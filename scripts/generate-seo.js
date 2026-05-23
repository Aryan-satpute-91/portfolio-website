// scripts/generate-seo.js
// Automatically generates sitemap.xml and robots.txt
// Run via: node scripts/generate-seo.js
// Or automatically after build via package.json "postbuild" script

import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, "..");

const SITE_URL = "https://aryan-satpute-portfolio.vercel.app";
const NOW = new Date().toISOString().split("T")[0];

// ─── robots.txt ──────────────────────────────────────────────────────────────
const robotsTxt = `User-agent: *
Allow: /

# Block admin / build artefacts
Disallow: /dist/
Disallow: /.git/
Disallow: /node_modules/

Sitemap: ${SITE_URL}/sitemap.xml
`;

// ─── sitemap.xml ─────────────────────────────────────────────────────────────
const sections = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/#about", priority: "0.9", changefreq: "monthly" },
  { path: "/#skills", priority: "0.85", changefreq: "monthly" },
  { path: "/#work", priority: "0.9", changefreq: "weekly" },
  { path: "/#experience", priority: "0.8", changefreq: "monthly" },
  { path: "/#techstack", priority: "0.8", changefreq: "monthly" },
  { path: "/#contact", priority: "0.75", changefreq: "yearly" },
];

const urlEntries = sections
  .map(
    ({ path, priority, changefreq }) => `
  <url>
    <loc>${SITE_URL}${path}</loc>
    <lastmod>${NOW}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
  )
  .join("");

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
    http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urlEntries}
</urlset>
`;

// ─── Write to public/ and dist/ ──────────────────────────────────────────────
function writeFile(dir, filename, content) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  const dest = join(dir, filename);
  writeFileSync(dest, content, "utf8");
  console.log(`✅  Generated: ${dest}`);
}

const publicDir = join(ROOT, "public");
const distDir = join(ROOT, "dist");

writeFile(publicDir, "robots.txt", robotsTxt);
writeFile(publicDir, "sitemap.xml", sitemapXml);

// Also write to dist/ if it exists (post-build context)
if (existsSync(distDir)) {
  writeFile(distDir, "robots.txt", robotsTxt);
  writeFile(distDir, "sitemap.xml", sitemapXml);
}

console.log("\n🚀  SEO files generated successfully!");
