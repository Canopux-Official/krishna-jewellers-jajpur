import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Collection } from '../../types';

interface CollectionMasonryProps {
  collections: Collection[];
}

export default function CollectionMasonry({ collections }: CollectionMasonryProps) {

  return (
    <>
      <div
        className="col-masonry"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gridAutoRows: '280px',
          gap: '3px',
        }}
      >
        {collections.map((col, i) => (
          <CollectionMasonryCard key={col.id} collection={col} index={i} />
        ))}
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .col-masonry { grid-template-columns: repeat(3, 1fr) !important; grid-auto-rows: 240px !important; }
        }
        @media (max-width: 768px) {
          .col-masonry { grid-template-columns: repeat(2, 1fr) !important; grid-auto-rows: 240px !important; }
          .col-masonry > * { grid-column: span 1 !important; grid-row: span 1 !important; }
        }
        @media (max-width: 480px) {
          .col-masonry { grid-template-columns: 1fr !important; grid-auto-rows: min(72vw, 360px) !important; }
        }
      `}</style>
    </>
  );
}

function CollectionMasonryCard({ collection, index }: { collection: Collection; index: number }) {
  const colSpan = collection.size === 'large' ? 2 : 1;
  const rowSpan = collection.size === 'large' || collection.size === 'tall' ? 2 : 1;
  

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.8, delay: (index % 4) * 0.07, ease: 'easeInOut' }}
      style={{ gridColumn: `span ${colSpan}`, gridRow: `span ${rowSpan}` }}
    >
      <Link
        to={`/collections/${collection.slug}`}
        style={{ display: 'block', height: '100%', textDecoration: 'none' }}
      >
        <div
          className="cm-card"
          style={{
            position: 'relative',
            height: '100%',
            overflow: 'hidden',
            backgroundColor: 'var(--color-bg-alt)',
            cursor: 'pointer',
          }}
        >
          {/* Image */}
          <motion.img
            src={collection.image}
            alt={collection.name}
            loading="lazy"
            decoding="async"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.85, ease: 'easeInOut' }}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center center',
              display: 'block',
            }}
          />

          {/* Gradient overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, transparent 35%, rgba(24,24,24,0.75) 100%)',
            }}
          />

          {/* Text */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px 20px' }}>
            <p
              className="cm-sub"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.5625rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--color-gold)',
                marginBottom: '6px',
                opacity: 0,
                transform: 'translateY(8px)',
                transition: 'opacity 0.4s ease, transform 0.4s ease',
              }}
            >
              {collection.productCount} Designs
            </p>
            <h3
              className="cm-title"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: collection.size === 'large' ? '2rem' : '1.375rem',
                fontWeight: 600,
                color: '#F8F6F2',
                lineHeight: 1.1,
                transform: 'translateY(6px)',
                transition: 'transform 0.4s ease',
              }}
            >
              {collection.name}
            </h3>
          </div>
        </div>
      </Link>

      <style>{`
        .cm-card:hover .cm-sub { opacity: 1 !important; transform: translateY(0) !important; }
        .cm-card:hover .cm-title { transform: translateY(0) !important; }
        @media (hover: none) {
          .cm-sub { opacity: 1 !important; transform: none !important; }
        }
        @media (max-width: 768px) {
          .cm-card .cm-title { font-size: 1.375rem !important; }
        }
      `}</style>
    </motion.div>
  );
}
