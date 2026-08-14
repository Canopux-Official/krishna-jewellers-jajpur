import type { Collection } from '../types';
import { STORE_PHOTOS } from './storeImages';

const C = STORE_PHOTOS.collections;
const B = STORE_PHOTOS.collectionBanners;

export const COLLECTIONS: Collection[] = [
  {
    id: 'bridal',
    slug: 'bridal-collection',
    name: 'Bridal Collection',
    shortDescription: 'Haars, chokers and sets for the sacred day.',
    description:
      'Bridal ornaments for Odia weddings and family rites — layered haars, chokers, and matching sets finished with care and BIS-hallmarked for purity.',
    image: C.bridal,
    bannerImage: B.bridal,
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
    bannerImage: B.goldNecklaces,
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
    bannerImage: B.goldChains,
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
    bannerImage: B.bangles,
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
    bannerImage: B.bracelets,
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
    bannerImage: B.earrings,
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
    bannerImage: B.pendants,
    productCount: 0,
    size: 'small',
  },
  {
    id: 'coins',
    slug: 'gold-coins--bars',
    name: 'Coins',
    shortDescription: 'Hallmarked gold coins.',
    description:
      'BIS-hallmarked gold coins for gifting, auspicious occasions, and lasting value.',
    image: C.coins,
    bannerImage: B.coins,
    productCount: 0,
    size: 'small',
  },
  {
    id: 'mangalsutra',
    slug: 'mangalsutra',
    name: 'Mangalsutra',
    shortDescription: 'Sacred threads of gold.',
    description:
      'Traditional and contemporary mangalsutra designs — from classic black-bead strands to light daily-wear pieces.',
    image: C.mangalsutra,
    bannerImage: B.mangalsutra,
    productCount: 0,
    size: 'medium',
  },
  {
    id: 'watches',
    slug: 'watches--collections',
    name: 'Watches',
    shortDescription: 'Fine timepieces.',
    description:
      'Curated watches chosen to pair with everyday gold — for gifting and personal style.',
    image: C.watches,
    bannerImage: B.watches,
    productCount: 0,
    size: 'small',
  },
  {
    id: 'diamonds',
    slug: 'diamond-collections',
    name: 'Diamonds',
    shortDescription: 'Fine timepieces.',
    description:
      'Curated watches chosen to pair with everyday gold — for gifting and personal style.',
    image: C.diamonds,
    bannerImage: B.diamonds,
    productCount: 0,
    size: 'small',
  },
  {
    id: 'gemstones',
    slug: 'gemstones',
    name: 'Gemstones',
    shortDescription: 'Fine timepieces.',
    description:
      'Curated watches chosen to pair with everyday gold — for gifting and personal style.',
    image: C.gemstones,
    bannerImage: B.gemstones,
    productCount: 0,
    size: 'small',
  },
];

export function getCollectionBySlug(slug: string): Collection | undefined {
  return COLLECTIONS.find((c) => c.slug === slug);
}
