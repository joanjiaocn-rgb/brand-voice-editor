import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const htmlFiles = [
  "index.html",
  "404.html",
  "ai-humanizer/index.html",
  "email-rewriter/index.html",
  "linkedin-post-rewriter/index.html",
  "pricing/index.html",
  "privacy/index.html",
  "terms/index.html",
  "app/index.html",
  "app/voice/index.html"
];

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

for (const relativePath of htmlFiles) {
  const inputPath = join(root, relativePath);
  const outputPath = join(dist, relativePath);
  await mkdir(dirname(outputPath), { recursive: true });
  let html = await readFile(inputPath, "utf8");
  html = html.replace("</head>", '  <link rel="stylesheet" href="/src/styles.css">\n</head>');
  html = html.replace(/<i\s+data-lucide="[^"]+"[^>]*><\/i>/g, "");
  await writeFile(outputPath, html);
}

await mkdir(join(dist, "src"), { recursive: true });
await cp(join(root, "src", "styles.css"), join(dist, "src", "styles.css"));
await cp(join(root, "src", "main.js"), join(dist, "src", "main.js"));
await cp(join(root, "src", "voice.js"), join(dist, "src", "voice.js"));

console.log(`Built ${htmlFiles.length} HTML routes into dist.`);
