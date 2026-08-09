/** Site SEO helpers for Krishna Jewellers, Byasanagar. */

export const SITE_URL = (
  import.meta.env.VITE_SITE_URL || 'https://www.krishnajewellersjajpur.in'
).replace(/\/$/, '');

export const SITE_NAME = 'Krishna Jewellers';
export const SITE_LOGO = `${SITE_URL}/krishna-jewellers-logo.png`;
/** PNG preferred for social crawlers (many skip AVIF). */
export const DEFAULT_OG_IMAGE = `${SITE_URL}/home-hero-bridal.png`;
export const DEFAULT_OG_IMAGE_WIDTH = 1920;
export const DEFAULT_OG_IMAGE_HEIGHT = 768;

export const DEFAULT_TITLE =
  'Krishna Jewellers | Gold & Silver Jewellery in Byasanagar, Jajpur';

export const DEFAULT_DESCRIPTION =
  'BIS-hallmarked gold and silver jewellery from Krishna Jewellers in Byasanagar, Jajpur — bridal sets, temple motifs, festive bangles, and everyday gold for Odisha families.';

export type BreadcrumbItem = { name: string; path?: string };

export function absoluteUrl(path = '/'): string {
  if (!path || path === '/') return SITE_URL;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export function truncateMeta(text: string, max = 155): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).trimEnd()}…`;
}

export function pageTitle(segment: string): string {
  return `${segment} | ${SITE_NAME}`;
}

/** Parse strings like "10:00 AM – 8:30 PM" into 24h HH:MM. */
function parseClock(part: string): string | null {
  const m = part
    .trim()
    .match(/^(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)?$/);
  if (!m) return null;
  let h = Number(m[1]);
  const min = m[2];
  const mer = m[3]?.toUpperCase();
  if (mer === 'PM' && h < 12) h += 12;
  if (mer === 'AM' && h === 12) h = 0;
  return `${String(h).padStart(2, '0')}:${min}`;
}

function parseHoursRange(hours: string): { opens: string; closes: string } | null {
  const parts = hours.split(/\s*[–—-]\s*/);
  if (parts.length < 2) return null;
  const opens = parseClock(parts[0]);
  const closes = parseClock(parts[1]);
  if (!opens || !closes) return null;
  return { opens, closes };
}

function parseWeightGrams(weight?: string, weightGrams?: number): number | undefined {
  if (typeof weightGrams === 'number' && weightGrams > 0) return weightGrams;
  if (!weight) return undefined;
  const m = weight.replace(/,/g, '').match(/(\d+(?:\.\d+)?)/);
  return m ? Number(m[1]) : undefined;
}

export function buildWebSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    publisher: {
      '@type': 'JewelryStore',
      name: SITE_NAME,
      url: SITE_URL,
      logo: SITE_LOGO,
    },
    inLanguage: 'en-IN',
  };
}

export function buildLocalBusinessJsonLd(settings: {
  storeName: string;
  phone: string;
  address: string;
  weekdayHours: string;
  sundayHours?: string;
  email?: string;
  googleMapsUrl?: string | null;
  instagramUrl?: string | null;
  facebookUrl?: string | null;
}) {
  const lines = settings.address.split('\n').map((l) => l.trim()).filter(Boolean);
  const weekday = parseHoursRange(settings.weekdayHours) || {
    opens: '10:00',
    closes: '20:30',
  };
  const sunday =
    parseHoursRange(settings.sundayHours || settings.weekdayHours) || weekday;

  const sameAs = [settings.instagramUrl, settings.facebookUrl].filter(
    (u): u is string => !!u && /^https?:\/\//i.test(u),
  );

  return {
    '@context': 'https://schema.org',
    '@type': ['JewelryStore', 'LocalBusiness'],
    '@id': `${SITE_URL}/#store`,
    name: settings.storeName || SITE_NAME,
    image: [DEFAULT_OG_IMAGE, SITE_LOGO],
    logo: SITE_LOGO,
    url: SITE_URL,
    telephone: settings.phone || undefined,
    email: settings.email || undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'X42J+2Q2, Bank St, Dolipur',
      addressLocality: 'Byasanagar',
      addressRegion: 'Odisha',
      postalCode: '755019',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 20.9500125,
      longitude: 86.131891,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
        ],
        opens: weekday.opens,
        closes: weekday.closes,
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Sunday',
        opens: sunday.opens,
        closes: sunday.closes,
        description: 'Closed on the last Sunday of every month',
      },
    ],
    hasMap: settings.googleMapsUrl || undefined,
    areaServed: [
      { '@type': 'City', name: 'Byasanagar' },
      { '@type': 'City', name: 'Jajpur' },
      { '@type': 'City', name: 'Jajpur Road' },
      { '@type': 'State', name: 'Odisha' },
    ],
    priceRange: '₹₹₹',
    description: DEFAULT_DESCRIPTION,
    sameAs,
    disambiguatingDescription: lines.join(', '),
    currenciesAccepted: 'INR',
    paymentAccepted: 'Cash, UPI, Card',
  };
}

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      ...(item.path ? { item: absoluteUrl(item.path) } : {}),
    })),
  };
}

export function buildCollectionJsonLd(collection: {
  name: string;
  description?: string;
  shortDescription?: string;
  slug: string;
  image?: string;
  bannerImage?: string;
  products?: { name: string; slug: string; images?: string[] }[];
}) {
  const pageUrl = absoluteUrl(`/collections/${collection.slug}`);
  const image =
    collection.bannerImage || collection.image
      ? (collection.bannerImage || collection.image)!.startsWith('http')
        ? collection.bannerImage || collection.image
        : absoluteUrl(collection.bannerImage || collection.image!)
      : DEFAULT_OG_IMAGE;

  const productList = (collection.products || []).slice(0, 24);

  const graph: Record<string, unknown>[] = [
    {
      '@type': 'CollectionPage',
      '@id': `${pageUrl}#collection`,
      url: pageUrl,
      name: collection.name,
      description: truncateMeta(
        collection.description ||
          collection.shortDescription ||
          `${collection.name} at ${SITE_NAME}, Byasanagar, Jajpur.`,
      ),
      image,
      isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: SITE_URL },
      about: {
        '@type': 'JewelryStore',
        name: SITE_NAME,
        '@id': `${SITE_URL}/#store`,
      },
    },
  ];

  if (productList.length > 0) {
    graph.push({
      '@type': 'ItemList',
      '@id': `${pageUrl}#items`,
      name: `${collection.name} catalogue`,
      numberOfItems: productList.length,
      itemListElement: productList.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: absoluteUrl(`/products/${p.slug}`),
        name: p.name,
        ...(p.images?.[0]
          ? {
              image: p.images[0].startsWith('http')
                ? p.images[0]
                : absoluteUrl(p.images[0]),
            }
          : {}),
      })),
    });
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}

export function buildCollectionsIndexJsonLd(
  collections: { name: string; slug: string; shortDescription?: string }[],
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Gold & Silver Collections',
    url: absoluteUrl('/collections'),
    description:
      'Bridal sets, necklaces, chains, bangles, earrings, pendants, mangalsutra, coins and watches — hallmarked jewellery for rituals and everyday wear in Byasanagar.',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: collections.length,
      itemListElement: collections.map((c, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: c.name,
        url: absoluteUrl(`/collections/${c.slug}`),
        description: c.shortDescription,
      })),
    },
  };
}

export function buildProductJsonLd(product: {
  name: string;
  description?: string;
  images?: string[];
  purity?: string;
  weight?: string;
  weightGrams?: number;
  priceValue?: number;
  slug: string;
  sku?: string;
  categoryName?: string;
  isSoldOut?: boolean;
  isAvailable?: boolean;
}) {
  const images = (product.images || []).map((src) =>
    src.startsWith('http') ? src : absoluteUrl(src),
  );
  const grams = parseWeightGrams(product.weight, product.weightGrams);
  const inStock =
    product.isSoldOut === true || product.isAvailable === false
      ? 'https://schema.org/OutOfStock'
      : 'https://schema.org/InStoreOnly';

  const offer: Record<string, unknown> = {
    '@type': 'Offer',
    url: absoluteUrl(`/products/${product.slug}`),
    availability: inStock,
    priceCurrency: 'INR',
    itemCondition: 'https://schema.org/NewCondition',
    seller: {
      '@type': 'JewelryStore',
      name: SITE_NAME,
      '@id': `${SITE_URL}/#store`,
    },
  };

  if (typeof product.priceValue === 'number' && product.priceValue > 0) {
    offer.price = product.priceValue;
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: truncateMeta(
      product.description || `${product.name} from ${SITE_NAME}, Byasanagar, Jajpur`,
    ),
    image: images.length ? images : [DEFAULT_OG_IMAGE],
    sku: product.sku || product.slug,
    brand: { '@type': 'Brand', name: SITE_NAME },
    category: product.categoryName,
    material: product.purity ? `${product.purity} gold` : undefined,
    weight: grams
      ? { '@type': 'QuantitativeValue', value: grams, unitCode: 'GRM' }
      : undefined,
    offers: offer,
  };
}

/** Merge multiple JSON-LD objects into one @graph payload for PageMeta. */
export function mergeJsonLd(
  ...parts: Array<Record<string, unknown> | null | undefined>
): Record<string, unknown> | null {
  const nodes: Record<string, unknown>[] = [];
  for (const part of parts) {
    if (!part) continue;
    if (Array.isArray(part['@graph'])) {
      nodes.push(...(part['@graph'] as Record<string, unknown>[]));
    } else {
      const { '@context': _ctx, ...rest } = part;
      nodes.push(rest);
    }
  }
  if (!nodes.length) return null;
  return { '@context': 'https://schema.org', '@graph': nodes };
}

export const STATIC_PAGE_META: Record<
  string,
  { title: string; description: string; path: string }
> = {
  home: {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    path: '/',
  },
  about: {
    title: pageTitle('About Us — Jewellers in Byasanagar, Jajpur'),
    description:
      'A temple-town jewellery house in Byasanagar — BIS-hallmarked gold, transparent pricing, and families served across Jajpur.',
    path: '/about',
  },
  contact: {
    title: pageTitle('Contact — Byasanagar, Jajpur Showroom'),
    description:
      'Visit Krishna Jewellers in Byasanagar for bridal, festival, and everyday gold. Reach us at the showroom for enquiries.',
    path: '/contact',
  },
  gallery: {
    title: pageTitle('Jewellery Gallery'),
    description:
      'Bridal gold, festive bangles, temple pendants, and showroom moments from Krishna Jewellers, Byasanagar.',
    path: '/gallery',
  },
  rates: {
    title: pageTitle("Today's Gold & Silver Rates — Jajpur"),
    description:
      "Today's indicative 22K, 24K gold and silver rates at Krishna Jewellers, Byasanagar. Final prices confirmed in store.",
    path: '/rates',
  },
  collections: {
    title: pageTitle('Gold & Silver Collections'),
    description:
      'Bridal sets, necklaces, chains, bangles, earrings, pendants, mangalsutra, coins and watches — hallmarked jewellery for rituals and everyday wear in Byasanagar.',
    path: '/collections',
  },
  privacy: {
    title: pageTitle('Privacy Policy'),
    description:
      'How Krishna Jewellers handles enquiries and visitor information at our Byasanagar, Jajpur showroom and website.',
    path: '/privacy-policy',
  },
  terms: {
    title: pageTitle('Terms of Service'),
    description:
      'Website terms for Krishna Jewellers — rates, product availability, and in-store purchase policies in Byasanagar, Jajpur.',
    path: '/terms-of-service',
  },
  notFound: {
    title: pageTitle('Page Not Found'),
    description: 'The page you are looking for could not be found on Krishna Jewellers.',
    path: '/404',
  },
};
