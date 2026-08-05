import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useStoreSettings } from '../../context/StoreSettingsContext';

type HeroSlide = {
  src: string;
  categoryLabel: string;
  categorySlug: string;
};

/** Hero banners — each slide can point to its own collection. */
const HERO_SLIDES: HeroSlide[] = [
  {
    src: '/krishna-jewellers-hero.avif',
    categoryLabel: 'Bridal Collection',
    categorySlug: 'bridal-collection',
  },
  {
    src: '/hero-2.png',
    categoryLabel: 'Gold Necklaces',
    categorySlug: 'gold-necklaces',
  },
  {
    src: '/hero-3.png',
    categoryLabel: 'Earrings',
    categorySlug: 'earrings',
  },
];

const SWIPE_MS = 3500;

/**
 * First screen fits: brand (nav) → categories → hero → tagline → hours ribbon.
 * Ribbon is flush to the viewport bottom — no gap below it.
 */
export default function Hero() {
  const [index, setIndex] = useState(0);
  const count = HERO_SLIDES.length;
  const multi = count > 1;
  const slide = HERO_SLIDES[index];

  const go = useCallback(
    (dir: 1 | -1) => {
      if (!multi) return;
      setIndex((i) => (i + dir + count) % count);
    },
    [multi, count],
  );

  useEffect(() => {
    if (!multi) return;
    const id = window.setInterval(() => go(1), SWIPE_MS);
    return () => window.clearInterval(id);
  }, [multi, go, index]);

  const prev = HERO_SLIDES[(index - 1 + count) % count];
  const next = HERO_SLIDES[(index + 1) % count];

  return (
    <section
      className="home-hero"
      aria-label="Hero gallery"
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        /* svh = visible viewport so the ribbon isn’t clipped under browser chrome */
        height: '100svh',
        maxHeight: '100svh',
        boxSizing: 'border-box',
        paddingTop: 'calc(var(--navbar-height) + 6px)',
        paddingBottom: 0,
        overflow: 'hidden',
        background:
          'radial-gradient(ellipse 90% 70% at 50% 18%, rgba(199,161,90,0.12) 0%, transparent 55%), linear-gradient(180deg, var(--color-bg-alt) 0%, var(--color-bg) 70%)',
      }}
    >
      <div
        className="hero-body"
        style={{
          position: 'relative',
          zIndex: 1,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'stretch',
          minHeight: 0,
          gap: '10px',
        }}
      >
        <div
          className="hero-stage"
          onPointerDown={(e) => {
            const startX = e.clientX;
            const onUp = (ev: PointerEvent) => {
              const dx = ev.clientX - startX;
              if (dx < -50) go(1);
              else if (dx > 50) go(-1);
              window.removeEventListener('pointerup', onUp);
            };
            window.addEventListener('pointerup', onUp);
          }}
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flex: '1 1 auto',
            minHeight: 0,
            width: '100%',
            maxWidth: '1440px',
            marginInline: 'auto',
            paddingInline: 'clamp(12px, 2vw, 24px)',
            cursor: multi ? 'grab' : 'default',
          }}
        >
          {multi && (
            <button
              type="button"
              aria-label="Previous slide"
              onClick={() => go(-1)}
              className="hero-peek hero-peek--prev"
            >
              <img src={prev.src} alt="" draggable={false} />
            </button>
          )}

          <motion.div
            key={index}
            className="hero-active"
            initial={{ opacity: 0.85, scale: 0.985 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
          >
            <img
              src={slide.src}
              alt=""
              loading="eager"
              decoding="async"
              fetchPriority="high"
              draggable={false}
            />

            <Link
              to={`/collections/${slide.categorySlug}`}
              className="hero-card__category"
              onPointerDown={(e) => e.stopPropagation()}
            >
              {slide.categoryLabel}
              <span aria-hidden style={{ marginLeft: '6px' }}>
                →
              </span>
            </Link>
          </motion.div>

          {multi && (
            <button
              type="button"
              aria-label="Next slide"
              onClick={() => go(1)}
              className="hero-peek hero-peek--next"
            >
              <img src={next.src} alt="" draggable={false} />
            </button>
          )}
        </div>

        {multi && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              flexShrink: 0,
            }}
          >
            <button
              type="button"
              aria-label="Previous slide"
              onClick={() => go(-1)}
              className="hero-nav-btn"
            >
              ‹
            </button>
            <div style={{ display: 'flex', gap: '8px' }}>
              {HERO_SLIDES.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Show slide ${i + 1}`}
                  aria-current={i === index}
                  onClick={() => setIndex(i)}
                  style={{
                    width: i === index ? 22 : 8,
                    height: 8,
                    borderRadius: 999,
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    background:
                      i === index ? 'var(--color-gold)' : 'var(--color-divider)',
                    transition: 'width 0.35s ease, background 0.35s ease',
                  }}
                />
              ))}
            </div>
            <button
              type="button"
              aria-label="Next slide"
              onClick={() => go(1)}
              className="hero-nav-btn"
            >
              ›
            </button>
          </div>
        )}

        <p
          style={{
            margin: 0,
            marginBottom: '12px',
            flexShrink: 0,
            textAlign: 'center',
            fontFamily: 'var(--font-body)',
            fontSize: '0.6875rem',
            fontWeight: 300,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--color-muted)',
            paddingBottom: '4px',
          }}
        >
          Temple-town gold · Byasanagar, Jajpur
        </p>
      </div>

      <HeroNoticeRibbon />

      <style>{`
        @supports not (height: 100svh) {
          .home-hero {
            height: 100vh !important;
            max-height: 100vh !important;
          }
        }

        /* Card shrinks to leftover viewport height so ribbon stays fully on-screen */
        .hero-active {
          position: relative;
          z-index: 2;
          width: min(
            860px,
            70vw,
            calc((100svh - var(--navbar-height) - 158px) * 16 / 9)
          );
          max-width: 100%;
          aspect-ratio: 16 / 9;
          max-height: calc(100svh - var(--navbar-height) - 158px);
          height: auto;
          margin-inline: auto;
          border-radius: 6px;
          overflow: hidden;
          background: var(--color-dark);
          box-shadow: 0 14px 40px rgba(24,24,24,0.16), 0 2px 0 rgba(199,161,90,0.25);
        }
        @supports not (height: 1svh) {
          .hero-active {
            width: min(
              860px,
              70vw,
              calc((100vh - var(--navbar-height) - 158px) * 16 / 9)
            );
            max-height: calc(100vh - var(--navbar-height) - 158px);
          }
        }
        .hero-active img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 28%;
          display: block;
        }

        .hero-peek {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: min(220px, 18vw);
          aspect-ratio: 16 / 9;
          max-height: calc(100svh - var(--navbar-height) - 180px);
          padding: 0;
          border: none;
          border-radius: 4px;
          overflow: hidden;
          cursor: pointer;
          opacity: 0.5;
          filter: saturate(0.85);
          box-shadow: 0 8px 22px rgba(24,24,24,0.12);
          transition: opacity 0.3s ease, transform 0.3s ease;
          z-index: 1;
          background: var(--color-dark);
        }
        .hero-peek:hover { opacity: 0.78; }
        .hero-peek img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 28%;
          display: block;
        }
        .hero-peek--prev {
          left: clamp(0px, 1.5vw, 20px);
          transform: translateY(-50%) rotate(-1.2deg);
        }
        .hero-peek--next {
          right: clamp(0px, 1.5vw, 20px);
          transform: translateY(-50%) rotate(1.2deg);
        }

        .hero-card__category {
          position: absolute;
          right: 14px;
          bottom: 14px;
          z-index: 3;
          display: inline-flex;
          align-items: center;
          padding: 7px 12px;
          background: rgba(248,246,242,0.92);
          border: 1px solid rgba(199,161,90,0.45);
          color: var(--color-text);
          font-family: var(--font-body);
          font-size: 0.5625rem;
          font-weight: 400;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          text-decoration: none;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }
        .hero-card__category:hover {
          border-color: var(--color-gold);
          color: var(--color-bronze);
        }

        .hero-nav-btn {
          width: 32px;
          height: 32px;
          border-radius: 999px;
          border: 1px solid var(--color-divider);
          background: var(--color-bg);
          color: var(--color-text);
          font-size: 1.15rem;
          line-height: 1;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hero-notice-ribbon {
          flex-shrink: 0;
          width: 100%;
          min-height: 38px;
          padding: 9px 16px;
          box-sizing: border-box;
          background: var(--color-dark);
          border-top: 1px solid rgba(199,161,90,0.35);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .hero-notice-static {
          margin: 0;
          width: 100%;
          text-align: center;
          font-family: var(--font-body);
          font-size: clamp(0.52rem, 1.5vw, 0.625rem);
          font-weight: 300;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-ivory);
          line-height: 1.35;
        }

        @media (max-width: 900px) {
          .hero-peek {
            width: min(140px, 16vw);
            opacity: 0.38;
          }
          .hero-active {
            width: min(780px, 78vw);
          }
        }
        @media (max-width: 640px) {
          .hero-peek { display: none; }
          .hero-active {
            width: min(100%, calc((100svh - var(--navbar-height) - 150px) * 4 / 5));
            max-width: 100%;
            aspect-ratio: 4 / 5;
            max-height: calc(100svh - var(--navbar-height) - 150px);
          }
          @supports not (height: 1svh) {
            .hero-active {
              width: min(100%, calc((100vh - var(--navbar-height) - 150px) * 4 / 5));
              max-height: calc(100vh - var(--navbar-height) - 150px);
            }
          }
          .hero-card__category {
            right: 10px;
            bottom: 10px;
            padding: 6px 10px;
          }
          .home-hero {
            padding-top: calc(var(--navbar-height) + 8px) !important;
          }
          .hero-body {
            gap: 8px !important;
            justify-content: flex-start !important;
            padding-top: 4px;
          }
        }
        @media (max-height: 720px) {
          .home-hero {
            padding-top: calc(var(--navbar-height) + 4px) !important;
          }
          .hero-active {
            max-height: calc(100svh - var(--navbar-height) - 140px);
          }
          .hero-body {
            gap: 6px !important;
          }
        }
      `}</style>
    </section>
  );
}

function HeroNoticeRibbon() {
  const settings = useStoreSettings();
  const hours = settings.weekdayHours || '10:00 AM – 8:30 PM';
  const line = `Open Monday – Sunday · ${hours} · Closed on the last Sunday of every month`;

  return (
    <div className="hero-notice-ribbon" role="note">
      <p className="hero-notice-static">{line}</p>
    </div>
  );
}
