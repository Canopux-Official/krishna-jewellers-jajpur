import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SectionLabel from '../ui/SectionLabel';
import { publicRatesService } from '../../services/publicApi';

const metalIcons: Record<string, string> = {
  '24K Gold': 'Au', '22K Gold': 'Au', '18K Gold': 'Au', Silver: 'Ag',
};

interface RateCard { label: string; karat: string | null; ratePerGram: string; lastUpdated: string; }

function buildRateCards(data: any, lastUpdated: string): RateCard[] {
  const fmt = (n: number) => `₹${n.toLocaleString('en-IN')}`;
  const updatedStr = lastUpdated
    ? new Date(lastUpdated).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })
    : 'Not yet updated';
  return [
    { label: '24K Gold', karat: '24K', ratePerGram: fmt(data.gold24k), lastUpdated: updatedStr },
    { label: '22K Gold', karat: '22K', ratePerGram: fmt(data.gold22k), lastUpdated: updatedStr },
    { label: '18K Gold', karat: '18K', ratePerGram: fmt(data.gold18k), lastUpdated: updatedStr },
    { label: 'Silver',   karat: null,  ratePerGram: fmt(data.silver),  lastUpdated: updatedStr },
  ];
}

const FALLBACK_RATES = {
  gold24k: 7420,
  gold22k: 6800,
  gold18k: 5560,
  silver: 98,
};

export default function MetalRates() {
  const [rates, setRates] = useState<RateCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicRatesService
      .getCurrent()
      .then((data) => setRates(buildRateCards(data, data.lastUpdated || '')))
      .catch(() => {
        setRates(buildRateCards(FALLBACK_RATES, ''));
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section
      style={{
        backgroundColor: 'var(--color-dark)',
        paddingBlock: 'var(--space-20)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle bg texture */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'radial-gradient(ellipse 60% 60% at 80% 50%, rgba(199,161,90,0.04) 0%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ marginBottom: '64px' }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          >
            <SectionLabel light>Transparent Pricing</SectionLabel>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.1, ease: 'easeInOut' }}
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2rem, 4vw, 3.25rem)',
              fontWeight: 600,
              color: 'var(--color-ivory)',
              marginTop: '16px',
              lineHeight: 1.15,
            }}
          >
            Today&apos;s Gold &amp;
            <br />
            <span style={{ fontStyle: 'italic', color: 'var(--color-gold)' }}>
              Silver in Byasanagar
            </span>
          </motion.h2>
        </div>

        {/* Rates Grid */}
        <div
          className="rates-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1px',
            background: 'rgba(221,215,207,0.12)',
            border: '1px solid rgba(221,215,207,0.12)',
          }}
        >
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} style={{ background: 'rgba(24,24,24,0.98)', padding: '48px 40px', minHeight: '220px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid rgba(199,161,90,0.15)' }} />
                  <div style={{ width: '60%', height: '10px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '4px' }} />
                  <div style={{ width: '80%', height: '40px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '4px' }} />
                </div>
              ))
            : rates.map((rate, i) => (
            <motion.div
              key={rate.label}
              className="rates-card"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeInOut' }}
              style={{
                background: 'rgba(24,24,24,0.98)',
                padding: '48px 40px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Element symbol watermark */}
              <span
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '20px',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '4rem',
                  fontWeight: 300,
                  color: 'rgba(199,161,90,0.06)',
                  lineHeight: 1,
                  userSelect: 'none',
                  pointerEvents: 'none',
                }}
              >
                {metalIcons[rate.label]}
              </span>

              {/* Karat badge */}
              {rate.karat && (
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '36px',
                    height: '36px',
                    border: '1px solid rgba(199,161,90,0.35)',
                    borderRadius: '50%',
                    marginBottom: '24px',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.5625rem',
                      letterSpacing: '0.08em',
                      color: 'var(--color-gold)',
                    }}
                  >
                    {rate.karat}
                  </span>
                </div>
              )}

              {!rate.karat && (
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '36px',
                    height: '36px',
                    border: '1px solid rgba(139,115,85,0.4)',
                    borderRadius: '50%',
                    marginBottom: '24px',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.5625rem',
                      letterSpacing: '0.06em',
                      color: 'var(--color-bronze)',
                    }}
                  >
                    Ag
                  </span>
                </div>
              )}

              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.625rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'rgba(248,246,242,0.4)',
                  marginBottom: '12px',
                }}
              >
                {rate.label}
              </p>

              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'clamp(2rem, 3vw, 2.75rem)',
                  fontWeight: 300,
                  color: 'var(--color-on-maroon)',
                  lineHeight: 1,
                  marginBottom: '8px',
                  letterSpacing: '0.02em',
                }}
              >
                {rate.ratePerGram}
              </p>

              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.6875rem',
                  color: 'rgba(248,246,242,0.3)',
                  marginBottom: '28px',
                }}
              >
                Per gram (incl. GST)
              </p>

              <div
                style={{
                  paddingTop: '24px',
                  borderTop: '1px solid rgba(221,215,207,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <div
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: 'var(--color-gold)',
                    animation: 'pulse 2s ease-in-out infinite',
                  }}
                />
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.625rem',
                    letterSpacing: '0.12em',
                    color: 'rgba(248,246,242,0.3)',
                  }}
                >
                  {rate.lastUpdated}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Disclaimer */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.6875rem',
            color: 'rgba(248,246,242,0.2)',
            marginTop: '24px',
            textAlign: 'right',
            letterSpacing: '0.06em',
          }}
        >
          * Rates are indicative and may vary. Contact store for confirmed pricing.
        </motion.p>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @media (max-width: 900px) {
          .rates-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .rates-card {
            padding: 28px 20px !important;
          }
        }
        @media (max-width: 480px) {
          .rates-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
