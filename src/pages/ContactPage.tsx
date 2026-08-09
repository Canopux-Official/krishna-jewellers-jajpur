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
import { buildWhatsAppContact } from '../services/publicApi';

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

function formatWhatsAppDisplay(whatsapp: string): string {
  const digits = whatsapp.replace(/\D/g, '');
  if (!digits) return '';
  if (whatsapp.trim().startsWith('+')) return whatsapp.trim();
  return `+${digits}`;
}

export default function ContactPage() {
  const settings = useStoreSettings();
  const mapsUrl = toMapsLinkUrl(settings.googleMapsUrl);
  const embedUrl = toMapsEmbedUrl();
  const whatsappDigits = (settings.whatsapp || '').replace(/\D/g, '');
  const whatsappHref = buildWhatsAppContact(settings.whatsapp);
  const phoneHref = settings.phone?.trim()
    ? `tel:${settings.phone.replace(/\s/g, '')}`
    : undefined;

  const details: Array<{ label: string; value: string; href?: string }> = [
    {
      label: 'Address',
      value: settings.address,
      href: mapsUrl,
    },
  ];

  if (settings.phone?.trim()) {
    details.push({
      label: 'Phone',
      value: settings.phone,
      href: phoneHref,
    });
  }

  if (whatsappDigits && whatsappHref) {
    details.push({
      label: 'WhatsApp',
      value: formatWhatsAppDisplay(settings.whatsapp),
      href: whatsappHref,
    });
  }

  details.push({
    label: 'Hours',
    value: `Monday – Sunday\n${settings.weekdayHours}\nClosed on the last Sunday of every month`,
  });

  return (
    <PageTransition>
      <PageMeta
        title={STATIC_PAGE_META.contact.title}
        description={STATIC_PAGE_META.contact.description}
        path={STATIC_PAGE_META.contact.path}
      />
      <section className="page-hero page-hero--sm">
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
          className="container page-hero__content"
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
            className="page-hero__lede"
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

              {whatsappHref && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  style={{ marginTop: '36px' }}
                >
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px',
                      padding: '16px 28px',
                      border: '1px solid var(--color-gold)',
                      backgroundColor: 'var(--color-gold)',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.6875rem',
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      color: '#F8F6F2',
                      textDecoration: 'none',
                      transition: 'background-color 0.3s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--color-bronze)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--color-gold)';
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Chat on WhatsApp
                  </a>
                </motion.div>
              )}
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
                className="contact-map"
                style={{
                  width: '100%',
                  minHeight: 'min(420px, 55svh)',
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
                    minHeight: 'min(420px, 55svh)',
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
