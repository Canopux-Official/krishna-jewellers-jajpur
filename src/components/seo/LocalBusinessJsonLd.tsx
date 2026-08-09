import { useEffect } from 'react';
import { useStoreSettings } from '../../context/StoreSettingsContext';
import { buildLocalBusinessJsonLd, buildWebSiteJsonLd } from '../../utils/seo';

const SCRIPT_ID = 'local-business-json-ld';

/** Injects JewelryStore / LocalBusiness + WebSite schema for the public site. */
export default function LocalBusinessJsonLd() {
  const settings = useStoreSettings();

  useEffect(() => {
    const data = {
      '@context': 'https://schema.org',
      '@graph': [
        (() => {
          const { '@context': _c, ...store } = buildLocalBusinessJsonLd(settings);
          return store;
        })(),
        (() => {
          const { '@context': _c, ...site } = buildWebSiteJsonLd();
          return site;
        })(),
      ],
    };
    let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = SCRIPT_ID;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);
  }, [settings]);

  return null;
}
