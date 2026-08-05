import { motion } from 'framer-motion';
import PageTransition from '../components/ui/PageTransition';
import Breadcrumb from '../components/ui/Breadcrumb';
import SectionLabel from '../components/ui/SectionLabel';
import GoldDivider from '../components/ui/GoldDivider';
import PageMeta from '../components/seo/PageMeta';
import MapsDirectionsButton from '../components/ui/MapsDirectionsButton';
import { useStoreSettings } from '../context/StoreSettingsContext';
import { SECTION_IMAGES } from '../data/storeImages';
import { STATIC_PAGE_META } from '../utils/seo';
import { getStoreMapsEmbedUrl, getStoreMapsUrl } from '../utils/maps';

const HERO_IMAGE = SECTION_IMAGES.contact;

function toMapsEmbedUrl(): string {
  return getStoreMapsEmbedUrl();
}

function toMapsLinkUrl(mapsUrl: string | null | undefined): string {
  if (
    mapsUrl &&
    mapsUrl.includes('google.com/maps') &&
    mapsUrl !== 'https://maps.google.com' &&
    !/^https?:\/\/(www\.)?google\.com\/maps\?q=\d+\.\d+,\d+\.\d+\/?$/i.test(mapsUrl.trim())
  ) {
    // Prefer a saved Place / search URL from settings; ignore bare lat,lng links
    // (those reverse-geocode to whatever POI sits nearest the pin).
    return mapsUrl;
  }
  return getStoreMapsUrl();
}

export default function ContactPage() {
  const settings = useStoreSettings();
  const mapsUrl = toMapsLinkUrl(settings.googleMapsUrl);
  const embedUrl = toMapsEmbedUrl();
  const whatsappHref = `https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`;
  const phoneHref = `tel:${settings.phone.replace(/\s/g, '')}`;

  const details = [
    {
      label: 'Address',
      value: settings.address,
      href: mapsUrl,
    },
    {
      label: 'Phone',
      value: settings.phone,
      href: phoneHref,
    },
    {
      label: 'WhatsApp',
      value: settings.whatsapp.startsWith('+') ? settings.whatsapp : `+${settings.whatsapp}`,
      href: whatsappHref,
    },
    {
      label: 'Hours',
      value: `Monday – Sunday\n${settings.weekdayHours}\nClosed on the last Sunday of every month`,
    },
  ];

  return (
    <PageTransition>
      <PageMeta
        title={STATIC_PAGE_META.contact.title}
        description={STATIC_PAGE_META.contact.description}
        path={STATIC_PAGE_META.contact.path}
      />
      <section
        style={{
          position: 'relative',
          height: '44vh',
          minHeight: '300px',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'flex-end',
        }}
      >
        <motion.div
          initial={{ scale: 1.06 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8, ease: 'easeOut' }}
          style={{ position: 'absolute', inset: 0 }}
        >
          <img
            src={HERO_IMAGE}
            alt="Contact Krishna Jewellers"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
          />
        </motion.div>

        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(24,24,24,0.55) 0%, rgba(24,24,24,0.28) 40%, rgba(24,24,24,0.8) 100%)',
          }}
        />

        <div
          className="container"
          style={{
            position: 'relative',
            zIndex: 1,
            paddingTop: 'calc(var(--navbar-height) + 24px)',
            paddingBottom: '44px',
            width: '100%',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ marginBottom: '20px' }}
          >
            <Breadcrumb light items={[{ label: 'Home', href: '/' }, { label: 'Contact' }]} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35, ease: 'easeInOut' }}
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 600,
              color: '#F8F6F2',
              lineHeight: 1.08,
              marginBottom: '12px',
            }}
          >
            Contact
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.9375rem',
              color: 'rgba(248,246,242,0.7)',
              maxWidth: '420px',
              lineHeight: 1.7,
            }}
          >
            Step into our Byasanagar showroom, or write to us for bridal and festival enquiries.
          </motion.p>
        </div>
      </section>

      <section className="section-padding" style={{ backgroundColor: 'var(--color-bg)' }}>
        <div className="container">
          <div
            className="contact-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1.15fr',
              gap: '56px',
              alignItems: 'start',
            }}
          >
            <div>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                style={{ marginBottom: '16px' }}
              >
                <SectionLabel>Get in Touch</SectionLabel>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.08 }}
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
                  fontWeight: 600,
                  color: 'var(--color-text)',
                  lineHeight: 1.15,
                  marginBottom: '24px',
                }}
              >
                Welcome to
                <br />
                <span style={{ fontStyle: 'italic', color: 'var(--color-bronze)' }}>Krishna Jewellers</span>
              </motion.h2>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.15 }}
                style={{ marginBottom: '36px' }}
              >
                <GoldDivider />
              </motion.div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                {details.map((d, i) => (
                  <motion.div
                    key={d.label}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 + i * 0.06 }}
                  >
                    <p
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.5625rem',
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        color: 'var(--color-muted)',
                        marginBottom: '8px',
                      }}
                    >
                      {d.label}
                    </p>
                    {d.href ? (
                      <a
                        href={d.href}
                        target={d.href.startsWith('http') ? '_blank' : undefined}
                        rel={d.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: '0.9375rem',
                          color: 'var(--color-text)',
                          lineHeight: 1.75,
                          whiteSpace: 'pre-line',
                          textDecoration: 'none',
                          borderBottom: '1px solid transparent',
                          transition: 'border-color 0.25s, color 0.25s',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = 'var(--color-gold)';
                          e.currentTarget.style.borderBottomColor = 'var(--color-gold)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = 'var(--color-text)';
                          e.currentTarget.style.borderBottomColor = 'transparent';
                        }}
                      >
                        {d.value}
                      </a>
                    ) : (
                      <p
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: '0.9375rem',
                          color: 'var(--color-text)',
                          lineHeight: 1.75,
                          whiteSpace: 'pre-line',
                        }}
                      >
                        {d.value}
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.85, delay: 0.1 }}
              style={{ width: '100%' }}
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
                  minHeight: '420px',
                  height: '100%',
                  border: '1px solid var(--color-divider)',
                  overflow: 'hidden',
                  backgroundColor: 'var(--color-bg-alt)',
                }}
              >
                <iframe
                  title="Krishna Jewellers location"
                  src={embedUrl}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  style={{
                    width: '100%',
                    height: '100%',
                    minHeight: '420px',
                    border: 0,
                    display: 'block',
                  }}
                  allowFullScreen
                />
              </div>
            </motion.div>
          </div>
        </div>

        <style>{`
          @media (max-width: 900px) {
            .contact-grid {
              grid-template-columns: 1fr !important;
              gap: 40px !important;
            }
          }
        `}</style>
      </section>
    </PageTransition>
  );
}
