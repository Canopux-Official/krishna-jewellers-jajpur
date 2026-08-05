import type { Purity } from '../../types';

// ─── Admin Product ──────────────────────────────────────────────
export interface AdminProduct {
  id: string;
  slug: string;
  name: string;
  category: string;
  categorySlug: string;
  purity: Purity;
  weight: string;
  price?: string;
  images: string[];
  description: string;
  makingStyle?: string;
  isNewArrival: boolean;
  isFeatured: boolean;
  isAvailable: boolean;
  isHidden: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Category ──────────────────────────────────────────────────
export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  productCount: number;
  isActive: boolean;
  createdAt: string;
}

// ─── Metal Rates ───────────────────────────────────────────────
export interface AdminRates {
  gold24k: string;
  gold22k: string;
  gold18k: string;
  silver: string;
  lastUpdated: string;
}

// ─── Gallery Image ─────────────────────────────────────────────
export interface AdminGalleryImage {
  id: string;
  src: string;
  alt: string;
  uploadedAt: string;
}

// ─── Testimonial ───────────────────────────────────────────────
export interface AdminTestimonial {
  id: string;
  name: string;
  city: string;
  quote: string;
  rating: number;
  isApproved: boolean;
  createdAt: string;
}

// ─── Offer ─────────────────────────────────────────────────────
export type OfferStatus = 'active' | 'scheduled' | 'expired';

export interface Offer {
  id: string;
  title: string;
  description: string;
  status: OfferStatus;
  startDate: string;
  endDate: string;
}

// ─── Activity ──────────────────────────────────────────────────
export type ActivityType = 'product' | 'rate' | 'gallery' | 'offer' | 'testimonial' | 'category';

export interface Activity {
  id: string;
  type: ActivityType;
  action: string;
  detail: string;
  timestamp: string;
}

// ─── Store Settings ────────────────────────────────────────────
export interface StoreSettings {
  storeName: string;
  adminName: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  weekdayHours: string;
  sundayHours: string;
  instagramUrl?: string;
  instagramCaption?: string;
  facebookUrl?: string;
  googleMapsUrl?: string;
  showRates: boolean;
  showBrandStory: boolean;
  showCollections: boolean;
  showCraftsmanship: boolean;
  showTestimonials: boolean;
  showVisitStore: boolean;
  showOffers: boolean;
  showGallery: boolean;
}

// ─── Dashboard Stats ───────────────────────────────────────────
export interface DashboardStat {
  label: string;
  value: string | number;
  sub?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color?: string;
}
