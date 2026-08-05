import { motion } from 'framer-motion';
import SectionLabel from '../ui/SectionLabel';
import { TESTIMONIALS } from '../../utils/constants';

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

export default function Testimonials() {
  return (
    <section
      className="section-padding"
      style={{ backgroundColor: 'var(--color-bg-alt)' }}
    >
      <div className="container">
        <div style={{ marginBottom: 'clamp(40px, 6vw, 64px)', maxWidth: '36rem' }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <SectionLabel>Voices from Jajpur</SectionLabel>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.08 }}
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.85rem, 3.5vw, 2.75rem)',
              fontWeight: 600,
              color: 'var(--color-text)',
              lineHeight: 1.2,
              marginTop: '16px',
            }}
          >
            What families say about us
          </motion.h2>
        </div>

        <div
          className="kj-testimonial-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 'clamp(16px, 2.2vw, 28px)',
          }}
        >
          {TESTIMONIALS.map((t, i) => (
            <motion.article
              key={t.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: 'easeOut' }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                padding: 'clamp(28px, 3vw, 36px)',
                backgroundColor: 'var(--color-bg)',
                border: '1px solid var(--color-divider)',
                borderRadius: '4px',
                boxShadow: '0 10px 28px rgba(24,24,24,0.04)',
              }}
            >
              <span
                aria-hidden
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '3rem',
                  lineHeight: 1,
                  color: 'var(--color-gold)',
                  marginBottom: '16px',
                }}
              >
                “
              </span>

              <blockquote
                style={{
                  flex: 1,
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(1.05rem, 1.5vw, 1.2rem)',
                  fontWeight: 400,
                  fontStyle: 'italic',
                  lineHeight: 1.65,
                  color: 'var(--color-text)',
                  margin: 0,
                }}
              >
                {t.quote}
              </blockquote>

              <div
                style={{
                  marginTop: '28px',
                  paddingTop: '22px',
                  borderTop: '1px solid var(--color-divider)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                }}
              >
                <div
                  aria-hidden
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background:
                      'linear-gradient(145deg, rgba(199,161,90,0.22), rgba(199,161,90,0.06))',
                    border: '1px solid rgba(199,161,90,0.35)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    letterSpacing: '0.06em',
                    color: 'var(--color-bronze)',
                  }}
                >
                  {initials(t.name)}
                </div>
                <div>
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.8125rem',
                      fontWeight: 500,
                      letterSpacing: '0.06em',
                      color: 'var(--color-text)',
                      marginBottom: '4px',
                    }}
                  >
                    {t.name}
                  </p>
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.625rem',
                      letterSpacing: '0.16em',
                      textTransform: 'uppercase',
                      color: 'var(--color-muted)',
                    }}
                  >
                    {t.city}
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .kj-testimonial-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 600px) {
          .kj-testimonial-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
