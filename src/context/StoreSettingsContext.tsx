import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { publicSettingsService } from '../services/publicApi';

export interface SectionVisibility {
  showRates: boolean;
  showBrandStory: boolean;
  showCollections: boolean;
  showCraftsmanship: boolean;
  showTestimonials: boolean;
  showVisitStore: boolean;
  showOffers: boolean;
  showGallery: boolean;
}

export interface PublicStoreSettings extends SectionVisibility {
  storeName: string;
  phone: string;
  whatsapp: string;
  address: string;
  weekdayHours: string;
  sundayHours: string;
  instagramUrl?: string | null;
  facebookUrl?: string | null;
  googleMapsUrl?: string | null;
  email?: string;
  /** True once the public settings request has settled (success or failure). */
  isLoaded: boolean;
}

const VISIBILITY_DEFAULTS: SectionVisibility = {
  showRates: true,
  showBrandStory: true,
  showCollections: true,
  showCraftsmanship: true,
  showTestimonials: true,
  showVisitStore: true,
  showOffers: true,
  showGallery: true,
};

const DEFAULTS: PublicStoreSettings = {
  storeName: 'Krishna Jewellers',
  phone: '',
  whatsapp: '',
  address:
    'Krishna Jewellers\nByasanagar\nJajpur\nOdisha – 755019',
  weekdayHours: '10:00 AM – 8:30 PM',
  sundayHours: '10:00 AM – 8:30 PM',
  googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=20.946%2C86.1301%20(Krishna%20Jewellers)',
  ...VISIBILITY_DEFAULTS,
  isLoaded: false,
};

/** Coerce API / JSON values — never treat the string "false" as truthy. */
export function parseSettingBool(value: unknown, fallback: boolean): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value === 1;
  if (typeof value === 'string') {
    const v = value.trim().toLowerCase();
    if (v === 'true' || v === '1') return true;
    if (v === 'false' || v === '0' || v === '') return false;
  }
  return fallback;
}

const StoreSettingsContext = createContext<PublicStoreSettings>(DEFAULTS);

export function StoreSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<PublicStoreSettings>(DEFAULTS);

  useEffect(() => {
    publicSettingsService
      .get()
      .then((data) =>
        setSettings({
          storeName: data.storeName || DEFAULTS.storeName,
          phone: data.phone || DEFAULTS.phone,
          whatsapp: data.whatsapp || DEFAULTS.whatsapp,
          address: data.address || DEFAULTS.address,
          weekdayHours: data.weekdayHours || DEFAULTS.weekdayHours,
          sundayHours: data.sundayHours || DEFAULTS.sundayHours,
          instagramUrl: data.instagramUrl,
          facebookUrl: data.facebookUrl,
          googleMapsUrl: data.googleMapsUrl || DEFAULTS.googleMapsUrl,
          email: data.email,
          showRates: parseSettingBool(data.showRates, true),
          showBrandStory: parseSettingBool(data.showBrandStory, true),
          showCollections: parseSettingBool(data.showCollections, true),
          showCraftsmanship: parseSettingBool(data.showCraftsmanship, true),
          showTestimonials: parseSettingBool(data.showTestimonials, true),
          showVisitStore: parseSettingBool(data.showVisitStore, true),
          showOffers: parseSettingBool(data.showOffers, true),
          showGallery: parseSettingBool(data.showGallery, true),
          isLoaded: true,
        }),
      )
      .catch(() => {
        setSettings((prev) => ({ ...prev, isLoaded: true }));
      });
  }, []);

  return <StoreSettingsContext.Provider value={settings}>{children}</StoreSettingsContext.Provider>;
}

export function useStoreSettings() {
  return useContext(StoreSettingsContext);
}

export { VISIBILITY_DEFAULTS };
