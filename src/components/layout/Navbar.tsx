import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useScrolled } from '../../hooks/useScrolled';
import { useSearch } from '../../context/SearchContext';
import { useStoreSettings } from '../../context/StoreSettingsContext';
import { NAV_LINKS, COLLECTIONS } from '../../utils/constants';

function BrandMark({ atTop }: { atTop: boolean }) {
  return (
    <Link
      to="/"
      aria-label="Krishna Jewellers — Home"
      style={{
        textDecoration: 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        alignItems: atTop ? 'center' : 'flex-start',
        textAlign: atTop ? 'center' : 'left',
        minWidth: 0,
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: atTop
            ? 'clamp(1.05rem, 2.6vw, 1.55rem)'
            : 'clamp(1rem, 2vw, 1.3rem)',
          fontWeight: 600,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: 'var(--color-text)',
          lineHeight: 1.1,
          whiteSpace: 'nowrap',
        }}
      >
        Krishna Jewellers
      </span>
      <span
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: atTop ? '0.625rem' : '0.5625rem',
          fontWeight: 300,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: atTop ? 'var(--color-bronze)' : 'var(--color-muted)',
        }}
      >
        Byasanagar, Jajpur
      </span>
    </Link>
  );
}

/**
 * Hero top: brand + Tanishq-style category bar.
 * Scrolled: categories collapse into “Collections” among page links.
 */
export default function Navbar() {
  const scrolled = useScrolled(48);
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const { openSearch } = useSearch();
  const settings = useStoreSettings();

  const isHome = location.pathname === '/';
  const atHeroTop = isHome && !scrolled;
  const showLinks = !atHeroTop;

  const links = NAV_LINKS.filter((link) => {
    if (link.href === '/rates') return settings.showRates;
    if (link.href === '/gallery') return settings.showGallery;
    return true;
  });

  // Keep page padding in sync with expanded / collapsed header
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty(
      '--navbar-height',
      atHeroTop
        ? 'calc(var(--navbar-brand-row) + var(--navbar-cats-row))'
        : 'var(--navbar-brand-row)',
    );
    return () => {
      root.style.setProperty('--navbar-height', 'var(--navbar-brand-row)');
    };
  }, [atHeroTop]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, scrolled]);

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'rgba(248,246,242,0.97)',
          borderBottom: atHeroTop
            ? '1px solid var(--color-divider)'
            : '1px solid var(--color-divider)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          transition: 'box-shadow 0.35s ease',
          boxShadow: scrolled ? '0 6px 20px rgba(24,24,24,0.06)' : 'none',
        }}
      >
        {/* Brand row */}
        <div
          className="container"
          style={{
            height: 'var(--navbar-brand-row)',
            display: 'grid',
            gridTemplateColumns: atHeroTop
              ? '1fr auto 1fr'
              : 'auto minmax(0, 1fr) auto',
            alignItems: 'center',
            columnGap: '16px',
            flexShrink: 0,
          }}
        >
          <div style={{ justifySelf: 'start', minWidth: 0 }}>
            {!atHeroTop && <BrandMark atTop={false} />}
          </div>

          <div
            style={{
              justifySelf: 'center',
              minWidth: 0,
              maxWidth: '100%',
              overflow: atHeroTop ? 'visible' : 'auto',
            }}
          >
            {atHeroTop ? (
              <BrandMark atTop />
            ) : (
              <nav
                className="kj-scrolled-links"
                aria-label="Primary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 'clamp(14px, 2.2vw, 32px)',
                  overflowX: 'auto',
                  scrollbarWidth: 'none',
                }}
              >
                {links.map((link) => {
                  const active =
                    link.href === '/'
                      ? location.pathname === '/'
                      : location.pathname === link.href ||
                        location.pathname.startsWith(`${link.href}/`);
                  return (
                    <Link
                      key={link.href}
                      to={link.href}
                      style={{
                        flexShrink: 0,
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.625rem',
                        fontWeight: active ? 500 : 400,
                        letterSpacing: '0.16em',
                        textTransform: 'uppercase',
                        textDecoration: 'none',
                        color: active ? 'var(--color-gold)' : 'var(--color-text)',
                        borderBottom: active
                          ? '1.5px solid var(--color-gold)'
                          : '1.5px solid transparent',
                        paddingBottom: '2px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            )}
          </div>

          <div
            style={{
              justifySelf: 'end',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            {!atHeroTop && (
              <button
                type="button"
                aria-label="Search"
                onClick={openSearch}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px',
                  color: 'var(--color-text)',
                  display: 'flex',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </button>
            )}

            {atHeroTop && (
              <button
                type="button"
                aria-label="Open menu"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen(true)}
                style={{
                  background: 'transparent',
                  border: '1px solid var(--color-divider)',
                  cursor: 'pointer',
                  padding: '10px',
                  color: 'var(--color-text)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '5px',
                }}
              >
                <span style={{ display: 'block', width: 18, height: 1.5, background: 'currentColor' }} />
                <span style={{ display: 'block', width: 18, height: 1.5, background: 'currentColor' }} />
                <span style={{ display: 'block', width: 18, height: 1.5, background: 'currentColor' }} />
              </button>
            )}
          </div>
        </div>

        {/* Category bar — hero top only; collapses into Collections on scroll */}
        <AnimatePresence initial={false}>
          {atHeroTop && (
            <motion.div
              key="category-bar"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'var(--navbar-cats-row)', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{
                overflow: 'hidden',
                borderTop: '1px solid var(--color-divider)',
                flexShrink: 0,
              }}
            >
              <nav
                className="kj-category-bar"
                aria-label="Jewellery categories"
                style={{
                  height: 'var(--navbar-cats-row)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 'clamp(18px, 2.8vw, 36px)',
                  paddingInline: 'clamp(16px, 4vw, 40px)',
                  overflowX: 'auto',
                  scrollbarWidth: 'none',
                }}
              >
                {COLLECTIONS.map((col) => {
                  const href = `/collections/${col.slug}`;
                  const active = location.pathname === href;
                  return (
                    <Link
                      key={col.id}
                      to={href}
                      style={{
                        flexShrink: 0,
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.625rem',
                        fontWeight: active ? 500 : 400,
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        textDecoration: 'none',
                        color: active ? 'var(--color-gold)' : 'var(--color-text)',
                        whiteSpace: 'nowrap',
                        opacity: active ? 1 : 0.78,
                        transition: 'color 0.25s ease, opacity 0.25s ease',
                      }}
                    >
                      {col.name}
                    </Link>
                  );
                })}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <AnimatePresence>
        {menuOpen && atHeroTop && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMenuOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 110,
                backgroundColor: 'rgba(24,24,24,0.5)',
              }}
            />
            <motion.nav
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 24 }}
              transition={{ duration: 0.3 }}
              aria-label="Site pages"
              style={{
                position: 'fixed',
                top: 0,
                right: 0,
                bottom: 0,
                zIndex: 111,
                width: 'min(320px, 88vw)',
                backgroundColor: 'var(--color-bg)',
                padding: '28px 28px 40px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                boxShadow: '-12px 0 40px rgba(0,0,0,0.18)',
                overflowY: 'auto',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '28px',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.875rem',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: 'var(--color-gold)',
                  }}
                >
                  Menu
                </span>
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setMenuOpen(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1.5rem',
                    lineHeight: 1,
                    color: 'var(--color-text)',
                    padding: '4px 8px',
                  }}
                >
                  ×
                </button>
              </div>

              {links.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.8125rem',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    color:
                      location.pathname === link.href
                        ? 'var(--color-gold)'
                        : 'var(--color-text)',
                    padding: '14px 0',
                    borderBottom: '1px solid var(--color-divider)',
                  }}
                >
                  {link.label}
                </Link>
              ))}

              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.625rem',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'var(--color-muted)',
                  marginTop: '28px',
                  marginBottom: '8px',
                }}
              >
                Collections
              </p>
              {COLLECTIONS.map((col) => (
                <Link
                  key={col.id}
                  to={`/collections/${col.slug}`}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.75rem',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    color: 'var(--color-text)',
                    padding: '10px 0',
                    borderBottom: '1px solid var(--color-divider)',
                  }}
                >
                  {col.name}
                </Link>
              ))}
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      <style>{`
        .kj-scrolled-links::-webkit-scrollbar,
        .kj-category-bar::-webkit-scrollbar {
          display: none;
        }
        .kj-category-bar a:hover {
          color: var(--color-gold) !important;
          opacity: 1 !important;
        }
      `}</style>
    </>
  );
}
