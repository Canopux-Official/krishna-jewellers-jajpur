import type { Product } from '../../types';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div
        style={{
          paddingBlock: '96px',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.5rem',
            fontStyle: 'italic',
            color: 'var(--color-muted)',
            marginBottom: '12px',
          }}
        >
          No pieces found
        </p>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.875rem',
            color: 'var(--color-muted)',
          }}
        >
          Try adjusting your filters.
        </p>
      </div>
    );
  }

  return (
    <>
      <div
        className="product-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '28px 20px',
          alignItems: 'start',
        }}
      >
        {products.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .product-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 24px 16px !important;
          }
        }
        @media (max-width: 360px) {
          .product-grid {
            grid-template-columns: 1fr !important;
            gap: 28px !important;
          }
        }
      `}</style>
    </>
  );
}
