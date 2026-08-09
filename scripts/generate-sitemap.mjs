#!/usr/bin/env node
/**
 * Builds public/sitemap.xml from static pages + curated collections + live products.
 * Safe to run offline — falls back to collections only if the API is unreachable.
 */
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const SITE =
  (process.env.VITE_SITE_URL || 'https://www.krishnajewellersjajpur.in').replace(
    /\/$/,
    '',
  );
const API =
  process.env.VITE_API_URL ||
  process.env.SITEMAP_API_URL ||
  'http://localhost:3001/api/v1';

const today = new Date().toISOString().slice(0, 10);

const COLLECTION_SLUGS = [
  'bridal-collection',
  'gold-necklaces',
  'gold-chains',
  'bangles',
  'gold-bracelets',
  'earrings',
  'gold-pendants',
  'gold-coins--bars',
  'mangalsutra',
  'watches--collections',
];

const STATIC = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/about', priority: '0.8', changefreq: 'monthly' },
  { path: '/contact', priority: '0.9', changefreq: 'monthly' },
  { path: '/gallery', priority: '0.7', changefreq: 'weekly' },
  { path: '/rates', priority: '0.9', changefreq: 'daily' },
  { path: '/collections', priority: '0.9', changefreq: 'weekly' },
  { path: '/privacy-policy', priority: '0.3', changefreq: 'yearly' },
  { path: '/terms-of-service', priority: '0.3', changefreq: 'yearly' },
];

function urlEntry(path, priority, changefreq) {
  return `  <url>
    <loc>${SITE}${path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

async function fetchProductSlugs() {
  const slugs = new Set();
  let page = 1;
  const limit = 100;

  for (;;) {
    const res = await fetch(`${API}/products?limit=${limit}&page=${page}`);
    if (!res.ok) break;
    const data = await res.json();
    const list = Array.isArray(data)
      ? data
      : Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data?.items)
          ? data.items
          : [];

    if (!list.length) break;

    for (const p of list) {
      if (p?.slug && p.isHidden !== true) slugs.add(p.slug);
    }

    if (list.length < limit) break;
    page += 1;
    if (page > 50) break;
  }

  return [...slugs];
}

async function main() {
  let products = [];
  try {
    products = await fetchProductSlugs();
    console.log(`[sitemap] ${products.length} product URLs from API`);
  } catch (err) {
    console.warn('[sitemap] API unavailable — writing pages + collections only:', err.message);
  }

  const parts = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...STATIC.map((s) => urlEntry(s.path, s.priority, s.changefreq)),
    ...COLLECTION_SLUGS.map((slug) =>
      urlEntry(`/collections/${slug}`, '0.8', 'weekly'),
    ),
    ...products.map((slug) => urlEntry(`/products/${slug}`, '0.7', 'weekly')),
    '</urlset>',
    '',
  ];

  const out = join(root, 'public', 'sitemap.xml');
  writeFileSync(out, parts.join('\n'), 'utf8');
  console.log(`[sitemap] wrote ${out}`);
}

main();
