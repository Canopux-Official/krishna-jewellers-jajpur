/** Site SEO helpers for Krishna Jewellers, Byasanagar. */
export const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://www.krishnajewellersjajpur.com').replace(/\/$/, '');
export const SITE_NAME = 'Krishna Jewellers';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/krishna-jewellers-hero.avif`;

export const DEFAULT_TITLE =
  'Krishna Jewellers | Gold & Silver Jewellery in Byasanagar, Jajpur';

export const DEFAULT_DESCRIPTION =
  'BIS-hallmarked gold and silver jewellery from Krishna Jewellers in Byasanagar, Jajpur — bridal sets, temple motifs, festive bangles, and everyday gold for Odisha families.';

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

export function buildLocalBusinessJsonLd(settings: {
  storeName: string;
  phone: string;
  address: string;
  weekdayHours: string;
  email?: string;
  googleMapsUrl?: string | null;
}) {
  const lines = settings.address.split('\n').map((l) => l.trim()).filter(Boolean);
  return {
    '@context': 'https://schema.org',
    '@type': ['JewelryStore', 'LocalBusiness'],
    name: settings.storeName || SITE_NAME,
    image: DEFAULT_OG_IMAGE,
    url: SITE_URL,
    telephone: settings.phone,
    email: settings.email || undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Byasanagar',
      addressLocality: 'Byasanagar',
      addressRegion: 'Odisha',
      postalCode: '755019',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 20.9460,
      longitude: 86.1301,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
      opens: '10:00',
      closes: '20:30',
      description: settings.weekdayHours,
    },
    hasMap: settings.googleMapsUrl || undefined,
    areaServed: ['Byasanagar', 'Jajpur', 'Jajpur Road', 'Odisha'],
    priceRange: '₹₹₹',
    description: DEFAULT_DESCRIPTION,
    sameAs: [] as string[],
    disambiguatingDescription: lines.join(', '),
  };
}

export function buildProductJsonLd(product: {
  name: string;
  description?: string;
  images?: string[];
  purity?: string;
  weight?: string;
  priceValue?: number;
  slug: string;
}) {
  const images = (product.images || []).map((src) =>
    src.startsWith('http') ? src : absoluteUrl(src),
  );
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: truncateMeta(product.description || `${product.name} from ${SITE_NAME}`),
    image: images.length ? images : [DEFAULT_OG_IMAGE],
    brand: { '@type': 'Brand', name: SITE_NAME },
    material: product.purity ? `${product.purity} gold` : undefined,
    weight: product.weight
      ? { '@type': 'QuantitativeValue', value: product.weight, unitText: 'g' }
      : undefined,
    offers: {
      '@type': 'Offer',
      url: absoluteUrl(`/products/${product.slug}`),
      availability: 'https://schema.org/InStoreOnly',
      priceCurrency: 'INR',
      ...(typeof product.priceValue === 'number' && product.priceValue > 0
        ? { price: product.priceValue }
        : {}),
      seller: { '@type': 'JewelryStore', name: SITE_NAME },
    },
  };
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
      'Bridal sets, necklaces, chains, bangles, earrings, pendants and silver — hallmarked jewellery for rituals and everyday wear in Byasanagar.',
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
