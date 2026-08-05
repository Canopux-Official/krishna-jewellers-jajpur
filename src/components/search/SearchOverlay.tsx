import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearch } from '../../context/SearchContext';
import { publicProductsService, publicCategoriesService } from '../../services/publicApi';
import { resolveMediaUrl } from '../../utils/cloudinary';

const STORAGE_KEY = 'kj_recent_searches';
const MAX_RECENT = 5;

interface SearchProduct {
  id: string;
  slug: string;
  name: string;
  purity: string;
  weight: string;
  image: string;
}

interface SearchCollection {
  id: string;
  slug: string;
  name: string;
  productCount: number;
  image?: string;
}

function getRecent(): string[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}
function addRecent(q: string) {
  const list = [q, ...getRecent().filter((x) => x !== q)].slice(0, MAX_RECENT);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}
function clearRecent() { localStorage.removeItem(STORAGE_KEY); }

function mapProduct(p: any): SearchProduct {
  const raw =
    Array.isArray(p.images) && p.images.length > 0
      ? typeof p.images[0] === 'string'
        ? p.images[0]
        : p.images[0]?.url
      : '';
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    purity: p.purity,
    weight: p.weight,
    image: resolveMediaUrl(raw),
  };
}

function mapCategory(c: any): SearchCollection {
  return {
    id: c.id,
    slug: c.slug,
    name: c.name,
    productCount: c.productCount ?? c._count?.products ?? 0,
    image: c.image ? resolveMediaUrl(c.image) : undefined,
  };
}

export default function SearchOverlay() {
  const { isOpen, closeSearch } = useSearch();
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<SearchProduct[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [allCollections, setAllCollections] = useState<SearchCollection[]>([]);
  const [suggestedCollections, setSuggestedCollections] = useState<SearchCollection[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    publicCategoriesService
      .getAll()
      .then((data) => {
        const list = Array.isArray(data) ? data : data.data || [];
        setAllCollections(
          list.filter((c: any) => c.isActive !== false).map(mapCategory),
        );
      })
      .catch(() => setAllCollections([]));
  }, []);

  useEffect(() => {
    if (isOpen) {
      setRecent(getRecent());
      setTimeout(() => inputRef.current?.focus(), 80);
    } else {
      setQuery('');
      setProducts([]);
      setSuggestedCollections([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const t = setTimeout(() => {
      const q = query.trim();
      if (q.length >= 2) {
        publicProductsService
          .search(q)
          .then((res) => {
            const list = Array.isArray(res) ? res : res.data || [];
            setProducts(list.map(mapProduct));
          })
          .catch(() => setProducts([]));

        setSuggestedCollections(
          allCollections
            .filter((c) => c.name.toLowerCase().includes(q.toLowerCase()))
            .slice(0, 3),
        );
      } else {
        setProducts([]);
        setSuggestedCollections([]);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [query, allCollections]);

  const handleClose = useCallback(() => {
    closeSearch();
  }, [closeSearch]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
      if (e.key === 'Enter' && query.trim()) {
        addRecent(query.trim());
        setRecent(getRecent());
      }
    },
    [handleClose, query],
  );

  const handleProductClick = (product: SearchProduct) => {
    addRecent(product.name);
    handleClose();
    navigate(`/products/${product.slug}`);
  };

  const handleRecentClick = (term: string) => {
    setQuery(term);
    inputRef.current?.focus();
  };

  const handleClearRecent = () => {
    clearRecent();
    setRecent([]);
  };

  return (
    <>
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 150,
              backgroundColor: 'rgba(24,24,24,0.7)',
              backdropFilter: 'blur(8px)',
            }}
            onClick={handleClose}
          />

          <motion.div
            initial={{ opacity: 0, y: -24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            style={{
              position: 'fixed',
              top: 0, left: 0, right: 0,
              zIndex: 151,
              backgroundColor: 'var(--color-bg)',
              borderBottom: '1px solid var(--color-divider)',
              paddingTop: '32px',
              paddingBottom: '40px',
              maxHeight: '85vh',
              overflowY: 'auto',
            }}
          >
            <div className="container">
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-muted)" strokeWidth="1.5" style={{ flexShrink: 0 }}>
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search bridal, bangles, chains…"
                  style={{
                    flex: 1,
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(1.25rem, 3vw, 2rem)',
                    fontWeight: 600,
                    fontStyle: query ? 'normal' : 'italic',
                    color: 'var(--color-text)',
                    backgroundColor: 'transparent',
                    border: 'none',
                    outline: 'none',
                    caretColor: 'var(--color-gold)',
                  }}
                />
                <button
                  onClick={handleClose}
                  aria-label="Close search"
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--color-muted)',
                    fontFamily: 'var(--font-body)', fontSize: '0.5625rem',
                    letterSpacing: '0.2em', textTransform: 'uppercase',
                    display: 'flex', alignItems: 'center', gap: '8px',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                  Esc
                </button>
              </div>

              <div style={{ height: '1px', backgroundColor: 'var(--color-divider)', marginBottom: '32px' }} />

              {query.trim().length >= 2 ? (
                <div className="search-results-grid">
                  {suggestedCollections.length > 0 && (
                    <div style={{ marginBottom: '32px' }}>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.5625rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: '16px' }}>Collections</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                        {suggestedCollections.map((col) => (
                          <Link
                            key={col.id}
                            to={`/collections/${col.slug}`}
                            onClick={handleClose}
                            style={{
                              display: 'flex', alignItems: 'center', gap: '16px',
                              padding: '12px 0', borderBottom: '1px solid var(--color-divider)',
                              textDecoration: 'none',
                            }}
                          >
                            {col.image ? (
                              <img src={col.image} alt={col.name} style={{ width: '44px', height: '44px', objectFit: 'cover', flexShrink: 0 }} />
                            ) : (
                              <div style={{ width: '44px', height: '44px', flexShrink: 0, backgroundColor: 'var(--color-bg-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', color: 'var(--color-gold)' }}>{col.name.charAt(0)}</span>
                              </div>
                            )}
                            <div>
                              <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', color: 'var(--color-text)' }}>{col.name}</p>
                              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.6875rem', color: 'var(--color-muted)' }}>{col.productCount} designs</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {products.length > 0 && (
                    <div>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.5625rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: '16px' }}>Pieces</p>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                        {products.map((p) => (
                          <button
                            key={p.id}
                            onClick={() => handleProductClick(p)}
                            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left' }}
                          >
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                              <img src={p.image} alt={p.name} style={{ width: '56px', height: '56px', objectFit: 'cover', flexShrink: 0, backgroundColor: 'var(--color-bg-alt)' }} />
                              <div>
                                <p style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9375rem', color: 'var(--color-text)', lineHeight: 1.25, marginBottom: '4px' }}>{p.name}</p>
                                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.625rem', letterSpacing: '0.1em', color: 'var(--color-muted)', textTransform: 'uppercase' }}>{p.purity} · {p.weight}</p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {products.length === 0 && suggestedCollections.length === 0 && (
                    <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontStyle: 'italic', color: 'var(--color-muted)' }}>
                      No results for "{query}"
                    </p>
                  )}
                </div>
              ) : (
                <div className="search-idle-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px' }}>
                  {recent.length > 0 && (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.5625rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-muted)' }}>Recent</p>
                        <button onClick={handleClearRecent} style={{ fontFamily: 'var(--font-body)', fontSize: '0.5625rem', letterSpacing: '0.14em', color: 'var(--color-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>Clear</button>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                        {recent.map((r) => (
                          <button
                            key={r}
                            onClick={() => handleRecentClick(r)}
                            style={{
                              fontFamily: 'var(--font-body)', fontSize: '0.9375rem', color: 'var(--color-text)',
                              textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer',
                              padding: '10px 0', borderBottom: '1px solid var(--color-divider)',
                              display: 'flex', alignItems: 'center', gap: '10px',
                            }}
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-muted)" strokeWidth="1.5">
                              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                            </svg>
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.5625rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: '16px' }}>Popular Collections</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                      {allCollections.slice(0, 5).map((col) => (
                        <Link
                          key={col.id}
                          to={`/collections/${col.slug}`}
                          onClick={handleClose}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '14px',
                            padding: '10px 0', borderBottom: '1px solid var(--color-divider)',
                            textDecoration: 'none',
                          }}
                        >
                          {col.image ? (
                            <img src={col.image} alt={col.name} style={{ width: '36px', height: '36px', objectFit: 'cover', flexShrink: 0, backgroundColor: 'var(--color-bg-alt)' }} />
                          ) : (
                            <div style={{ width: '36px', height: '36px', flexShrink: 0, backgroundColor: 'var(--color-bg-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.875rem', color: 'var(--color-gold)' }}>{col.name.charAt(0)}</span>
                            </div>
                          )}
                          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--color-text)' }}>{col.name}</p>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-muted)" strokeWidth="1.5" style={{ marginLeft: 'auto' }}>
                            <polyline points="9 18 15 12 9 6" />
                          </svg>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
    <style>{`
      @media (max-width: 700px) {
        .search-idle-grid {
          grid-template-columns: 1fr !important;
          gap: 32px !important;
        }
      }
    `}</style>
    </>
  );
}
