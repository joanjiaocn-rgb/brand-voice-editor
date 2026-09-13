import { existsSync } from "node:fs";
import { readFile, readdir } from "node:fs/promises";
import { dirname, extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const failures = [];
const publicRoutes = new Set([
  "index.html",
  "ai-humanizer/index.html",
  "email-rewriter/index.html",
  "linkedin-post-rewriter/index.html",
  "pricing/index.html",
  "privacy/index.html",
  "terms/index.html",
  "about/index.html",
  "contact/index.html",
  "guides/index.html",
  "guides/what-is-brand-voice/index.html",
  "guides/how-to-build-brand-voice/index.html",
  "guides/brand-voice-vs-tone-of-voice/index.html",
  "guides/brand-voice-examples/index.html",
  "guides/brand-voice-guidelines/index.html",
  "guides/how-to-keep-brand-voice-consistent/index.html"
]);

const files = await walk(dist);
const htmlFiles = files.filter((file) => extname(file) === ".html");

for (const file of htmlFiles) {
  const rel = relative(dist, file).replaceAll("\\", "/");
  const html = await readFile(file, "utf8");
  const h1Count = (html.match(/<h1(?:\s|>)/g) || []).length;
  if (h1Count !== 1) failures.push(`${rel}: expected one H1, found ${h1Count}`);
  if (!/<title>[^<]+<\/title>/.test(html)) failures.push(`${rel}: missing title`);
  if (!html.includes('href="/src/styles.css"')) failures.push(`${rel}: missing stylesheet`);
  if (!html.includes('src="/src/analytics.js"')) failures.push(`${rel}: missing analytics module`);
  if (!html.includes('property="og:title"')) failures.push(`${rel}: missing og:title`);
  if (!html.includes('property="og:image"')) failures.push(`${rel}: missing og:image`);
  if (!html.includes('name="author"')) failures.push(`${rel}: missing author signal`);
  if (!html.includes('data-generated-page-schema') || !html.includes('VoiceDraft')) failures.push(`${rel}: missing page schema`);
  if (publicRoutes.has(rel) && !html.includes("page-meta")) failures.push(`${rel}: missing visible author/freshness signal`);
  if (html.includes("data-lucide")) failures.push(`${rel}: unresolved icon placeholder`);
  if (publicRoutes.has(rel) && !/<meta name="description"/.test(html)) failures.push(`${rel}: missing meta description`);
  if (publicRoutes.has(rel) && !html.includes('data-guide-nav')) failures.push(`${rel}: missing Guides navigation`);
  if (rel.startsWith("guides/") && rel !== "guides/index.html" && !html.includes('data-guide-article-schema')) failures.push(`${rel}: missing Article schema`);
  if (rel.startsWith("app/") && !/name="robots" content="noindex/.test(html)) failures.push(`${rel}: app route must be noindex`);

  const links = [...html.matchAll(/href="([^"]+)"/g)].map((match) => match[1]);
  for (const link of links) {
    if (!link.startsWith("/") || link.startsWith("//")) continue;
    const path = link.split("#")[0].split("?")[0];
    if (!path) continue;
    const target = path.endsWith("/") ? join(dist, path, "index.html") : join(dist, path);
    if (!existsSync(target)) failures.push(`${rel}: broken internal link ${link}`);
  }
}

const workerSource = await readFile(join(root, "src", "worker.js"), "utf8");
const analyticsSource = await readFile(join(root, "src", "analytics.js"), "utf8");
if (!analyticsSource.includes("G-GB11M9DGM2") && !analyticsSource.includes("voicedraft-analytics-id")) failures.push("analytics: missing configurable GA4 ID");
if (/(?:source_text|rewritten_text|samples|freeform_context)\s*[:=]/.test(analyticsSource)) failures.push("analytics: raw writing field appears in analytics module");
if (!workerSource.includes("/sitemap.xml")) failures.push("worker: missing sitemap route");
if (!workerSource.includes("/llms.txt")) failures.push("worker: missing llms.txt route");
if (!workerSource.includes('rel=\"canonical\"')) failures.push("worker: missing canonical injection");
if (!workerSource.includes("no-store")) failures.push("worker: API responses must be no-store");
if (!workerSource.includes('SITE_ORIGIN = "https://brandvoice.space"')) failures.push("worker: production site origin is not configured");
if (workerSource.includes("@cf/meta/llama-3.1-8b-instruct")) failures.push("worker: deprecated AI model configured");

const worker = (await import("../src/worker.js")).default;
await verifySiteOrigin(worker);
await verifyRewriteResponse(worker, '```json\n{"rewritten_text":"Hi Maya, the draft is ready.","change_tags":["clarity"],"review_notes":[]}\n```', "fenced JSON");
await verifyRewriteResponse(worker, "Hi Maya, please review {the landing page} by Thursday.", "plain text with braces");

if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Verified ${htmlFiles.length} HTML routes, internal links, SEO basics, and Worker surface.`);
}

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  }));
  return nested.flat();
}

async function verifyRewriteResponse(worker, modelResponse, label) {
  const request = new Request("https://example.test/api/rewrite", {
    method: "POST",
    headers: { "content-type": "application/json", "CF-Connecting-IP": `verify-${label}` },
    body: JSON.stringify({
      mode: "email",
      source_text: "Hi Maya, the landing page is ready for review by Thursday.",
      context: {},
      voice_profile: null,
      adjustment: "none"
    })
  });
  const response = await worker.fetch(request, { AI: { run: async () => ({ response: modelResponse }) } });
  const body = await response.json();
  if (!response.ok || !body.rewritten_text) failures.push(`worker: ${label} model response returned ${response.status}`);
}

async function verifySiteOrigin(worker) {
  const sitemapResponse = await worker.fetch(new Request("https://temporary.workers.dev/sitemap.xml"));
  const sitemap = await sitemapResponse.text();
  if (!sitemapResponse.ok || !sitemap.includes("https://brandvoice.space/")) failures.push("worker: sitemap does not use brandvoice.space");

  const llmsResponse = await worker.fetch(new Request("https://temporary.workers.dev/llms.txt"));
  const llms = await llmsResponse.text();
  if (!llmsResponse.ok || !llms.includes("AI humanizer") || !llms.includes("https://brandvoice.space/ai-humanizer/") || !llms.includes("https://brandvoice.space/guides/")) failures.push("worker: llms.txt is missing key product routes");

  const robotsResponse = await worker.fetch(new Request("https://temporary.workers.dev/robots.txt"));
  const robots = await robotsResponse.text();
  if (!robotsResponse.ok || !robots.includes("Sitemap: https://brandvoice.space/sitemap.xml")) failures.push("worker: robots.txt does not use brandvoice.space");
}
