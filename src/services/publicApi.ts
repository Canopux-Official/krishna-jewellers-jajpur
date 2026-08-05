/**
 * Lightweight Axios instance for public (unauthenticated) API calls.
 */
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

const publicApi = axios.create({
  baseURL: BASE_URL,
  timeout: 12000,
});

export const publicRatesService = {
  getCurrent: () => publicApi.get('/rates').then((r) => r.data),
};

export const publicTestimonialsService = {
  getApproved: () => publicApi.get('/testimonials?approved=true').then((r) => r.data),
};

export const publicGalleryService = {
  getAll: () => publicApi.get('/gallery').then((r) => r.data),
};

export const publicProductsService = {
  getFeatured: () =>
    publicApi.get('/products', { params: { featured: true, limit: 8 } }).then((r) => r.data),
  getBySlug: (slug: string) => publicApi.get(`/products/slug/${slug}`).then((r) => r.data),
  getByCollection: (categorySlug: string, params?: Record<string, unknown>) =>
    publicApi.get('/products', { params: { category: categorySlug, ...params } }).then((r) => r.data),
  search: (q: string) =>
    publicApi.get('/products', { params: { search: q, limit: 12 } }).then((r) => r.data),
};

export const publicCategoriesService = {
  getAll: () => publicApi.get('/categories').then((r) => r.data),
};

export const publicSettingsService = {
  get: () => publicApi.get('/settings').then((r) => r.data),
};

export const publicOffersService = {
  getActive: () =>
    publicApi.get('/offers', { params: { public: 'true' } }).then((r) => r.data as PublicOffer[]),
};

export interface PublicOffer {
  id: string;
  title: string;
  description: string;
  status: string;
  startDate: string;
  endDate: string;
}

/** Build WhatsApp enquiry URL from store settings + product */
export function buildWhatsAppEnquiry(
  whatsapp: string,
  product: { name: string; purity: string; weight: string },
): string {
  const phone = (whatsapp || '').replace(/[^\d]/g, '');
  const message = encodeURIComponent(
    `Hello Krishna Jewellers,\n\nI am interested in the following piece from your Byasanagar showroom:\n\nProduct Name: ${product.name}\nPurity: ${product.purity}\nWeight: ${product.weight}\n\nPlease share more details.`,
  );
  return `https://wa.me/${phone}?text=${message}`;
}
