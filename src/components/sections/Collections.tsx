import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { COLLECTIONS } from '../../utils/constants';

export default function Collections() {
  const [activeId, setActiveId] = useState(COLLECTIONS[0]?.id ?? 'bridal');
  const active = COLLECTIONS.find((c) => c.id === activeId) ?? COLLECTIONS[0];

  return (
    <section
      className="kj-collections"
      style={{
        backgroundColor: 'var(--color-bg)',
        paddingTop: 'clamp(16px, 2.5vw, 28px)',
        paddingBottom: 'clamp(64px, 10vw, 120px)',
      }}
    >
      <div className="container">
        <div
          className="kj-collections-layout"
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(240px, 0.9fr) minmax(0, 1.25fr)',
            gap: 'clamp(40px, 6vw, 80px)',
            alignItems: 'stretch',
          }}
        >
          {/* Index list — not a masonry card grid */}
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.85 }}
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(2rem, 3.8vw, 3rem)',
                fontWeight: 600,
                color: 'var(--color-text)',
                lineHeight: 1.15,
                marginBottom: '12px',
              }}
            >
              In the showroom
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.75, delay: 0.1 }}
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 300,
                fontSize: '0.9375rem',
                color: 'var(--color-muted)',
                lineHeight: 1.7,
                marginBottom: '40px',
                maxWidth: '28rem',
              }}
            >
              Bridal sets, festival bangles, temple pendants, and the everyday gold families wear in Byasanagar.
            </motion.p>

            <nav aria-label="Collections" style={{ display: 'flex', flexDirection: 'column' }}>
              {COLLECTIONS.map((col, i) => {
                const isActive = col.id === activeId;
                return (
                  <motion.button
                    key={col.id}
                    type="button"
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.55, delay: i * 0.04 }}
                    onMouseEnter={() => setActiveId(col.id)}
                    onFocus={() => setActiveId(col.id)}
                    onClick={() => setActiveId(col.id)}
                    style={{
                      textAlign: 'left',
                      background: 'transparent',
                      border: 'none',
                      borderBottom: '1px solid var(--color-divider)',
                      padding: '18px 0',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '1.25rem',
                        fontWeight: 600,
                        color: isActive ? 'var(--color-maroon)' : 'var(--color-text)',
                        transition: 'color 0.25s ease',
                      }}
                    >
                      {col.name}
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontWeight: 300,
                        fontSize: '0.8125rem',
                        color: 'var(--color-muted)',
                        lineHeight: 1.5,
                      }}
                    >
                      {col.shortDescription}
                    </span>
                  </motion.button>
                );
              })}
            </nav>

            <Link
              to="/collections"
              style={{
                display: 'inline-block',
                marginTop: '32px',
                fontFamily: 'var(--font-body)',
                fontSize: '0.6875rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--color-maroon)',
                borderBottom: '1px solid var(--color-gold)',
                paddingBottom: '3px',
                textDecoration: 'none',
              }}
            >
              Open full catalogue
            </Link>
          </div>

          {/* Featured preview */}
          <motion.div
            key={active?.id}
            initial={{ opacity: 0.4 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.45 }}
            style={{ position: 'relative', minHeight: '520px' }}
          >
            <Link
              to={`/collections/${active?.slug ?? 'bridal-collection'}`}
              style={{ display: 'block', height: '100%', textDecoration: 'none', color: 'inherit' }}
            >
              <div
                style={{
                  position: 'relative',
                  height: '100%',
                  minHeight: '520px',
                  overflow: 'hidden',
                  backgroundColor: 'var(--color-maroon)',
                }}
              >
                <img
                  src={active?.image}
                  alt={active?.name ?? 'Collection'}
                  loading="lazy"
                  decoding="async"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center',
                    display: 'block',
                    opacity: 0.92,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(180deg, transparent 45%, rgba(24,24,24,0.88) 100%)',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    padding: '36px 32px',
                  }}
                >
                  <p
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '0.75rem',
                      letterSpacing: '0.28em',
                      textTransform: 'uppercase',
                      color: 'var(--color-gold)',
                      marginBottom: '10px',
                    }}
                  >
                    Featured
                  </p>
                  <h3
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
                      fontWeight: 600,
                      color: 'var(--color-ivory)',
                      marginBottom: '12px',
                    }}
                  >
                    {active?.name}
                  </h3>
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontWeight: 300,
                      fontSize: '0.875rem',
                      color: 'var(--color-on-maroon)',
                      maxWidth: '32rem',
                      lineHeight: 1.7,
                    }}
                  >
                    {active?.shortDescription}
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .kj-collections-layout {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          .kj-collections-layout > div:last-child {
            min-height: 380px !important;
            order: -1;
          }
          .kj-collections-layout > div:last-child a > div {
            min-height: 380px !important;
          }
        }
      `}</style>
    </section>
  );
}
