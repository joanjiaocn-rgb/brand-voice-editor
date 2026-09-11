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

const worker = await readFile(join(root, "src", "worker.js"), "utf8");
if (!worker.includes("/sitemap.xml")) failures.push("worker: missing sitemap route");
if (!worker.includes('rel=\"canonical\"')) failures.push("worker: missing canonical injection");
if (!worker.includes("no-store")) failures.push("worker: API responses must be no-store");

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
