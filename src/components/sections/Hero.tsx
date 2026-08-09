import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStoreSettings } from '../../context/StoreSettingsContext';

type HeroSlide = {
  src: string;
  mobileSrc?: string;
  categoryLabel: string;
  categorySlug: string;
};

type TrackItem = HeroSlide & { key: string; realIndex: number };

/** Hero banners — each slide can point to its own collection. */
const HERO_SLIDES: HeroSlide[] = [
  {
    src: '/home-hero-bridal.png',
    mobileSrc: '/home-hero-bridal-mobile.png',
    categoryLabel: 'Bridal Collection',
    categorySlug: 'bridal-collection',
  },
  {
    src: '/home-hero-necklaces.png',
    mobileSrc: '/home-hero-necklaces-mobile.png',
    categoryLabel: 'Gold Necklaces',
    categorySlug: 'gold-necklaces',
  },
  {
    src: '/home-hero-bangles.png',
    mobileSrc: '/home-hero-bangles-mobile.png',
    categoryLabel: 'Bangles',
    categorySlug: 'bangles',
  },
];

const SWIPE_MS = 3000;
const GAP_PX = 18;
const DRAG_THRESHOLD = 48;

/**
 * Tanishq-style hero: continuous track with edge clones so the
 * carousel loops forward forever instead of rewinding to slide 1.
 */
export default function Hero() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const draggingRef = useRef(false);
  const startXRef = useRef(0);
  const dragDxRef = useRef(0);
  const trackIndexRef = useRef(1);

  const count = HERO_SLIDES.length;
  const multi = count > 1;

  // [clone(last), ...slides, clone(first)] — trackIndex starts at 1 (first real)
  const trackItems: TrackItem[] = multi
    ? [
        { ...HERO_SLIDES[count - 1], key: 'clone-last', realIndex: count - 1 },
        ...HERO_SLIDES.map((s, i) => ({
          ...s,
          key: `slide-${i}`,
          realIndex: i,
        })),
        { ...HERO_SLIDES[0], key: 'clone-first', realIndex: 0 },
      ]
    : HERO_SLIDES.map((s, i) => ({ ...s, key: `slide-${i}`, realIndex: i }));

  const [trackIndex, setTrackIndex] = useState(multi ? 1 : 0);
  const [slideW, setSlideW] = useState(0);
  const [viewportW, setViewportW] = useState(0);
  const [dragDx, setDragDx] = useState(0);
  const [smooth, setSmooth] = useState(true);

  trackIndexRef.current = trackIndex;

  const realIndex = multi
    ? trackIndex === 0
      ? count - 1
      : trackIndex === count + 1
        ? 0
        : trackIndex - 1
    : 0;

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const measure = () => {
      const w = el.clientWidth;
      setViewportW(w);
      const mobile = w < 640;
      // Desktop: wide center slide with slim side peeks (Tanishq ~3.6:1 banners)
      const next = Math.round(
        mobile
          ? Math.min(w * 0.88, w - 24)
          : Math.min(1280, w * 0.88),
      );
      setSlideW(next);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // After an instant snap off a clone, re-enable smooth for the next move
  useEffect(() => {
    if (smooth) return;
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setSmooth(true));
    });
    return () => cancelAnimationFrame(id);
  }, [smooth, trackIndex]);

  const snapFromClone = useCallback(() => {
    const i = trackIndexRef.current;
    if (!multi) return;
    if (i === count + 1) {
      setSmooth(false);
      setTrackIndex(1);
    } else if (i === 0) {
      setSmooth(false);
      setTrackIndex(count);
    }
  }, [multi, count]);

  const goDir = useCallback(
    (dir: 1 | -1) => {
      if (!multi) return;
      setSmooth(true);
      setTrackIndex((i) => i + dir);
    },
    [multi],
  );

  const goToReal = useCallback(
    (real: number) => {
      if (!multi) return;
      setSmooth(true);
      setTrackIndex(real + 1);
    },
    [multi],
  );

  useEffect(() => {
    if (!multi) return;
    const id = window.setInterval(() => {
      if (pausedRef.current || draggingRef.current) return;
      setSmooth(true);
      setTrackIndex((i) => i + 1);
    }, SWIPE_MS);
    return () => window.clearInterval(id);
  }, [multi]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (!multi) return;
    draggingRef.current = true;
    pausedRef.current = true;
    startXRef.current = e.clientX;
    dragDxRef.current = 0;
    setSmooth(false);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    const dx = e.clientX - startXRef.current;
    dragDxRef.current = dx;
    setDragDx(dx);
  };

  const endDrag = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    const dx = dragDxRef.current;
    setDragDx(0);
    setSmooth(true);
    if (dx < -DRAG_THRESHOLD) goDir(1);
    else if (dx > DRAG_THRESHOLD) goDir(-1);
    else snapFromClone();
    pausedRef.current = false;
  };

  const offset =
    slideW > 0
      ? viewportW / 2 - slideW / 2 - trackIndex * (slideW + GAP_PX) + dragDx
      : 0;

  return (
    <section
      className="home-hero"
      aria-label="Hero gallery"
      aria-roledescription="carousel"
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
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
      <div className="hero-body">
        <div
          ref={viewportRef}
          className="hero-viewport"
          onMouseEnter={() => {
            pausedRef.current = true;
          }}
          onMouseLeave={() => {
            if (!draggingRef.current) pausedRef.current = false;
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          <div
            ref={trackRef}
            className="hero-track"
            style={{
              gap: GAP_PX,
              transform: `translate3d(${offset}px, 0, 0)`,
              transition: smooth
                ? 'transform 0.65s cubic-bezier(0.22, 1, 0.36, 1)'
                : 'none',
            }}
            onTransitionEnd={(e) => {
              if (e.target !== trackRef.current) return;
              if (e.propertyName !== 'transform') return;
              snapFromClone();
            }}
          >
            {trackItems.map((slide, i) => {
              const active = i === trackIndex;
              return (
                <article
                  key={slide.key}
                  className={`hero-slide${active ? ' is-active' : ''}`}
                  style={{ width: slideW || undefined }}
                  aria-hidden={!active}
                  onClick={() => {
                    if (active) return;
                    if (i === 0) goDir(-1);
                    else if (i === trackItems.length - 1) goDir(1);
                    else goToReal(slide.realIndex);
                  }}
                >
                  <picture>
                    {slide.mobileSrc ? (
                      <source media="(max-width: 640px)" srcSet={slide.mobileSrc} />
                    ) : null}
                    <img
                      src={slide.src}
                      alt=""
                      loading={slide.realIndex === 0 ? 'eager' : 'lazy'}
                      decoding="async"
                      fetchPriority={slide.realIndex === 0 ? 'high' : 'auto'}
                      draggable={false}
                    />
                  </picture>
                  <Link
                    to={`/collections/${slide.categorySlug}`}
                    className="hero-card__category"
                    tabIndex={active ? 0 : -1}
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {slide.categoryLabel}
                    <span aria-hidden style={{ marginLeft: '6px' }}>
                      →
                    </span>
                  </Link>
                </article>
              );
            })}
          </div>
        </div>

        {multi && (
          <div className="hero-dots" role="tablist" aria-label="Hero slides">
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-label={`Show slide ${i + 1}`}
                aria-selected={i === realIndex}
                className={`hero-dot${i === realIndex ? ' hero-dot--active' : ''}`}
                onClick={() => goToReal(i)}
              />
            ))}
          </div>
        )}

        <p className="hero-tagline">Temple-town gold · Byasanagar, Jajpur</p>
      </div>

      <HeroNoticeRibbon />

      <style>{`
        @supports not (height: 100svh) {
          .home-hero {
            height: 100vh !important;
            max-height: 100vh !important;
          }
        }

        .hero-body {
          position: relative;
          z-index: 1;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: stretch;
          min-height: 0;
          gap: 14px;
        }

        .hero-viewport {
          position: relative;
          flex: 1 1 auto;
          min-height: 0;
          width: 100%;
          display: flex;
          align-items: center;
          overflow: hidden;
          cursor: grab;
          touch-action: pan-y;
          user-select: none;
        }
        .hero-viewport:active {
          cursor: grabbing;
        }

        .hero-track {
          display: flex;
          align-items: center;
          will-change: transform;
        }

        .hero-slide {
          position: relative;
          flex: 0 0 auto;
          /* Tanishq desktop hero slide ≈ 2.5:1 (banner art ~1024×412) */
          aspect-ratio: 5 / 2;
          max-height: calc(100svh - var(--navbar-height) - 148px);
          border-radius: 12px;
          overflow: hidden;
          background: var(--color-dark);
          box-shadow: 0 10px 28px rgba(24, 24, 24, 0.14);
          cursor: pointer;
        }
        @supports not (height: 1svh) {
          .hero-slide {
            max-height: calc(100vh - var(--navbar-height) - 148px);
          }
        }
        .hero-slide.is-active {
          cursor: grab;
          box-shadow:
            0 16px 40px rgba(24, 24, 24, 0.18),
            0 0 0 1px rgba(199, 161, 90, 0.18);
        }
        .hero-slide picture {
          position: absolute;
          inset: 0;
          display: block;
        }
        .hero-slide img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center center;
          display: block;
          pointer-events: none;
        }

        .hero-card__category {
          position: absolute;
          right: 14px;
          bottom: 14px;
          z-index: 3;
          display: inline-flex;
          align-items: center;
          padding: 8px 14px;
          background: rgba(255, 255, 255, 0.94);
          border: none;
          color: var(--color-text);
          font-family: var(--font-body);
          font-size: 0.5625rem;
          font-weight: 500;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          text-decoration: none;
          border-radius: 2px;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }
        .hero-card__category:hover {
          color: var(--color-bronze);
        }
        .hero-slide:not(.is-active) .hero-card__category {
          opacity: 0;
          pointer-events: none;
        }

        .hero-dots {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          flex-shrink: 0;
          padding-block: 2px;
        }
        .hero-dot {
          width: 7px;
          height: 7px;
          padding: 0;
          border: none;
          border-radius: 1px;
          transform: rotate(45deg);
          cursor: pointer;
          background: #cfc9bf;
          transition: background 0.3s ease, transform 0.3s ease;
        }
        .hero-dot--active {
          background: var(--color-bronze, #8b5a2b);
          transform: rotate(45deg) scale(1.2);
        }

        .hero-tagline {
          margin: 0 0 10px;
          flex-shrink: 0;
          text-align: center;
          font-family: var(--font-body);
          font-size: 0.6875rem;
          font-weight: 300;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-muted);
        }

        .hero-notice-ribbon {
          flex-shrink: 0;
          width: 100%;
          min-height: 38px;
          padding: 9px 16px;
          box-sizing: border-box;
          background: var(--color-dark);
          border-top: 1px solid rgba(199, 161, 90, 0.35);
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

        @media (max-width: 640px) {
          .hero-slide {
            /* Tanishq mobile banners — portrait ~3:4 */
            aspect-ratio: 3 / 4;
            border-radius: 10px;
            max-height: calc(100svh - var(--navbar-height) - 142px);
          }
          @supports not (height: 1svh) {
            .hero-slide {
              max-height: calc(100vh - var(--navbar-height) - 142px);
            }
          }
          .hero-slide img {
            object-position: center center;
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
            gap: 10px !important;
            justify-content: flex-start !important;
            padding-top: 4px;
          }
        }

        @media (max-height: 720px) {
          .home-hero {
            padding-top: calc(var(--navbar-height) + 4px) !important;
          }
          .hero-slide {
            max-height: calc(100svh - var(--navbar-height) - 132px);
          }
          .hero-body {
            gap: 8px !important;
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
