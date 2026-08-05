import type { GalleryImage } from '../types';

export type GalleryCategory =
  | 'all'
  | 'videos'
  | 'store'
  | 'bridal'
  | 'necklaces'
  | 'chains'
  | 'bangles'
  | 'bracelets'
  | 'earrings'
  | 'pendants'
  | 'silver'
  | 'collections'
  | 'products'
  | 'highlights';

export interface GalleryItem extends GalleryImage {
  category: Exclude<GalleryCategory, 'all'>;
}

const u = (path: string) =>
  `https://images.unsplash.com/${path}?auto=format&fit=crop&w=1400&q=80`;

/** Static gallery moments for the storefront (collections cards stay on placeholders). */
export const GALLERY_PAGE_IMAGES: GalleryItem[] = [
  {
    id: 'g1',
    src: '/krishna-jewellers-hero.avif',
    alt: 'Bridal gold at Krishna Jewellers',
    span: 'wide',
    category: 'bridal',
  },
  {
    id: 'g2',
    src: '/hero-2.png',
    alt: 'Gold necklace detail',
    span: 'normal',
    category: 'necklaces',
  },
  {
    id: 'g3',
    src: '/hero-3.png',
    alt: 'Traditional earrings',
    span: 'tall',
    category: 'earrings',
  },
  {
    id: 'g4',
    src: u('photo-1573408301185-9146fe634ad0'),
    alt: 'Hallmarked gold jewellery display',
    span: 'normal',
    category: 'store',
  },
  {
    id: 'g5',
    src: u('photo-1601121141461-9d6647bca1ed'),
    alt: 'Temple-town gold necklace',
    span: 'wide',
    category: 'necklaces',
  },
  {
    id: 'g6',
    src: u('photo-1535632066927-ab7c9ab60908'),
    alt: 'Gold earrings close-up',
    span: 'normal',
    category: 'earrings',
  },
  {
    id: 'g7',
    src: u('flagged/photo-1570055349452-29232699cc63'),
    alt: 'Bridal gold and bangles',
    span: 'tall',
    category: 'bangles',
  },
  {
    id: 'g8',
    src: u('photo-1515562141207-7a88fb7ce338'),
    alt: 'Fine jewellery composition',
    span: 'normal',
    category: 'highlights',
  },
  {
    id: 'g9',
    src: u('photo-1605100804763-247f67b3557e'),
    alt: 'Gold ring detail',
    span: 'normal',
    category: 'products',
  },
  {
    id: 'g10',
    src: u('photo-1611591437281-460bfbe1220a'),
    alt: 'Jewellery on soft display',
    span: 'wide',
    category: 'store',
  },
];

export const GALLERY_FILTERS: { id: GalleryCategory; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'videos', label: 'Videos' },
  { id: 'store', label: 'Store' },
  { id: 'bridal', label: 'Bridal' },
  { id: 'necklaces', label: 'Necklaces' },
  { id: 'chains', label: 'Chains' },
  { id: 'bangles', label: 'Bangles' },
  { id: 'bracelets', label: 'Bracelets' },
  { id: 'earrings', label: 'Earrings' },
  { id: 'pendants', label: 'Pendants' },
  { id: 'silver', label: 'Silver' },
  { id: 'collections', label: 'Collections' },
  { id: 'products', label: 'Products' },
  { id: 'highlights', label: 'Highlights' },
];

export function getGalleryByCategory(
  category: GalleryCategory,
  items: GalleryItem[] = GALLERY_PAGE_IMAGES,
): GalleryItem[] {
  if (category === 'all') return items;
  if (category === 'videos') return items.filter((img) => img.mediaType === 'video');
  return items.filter((img) => img.category === category);
}
