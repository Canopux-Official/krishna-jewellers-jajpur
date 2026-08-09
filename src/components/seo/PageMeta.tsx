import { useEffect } from 'react';
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  DEFAULT_OG_IMAGE_HEIGHT,
  DEFAULT_OG_IMAGE_WIDTH,
  DEFAULT_TITLE,
  SITE_NAME,
  absoluteUrl,
} from '../../utils/seo';

type JsonLd = Record<string, unknown> | Record<string, unknown>[];

interface PageMetaProps {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  noindex?: boolean;
  /** When false with noindex, skip canonical (prefer for soft 404s). */
  setCanonical?: boolean;
  jsonLd?: JsonLd | null;
}

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function removeLink(rel: string) {
  document.head.querySelector(`link[rel="${rel}"]`)?.remove();
}

function upsertJsonLd(data: JsonLd | null | undefined) {
  const id = 'page-json-ld';
  const existing = document.getElementById(id);
  if (!data) {
    existing?.remove();
    return;
  }
  let script = existing as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}

/**
 * Sets document title, description, Open Graph, Twitter, canonical, and optional JSON-LD.
 * Renders nothing.
 */
export default function PageMeta({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  path = '/',
  image = DEFAULT_OG_IMAGE,
  type = 'website',
  noindex = false,
  setCanonical = true,
  jsonLd = null,
}: PageMetaProps) {
  const jsonLdKey = jsonLd ? JSON.stringify(jsonLd) : '';

  useEffect(() => {
    const url = absoluteUrl(path);
    const ogImage = image.startsWith('http') ? image : absoluteUrl(image);
    const parsedJsonLd = jsonLdKey ? (JSON.parse(jsonLdKey) as JsonLd) : null;

    document.title = title;

    upsertMeta('name', 'description', description);
    upsertMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');

    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:type', type === 'product' ? 'product' : 'website');
    upsertMeta('property', 'og:url', url);
    upsertMeta('property', 'og:image', ogImage);
    upsertMeta('property', 'og:image:width', String(DEFAULT_OG_IMAGE_WIDTH));
    upsertMeta('property', 'og:image:height', String(DEFAULT_OG_IMAGE_HEIGHT));
    upsertMeta('property', 'og:site_name', SITE_NAME);
    upsertMeta('property', 'og:locale', 'en_IN');

    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', title);
    upsertMeta('name', 'twitter:description', description);
    upsertMeta('name', 'twitter:image', ogImage);

    if (setCanonical && !noindex) {
      upsertLink('canonical', url);
    } else if (noindex) {
      removeLink('canonical');
    }

    upsertJsonLd(parsedJsonLd);
  }, [title, description, path, image, type, noindex, setCanonical, jsonLdKey]);

  return null;
}
