import type { Collection } from '../types';
import { STORE_PHOTOS } from './storeImages';

const C = STORE_PHOTOS.collections;

export const COLLECTIONS: Collection[] = [
  {
    id: 'bridal',
    slug: 'bridal-collection',
    name: 'Bridal Collection',
    shortDescription: 'Haars, chokers and sets for the sacred day.',
    description:
      'Bridal ornaments for Odia weddings and family rites — layered haars, chokers, and matching sets finished with care and BIS-hallmarked for purity.',
    image: C.bridal,
    bannerImage: C.bridal,
    productCount: 0,
    size: 'large',
  },
  {
    id: 'necklaces',
    slug: 'gold-necklaces',
    name: 'Gold Necklaces',
    shortDescription: 'Temple grace to everyday gold.',
    description:
      'From light daily-wear necklaces to statement bridal haars — available in 22K and 18K gold for festivals, rituals, and heirloom occasions.',
    image: C.goldNecklaces,
    bannerImage: C.goldNecklaces,
    productCount: 0,
    size: 'medium',
  },
  {
    id: 'chains',
    slug: 'gold-chains',
    name: 'Gold Chains',
    shortDescription: 'Links of purity for every day.',
    description:
      'Classic and lightweight gold chains for daily wear or as the foundation for pendants — hallmarked in 22K and 18K gold.',
    image: C.goldChains,
    bannerImage: C.goldChains,
    productCount: 0,
    size: 'small',
  },
  {
    id: 'bangles',
    slug: 'bangles',
    name: 'Bangles',
    shortDescription: 'Chura, pairs, and festive stacks.',
    description:
      'Traditional bangles and bridal chura — from slender plain gold to richly worked pairs for sankranti, weddings, and house celebrations.',
    image: C.bangles,
    bannerImage: C.bangles,
    productCount: 0,
    size: 'medium',
  },
  {
    id: 'bracelets',
    slug: 'gold-bracelets',
    name: 'Gold Bracelets',
    shortDescription: 'Grace for the wrist.',
    description:
      'Twisted, curb, and delicate link bracelets that bridge Odisha tradition with easy contemporary wear.',
    image: C.bracelets,
    bannerImage: C.bracelets,
    productCount: 0,
    size: 'small',
  },
  {
    id: 'earrings',
    slug: 'earrings',
    name: 'Gold Earrings',
    shortDescription: 'Jhumkas, studs and drops.',
    description:
      'Classic jhumkas, temple-inspired drops, and refined studs for daily wear and festival evenings.',
    image: C.earrings,
    bannerImage: C.earrings,
    productCount: 0,
    size: 'small',
  },
  {
    id: 'pendants',
    slug: 'gold-pendants',
    name: 'Gold Pendants',
    shortDescription: 'Motifs of devotion & beauty.',
    description:
      'Temple, floral, and sacred motifs in 22K and 18K gold — pendants meant to be worn close to the heart.',
    image: C.pendants,
    bannerImage: C.pendants,
    productCount: 0,
    size: 'small',
  },
  {
    id: 'silver',
    slug: 'silver-bracelets',
    name: 'Silver Bracelets',
    shortDescription: 'Silver for everyday blessing.',
    description:
      'Quality silver bracelets and everyday pieces — approachable, durable, and finished with the same care as our gold.',
    image: C.silver,
    bannerImage: C.silver,
    productCount: 0,
    size: 'small',
  },
];

export function getCollectionBySlug(slug: string): Collection | undefined {
  return COLLECTIONS.find((c) => c.slug === slug);
}
