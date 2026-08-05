import { Link } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import BisCredibility from '../ui/BisCredibility';

import { SECTION_IMAGES } from '../../data/storeImages';

const STORY_IMAGE = SECTION_IMAGES.brandStory;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, delay, ease: 'easeInOut' as const },
  }),
};

export default function BrandStory() {
  return (
    <section
      className="kj-story"
      style={{
        backgroundColor: 'var(--color-maroon)',
        color: 'var(--color-ivory)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        className="kj-story-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: '1.15fr 0.85fr',
          minHeight: 'min(78vh, 720px)',
        }}
      >
        {/* Editorial copy on maroon — no label / divider / float badge */}
        <div
          className="kj-story-copy"
          style={{
            padding: 'clamp(56px, 9vw, 112px) clamp(24px, 6vw, 96px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.35 }}
            custom={0}
            variants={fadeUp}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '0.75rem',
              fontWeight: 500,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'var(--color-gold)',
              marginBottom: '28px',
            }}
          >
            Since Byasanagar
          </motion.p>

          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.35 }}
            custom={0.08}
            variants={fadeUp}
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.35rem, 4.5vw, 3.6rem)',
              fontWeight: 600,
              lineHeight: 1.12,
              color: 'var(--color-ivory)',
              marginBottom: '28px',
              maxWidth: '14ch',
            }}
          >
            A neighbourhood house of gold for faith and family.
          </motion.h2>

          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.35 }}
            custom={0.18}
            variants={fadeUp}
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 300,
              fontSize: '1rem',
              lineHeight: 1.9,
              color: 'var(--color-on-maroon)',
              marginBottom: '20px',
              maxWidth: '34rem',
            }}
          >
            In the temple town of Jajpur, Krishna Jewellers is where families return for mangalsutra, bridal sets, festival bangles, and the quiet pieces worn every day. Honest metal, careful finishing, and a showroom that feels like home.
          </motion.p>

          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.35 }}
            custom={0.28}
            variants={fadeUp}
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 300,
              fontSize: '0.9375rem',
              lineHeight: 1.85,
              color: 'rgba(243,235,227,0.72)',
              marginBottom: '40px',
              maxWidth: '34rem',
            }}
          >
            From rites near local shrines to weddings across Odisha — purity, meaning, and trust passed between generations.
          </motion.p>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.35 }}
            custom={0.36}
            variants={fadeUp}
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px 28px',
              alignItems: 'center',
              marginBottom: '36px',
              fontFamily: 'var(--font-body)',
              fontSize: '0.6875rem',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'var(--color-gold)',
            }}
          >
            <span>Temple-town roots</span>
            <span style={{ opacity: 0.35 }}>·</span>
            <span>BIS hallmarked</span>
            <span style={{ opacity: 0.35 }}>·</span>
            <span>Families first</span>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.35 }}
            custom={0.42}
            variants={fadeUp}
            style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center' }}
          >
            <Link
              to="/about"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.6875rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--color-ivory)',
                borderBottom: '1px solid var(--color-gold)',
                paddingBottom: '3px',
                textDecoration: 'none',
              }}
            >
              Our heritage
            </Link>
            <BisCredibility variant="dark" compact />
          </motion.div>
        </div>

        {/* Full-height image plane — no inset frame / float sticker */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.1 }}
          className="kj-story-media"
          style={{ position: 'relative', minHeight: '420px' }}
        >
          <img
            src={STORY_IMAGE}
            alt="Krishna Jewellers craft and showroom atmosphere"
            loading="lazy"
            decoding="async"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              display: 'block',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(90deg, rgba(24,24,24,0.55) 0%, transparent 45%)',
              pointerEvents: 'none',
            }}
          />
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .kj-story-grid {
            grid-template-columns: 1fr !important;
            min-height: 0 !important;
          }
          .kj-story-media {
            min-height: 320px !important;
            order: -1;
          }
          .kj-story-copy {
            padding-block: 56px !important;
          }
        }
      `}</style>
    </section>
  );
}
