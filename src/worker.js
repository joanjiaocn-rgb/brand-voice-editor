const MODEL = "@cf/meta/llama-3.3-70b-instruct-fp8-fast";
const SITE_ORIGIN = "https://brandvoice.space";
const MAX_SOURCE_LENGTH = 5000;
const rateBuckets = new Map();
const PUBLIC_ROUTES = new Set([
  "/",
  "/ai-humanizer/",
  "/email-rewriter/",
  "/linkedin-post-rewriter/",
  "/pricing/",
  "/privacy/",
  "/terms/",
  "/about/",
  "/contact/",
  "/guides/",
  "/guides/what-is-brand-voice/",
  "/guides/how-to-build-brand-voice/",
  "/guides/brand-voice-vs-tone-of-voice/",
  "/guides/brand-voice-examples/",
  "/guides/brand-voice-guidelines/",
  "/guides/how-to-keep-brand-voice-consistent/"
]);

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS" && url.pathname.startsWith("/api/")) {
      return new Response(null, { status: 204, headers: apiHeaders() });
    }

    if (url.pathname === "/api/health") {
      return json({ ok: true, ai: Boolean(env.AI), model: MODEL });
    }

    if (url.pathname === "/api/rewrite" && request.method === "POST") {
      return handleRewrite(request, env);
    }

    if (url.pathname === "/api/voice/analyze" && request.method === "POST") {
      return handleVoiceAnalysis(request, env);
    }

    if (url.pathname === "/sitemap.xml") {
      return sitemap(SITE_ORIGIN);
    }

    if (url.pathname === "/robots.txt") {
      return new Response(`User-agent: *\nAllow: /\nDisallow: /app/\nSitemap: ${SITE_ORIGIN}/sitemap.xml\n`, {
        headers: { "content-type": "text/plain; charset=utf-8" }
      });
    }

    if (url.pathname === "/llms.txt") {
      return new Response(llmsText(SITE_ORIGIN), {
        headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=3600" }
      });
    }

    const response = await env.ASSETS.fetch(request);
    if (!isHtml(response)) return response;

    const canonicalPath = normalizeCanonicalPath(url.pathname);
    const canonical = `${SITE_ORIGIN}${canonicalPath}`;
    return new HTMLRewriter()
      .on("head", {
        element(element) {
          element.append(`<link rel="canonical" href="${escapeHtml(canonical)}">`, { html: true });
        }
      })
      .transform(response);
  }
};

async function handleRewrite(request, env) {
  if (!env.AI) return json({ error: "AI service is not configured." }, 503);
  const rateLimit = enforceRateLimit(request, "rewrite", 8);
  if (!rateLimit.allowed) return json({ error: "Too many rewrite requests. Try again in a minute.", retry_after: rateLimit.retryAfter }, 429);

  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ error: "Request body must be valid JSON." }, 400);
  }

  const sourceText = cleanString(payload.source_text);
  const mode = payload.mode === "linkedin" ? "linkedin" : "email";
  const adjustment = ["shorter", "more_direct", "more_conversational"].includes(payload.adjustment)
    ? payload.adjustment
    : "none";

  if (sourceText.length < 20 || sourceText.length > MAX_SOURCE_LENGTH) {
    return json({ error: `Draft must contain 20-${MAX_SOURCE_LENGTH} characters.` }, 400);
  }

  const requestId = crypto.randomUUID();
  const voiceProfile = sanitizeProfile(payload.voice_profile);
  const context = {
    audience: cleanString(payload.context?.audience).slice(0, 240),
    goal: cleanString(payload.context?.goal).slice(0, 240),
    relationship: cleanString(payload.context?.relationship).slice(0, 120)
  };

  const systemPrompt = buildRewritePrompt({ mode, adjustment, voiceProfile, context });

  try {
    const result = await env.AI.run(MODEL, {
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: sourceText }
      ],
      temperature: 0.35,
      max_tokens: 1200
    });

    const parsed = parseModelJson(result?.response ?? result);
    const rewrittenText = cleanString(parsed.rewritten_text || parsed.rewrite || result?.response);
    if (!rewrittenText) throw new Error("Empty model response");

    const protectedTokenChanges = compareProtectedTokens(sourceText, rewrittenText);
    const reviewNotes = Array.isArray(parsed.review_notes)
      ? parsed.review_notes.map(cleanString).filter(Boolean).slice(0, 5)
      : [];

    for (const change of protectedTokenChanges) {
      reviewNotes.push(`Check ${change.type}: ${change.value}`);
    }

    return json({
      request_id: requestId,
      rewritten_text: rewrittenText,
      change_tags: sanitizeTags(parsed.change_tags),
      protected_token_changes: protectedTokenChanges,
      meaning_risk: protectedTokenChanges.length || reviewNotes.length ? "review" : "none",
      review_notes: [...new Set(reviewNotes)].slice(0, 6),
      model_version: MODEL,
      prompt_version: "rewrite-v1"
    });
  } catch (error) {
    console.error("rewrite_failed", { request_id: requestId, message: error?.message });
    return json({ error: "The rewrite could not be completed. Your draft was not saved.", request_id: requestId }, 502);
  }
}

async function handleVoiceAnalysis(request, env) {
  if (!env.AI) return json({ error: "AI service is not configured." }, 503);
  const rateLimit = enforceRateLimit(request, "voice", 3);
  if (!rateLimit.allowed) return json({ error: "Too many profile requests. Try again in a minute.", retry_after: rateLimit.retryAfter }, 429);

  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ error: "Request body must be valid JSON." }, 400);
  }

  const samples = Array.isArray(payload.samples)
    ? payload.samples.map(cleanString).filter(Boolean).slice(0, 5)
    : [];
  const totalLength = samples.reduce((sum, sample) => sum + sample.length, 0);

  if (!samples.length || totalLength < 80 || totalLength > 15000) {
    return json({ error: "Add 80-15,000 characters of representative writing." }, 400);
  }

  const prompt = `Analyze the writing samples and return JSON only. Describe observable writing preferences, not identity or personality. Use this exact shape: {"formality":"relaxed|balanced|formal","directness":"gentle|balanced|direct","sentence_length":"short|mixed|long","warmth":"reserved|balanced|warm","contractions":"rare|sometimes|frequent","rhythm":"plain English summary under 100 characters","preferred_openings":["up to 3 short patterns"],"preferred_closings":["up to 3 short patterns"],"avoid":["up to 5 habits"]}. Do not repeat private facts, names, contact details, or full phrases from the samples.`;

  try {
    const result = await env.AI.run(MODEL, {
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: samples.join("\n\n--- SAMPLE ---\n\n") }
      ],
      temperature: 0.2,
      max_tokens: 700
    });
    const traits = parseModelJson(result?.response ?? result);
    return json({
      schema_version: "voice-v1",
      traits: sanitizeTraits(traits),
      confidence: samples.length >= 3 && totalLength >= 600 ? "high" : samples.length >= 2 ? "medium" : "low"
    });
  } catch (error) {
    console.error("voice_analysis_failed", { message: error?.message });
    return json({ error: "The Voice Profile could not be created. Your samples were not saved." }, 502);
  }
}

function buildRewritePrompt({ mode, adjustment, voiceProfile, context }) {
  return `You are a precise professional editor. Rewrite the user's ${mode === "email" ? "business email" : "LinkedIn post"} so it sounds natural and specific while preserving the writer's meaning.

Rules:
- Never invent names, credentials, outcomes, experiences, stories, evidence, offers, promises, or calls to action.
- Preserve names, numbers, dates, currencies, percentages, URLs, email addresses, quoted text, deadlines, and commitments exactly.
- Do not mention AI detection. Do not add hashtags unless the input already contains them.
- Remove generic enthusiasm, inflated claims, unnecessary scene-setting, and canned transitions.
- ${mode === "email" ? "Preserve functional greeting, sign-off, relationship, and requested action." : "Improve opening, flow, and scanability without manufacturing a personal anecdote or engagement bait."}
- Requested adjustment: ${adjustment}.
- Optional audience: ${context.audience || "not provided"}.
- Optional goal: ${context.goal || "not provided"}.
- Optional relationship: ${context.relationship || "not provided"}.
- Voice Profile: ${voiceProfile ? JSON.stringify(voiceProfile) : "No saved profile. Use clear, direct, warm professional English."}

Return JSON only with this shape: {"rewritten_text":"string","change_tags":["clarity"|"voice"|"brevity"|"structure"],"review_notes":["only genuine ambiguity or meaning risks"]}.`;
}

function parseModelJson(value) {
  if (value && typeof value === "object" && !Array.isArray(value)) return value;
  const text = cleanString(value).replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");

  try {
    return JSON.parse(text);
  } catch {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start >= 0 && end > start) {
      try {
        return JSON.parse(text.slice(start, end + 1));
      } catch {
        // Fall through to a usable plain-text rewrite when model JSON is malformed.
      }
    }
  }

  return { rewritten_text: text, change_tags: ["clarity"], review_notes: [] };
}

function compareProtectedTokens(source, output) {
  const patterns = [
    ["email", /[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/g],
    ["URL", /https?:\/\/[^\s<>)]+/g],
    ["number", /(?:[$£€]\s?)?\b\d[\d,.]*(?:%|\b)/g],
    ["date", /\b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{1,2}(?:,\s*\d{4})?\b/gi]
  ];
  const changes = [];
  for (const [type, pattern] of patterns) {
    const values = source.match(pattern) || [];
    for (const value of values) {
      if (!output.includes(value)) changes.push({ type, value });
    }
  }
  return changes.slice(0, 8);
}

function sanitizeProfile(value) {
  if (!value || typeof value !== "object") return null;
  const jsonValue = JSON.stringify(value);
  if (jsonValue.length > 3000) return null;
  return value;
}

function sanitizeTraits(value) {
  const allowed = ["formality", "directness", "sentence_length", "warmth", "contractions", "rhythm", "preferred_openings", "preferred_closings", "avoid"];
  return Object.fromEntries(allowed.filter((key) => value?.[key] !== undefined).map((key) => [key, value[key]]));
}

function sanitizeTags(tags) {
  const allowed = new Set(["clarity", "voice", "brevity", "structure"]);
  return Array.isArray(tags) ? [...new Set(tags.filter((tag) => allowed.has(tag)))].slice(0, 4) : ["clarity"];
}

function cleanString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function enforceRateLimit(request, scope, limit) {
  const now = Date.now();
  const windowMs = 60_000;
  const subject = request.headers.get("CF-Connecting-IP") || "unknown";
  const key = `${scope}:${subject}`;
  const bucket = rateBuckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    rateBuckets.set(key, { count: 1, resetAt: now + windowMs });
    pruneRateBuckets(now);
    return { allowed: true, retryAfter: 0 };
  }

  if (bucket.count >= limit) {
    return { allowed: false, retryAfter: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)) };
  }

  bucket.count += 1;
  return { allowed: true, retryAfter: 0 };
}

function pruneRateBuckets(now) {
  if (rateBuckets.size < 1000) return;
  for (const [key, bucket] of rateBuckets) {
    if (bucket.resetAt <= now) rateBuckets.delete(key);
  }
}

function apiHeaders() {
  return {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "x-content-type-options": "nosniff"
  };
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: apiHeaders() });
}

function sitemap(origin) {
  const paths = [...PUBLIC_ROUTES];
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths.map((path) => `  <url><loc>${origin}${path}</loc><lastmod>2026-09-13</lastmod></url>`).join("\n")}\n</urlset>`;
  return new Response(body.replaceAll("2026-09-13", "2026-09-14"), { headers: { "content-type": "application/xml; charset=utf-8" } });
}

function llmsText(origin) {
  const productText = llmsProductText(origin).replace("Last updated: 2026-09-13", "Last updated: 2026-09-14");
  return `${productText}\n## Brand voice guides\n- All guides: ${origin}/guides/\n- What is brand voice?: ${origin}/guides/what-is-brand-voice/\n- How to build a brand voice: ${origin}/guides/how-to-build-brand-voice/\n- Brand voice vs. tone: ${origin}/guides/brand-voice-vs-tone-of-voice/\n- Brand voice examples: ${origin}/guides/brand-voice-examples/\n- Brand voice guidelines: ${origin}/guides/brand-voice-guidelines/\n- Brand voice consistency: ${origin}/guides/how-to-keep-brand-voice-consistent/\n`;
}

function llmsProductText(origin) {
  return `# VoiceDraft\n\n> AI humanizer for professional emails and LinkedIn posts.\n\n## What it does\n- Rewrites AI-assisted drafts so they sound clear, personal, and ready to send.\n- Preserves meaning, names, numbers, dates, links, commitments, and point of view.\n- Offers a reusable Voice Profile stored locally in the visitor's browser.\n\n## Main pages\n- Home: ${origin}/\n- AI humanizer: ${origin}/ai-humanizer/\n- Email humanizer: ${origin}/email-rewriter/\n- LinkedIn post humanizer: ${origin}/linkedin-post-rewriter/\n- Pricing: ${origin}/pricing/\n- Privacy: ${origin}/privacy/\n- Terms: ${origin}/terms/\n- About: ${origin}/about/\n- Contact: ${origin}/contact/\n\n## Important limits\nVoiceDraft does not promise to bypass AI detectors, make text undetectable, or guarantee engagement or business outcomes. Review business-critical writing before sending.\n\n## Freshness\nLast updated: 2026-09-13\n`;
}

function normalizeCanonicalPath(pathname) {
  if (pathname.endsWith(".html")) return pathname.replace(/index\.html$/, "").replace(/\.html$/, "/");
  return pathname.endsWith("/") || pathname.includes(".") ? pathname : `${pathname}/`;
}

function isHtml(response) {
  return response.headers.get("content-type")?.includes("text/html");
}

function escapeHtml(value) {
  return value.replace(/[&<>\"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[character]);
}
