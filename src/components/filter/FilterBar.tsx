import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { FilterState, Purity } from '../../types';
import { DEFAULT_FILTERS } from '../../types';
import { getActiveFilterCount } from '../../utils/filters';

interface FilterBarProps {
  filters: FilterState;
  onChange: (f: FilterState) => void;
  resultCount: number;
}

const PURITIES: Purity[] = ['24K', '22K', '18K', '14K'];
const WEIGHTS = [
  { value: 'all', label: 'All Weights' },
  { value: 'light', label: 'Under 5g' },
  { value: 'medium', label: '5g – 15g' },
  { value: 'heavy', label: '15g – 30g' },
  { value: 'statement', label: '30g+' },
];
const PRICES = [
  { value: 'all', label: 'All Prices' },
  { value: 'under20k', label: 'Under ₹20K' },
  { value: '20k-50k', label: '₹20K – ₹50K' },
  { value: '50k-1l', label: '₹50K – ₹1L' },
  { value: 'above1l', label: 'Above ₹1L' },
];

export default function FilterBar({ filters, onChange, resultCount }: FilterBarProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const activeCount = getActiveFilterCount(filters);

  const togglePurity = (p: Purity) => {
    const next = filters.purity.includes(p)
      ? filters.purity.filter((x) => x !== p)
      : [...filters.purity, p];
    onChange({ ...filters, purity: next });
  };

  const reset = () => onChange({ ...DEFAULT_FILTERS });

  return (
    <>
      {/* ── Desktop filter bar ── */}
      <div
        className="filter-bar-desktop"
        style={{
          position: 'sticky',
          top: 'var(--navbar-height)',
          zIndex: 50,
          backgroundColor: 'rgba(248,246,242,0.96)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--color-divider)',
          paddingBlock: '0',
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '56px',
            gap: '32px',
            overflowX: 'auto',
          }}
        >
          {/* Left: filter controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0', flexShrink: 0 }}>
            {/* Purity */}
            <FilterGroup label="Purity">
              <div style={{ display: 'flex', gap: '6px' }}>
                {PURITIES.map((p) => (
                  <button
                    key={p}
                    onClick={() => togglePurity(p)}
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.625rem',
                      letterSpacing: '0.12em',
                      padding: '4px 10px',
                      border: `1px solid ${filters.purity.includes(p) ? 'var(--color-gold)' : 'var(--color-divider)'}`,
                      backgroundColor: filters.purity.includes(p) ? 'var(--color-gold)' : 'transparent',
                      color: filters.purity.includes(p) ? '#F8F6F2' : 'var(--color-muted)',
                      cursor: 'pointer',
                      transition: 'all 0.25s',
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </FilterGroup>

            <Separator />

            {/* Weight */}
            <FilterGroup label="Weight">
              <SelectFilter
                options={WEIGHTS}
                value={filters.weightBucket}
                onChange={(v) => onChange({ ...filters, weightBucket: v as FilterState['weightBucket'] })}
              />
            </FilterGroup>

            <Separator />

            {/* Price */}
            <FilterGroup label="Price">
              <SelectFilter
                options={PRICES}
                value={filters.priceRange}
                onChange={(v) => onChange({ ...filters, priceRange: v as FilterState['priceRange'] })}
              />
            </FilterGroup>

            <Separator />

            {/* Toggles */}
            <div style={{ display: 'flex', gap: '16px', paddingInline: '20px', alignItems: 'center' }}>
              <ToggleChip
                active={filters.newArrivals}
                onClick={() => onChange({ ...filters, newArrivals: !filters.newArrivals })}
              >
                New Arrivals
              </ToggleChip>
              <ToggleChip
                active={filters.featured}
                onClick={() => onChange({ ...filters, featured: !filters.featured })}
              >
                Featured
              </ToggleChip>
            </div>
          </div>

          {/* Right: result count + clear */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexShrink: 0 }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.6875rem', color: 'var(--color-muted)', whiteSpace: 'nowrap' }}>
              {resultCount} {resultCount === 1 ? 'piece' : 'pieces'}
            </span>
            {activeCount > 0 && (
              <button
                onClick={reset}
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.5625rem',
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: 'var(--color-gold)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  whiteSpace: 'nowrap',
                }}
              >
                Clear ({activeCount})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile filter button ── */}
      <div
        className="filter-bar-mobile"
        style={{
          position: 'sticky',
          top: 'var(--navbar-height)',
          zIndex: 50,
          backgroundColor: 'rgba(248,246,242,0.96)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--color-divider)',
          display: 'none',
        }}
      >
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '52px' }}>
          <button
            onClick={() => setSheetOpen(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              fontFamily: 'var(--font-body)', fontSize: '0.625rem', letterSpacing: '0.16em', textTransform: 'uppercase',
              color: 'var(--color-text)', background: 'none', border: 'none', cursor: 'pointer', padding: 0,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="11" y1="18" x2="13" y2="18" />
            </svg>
            Filter {activeCount > 0 && `(${activeCount})`}
          </button>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.6875rem', color: 'var(--color-muted)' }}>
            {resultCount} pieces
          </span>
        </div>
      </div>

      {/* ── Mobile bottom sheet ── */}
      <AnimatePresence>
        {sheetOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(24,24,24,0.5)', zIndex: 200 }}
              onClick={() => setSheetOpen(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'tween', duration: 0.4, ease: 'easeInOut' }}
              style={{
                position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 201,
                backgroundColor: 'var(--color-bg)',
                borderTop: '1px solid var(--color-divider)',
                padding: '32px 24px 48px',
                maxHeight: '80vh',
                overflowY: 'auto',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-text)' }}>Filter</h3>
                <button onClick={() => setSheetOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-muted)' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* Purity */}
              <div style={{ marginBottom: '28px' }}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.625rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: '12px' }}>Purity</p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {PURITIES.map((p) => (
                    <button
                      key={p}
                      onClick={() => togglePurity(p)}
                      style={{
                        fontFamily: 'var(--font-body)', fontSize: '0.75rem', letterSpacing: '0.1em',
                        padding: '8px 16px',
                        border: `1px solid ${filters.purity.includes(p) ? 'var(--color-gold)' : 'var(--color-divider)'}`,
                        backgroundColor: filters.purity.includes(p) ? 'var(--color-gold)' : 'transparent',
                        color: filters.purity.includes(p) ? '#F8F6F2' : 'var(--color-text)',
                        cursor: 'pointer', transition: 'all 0.25s',
                      }}
                    >{p}</button>
                  ))}
                </div>
              </div>

              {/* Weight */}
              <div style={{ marginBottom: '28px' }}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.625rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: '12px' }}>Weight</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {WEIGHTS.map((w) => (
                    <button
                      key={w.value}
                      onClick={() => onChange({ ...filters, weightBucket: w.value as FilterState['weightBucket'] })}
                      style={{
                        fontFamily: 'var(--font-body)', fontSize: '0.875rem', textAlign: 'left',
                        padding: '10px 0', background: 'none', cursor: 'pointer',
                        borderBottom: `1px solid ${filters.weightBucket === w.value ? 'var(--color-gold)' : 'var(--color-divider)'}`,
                        color: filters.weightBucket === w.value ? 'var(--color-gold)' : 'var(--color-text)',
                        transition: 'all 0.25s',
                      }}
                    >{w.label}</button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div style={{ marginBottom: '28px' }}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.625rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: '12px' }}>Price</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {PRICES.map((p) => (
                    <button
                      key={p.value}
                      onClick={() => onChange({ ...filters, priceRange: p.value as FilterState['priceRange'] })}
                      style={{
                        fontFamily: 'var(--font-body)', fontSize: '0.875rem', textAlign: 'left',
                        padding: '10px 0', background: 'none', cursor: 'pointer',
                        borderBottom: `1px solid ${filters.priceRange === p.value ? 'var(--color-gold)' : 'var(--color-divider)'}`,
                        color: filters.priceRange === p.value ? 'var(--color-gold)' : 'var(--color-text)',
                        transition: 'all 0.25s',
                      }}
                    >{p.label}</button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div style={{ marginBottom: '32px' }}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.625rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: '12px' }}>Show</p>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <ToggleChip active={filters.newArrivals} onClick={() => onChange({ ...filters, newArrivals: !filters.newArrivals })}>New Arrivals</ToggleChip>
                  <ToggleChip active={filters.featured} onClick={() => onChange({ ...filters, featured: !filters.featured })}>Featured</ToggleChip>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => { reset(); setSheetOpen(false); }}
                  style={{ flex: 1, padding: '14px', border: '1px solid var(--color-divider)', background: 'none', fontFamily: 'var(--font-body)', fontSize: '0.6875rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-muted)', cursor: 'pointer' }}
                >
                  Clear All
                </button>
                <button
                  onClick={() => setSheetOpen(false)}
                  style={{ flex: 2, padding: '14px', border: '1px solid var(--color-gold)', backgroundColor: 'var(--color-gold)', fontFamily: 'var(--font-body)', fontSize: '0.6875rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#F8F6F2', cursor: 'pointer' }}
                >
                  View {resultCount} Results
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 900px) {
          .filter-bar-desktop { display: none !important; }
          .filter-bar-mobile { display: block !important; }
        }
      `}</style>
    </>
  );
}

// ── Sub-components ──────────────────────────────────────────────

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '2px', paddingInline: '20px', height: '56px', borderRight: '1px solid var(--color-divider)' }}>
      <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.5rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-muted)' }}>{label}</span>
      {children}
    </div>
  );
}

function Separator() {
  return <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--color-divider)' }} />;
}

function SelectFilter({ options, value, onChange }: { options: { value: string; label: string }[]; value: string; onChange: (v: string) => void; }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        fontFamily: 'var(--font-body)', fontSize: '0.6875rem', letterSpacing: '0.06em',
        color: value === 'all' ? 'var(--color-muted)' : 'var(--color-text)',
        background: 'transparent', border: 'none', outline: 'none', cursor: 'pointer', padding: '2px 4px 2px 0',
        appearance: 'none', WebkitAppearance: 'none',
      }}
    >
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

function ToggleChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: 'var(--font-body)', fontSize: '0.5625rem', letterSpacing: '0.16em', textTransform: 'uppercase',
        padding: '4px 10px',
        border: `1px solid ${active ? 'var(--color-gold)' : 'var(--color-divider)'}`,
        backgroundColor: active ? 'rgba(199,161,90,0.1)' : 'transparent',
        color: active ? 'var(--color-gold)' : 'var(--color-muted)',
        cursor: 'pointer', transition: 'all 0.25s', whiteSpace: 'nowrap',
      }}
    >
      {children}
    </button>
  );
}
