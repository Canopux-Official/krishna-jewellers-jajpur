import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Badge from '../ui/Badge';
import type { Product } from '../../types';
import { isProductInStock, isProductSoldOut } from '../../utils/stock';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.75, delay: (index % 4) * 0.07, ease: 'easeInOut' }}
      className="product-card-root"
      style={{
        width: '100%',
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Link
        to={`/products/${product.slug}`}
        style={{ display: 'flex', flexDirection: 'column', textDecoration: 'none', height: '100%' }}
      >
        {/* Image container — uniform 3:4 frame */}
        <div
          style={{
            position: 'relative',
            overflow: 'hidden',
            width: '100%',
            aspectRatio: '3 / 4',
            backgroundColor: 'var(--color-bg-alt)',
            flexShrink: 0,
          }}
        >
          <motion.img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            decoding="async"
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.85, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center center',
              display: 'block',
            }}
          />

          {/* Badges */}
          <div
            style={{
              position: 'absolute',
              top: '16px',
              left: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              zIndex: 2,
            }}
          >
            {product.isNewArrival && <Badge variant="newArrival">New Arrival</Badge>}
            {isProductSoldOut(product) && <Badge variant="unavailable">Sold Out</Badge>}
            {!isProductSoldOut(product) && !isProductInStock(product) && <Badge variant="unavailable">Made to Order</Badge>}
          </div>

          {/* Hover overlay */}
          <div
            className="pc-overlay"
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(24,24,24,0)',
              transition: 'background 0.5s ease',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              padding: '24px',
              zIndex: 1,
            }}
          >
            <div
              className="pc-info"
              style={{
                opacity: 0,
                transform: 'translateY(12px)',
                transition: 'opacity 0.45s ease, transform 0.45s ease',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  gap: '16px',
                  marginBottom: '8px',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.6875rem',
                    color: 'rgba(248,246,242,0.65)',
                    letterSpacing: '0.06em',
                  }}
                >
                  {product.purity}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.6875rem',
                    color: 'rgba(248,246,242,0.65)',
                    letterSpacing: '0.06em',
                  }}
                >
                  {product.weight}
                </span>
              </div>
              {product.price && (
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '1.375rem',
                    fontWeight: 300,
                    color: 'var(--color-on-maroon)',
                    letterSpacing: '0.02em',
                  }}
                >
                  {product.price}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Text below image */}
        <div style={{ paddingTop: '14px', paddingBottom: '4px', minWidth: 0 }}>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.5625rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--color-muted)',
              marginBottom: '5px',
            }}
          >
            {product.category}
          </p>
          <h3
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.125rem',
              fontWeight: 600,
              color: 'var(--color-text)',
              lineHeight: 1.25,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {product.name}
          </h3>
          <div className="pc-meta-mobile" style={{ display: 'none', marginTop: '8px' }}>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.6875rem',
                letterSpacing: '0.06em',
                color: 'var(--color-muted)',
                marginBottom: product.price ? '4px' : 0,
              }}
            >
              {[product.purity, product.weight].filter(Boolean).join(' · ')}
            </p>
            {product.price && (
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '1.125rem',
                  fontWeight: 400,
                  color: 'var(--color-text)',
                  letterSpacing: '0.02em',
                }}
              >
                {product.price}
              </p>
            )}
          </div>
        </div>
      </Link>

      <style>{`
        .product-card-root:hover .pc-overlay {
          background: rgba(24,24,24,0.55) !important;
        }
        .product-card-root:hover .pc-info {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
        @media (max-width: 900px), (hover: none) {
          .pc-meta-mobile { display: block !important; }
          .pc-overlay { display: none !important; }
        }
      `}</style>
    </motion.div>
  );
}
