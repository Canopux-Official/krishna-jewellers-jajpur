import { useState, useEffect } from 'react';
import { Navigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../components/ui/PageTransition';
import Breadcrumb from '../components/ui/Breadcrumb';
import ProductGallery from '../components/product/ProductGallery';
import RelatedProducts from '../components/product/RelatedProducts';
import GoldDivider from '../components/ui/GoldDivider';
import PageMeta from '../components/seo/PageMeta';
import BisCredibility from '../components/ui/BisCredibility';
import { publicProductsService, buildWhatsAppEnquiry } from '../services/publicApi';
import { useStoreSettings } from '../context/StoreSettingsContext';
import { resolveMediaUrl } from '../utils/cloudinary';
import { buildProductJsonLd, pageTitle, truncateMeta } from '../utils/seo';
import { isProductSoldOut, stockLabel } from '../utils/stock';

const INFO_SECTIONS = [
  {
    title: 'Jewellery Care',
    icon: '✦',
    content: 'Store your piece in the pouch provided, away from direct sunlight and moisture. Clean gently with a soft, dry cloth. Avoid contact with perfumes, lotions and harsh chemicals. For deep cleaning, visit our store.',
  },
  {
    title: 'Hallmark Information',
    icon: '◆',
    content: 'All our gold jewellery is BIS Hallmarked under the Bureau of Indian Standards (IS 1417). Each piece carries a unique HUID (Hallmark Unique Identification) number for full traceability and certified purity.',
  },
  {
    title: 'Delivery & Making',
    icon: '○',
    content: 'In-stock pieces are available for same-day collection from our store. Made-to-order pieces take 4–6 weeks depending on design complexity. We do not offer home delivery at this time — all pieces must be collected in person.',
  },
];

function availabilityLabel(product: any) {
  return stockLabel(product);
}

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const settings = useStoreSettings();
  const [product, setProduct] = useState<any | null>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    publicProductsService
      .getBySlug(slug)
      .then(async (p) => {
        setProduct(p);
        try {
          const res = await publicProductsService.getByCollection(p.categorySlug || p.category?.slug, { limit: 5 });
          const list = (res.data || []).filter((x: any) => x.id !== p.id).slice(0, 4);
          setRelated(
            list.map((x: any) => ({
              ...x,
              images: (x.images || []).map((img: any) => (typeof img === 'string' ? img : img.url)).map(resolveMediaUrl),
              category: x.category?.name || x.category,
            })),
          );
        } catch {
          setRelated([]);
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (notFound) return <Navigate to="/404" replace />;

  if (loading || !product) {
    return (
      <PageTransition>
        <div style={{ paddingTop: 'var(--navbar-height)', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--color-muted)' }}>Loading…</p>
        </div>
      </PageTransition>
    );
  }

  const images = (product.images || [])
    .slice()
    .sort((a: any, b: any) => {
      if (a.isFeatured) return -1;
      if (b.isFeatured) return 1;
      return (a.order ?? 0) - (b.order ?? 0);
    })
    .map((img: any) => resolveMediaUrl(typeof img === 'string' ? img : img.url));

  const categoryName = product.category?.name || product.category || '';
  const categorySlug = product.categorySlug || product.category?.slug || '';

  const whatsappUrl = buildWhatsAppEnquiry(settings.whatsapp, {
    name: product.name,
    purity: product.purity,
    weight: product.weight,
  });

  return (
    <PageTransition>
      <PageMeta
        title={pageTitle(`${product.name}${product.purity ? ` — ${product.purity}` : ''}`)}
        description={truncateMeta(
          product.description ||
            `${product.name}${product.purity ? ` in ${product.purity}` : ''}${product.weight ? `, ${product.weight}` : ''} at Krishna Jewellers, Byasanagar, Jajpur.`,
        )}
        path={`/products/${product.slug}`}
        image={images[0]}
        type="product"
        jsonLd={buildProductJsonLd({
          name: product.name,
          description: product.description,
          images,
          purity: product.purity,
          weight: product.weight,
          priceValue: product.priceValue,
          slug: product.slug,
        })}
      />
      <div style={{ paddingTop: 'var(--navbar-height)', backgroundColor: 'var(--color-bg)' }}>
        <div className="container" style={{ paddingTop: '32px', paddingBottom: '40px' }}>
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Collections', href: '/collections' },
              { label: categoryName, href: `/collections/${categorySlug}` },
              { label: product.name },
            ]}
          />
        </div>

        <div className="container">
          <div className="pdp-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'start', paddingBottom: '96px' }}>
            <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, ease: 'easeInOut' }}>
              <ProductGallery images={images} productName={product.name} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.1, ease: 'easeInOut' }}
              style={{ position: 'sticky', top: 'calc(var(--navbar-height) + 32px)' }}
            >
              <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
                {product.isNewArrival && (
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.5625rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-gold)', border: '1px solid rgba(199,161,90,0.4)', padding: '3px 8px' }}>New Arrival</span>
                )}
                {isProductSoldOut(product) && (
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.5625rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#DC2626', border: '1px solid rgba(220,38,38,0.3)', padding: '3px 8px' }}>Sold Out</span>
                )}
              </div>

              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.5625rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: '12px' }}>
                {categoryName}
              </p>

              <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)', fontWeight: 600, color: 'var(--color-text)', lineHeight: 1.15, marginBottom: '24px' }}>
                {product.name}
              </h1>

              <GoldDivider style={{ marginBottom: '28px' }} />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px', padding: '24px', border: '1px solid var(--color-divider)', backgroundColor: 'var(--color-bg-alt)' }}>
                {[
                  { label: 'Purity', value: product.purity },
                  { label: 'Weight', value: product.weight },
                  ...(product.makingStyle ? [{ label: 'Making Style', value: product.makingStyle }] : []),
                  { label: 'Availability', value: availabilityLabel(product) },
                ].map((item) => (
                  <div key={item.label}>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.5625rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: '5px' }}>{item.label}</p>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--color-text)', lineHeight: 1.4 }}>{item.value}</p>
                  </div>
                ))}
              </div>

              {product.price && (
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '2rem', fontWeight: 300, color: 'var(--color-text)', marginBottom: '8px', letterSpacing: '0.02em' }}>{product.price}</p>
              )}
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.6875rem', color: 'var(--color-muted)', marginBottom: '36px' }}>
                Price is indicative · Contact store for confirmed billing
              </p>

              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9375rem', color: 'var(--color-muted)', lineHeight: 1.85, marginBottom: '40px' }}>
                {product.description}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '48px' }}>
                {!isProductSoldOut(product) && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                      padding: '16px 32px', border: '1px solid var(--color-gold)', backgroundColor: 'var(--color-gold)',
                      fontFamily: 'var(--font-body)', fontSize: '0.6875rem', letterSpacing: '0.18em', textTransform: 'uppercase',
                      color: '#F8F6F2', textDecoration: 'none', transition: 'background-color 0.3s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-bronze)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-gold)'; }}
                  >
                    Enquire on WhatsApp
                  </a>
                )}

                <Link
                  to="/#visit"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                    padding: '16px 32px', border: '1px solid var(--color-divider)', backgroundColor: 'transparent',
                    fontFamily: 'var(--font-body)', fontSize: '0.6875rem', letterSpacing: '0.18em', textTransform: 'uppercase',
                    color: 'var(--color-text)', textDecoration: 'none',
                  }}
                >
                  Book a Store Visit
                </Link>
              </div>

              <div style={{ marginBottom: '36px' }}>
                <BisCredibility compact />
              </div>

              <div style={{ borderTop: '1px solid var(--color-divider)' }}>
                {INFO_SECTIONS.map((section) => (
                  <InfoAccordion key={section.title} title={section.title} icon={section.icon} content={section.content} />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {related.length > 0 && <RelatedProducts products={related} />}

      <style>{`
        @media (max-width: 900px) {
          .pdp-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
          .pdp-grid > div:last-child { position: static !important; }
        }
      `}</style>
    </PageTransition>
  );
}

function InfoAccordion({ title, icon, content }: { title: string; icon: string; content: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: '1px solid var(--color-divider)' }}>
      <button onClick={() => setOpen(!open)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 0', background: 'none', border: 'none', cursor: 'pointer' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.75rem', color: 'var(--color-gold)' }}>{icon}</span>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-text)' }}>{title}</span>
        </div>
        <motion.span animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.3 }} style={{ color: 'var(--color-muted)', fontSize: '1.125rem' }}>+</motion.span>
      </button>
      <motion.div initial={false} animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }} transition={{ duration: 0.4, ease: 'easeInOut' }} style={{ overflow: 'hidden' }}>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--color-muted)', lineHeight: 1.85, paddingBottom: '20px' }}>{content}</p>
      </motion.div>
    </div>
  );
}
