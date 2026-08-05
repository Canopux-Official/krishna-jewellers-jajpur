import { motion } from 'framer-motion';
import SectionLabel from '../ui/SectionLabel';
import GoldDivider from '../ui/GoldDivider';
import MapsDirectionsButton from '../ui/MapsDirectionsButton';
import { useStoreSettings } from '../../context/StoreSettingsContext';
import { STORE_PHOTOS } from '../../data/storeImages';
import { getStoreMapsEmbedUrl } from '../../utils/maps';

const STORE_IMAGE = STORE_PHOTOS.findUs;
const MAP_EMBED_URL = getStoreMapsEmbedUrl();

export default function VisitStore() {
  const settings = useStoreSettings();

  const storeDetails = [
    {
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      ),
      label: 'Address',
      value: settings.address,
    },
    {
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
      label: 'Opening Hours',
      value: `Monday – Sunday\n${settings.weekdayHours}\nClosed on the last Sunday of every month`,
    },
    {
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.63 3.18 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l.81-.81a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      ),
      label: 'Phone',
      value: settings.phone,
    },
  ];

  return (
    <section
      id="visit"
      className="section-padding"
      style={{ backgroundColor: 'var(--color-bg-alt)' }}
    >
      <div className="container">
        <div
          className="store-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '80px',
            alignItems: 'center',
          }}
        >
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1, ease: 'easeInOut' }}
            style={{
              position: 'relative',
              aspectRatio: '4/5',
              overflow: 'hidden',
            }}
          >
            <motion.img
              src={STORE_IMAGE}
              alt={`${settings.storeName} store`}
              loading="lazy"
              decoding="async"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.9, ease: 'easeInOut' }}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: '80px',
                height: '80px',
                borderRight: '2px solid var(--color-gold)',
                borderBottom: '2px solid var(--color-gold)',
                pointerEvents: 'none',
              }}
            />
          </motion.div>

          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              style={{ marginBottom: '20px' }}
            >
              <SectionLabel>Find Us</SectionLabel>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.1, ease: 'easeInOut' }}
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(2rem, 3.5vw, 3rem)',
                fontWeight: 600,
                color: 'var(--color-text)',
                lineHeight: 1.12,
                marginBottom: '28px',
              }}
            >
              Visit Our
              <br />
              <span style={{ fontStyle: 'italic', color: 'var(--color-bronze)' }}>
                Byasanagar Showroom
              </span>
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{ marginBottom: '40px' }}
            >
              <GoldDivider />
            </motion.div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {storeDetails.map((detail, i) => (
                <motion.div
                  key={detail.label}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.3 + i * 0.1, ease: 'easeInOut' }}
                  style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}
                >
                  <div
                    style={{
                      color: 'var(--color-gold)',
                      flexShrink: 0,
                      marginTop: '2px',
                    }}
                  >
                    {detail.icon}
                  </div>
                  <div>
                    <p
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.5625rem',
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        color: 'var(--color-muted)',
                        marginBottom: '6px',
                      }}
                    >
                      {detail.label}
                    </p>
                    <p
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.875rem',
                        color: 'var(--color-text)',
                        lineHeight: 1.75,
                        whiteSpace: 'pre-line',
                      }}
                    >
                      {detail.value}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.85, delay: 0.1 }}
          style={{ marginTop: 72 }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
              flexWrap: 'wrap',
              marginBottom: 16,
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.6875rem',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'var(--color-muted)',
              }}
            >
              Store location
            </p>
            <MapsDirectionsButton />
          </div>
          <div
            style={{
              width: '100%',
              height: 420,
              border: '1px solid var(--color-divider)',
              overflow: 'hidden',
              backgroundColor: 'var(--color-bg)',
            }}
          >
            <iframe
              title="Krishna Jewellers location"
              src={MAP_EMBED_URL}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              style={{
                width: '100%',
                height: '100%',
                border: 0,
                display: 'block',
              }}
              allowFullScreen
            />
          </div>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .store-grid {
            grid-template-columns: 1fr !important;
            gap: 48px !important;
          }
        }
      `}</style>
    </section>
  );
}
