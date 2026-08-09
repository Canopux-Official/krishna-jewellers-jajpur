import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useRef, useState } from 'react';
import { COLLECTIONS } from '../../utils/constants';
import { CATEGORY_NAV_LABELS } from '../icons/CategoryNavIcons';

export default function Collections() {
  const [activeId, setActiveId] = useState(COLLECTIONS[0]?.id ?? 'bridal');
  const stripRef = useRef<HTMLDivElement>(null);
  const active = COLLECTIONS.find((c) => c.id === activeId) ?? COLLECTIONS[0];

  const scrollStrip = (dir: 1 | -1) => {
    const el = stripRef.current;
    if (!el) return;
    const vertical = window.matchMedia('(min-width: 901px)').matches;
    if (vertical) {
      el.scrollBy({ top: dir * 160, behavior: 'smooth' });
    } else {
      el.scrollBy({ left: dir * 320, behavior: 'smooth' });
    }
  };

  return (
    <section className="kj-collections" aria-labelledby="collections-heading">
      <div className="kj-collections__glow" aria-hidden />

      <div className="container kj-collections__inner">
        <header className="kj-collections__header">
          <motion.h2
            id="collections-heading"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Collections
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.08 }}
          >
            Bridal, festival, and everyday gold from the Byasanagar showroom.
          </motion.p>
        </header>

        <div className="kj-collections__stage">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              className="kj-collections__feature-frame"
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.995 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                to={`/collections/${active.slug}`}
                className="kj-collections__feature-link"
                aria-label={`Explore ${active.name}`}
              >
                <img
                  src={active.bannerImage || active.image}
                  alt={`${active.name} collection — Krishna Jewellers, Byasanagar`}
                  loading="lazy"
                  decoding="async"
                />
                <div className="kj-collections__feature-shade" />
                <div className="kj-collections__feature-copy">
                  <span className="kj-collections__feature-kicker">
                    {CATEGORY_NAV_LABELS[active.id] ?? active.name}
                  </span>
                  <h3>{active.name}</h3>
                  <p>{active.shortDescription}</p>
                  <span className="kj-collections__feature-cta">
                    Explore collection →
                  </span>
                </div>
              </Link>
            </motion.div>
          </AnimatePresence>

          <div className="kj-collections__strip-wrap">
            <button
              type="button"
              className="kj-collections__strip-nav kj-collections__strip-nav--prev"
              aria-label="Scroll collections"
              onClick={() => scrollStrip(-1)}
            >
              <span className="kj-collections__strip-nav-icon" aria-hidden>
                ‹
              </span>
            </button>

            <div
              ref={stripRef}
              className="kj-collections__tiles"
              role="listbox"
              aria-label="Choose a collection"
            >
              {COLLECTIONS.map((col, i) => {
                const selected = col.id === activeId;
                const label = CATEGORY_NAV_LABELS[col.id] ?? col.name;
                return (
                  <motion.button
                    key={col.id}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    className={`kj-collections__tile${selected ? ' is-active' : ''}`}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: i * 0.04 }}
                    onClick={() => setActiveId(col.id)}
                    onMouseEnter={() => {
                      if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
                        setActiveId(col.id);
                      }
                    }}
                    onFocus={() => setActiveId(col.id)}
                  >
                    <span className="kj-collections__tile-media">
                      <img
                        src={col.image}
                        alt={label}
                        loading="lazy"
                        decoding="async"
                        draggable={false}
                      />
                    </span>
                    <span className="kj-collections__tile-label">{label}</span>
                  </motion.button>
                );
              })}
            </div>

            <button
              type="button"
              className="kj-collections__strip-nav kj-collections__strip-nav--next"
              aria-label="Scroll collections"
              onClick={() => scrollStrip(1)}
            >
              <span className="kj-collections__strip-nav-icon" aria-hidden>
                ›
              </span>
            </button>
          </div>
        </div>

        <motion.div
          className="kj-collections__footer"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <Link to="/collections" className="kj-collections__all">
            View all collections
          </Link>
        </motion.div>
      </div>

      <style>{`
        .kj-collections {
          position: relative;
          overflow: hidden;
          padding: clamp(48px, 8vw, 96px) 0 clamp(56px, 9vw, 110px);
          background:
            radial-gradient(ellipse 80% 55% at 12% 0%, rgba(199,161,90,0.14) 0%, transparent 55%),
            radial-gradient(ellipse 70% 50% at 100% 80%, rgba(139,115,85,0.08) 0%, transparent 50%),
            linear-gradient(180deg, var(--color-bg-alt) 0%, var(--color-bg) 45%, var(--color-bg-alt) 100%);
        }
        .kj-collections__glow {
          pointer-events: none;
          position: absolute;
          inset: auto 0 0 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(199,161,90,0.45), transparent);
        }
        .kj-collections__inner {
          position: relative;
          z-index: 1;
        }

        .kj-collections__header {
          max-width: 36rem;
          margin-bottom: clamp(28px, 4vw, 40px);
        }
        .kj-collections__header h2 {
          font-family: var(--font-heading);
          font-size: clamp(2.25rem, 4.5vw, 3.5rem);
          font-weight: 600;
          color: var(--color-text);
          line-height: 1.1;
          margin: 0 0 12px;
        }
        .kj-collections__header p {
          margin: 0;
          font-family: var(--font-body);
          font-weight: 300;
          font-size: 1rem;
          color: var(--color-muted);
          line-height: 1.7;
        }

        /* Desktop: one large hero with vertical tile strip inside (right) */
        .kj-collections__stage {
          position: relative;
          width: 100%;
        }

        .kj-collections__feature-frame {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          overflow: hidden;
          border-radius: 4px;
          background: var(--color-dark);
          box-shadow: 0 20px 50px rgba(24, 24, 24, 0.12);
        }
        .kj-collections__feature-link {
          display: block;
          position: absolute;
          inset: 0;
          text-decoration: none;
          color: inherit;
        }
        .kj-collections__feature-link img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center center;
          display: block;
          transition: transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .kj-collections__feature-link:hover img {
          transform: scale(1.04);
        }
        .kj-collections__feature-shade {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(90deg, rgba(24,24,24,0.78) 0%, rgba(24,24,24,0.35) 38%, transparent 58%),
            linear-gradient(270deg, rgba(24,24,24,0.55) 0%, transparent 28%),
            linear-gradient(180deg, transparent 48%, rgba(24,24,24,0.5) 100%);
          pointer-events: none;
        }
        .kj-collections__feature-copy {
          position: absolute;
          left: 0;
          bottom: 0;
          max-width: min(28rem, 58%);
          padding: clamp(24px, 4vw, 44px);
          z-index: 1;
        }
        @media (max-width: 1100px) and (min-width: 901px) {
          .kj-collections__feature-copy {
            max-width: min(22rem, 46%);
            padding: clamp(20px, 3vw, 32px);
          }
          .kj-collections__strip-wrap {
            width: 132px;
          }
        }
        .kj-collections__feature-kicker {
          display: inline-block;
          font-family: var(--font-body);
          font-size: 0.6875rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--color-gold);
          margin-bottom: 10px;
        }
        .kj-collections__feature-copy h3 {
          margin: 0 0 10px;
          font-family: var(--font-heading);
          font-size: clamp(1.75rem, 3.2vw, 2.75rem);
          font-weight: 600;
          color: var(--color-ivory);
          line-height: 1.15;
        }
        .kj-collections__feature-copy p {
          margin: 0 0 18px;
          font-family: var(--font-body);
          font-weight: 300;
          font-size: 0.9375rem;
          color: rgba(248, 246, 242, 0.82);
          line-height: 1.65;
        }
        .kj-collections__feature-cta {
          font-family: var(--font-body);
          font-size: 0.6875rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--color-ivory);
          border-bottom: 1px solid rgba(199, 161, 90, 0.7);
          padding-bottom: 3px;
        }

        .kj-collections__strip-wrap {
          position: absolute;
          top: 14px;
          right: 14px;
          bottom: 14px;
          z-index: 3;
          width: 156px;
          display: grid;
          grid-template-columns: 1fr;
          grid-template-rows: auto minmax(0, 1fr) auto;
          align-items: center;
          justify-items: center;
          gap: 10px;
          padding: 14px 12px;
          border-radius: 4px;
          background: rgba(248, 246, 242, 0.92);
          border: 1px solid rgba(255, 255, 255, 0.35);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          box-shadow: 0 12px 28px rgba(24, 24, 24, 0.18);
        }
        .kj-collections__tiles {
          display: flex;
          flex-direction: column;
          gap: 14px;
          overflow-y: auto;
          overflow-x: hidden;
          scroll-snap-type: y mandatory;
          scrollbar-width: none;
          padding: 2px;
          width: 100%;
          height: 100%;
          min-height: 0;
          -webkit-overflow-scrolling: touch;
        }
        .kj-collections__tiles::-webkit-scrollbar {
          display: none;
        }

        .kj-collections__tile {
          flex: 0 0 auto;
          width: 100%;
          scroll-snap-align: start;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 0;
          border: none;
          background: transparent;
          cursor: pointer;
          text-align: center;
          color: var(--color-muted);
          transition: color 0.25s ease;
        }
        .kj-collections__tile-media {
          display: block;
          width: 100%;
          aspect-ratio: 1;
          overflow: hidden;
          border-radius: 4px;
          background: var(--color-dark);
          outline: 1px solid transparent;
          outline-offset: 0;
          transition: outline-color 0.25s ease, box-shadow 0.25s ease;
        }
        .kj-collections__tile-media img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          display: block;
          transition: transform 0.55s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .kj-collections__tile-label {
          font-family: var(--font-heading);
          font-size: 1rem;
          font-weight: 600;
          line-height: 1.2;
          letter-spacing: 0.01em;
          padding-inline: 2px;
          text-align: center;
          width: 100%;
        }
        .kj-collections__tile:hover {
          color: var(--color-text);
        }
        .kj-collections__tile:hover .kj-collections__tile-media img {
          transform: scale(1.05);
        }
        .kj-collections__tile.is-active {
          color: var(--color-text);
        }
        .kj-collections__tile.is-active .kj-collections__tile-media {
          outline-color: var(--color-gold);
          box-shadow: 0 6px 14px rgba(24, 24, 24, 0.12);
        }

        .kj-collections__strip-nav {
          width: 32px;
          height: 32px;
          border-radius: 999px;
          border: 1px solid var(--color-divider);
          background: var(--color-bg);
          color: var(--color-text);
          font-size: 1.1rem;
          line-height: 1;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .kj-collections__strip-nav:hover {
          border-color: var(--color-gold);
          color: var(--color-bronze);
        }
        .kj-collections__strip-nav-icon {
          display: inline-block;
          transform: rotate(90deg);
        }

        .kj-collections__footer {
          margin-top: clamp(28px, 4vw, 40px);
          text-align: center;
        }
        .kj-collections__all {
          font-family: var(--font-body);
          font-size: 0.75rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--color-bronze);
          text-decoration: none;
          border-bottom: 1px solid rgba(199, 161, 90, 0.55);
          padding-bottom: 4px;
        }
        .kj-collections__all:hover {
          color: var(--color-text);
          border-bottom-color: var(--color-gold);
        }

        /* Mobile: stacked hero + horizontal strip below */
        @media (max-width: 900px) {
          .kj-collections__feature-frame {
            aspect-ratio: 4 / 3;
            min-height: 320px;
          }
          .kj-collections__feature-link img {
            object-fit: cover;
            object-position: left 35%;
          }
          .kj-collections__feature-shade {
            background:
              linear-gradient(180deg, transparent 35%, rgba(24,24,24,0.82) 100%);
          }
          .kj-collections__feature-copy {
            max-width: min(28rem, 92%);
          }
          .kj-collections__strip-wrap {
            position: static;
            width: auto;
            margin-top: clamp(20px, 3vw, 28px);
            display: grid;
            grid-template-columns: auto 1fr auto;
            grid-template-rows: auto;
            height: auto;
            gap: 10px;
            padding: 0;
            border: none;
            background: transparent;
            box-shadow: none;
            backdrop-filter: none;
            -webkit-backdrop-filter: none;
          }
          .kj-collections__tiles {
            flex-direction: row;
            overflow-x: auto;
            overflow-y: hidden;
            scroll-snap-type: x mandatory;
            height: auto;
            padding: 4px 2px 6px;
            gap: clamp(12px, 1.6vw, 18px);
          }
          .kj-collections__tile {
            width: clamp(132px, 16vw, 168px);
            gap: 10px;
          }
          .kj-collections__tile-media {
            aspect-ratio: 4 / 5;
            border-radius: 4px;
          }
          .kj-collections__tile-label {
            font-size: 1.0625rem;
          }
          .kj-collections__strip-nav {
            width: 36px;
            height: 36px;
            font-size: 1.25rem;
          }
          .kj-collections__strip-nav-icon {
            transform: none;
          }
        }
        @media (max-width: 640px) {
          .kj-collections__strip-nav {
            display: none;
          }
          .kj-collections__strip-wrap {
            grid-template-columns: 1fr;
          }
          .kj-collections__feature-copy p {
            display: none;
          }
          .kj-collections__tile {
            width: 118px;
          }
          .kj-collections__tile-label {
            font-size: 0.9375rem;
          }
        }
      `}</style>
    </section>
  );
}
