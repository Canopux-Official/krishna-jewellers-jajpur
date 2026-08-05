import api from './api';

export interface StoreSettings {
  id?: string;
  storeName: string;
  adminName: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  weekdayHours: string;
  sundayHours: string;
  instagramUrl?: string | null;
  instagramCaption?: string | null;
  facebookUrl?: string | null;
  googleMapsUrl?: string | null;
  showRates?: boolean;
  showBrandStory?: boolean;
  showCollections?: boolean;
  showCraftsmanship?: boolean;
  showTestimonials?: boolean;
  showVisitStore?: boolean;
  showOffers?: boolean;
  showGallery?: boolean;
}

export const settingsService = {
  get: () => api.get<StoreSettings>('/settings').then((r) => r.data),
  update: (data: Partial<StoreSettings>) => api.put<StoreSettings>('/settings', data).then((r) => r.data),
};
