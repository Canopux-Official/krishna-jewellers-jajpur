import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { Product } from '../../types';
import GoldDivider from '../ui/GoldDivider';

interface RelatedProductsProps {
  products: Product[];
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section style={{ paddingTop: '80px', paddingBottom: '96px', backgroundColor: 'var(--color-bg-alt)' }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ marginBottom: '48px' }}
        >
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.625rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-muted)', display: 'block', marginBottom: '14px' }}>
            You May Also Like
          </span>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 600, color: 'var(--color-text)', marginBottom: '20px' }}>
            From the Same <span style={{ fontStyle: 'italic', color: 'var(--color-bronze)' }}>Collection</span>
          </h2>
          <GoldDivider />
        </motion.div>

        <div
          className="related-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '3px',
          }}
        >
          {products.slice(0, 4).map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.75, delay: i * 0.08, ease: 'easeInOut' }}
              className="related-card"
            >
              <Link to={`/products/${product.slug}`} style={{ display: 'block', textDecoration: 'none' }}>
                <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: '3/4', backgroundColor: 'var(--color-bg)' }}>
                  <motion.img
                    src={product.images[0]}
                    alt={product.name}
                    loading="lazy"
                    decoding="async"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.85, ease: 'easeInOut' }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>
                <div style={{ paddingTop: '12px' }}>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.5625rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: '4px' }}>
                    {product.purity} · {product.weight}
                  </p>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-text)', lineHeight: 1.25 }}>
                    {product.name}
                  </h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) { .related-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 16px !important; } }
        @media (max-width: 360px) { .related-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}
