const STORE_LAT = 20.9500125;
const STORE_LNG = 86.131891;
const STORE_NAME = 'Krishna Jewellers';
const STORE_ADDRESS =
  'X42J+2Q2, Bank St, Dolipur, Byasanagar, Odisha 755019';

/** Exact pin from Plus Code X42J+2Q2 (Bank St, Byasanagar). */
const STORE_COORDS = `${STORE_LAT},${STORE_LNG}`;

/**
 * Dropped-pin query with Plus Code address label.
 * Bare names can resolve to the wrong Google Business listing nearby.
 */
const STORE_PIN_QUERY = `${STORE_COORDS} (${STORE_NAME}, ${STORE_ADDRESS})`;

/** Public Google Maps link to our exact coordinates. */
export function getStoreMapsUrl(): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(STORE_PIN_QUERY)}`;
}

/** Embeddable map on our exact pin. */
export function getStoreMapsEmbedUrl(): string {
  return `https://maps.google.com/maps?q=${encodeURIComponent(STORE_PIN_QUERY)}&z=17&output=embed`;
}

/**
 * Directions to the exact lat/lng.
 * Using coordinates (not a place name) stops Google from routing to
 * a nearby unrelated jewellery listing.
 */
export function buildDirectionsUrl(origin?: { lat: number; lng: number }): string {
  const params = new URLSearchParams({
    api: '1',
    destination: STORE_COORDS,
    travelmode: 'driving',
  });
  if (origin) {
    params.set('origin', `${origin.lat},${origin.lng}`);
  }
  return `https://www.google.com/maps/dir/?${params.toString()}`;
}

/**
 * Opens Google Maps directions to the store pin.
 * Tries the user's GPS location as origin; falls back to destination-only.
 */
export function openStoreDirections(): void {
  const fallback = () => {
    window.open(buildDirectionsUrl(), '_blank', 'noopener,noreferrer');
  };

  if (!navigator.geolocation) {
    fallback();
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      window.open(
        buildDirectionsUrl({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        '_blank',
        'noopener,noreferrer',
      );
    },
    () => fallback(),
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 60_000 },
  );
}

export { STORE_LAT, STORE_LNG, STORE_NAME, STORE_ADDRESS, STORE_COORDS };
