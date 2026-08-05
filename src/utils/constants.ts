import type { Collection, MetalRate, NavLink, Product, Testimonial, GalleryImage } from '../types';
import { STORE_PHOTOS } from '../data/storeImages';

export const NAV_LINKS: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Collections', href: '/collections' },
  { label: "Today's Rates", href: '/rates' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Contact', href: '/contact' },
];

export const METAL_RATES: MetalRate[] = [
  { label: '24K Gold', karat: '24K', ratePerGram: '₹7,420', lastUpdated: 'Today, 10:00 AM' },
  { label: '22K Gold', karat: '22K', ratePerGram: '₹6,803', lastUpdated: 'Today, 10:00 AM' },
  { label: '18K Gold', karat: '18K', ratePerGram: '₹5,565', lastUpdated: 'Today, 10:00 AM' },
  { label: 'Silver', karat: undefined, ratePerGram: '₹94', lastUpdated: 'Today, 10:00 AM' },
];

const C = STORE_PHOTOS.collections;

export const COLLECTIONS: Collection[] = [
  { id: 'bridal', name: 'Bridal Collection', slug: 'bridal-collection', shortDescription: 'Haars, chokers and sets for the sacred day.', description: '', image: C.bridal, bannerImage: C.bridal, productCount: 0, size: 'large' },
  { id: 'necklaces', name: 'Gold Necklaces', slug: 'gold-necklaces', shortDescription: 'Temple grace to everyday gold.', description: '', image: C.goldNecklaces, bannerImage: C.goldNecklaces, productCount: 0, size: 'medium' },
  { id: 'chains', name: 'Gold Chains', slug: 'gold-chains', shortDescription: 'Links of purity for every day.', description: '', image: C.goldChains, bannerImage: C.goldChains, productCount: 0, size: 'small' },
  { id: 'bangles', name: 'Bangles', slug: 'bangles', shortDescription: 'Chura, pairs, and festive stacks.', description: '', image: C.bangles, bannerImage: C.bangles, productCount: 0, size: 'small' },
  { id: 'bracelets', name: 'Gold Bracelets', slug: 'gold-bracelets', shortDescription: 'Grace for the wrist.', description: '', image: C.bracelets, bannerImage: C.bracelets, productCount: 0, size: 'medium' },
  { id: 'earrings', name: 'Gold Earrings', slug: 'earrings', shortDescription: 'Jhumkas, studs and drops.', description: '', image: C.earrings, bannerImage: C.earrings, productCount: 0, size: 'small' },
  { id: 'pendants', name: 'Gold Pendants', slug: 'gold-pendants', shortDescription: 'Motifs of devotion & beauty.', description: '', image: C.pendants, bannerImage: C.pendants, productCount: 0, size: 'small' },
  { id: 'silver', name: 'Silver Bracelets', slug: 'silver-bracelets', shortDescription: 'Silver for everyday blessing.', description: '', image: C.silver, bannerImage: C.silver, productCount: 0, size: 'medium' },
];

/** Featured products emptied for redesign. */
export const FEATURED_PRODUCTS: Product[] = [];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    quote:
      'We bought our bridal set from Krishna Jewellers — the staff guided us with patience, and every piece felt pure and complete for our wedding.',
    name: 'Priyanka Mishra',
    city: 'Byasanagar',
  },
  {
    id: 't2',
    quote:
      'Transparent rates and honest making charges. For our family, this is the trusted jewellery house in Jajpur Road.',
    name: 'Satyabrata Nayak',
    city: 'Jajpur',
  },
  {
    id: 't3',
    quote:
      'From festival bangles to our daughter’s mangalsutra, Krishna Jewellers has been part of every celebration.',
    name: 'Ananya Das',
    city: 'Jajpur',
  },
];

export const GALLERY_IMAGES: GalleryImage[] = [...STORE_PHOTOS.gallery];
