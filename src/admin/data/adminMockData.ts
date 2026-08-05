import type {
  AdminProduct, AdminCategory,
  AdminRates, AdminGalleryImage, AdminTestimonial,
  Offer, Activity, StoreSettings,
} from '../types/admin';

// ─── Products (emptied for redesign) ───────────────────────────
export const adminProducts: AdminProduct[] = [];

// ─── Categories ────────────────────────────────────────────────
export const adminCategories: AdminCategory[] = [
  { id: 'bridal', name: 'Bridal Collection', slug: 'bridal-collection', productCount: 0, isActive: true, createdAt: '2026-01-01' },
  { id: 'necklaces', name: 'Gold Necklaces', slug: 'gold-necklaces', productCount: 0, isActive: true, createdAt: '2026-01-01' },
  { id: 'chains', name: 'Gold Chains', slug: 'gold-chains', productCount: 0, isActive: true, createdAt: '2026-01-01' },
  { id: 'bangles', name: 'Bangles', slug: 'bangles', productCount: 0, isActive: true, createdAt: '2026-01-01' },
  { id: 'bracelets', name: 'Gold Bracelets', slug: 'gold-bracelets', productCount: 0, isActive: true, createdAt: '2026-01-01' },
  { id: 'earrings', name: 'Gold Earrings', slug: 'earrings', productCount: 0, isActive: true, createdAt: '2026-01-01' },
  { id: 'pendants', name: 'Gold Pendants', slug: 'gold-pendants', productCount: 0, isActive: true, createdAt: '2026-01-01' },
  { id: 'silver', name: 'Silver Bracelets', slug: 'silver-bracelets', productCount: 0, isActive: true, createdAt: '2026-01-01' },
  { id: 'rings', name: 'Gold Rings', slug: 'gold-rings', productCount: 0, isActive: false, createdAt: '2026-01-01' },
  { id: 'temple', name: 'Temple Jewellery', slug: 'temple-jewellery', productCount: 0, isActive: false, createdAt: '2026-01-01' },
  { id: 'mangalsutra', name: 'Mangalsutra', slug: 'mangalsutra', productCount: 0, isActive: false, createdAt: '2026-01-01' },
  { id: 'kids', name: 'Kids Collection', slug: 'kids-collection', productCount: 0, isActive: false, createdAt: '2026-03-01' },
  { id: 'daily', name: 'Daily Wear Collection', slug: 'daily-wear-collection', productCount: 0, isActive: false, createdAt: '2026-03-01' },
  { id: 'coins', name: 'Coins', slug: 'coins', productCount: 0, isActive: false, createdAt: '2026-02-01' },
];

// ─── Rates ─────────────────────────────────────────────────────
export const defaultRates: AdminRates = {
  gold24k: '7420',
  gold22k: '6803',
  gold18k: '5565',
  silver: '94',
  lastUpdated: 'Today, 10:00 AM',
};

// ─── Gallery (emptied — upload via admin) ──────────────────────
export const galleryImages: AdminGalleryImage[] = [];

// ─── Testimonials ──────────────────────────────────────────────
export const adminTestimonials: AdminTestimonial[] = [
      { id: 't1', name: 'Priyanka Mishra', city: 'Byasanagar', quote: 'We bought our bridal set from Krishna Jewellers — the staff guided us with patience, and every piece felt pure and complete for our wedding.', rating: 5, isApproved: true, createdAt: '2026-06-15' },
  { id: 't2', name: 'Satyabrata Nayak', city: 'Jajpur', quote: 'Transparent rates and honest making charges. For our family, this is the trusted jewellery house in Jajpur Road.', rating: 5, isApproved: true, createdAt: '2026-06-10' },
  { id: 't3', name: 'Ananya Das', city: 'Jajpur', quote: 'From festival bangles to our daughter’s mangalsutra, Krishna Jewellers has been part of every celebration.', rating: 5, isApproved: true, createdAt: '2026-05-28' },
];

// ─── Offers ────────────────────────────────────────────────────
export const offers: Offer[] = [
  { id: 'o1', title: 'Akshaya Tritiya Special', description: 'Get 0% making charges on all gold coins above 5g.', status: 'active', startDate: '2026-07-01', endDate: '2026-07-31' },
  { id: 'o2', title: 'Bridal Season Offer', description: '5% discount on complete bridal sets above ₹3L.', status: 'active', startDate: '2026-06-15', endDate: '2026-09-15' },
];

// ─── Activity ──────────────────────────────────────────────────
export const recentActivity: Activity[] = [
  { id: 'a2', type: 'rate', action: 'Rates updated', detail: '24K: ₹7,420 · 22K: ₹6,803', timestamp: '14 Jul, 10:00 AM' },
];

// ─── Settings ──────────────────────────────────────────────────
export const defaultSettings: StoreSettings = {
  adminName: 'Store Admin',
  email: 'admin@krishnajewellersjajpur.com',
  storeName: 'Krishna Jewellers',
  address: 'Krishna Jewellers\nByasanagar\nJajpur\nOdisha – 755019',
  phone: '',
  whatsapp: '',
  weekdayHours: '10:00 AM – 8:30 PM',
  sundayHours: '10:00 AM – 8:30 PM',
  instagramUrl: '',
  instagramCaption: '',
  facebookUrl: '',
  googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=20.946%2C86.1301%20(Krishna%20Jewellers)',
  showRates: true,
  showBrandStory: true,
  showCollections: true,
  showCraftsmanship: true,
  showTestimonials: true,
  showVisitStore: true,
  showOffers: true,
  showGallery: true,
};
