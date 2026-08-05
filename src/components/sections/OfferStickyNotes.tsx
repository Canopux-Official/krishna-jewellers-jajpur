import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { publicOffersService, type PublicOffer } from '../../services/publicApi';

const MAX_NOTES = 3;
const MAX_NOTES_MOBILE = 1;

const NOTE_STYLES = [
  { bg: '#F3E6C8', rotate: -2.5, tape: 'rgba(199,161,90,0.55)' },
  { bg: '#EDE4D4', rotate: 1.8, tape: 'rgba(139,115,85,0.45)' },
  { bg: '#F0E8D2', rotate: -1.2, tape: 'rgba(199,161,90,0.4)' },
];

/** Survives React remounts; cleared only on full page refresh. */
const dismissedIds = new Set<string>();
let lockedOfferIds: string[] | null = null;

function useIsMobile(breakpoint = 700) {
  const [mobile, setMobile] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(`(max-width: ${breakpoint}px)`).matches : false,
  );

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const onChange = () => setMobile(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [breakpoint]);

  return mobile;
}

export default function OfferStickyNotes() {
  const [offers, setOffers] = useState<PublicOffer[]>([]);
  const [, bump] = useState(0);
  const isMobile = useIsMobile();

  useEffect(() => {
    let cancelled = false;
    publicOffersService
      .getActive()
      .then((data) => {
        if (cancelled) return;
        const list = Array.isArray(data) ? data : [];
        if (!lockedOfferIds) {
          lockedOfferIds = list.slice(0, MAX_NOTES).map((o) => o.id);
        }
        setOffers(list.filter((o) => lockedOfferIds!.includes(o.id)));
      })
      .catch(() => {
        if (!cancelled) setOffers([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const limit = isMobile ? MAX_NOTES_MOBILE : MAX_NOTES;
  const visible = offers.filter((o) => !dismissedIds.has(o.id)).slice(0, limit);

  const dismiss = (id: string) => {
    dismissedIds.add(id);
    bump((n) => n + 1);
  };

  if (visible.length === 0) return null;

  return (
    <div
      className="offer-sticky-stack"
      aria-label="Current offers"
      style={{
        position: 'fixed',
        zIndex: 95,
        display: 'flex',
        flexDirection: 'column-reverse',
        alignItems: 'flex-end',
        gap: 12,
        pointerEvents: 'none',
      }}
    >
      <AnimatePresence initial={false}>
        {visible.map((offer, i) => {
          const style = NOTE_STYLES[i % NOTE_STYLES.length];
          const rotate = isMobile ? 0 : style.rotate;
          return (
            <motion.aside
              key={offer.id}
              initial={{ opacity: 0, y: 20, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotate }}
              exit={{ opacity: 0, scale: 0.9, y: 12 }}
              transition={{ duration: 0.4, delay: i * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{
                pointerEvents: 'auto',
                position: 'relative',
                width: '100%',
                backgroundColor: style.bg,
                padding: isMobile ? '16px 14px 14px' : '18px 14px 16px',
                paddingTop: isMobile ? 20 : 18,
                boxShadow: '2px 6px 18px rgba(24,24,24,0.16)',
                border: '1px solid rgba(139,115,85,0.12)',
                transformOrigin: 'center top',
                overflow: 'visible',
              }}
            >
              <span
                aria-hidden
                style={{
                  position: 'absolute',
                  top: -7,
                  left: '50%',
                  transform: 'translateX(-50%) rotate(-2deg)',
                  width: 48,
                  height: 14,
                  backgroundColor: style.tape,
                  opacity: 0.85,
                }}
              />

              <button
                type="button"
                aria-label={`Dismiss ${offer.title}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  dismiss(offer.id);
                }}
                style={{
                  position: 'absolute',
                  top: 6,
                  right: 6,
                  width: 28,
                  height: 28,
                  border: 'none',
                  borderRadius: 4,
                  background: 'rgba(46,46,46,0.08)',
                  cursor: 'pointer',
                  color: 'rgba(46,46,46,0.7)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '1.125rem',
                  lineHeight: 1,
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 2,
                }}
              >
                ×
              </button>

              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.5625rem',
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: 'var(--color-bronze)',
                  marginBottom: 6,
                  paddingRight: 28,
                }}
              >
                Offer
              </p>

              <h3
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: isMobile ? '0.95rem' : '1.05rem',
                  fontWeight: 600,
                  color: 'var(--color-text)',
                  lineHeight: 1.25,
                  marginBottom: 6,
                  paddingRight: 8,
                }}
              >
                {offer.title}
              </h3>

              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.72rem',
                  color: 'var(--color-muted)',
                  lineHeight: 1.5,
                }}
              >
                {offer.description}
              </p>
            </motion.aside>
          );
        })}
      </AnimatePresence>

      <style>{`
        .offer-sticky-stack {
          right: max(16px, env(safe-area-inset-right));
          bottom: max(24px, env(safe-area-inset-bottom));
          max-width: min(220px, calc(100vw - 32px));
        }
        @media (max-width: 700px) {
          .offer-sticky-stack {
            right: max(12px, env(safe-area-inset-right));
            bottom: max(56px, calc(env(safe-area-inset-bottom) + 48px));
            max-width: min(168px, calc(100vw - 28px));
          }
        }
      `}</style>
    </div>
  );
}
