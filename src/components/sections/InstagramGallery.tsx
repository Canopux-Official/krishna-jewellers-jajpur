import { motion } from 'framer-motion';
import SectionLabel from '../ui/SectionLabel';
import { GALLERY_IMAGES } from '../../utils/constants';

export default function InstagramGallery() {
  return (
    <section
      className="section-padding"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{ marginBottom: '12px' }}
          >
            <SectionLabel>@krishnajewellers</SectionLabel>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.1, ease: 'easeInOut' }}
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
              fontWeight: 600,
              color: 'var(--color-text)',
            }}
          >
            Gold Moments from{' '}
            <span style={{ fontStyle: 'italic', color: 'var(--color-bronze)' }}>
              Byasanagar
            </span>
          </motion.h2>
        </div>

        {/* Masonry grid */}
        <div
          className="masonry-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gridAutoRows: '200px',
            gap: '4px',
          }}
        >
          {GALLERY_IMAGES.map((img, i) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.7, delay: i * 0.06, ease: 'easeInOut' }}
              style={{
                gridColumn:
                  img.span === 'wide' ? 'span 2' : 'span 1',
                gridRow:
                  img.span === 'tall' ? 'span 2' : 'span 1',
                overflow: 'hidden',
                position: 'relative',
                backgroundColor: 'var(--color-bg-alt)',
              }}
            >
              <motion.img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                decoding="async"
                whileHover={{ scale: 1.07 }}
                transition={{ duration: 0.85, ease: 'easeInOut' }}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
              {/* Hover overlay */}
              <div
                className="gallery-overlay"
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(24,24,24,0)',
                  transition: 'background 0.4s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg
                  className="gallery-icon"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="rgba(248,246,242,0)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ transition: 'stroke 0.4s ease' }}
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="rgba(248,246,242,0)" />
                </svg>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Follow link */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          style={{ textAlign: 'center', marginTop: '40px' }}
        >
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.6875rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--color-muted)',
              borderBottom: '1px solid var(--color-divider)',
              paddingBottom: '2px',
            }}
          >
            Follow Us on Instagram →
          </a>
        </motion.div>
      </div>

      <style>{`
        .gallery-overlay:hover {
          background: rgba(24,24,24,0.35) !important;
        }
        .gallery-overlay:hover .gallery-icon {
          stroke: rgba(248,246,242,0.8) !important;
        }
        @media (max-width: 900px) {
          .masonry-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            grid-auto-rows: 180px !important;
          }
        }
        @media (max-width: 480px) {
          .masonry-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            grid-auto-rows: 140px !important;
          }
          .masonry-grid > div {
            grid-column: span 1 !important;
            grid-row: span 1 !important;
          }
        }
      `}</style>
    </section>
  );
}
