import { useState, useEffect, useMemo } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import PageTransition from '../components/ui/PageTransition';
import CollectionHero from '../components/collection/CollectionHero';
import FilterBar from '../components/filter/FilterBar';
import ProductGrid from '../components/product/ProductGrid';
import PageMeta from '../components/seo/PageMeta';
import { publicProductsService, publicCategoriesService } from '../services/publicApi';
import { getCollectionBySlug } from '../data/mockCollections';
import { applyFilters } from '../utils/filters';
import { DEFAULT_FILTERS } from '../types';
import type { FilterState, Product, Collection } from '../types';
import { resolveMediaUrl } from '../utils/cloudinary';
import { pageTitle, truncateMeta, buildCollectionJsonLd, buildBreadcrumbJsonLd, mergeJsonLd } from '../utils/seo';
import { motion } from 'framer-motion';

function mapApiProduct(p: any): Product {
  const images = (p.images || [])
    .slice()
    .sort((a: any, b: any) => {
      if (a.isFeatured) return -1;
      if (b.isFeatured) return 1;
      return (a.order ?? 0) - (b.order ?? 0);
    })
    .map((img: any) => resolveMediaUrl(typeof img === 'string' ? img : img.url));

  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    category: p.category?.name || p.category || '',
    categorySlug: p.categorySlug || p.category?.slug || '',
    purity: p.purity,
    weight: p.weight,
    weightGrams: p.weightGrams,
    price: p.price,
    priceValue: p.priceValue,
    images,
    description: p.description,
    makingStyle: p.makingStyle,
    isNewArrival: p.isNewArrival,
    isFeatured: p.isFeatured,
    isAvailable: p.isAvailable,
    isSoldOut: p.isSoldOut,
    tags: p.tags,
  } as Product;
}

export default function CollectionDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [collection, setCollection] = useState<Collection | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    Promise.all([
      publicCategoriesService.getAll(),
      publicProductsService.getByCollection(slug, { limit: 100 }),
    ])
      .then(([categories, res]) => {
        const cat = (categories || []).find((c: any) => c.slug === slug && c.isActive !== false);
        if (!cat) {
          setNotFound(true);
          return;
        }
        const mock = getCollectionBySlug(slug);
        setCollection({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          shortDescription: mock?.shortDescription || `Explore our ${cat.name} collection.`,
          description: mock?.description || `Timeless designs in our ${cat.name} collection, crafted for every celebration.`,
          image: mock?.image || '',
          bannerImage: mock?.bannerImage || mock?.image || '',
          productCount: res.total || (res.data || []).length,
          size: mock?.size || 'large',
        } as Collection);
        setAllProducts((res.data || []).map(mapApiProduct));
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  const filteredProducts = useMemo(
    () => applyFilters(allProducts, filters),
    [allProducts, filters],
  );

  if (notFound) return <Navigate to="/404" replace />;

  if (loading || !collection) {
    return (
      <PageTransition>
        <div style={{ paddingTop: 'var(--navbar-height)', minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-muted)' }}>Loading collection…</p>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <PageMeta
        title={pageTitle(`${collection.name} — Byasanagar, Jajpur`)}
        description={truncateMeta(
          `${collection.shortDescription} Shop ${collection.name.toLowerCase()} at Krishna Jewellers, Byasanagar, Jajpur, Odisha.`,
        )}
        path={`/collections/${collection.slug}`}
        image={collection.bannerImage || collection.image}
        jsonLd={mergeJsonLd(
          buildCollectionJsonLd({
            name: collection.name,
            description: collection.description,
            shortDescription: collection.shortDescription,
            slug: collection.slug,
            image: collection.image,
            bannerImage: collection.bannerImage,
            products: filteredProducts.map((p) => ({
              name: p.name,
              slug: p.slug,
              images: p.images,
            })),
          }),
          buildBreadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Collections', path: '/collections' },
            { name: collection.name },
          ]),
        )}
      />
      <CollectionHero collection={{ ...collection, productCount: filteredProducts.length || collection.productCount }} />

      <FilterBar filters={filters} onChange={setFilters} resultCount={filteredProducts.length} />

      <div className="container" style={{ paddingTop: 40, paddingBottom: 96 }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <ProductGrid products={filteredProducts} />
        </motion.div>
      </div>
    </PageTransition>
  );
}
