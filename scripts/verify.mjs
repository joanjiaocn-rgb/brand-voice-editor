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
  "terms/index.html"
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
  if (html.includes("data-lucide")) failures.push(`${rel}: unresolved icon placeholder`);
  if (publicRoutes.has(rel) && !/<meta name="description"/.test(html)) failures.push(`${rel}: missing meta description`);
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
if (!workerSource.includes("/sitemap.xml")) failures.push("worker: missing sitemap route");
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

  const robotsResponse = await worker.fetch(new Request("https://temporary.workers.dev/robots.txt"));
  const robots = await robotsResponse.text();
  if (!robotsResponse.ok || !robots.includes("Sitemap: https://brandvoice.space/sitemap.xml")) failures.push("worker: robots.txt does not use brandvoice.space");
}
