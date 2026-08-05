import { motion } from 'framer-motion';
import type { Collection } from '../../types';
import Breadcrumb from '../ui/Breadcrumb';

interface CollectionHeroProps {
  collection: Collection;
}

export default function CollectionHero({ collection }: CollectionHeroProps) {
  return (
    <section
      className="collection-hero"
      style={{
        position: 'relative',
        height: '58vh',
        minHeight: '380px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'flex-end',
      }}
    >
      <motion.div
        initial={{ scale: 1.04 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        style={{ position: 'absolute', inset: 0 }}
      >
        <img
          src={collection.bannerImage}
          alt={collection.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center center',
            display: 'block',
          }}
        />
      </motion.div>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(24,24,24,0.55) 0%, rgba(24,24,24,0.2) 35%, rgba(24,24,24,0.72) 100%)',
        }}
      />

      <div
        className="container"
        style={{
          position: 'relative',
          zIndex: 1,
          paddingTop: 'calc(var(--navbar-height) + 24px)',
          paddingBottom: '48px',
          width: '100%',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: 'easeInOut' }}
          style={{ marginBottom: '16px' }}
        >
          <Breadcrumb
            light
            items={[
              { label: 'Home', href: '/' },
              { label: 'Collections', href: '/collections' },
              { label: collection.name },
            ]}
          />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: 'easeInOut' }}
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2.25rem, 7vw, 4.5rem)',
            fontWeight: 600,
            color: '#F8F6F2',
            lineHeight: 1.08,
            marginBottom: '12px',
          }}
        >
          {collection.name}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: 'easeInOut' }}
          style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}
        >
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.9375rem',
              color: 'rgba(248,246,242,0.7)',
              maxWidth: '480px',
              lineHeight: 1.7,
            }}
          >
            {collection.shortDescription}
          </p>
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.625rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(199,161,90,0.85)',
              whiteSpace: 'nowrap',
              borderLeft: '1px solid rgba(199,161,90,0.3)',
              paddingLeft: '16px',
            }}
          >
            {collection.productCount} Designs
          </span>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 700px) {
          .collection-hero {
            height: 55svh !important;
            min-height: 300px !important;
            max-height: 440px !important;
          }
        }
      `}</style>
    </section>
  );
}
