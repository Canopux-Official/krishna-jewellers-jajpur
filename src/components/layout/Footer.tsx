import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useStoreSettings } from '../../context/StoreSettingsContext';
import { COLLECTIONS } from '../../utils/constants';
import { CATEGORY_NAV_LABELS } from '../icons/CategoryNavIcons';
import BisCredibility from '../ui/BisCredibility';

const footerCollections = COLLECTIONS.map((col) => ({
  label: CATEGORY_NAV_LABELS[col.id] ?? col.name,
  href: `/collections/${col.slug}`,
}));
const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: "Today's Rates", href: '/rates' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Contact', href: '/contact' },
];
const legalLinks = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms of Service', href: '/terms-of-service' },
];

export default function Footer() {
  const settings = useStoreSettings();
  const storeName = settings.storeName || 'Krishna Jewellers';
  const nameParts = storeName.split(/\s+/);
  const brandMain = nameParts.length >= 3 ? nameParts.slice(0, -1).join(' ') : (nameParts[0] || 'Krishna');
  const brandSub = nameParts.length >= 3 ? nameParts[nameParts.length - 1] : (nameParts.slice(1).join(' ') || 'Jewellers');

  const socialLinks = [
    { label: 'Instagram', href: settings.instagramUrl },
    { label: 'Facebook', href: settings.facebookUrl },
  ].filter((s) => !!s.href);

  const visibleQuickLinks = quickLinks.filter((l) => {
    if (!settings.isLoaded) {
      if (l.href === '/rates' || l.href === '/gallery') return false;
    }
    if (l.href === '/rates') return settings.showRates;
    if (l.href === '/gallery') return settings.showGallery;
    return true;
  });

  return (
    <footer
      style={{
        backgroundColor: 'var(--color-dark)',
        color: 'rgba(248,246,242,0.7)',
        paddingTop: '80px',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr',
            gap: '64px',
            paddingBottom: '64px',
          }}
          className="footer-grid"
        >
          <div>
            <div style={{ marginBottom: '24px' }}>
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.75rem',
                  fontWeight: 600,
                  letterSpacing: '0.28em',
                  color: 'var(--color-gold)',
                  textTransform: 'uppercase',
                }}
              >
                {brandMain}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.5625rem',
                  fontWeight: 500,
                  letterSpacing: '0.36em',
                  color: 'var(--color-gold)',
                  textTransform: 'uppercase',
                  marginTop: '6px',
                }}
              >
                {brandSub}
              </div>
            </div>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.8125rem',
                lineHeight: 1.8,
                color: 'rgba(248,246,242,0.5)',
                maxWidth: '280px',
              }}
            >
              Premium BIS-hallmarked gold and silver from Byasanagar — a temple-town jewellery house trusted for weddings, festivals, and everyday blessing.
            </p>
            <BisCredibility
              variant="dark"
              compact
              style={{ marginTop: '28px' }}
            />
            {socialLinks.length > 0 && (
              <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
                {socialLinks.map((s) => (
                  <motion.a
                    key={s.label}
                    href={s.href!}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.625rem',
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      color: 'rgba(248,246,242,0.45)',
                      borderBottom: '1px solid rgba(199,161,90,0.3)',
                      paddingBottom: '2px',
                      transition: 'color 0.3s',
                    }}
                  >
                    {s.label}
                  </motion.a>
                ))}
              </div>
            )}
          </div>

          <div>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.5625rem',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color: 'var(--color-gold)',
                marginBottom: '24px',
              }}
            >
              Quick Links
            </p>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {visibleQuickLinks.map((l) => (
                <Link
                  key={l.label}
                  to={l.href}
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.8125rem',
                    color: 'rgba(248,246,242,0.55)',
                    transition: 'color 0.3s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#F8F6F2')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(248,246,242,0.55)')}
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.5625rem',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color: 'var(--color-gold)',
                marginBottom: '24px',
              }}
            >
              Collections
            </p>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {footerCollections.map((c) => (
                <Link
                  key={c.label}
                  to={c.href}
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.8125rem',
                    color: 'rgba(248,246,242,0.55)',
                    transition: 'color 0.3s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#F8F6F2')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(248,246,242,0.55)')}
                >
                  {c.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.5625rem',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color: 'var(--color-gold)',
                marginBottom: '24px',
              }}
            >
              Contact
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { label: 'Address', value: settings.address },
                { label: 'Phone', value: settings.phone },
                { label: 'Hours', value: `Monday – Sunday\n${settings.weekdayHours}\nClosed on the last Sunday of every month` },
              ].map((item) => (
                <div key={item.label}>
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.5625rem',
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      color: 'rgba(248,246,242,0.3)',
                      marginBottom: '4px',
                    }}
                  >
                    {item.label}
                  </p>
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.8125rem',
                      color: 'rgba(248,246,242,0.55)',
                      whiteSpace: 'pre-line',
                      lineHeight: 1.7,
                    }}
                  >
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          style={{
            borderTop: '1px solid rgba(221,215,207,0.15)',
            paddingTop: '28px',
            paddingBottom: 'max(28px, env(safe-area-inset-bottom, 0px))',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.6875rem',
                color: 'rgba(248,246,242,0.3)',
                letterSpacing: '0.08em',
              }}
            >
              © {new Date().getFullYear()} Krishna Jewellers.
              All Rights Reserved.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
              {legalLinks.map((l) => (
                <Link
                  key={l.href}
                  to={l.href}
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.6875rem',
                    color: 'rgba(248,246,242,0.35)',
                    letterSpacing: '0.08em',
                    textDecoration: 'none',
                    transition: 'color 0.25s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(248,246,242,0.7)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(248,246,242,0.35)')}
                >
                  {l.label}
                </Link>
              ))}
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.6875rem',
                  color: 'rgba(248,246,242,0.2)',
                  letterSpacing: '0.08em',
                }}
              >
                Byasanagar · Jajpur · Odisha
              </p>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.6875rem',
                    letterSpacing: '0.08em',
                    color: 'rgba(248,246,242,0.35)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Maintained by
                </span>
                <a
                  href="https://canopux.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Canopux"
                  style={{ display: 'inline-flex', lineHeight: 0 }}
                >
                  <img
                    src="/CANOPUX.png"
                    alt="Canopux"
                    style={{
                      height: '14px',
                      width: 'auto',
                      display: 'block',
                      opacity: 0.55,
                      transition: 'opacity 0.25s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.95'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.55'; }}
                  />
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 48px !important;
          }
        }
        @media (max-width: 600px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
      `}</style>
    </footer>
  );
}
