import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const configuredAnalyticsId = process.env.VITE_ANALYTICS_ID || "G-GB11M9DGM2";
const analyticsId = /^G-[A-Z0-9]+$/.test(configuredAnalyticsId) ? configuredAnalyticsId : "G-GB11M9DGM2";
const siteOrigin = "https://brandvoice.space";
const htmlFiles = [
  "index.html",
  "404.html",
  "ai-humanizer/index.html",
  "email-rewriter/index.html",
  "linkedin-post-rewriter/index.html",
  "pricing/index.html",
  "privacy/index.html",
  "terms/index.html",
  "about/index.html",
  "contact/index.html",
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
  const routePath = relativePath === "index.html" ? "/" : `/${relativePath.replace(/index\.html$/, "")}`;
  const title = html.match(/<title>([^<]+)<\/title>/i)?.[1]?.trim() || "VoiceDraft";
  const description = html.match(/<meta name="description" content="([^"]+)"/i)?.[1]?.trim() || "AI humanizer for professional writing.";
  const escapeAttribute = (value) => value.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
  const socialTags = [
    html.includes('property="og:type"') ? "" : '  <meta property="og:type" content="website">\n',
    html.includes('property="og:url"') ? "" : `  <meta property="og:url" content="${siteOrigin}${routePath}">\n`,
    html.includes('property="og:title"') ? "" : `  <meta property="og:title" content="${escapeAttribute(title)}">\n`,
    html.includes('property="og:description"') ? "" : `  <meta property="og:description" content="${escapeAttribute(description)}">\n`,
    html.includes('name="twitter:card"') ? "" : '  <meta name="twitter:card" content="summary">\n',
    html.includes('name="twitter:title"') ? "" : `  <meta name="twitter:title" content="${escapeAttribute(title)}">\n`,
    html.includes('name="twitter:description"') ? "" : `  <meta name="twitter:description" content="${escapeAttribute(description)}">\n`,
    html.includes('property="og:image"') ? "" : `  <meta property="og:image" content="${siteOrigin}/og-card.svg">\n  <meta property="og:image:alt" content="VoiceDraft AI humanizer for professional writing">\n`,
    html.includes('name="twitter:image"') ? "" : `  <meta name="twitter:image" content="${siteOrigin}/og-card.svg">\n`
  ].join("");
  const pageSchema = `  <script type="application/ld+json" data-generated-page-schema>${JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        url: `${siteOrigin}${routePath}`,
        inLanguage: "en-US",
        datePublished: "2026-09-12",
        dateModified: "2026-09-13",
        author: { "@type": "Organization", name: "VoiceDraft", url: `${siteOrigin}/about/` },
        publisher: { "@id": `${siteOrigin}/#organization` }
      },
      {
        "@type": "Organization",
        "@id": `${siteOrigin}/#organization`,
        name: "VoiceDraft",
        url: `${siteOrigin}/`,
        contactPoint: { "@type": "ContactPoint", contactType: "customer support", url: `${siteOrigin}/contact/` }
      }
    ]
  })}</script>\n`;
  const byline = /<meta name="robots" content="noindex/i.test(html) ? "" : '  <p class="page-meta">By VoiceDraft team · Updated September 13, 2026</p>\n';
  html = html.replace("</head>", `${socialTags}${pageSchema}  <meta name="author" content="VoiceDraft team">\n  <meta name="dateModified" content="2026-09-13">\n  <meta property="article:modified_time" content="2026-09-13T00:00:00Z">\n  <meta name="voicedraft-analytics-id" content="${analyticsId}">\n  <link rel="stylesheet" href="/src/styles.css">\n</head>`);
  if (byline) html = html.replace(/(<h1[^>]*>[^<]*<\/h1>)/i, "$1\n" + byline);
  html = html.replace(/<i\s+data-lucide="[^"]+"[^>]*><\/i>/g, "");
  html = html.replace("</body>", '  <script type="module" src="/src/analytics.js"></script>\n</body>');
  await writeFile(outputPath, html);
}

await mkdir(join(dist, "src"), { recursive: true });
await cp(join(root, "public"), dist, { recursive: true, force: true });
await cp(join(root, "src", "styles.css"), join(dist, "src", "styles.css"));
await cp(join(root, "src", "main.js"), join(dist, "src", "main.js"));
await cp(join(root, "src", "voice.js"), join(dist, "src", "voice.js"));
await cp(join(root, "src", "analytics.js"), join(dist, "src", "analytics.js"));

console.log(`Built ${htmlFiles.length} HTML routes into dist.`);
