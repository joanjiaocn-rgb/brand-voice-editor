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
  "guides/index.html",
  "guides/what-is-brand-voice/index.html",
  "guides/how-to-build-brand-voice/index.html",
  "guides/brand-voice-vs-tone-of-voice/index.html",
  "guides/brand-voice-examples/index.html",
  "guides/brand-voice-guidelines/index.html",
  "guides/how-to-keep-brand-voice-consistent/index.html",
  "app/index.html",
  "app/voice/index.html"
];

const guideLinks = [
  ["What is brand voice?", "/guides/what-is-brand-voice/", "Start with a clear definition"],
  ["How do you build a brand voice?", "/guides/how-to-build-brand-voice/", "A practical five-step process"],
  ["Brand voice vs. tone of voice", "/guides/brand-voice-vs-tone-of-voice/", "Know what stays fixed and what changes"],
  ["What are good brand voice examples?", "/guides/brand-voice-examples/", "Learn from recognizable patterns"],
  ["How do you write brand voice guidelines?", "/guides/brand-voice-guidelines/", "Turn decisions into a usable document"],
  ["How do you keep brand voice consistent?", "/guides/how-to-keep-brand-voice-consistent/", "Make consistency part of the workflow"]
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
  html = enhanceSiteNavigation(html, routePath);
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
        dateModified: "2026-09-14",
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
  const guideArticleSchema = routePath.startsWith("/guides/") && routePath !== "/guides/"
    ? `  <script type="application/ld+json" data-guide-article-schema>${JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        headline: title,
        description,
        mainEntityOfPage: `${siteOrigin}${routePath}`,
        datePublished: "2026-09-14",
        dateModified: "2026-09-14",
        author: { "@type": "Organization", name: "VoiceDraft", url: `${siteOrigin}/about/` },
        publisher: { "@id": `${siteOrigin}/#organization` }
      })}</script>\n`
    : "";
  const byline = /<meta name="robots" content="noindex/i.test(html) ? "" : '  <p class="page-meta">By VoiceDraft team · Updated September 13, 2026</p>\n';
  html = html.replace("</head>", `${socialTags}${pageSchema}${guideArticleSchema}  <meta name="author" content="VoiceDraft team">\n  <meta name="dateModified" content="2026-09-14">\n  <meta property="article:modified_time" content="2026-09-14T00:00:00Z">\n  <meta name="voicedraft-analytics-id" content="${analyticsId}">\n  <link rel="stylesheet" href="/src/styles.css">\n</head>`);
  if (byline) html = html.replace(/(<h1[^>]*>[^<]*<\/h1>)/i, "$1\n" + byline);
  html = html.replace("Updated September 13, 2026", "Updated September 14, 2026");
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

function enhanceSiteNavigation(html, routePath) {
  const guideRoute = routePath.startsWith("/guides/");
  const currentAttribute = guideRoute ? ' aria-current="page"' : "";
  const desktopLinks = guideLinks.map(([label, href, note]) => `
            <a href="${href}"><strong>${label}</strong><span>${note}</span></a>`).join("");
  const desktopMenu = `
        <div class="nav-menu" data-guide-nav>
          <button class="nav-menu-trigger" type="button" aria-expanded="false" aria-controls="desktop-guide-menu"${currentAttribute} data-guide-trigger>Guides</button>
          <div class="nav-dropdown" id="desktop-guide-menu" data-guide-panel>${desktopLinks}
            <a class="nav-dropdown-all" href="/guides/"><strong>View all guides</strong><span>Browse the full brand voice library</span></a>
          </div>
        </div>`;
  const mobileLinks = guideLinks.map(([label, href]) => `<a href="${href}">${label}</a>`).join("");
  const mobileGuideMenu = `<div class="mobile-guide-menu" data-guide-nav><button type="button" aria-expanded="false" aria-controls="mobile-guide-menu"${currentAttribute} data-guide-trigger>Guides</button><div class="mobile-guide-links" id="mobile-guide-menu" data-guide-panel>${mobileLinks}<a href="/guides/">View all guides</a></div></div>`;

  return html.replace(/<header class="site-header">[\s\S]*?<\/header>/i, (header) => {
    let updated = header.replace(/(<nav class="desktop-nav"[^>]*>)([\s\S]*?)(<\/nav>)/i, (match, open, links, close) => {
      if (links.includes("data-guide-nav")) return match;
      const pricingLink = links.match(/<a[^>]*href="\/pricing\/"[^>]*>[\s\S]*?<\/a>/i);
      if (!pricingLink || pricingLink.index === undefined) return `${open}${links}${desktopMenu}${close}`;
      const index = pricingLink.index;
      return `${open}${links.slice(0, index)}${desktopMenu}${links.slice(index)}${close}`;
    });

    const mobileMenuMatch = updated.match(/<nav class="mobile-menu"[^>]*>[\s\S]*?<\/nav>/i);
    if (mobileMenuMatch) {
      updated = updated.replace(/(<nav class="mobile-menu"[^>]*>)([\s\S]*?)(<\/nav>)/i, (match, open, links, close) => {
        if (links.includes("data-guide-nav")) return match;
        return `${open}${links}${mobileGuideMenu}${close}`;
      });
    } else {
      const mobileMenu = `<nav class="mobile-menu" aria-label="Mobile navigation" data-mobile-menu><a href="/ai-humanizer/">AI humanizer</a><a href="/email-rewriter/">Email desk</a><a href="/linkedin-post-rewriter/">LinkedIn desk</a>${mobileGuideMenu}<a href="/pricing/">Pricing</a><a href="/app/">Open editor</a></nav>`;
      const menuButton = '<button class="icon-button menu-button" type="button" aria-label="Open navigation" aria-expanded="false" data-menu-button></button>';
      updated = updated.replace(/<\/div>\s*<\/header>$/i, `${menuButton}</div>${mobileMenu}</header>`);
    }

    return updated;
  }).replace(/(<nav class="footer-links"[^>]*>)([\s\S]*?)(<\/nav>)/i, (match, open, links, close) => {
    if (links.includes('href="/guides/"')) return match;
    return `${open}${links}<a href="/guides/">Guides</a>${close}`;
  });
}
