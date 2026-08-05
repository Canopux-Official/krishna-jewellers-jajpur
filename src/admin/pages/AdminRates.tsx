import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PageHeader from '../components/ui/PageHeader';
import AdminButton from '../components/ui/AdminButton';
import { Skeleton } from '../components/ui/LoadingSkeleton';
import { ratesService, type GoldRates } from '../services/rates.service';
import { useToast } from '../context/ToastContext';

interface RateCard { key: keyof Omit<GoldRates, 'id' | 'lastUpdated'>; label: string; sublabel: string; color: string; }

const RATE_CARDS: RateCard[] = [
  { key: 'gold24k', label: '24K Gold', sublabel: 'Fine gold · 999 purity', color: '#C7A15A' },
  { key: 'gold22k', label: '22K Gold', sublabel: 'Jewellery gold · 916 purity', color: '#D4A853' },
  { key: 'gold18k', label: '18K Gold', sublabel: 'Mixed gold · 750 purity', color: '#E8BC6A' },
  { key: 'silver', label: 'Silver', sublabel: 'Fine silver · 999 purity', color: '#A8A8B0' },
];

export default function AdminRates() {
  const toast = useToast();
  const [rates, setRates] = useState<GoldRates>({ gold24k: 0, gold22k: 0, gold18k: 0, silver: 0 });
  const [saved, setSaved] = useState<GoldRates>({ gold24k: 0, gold22k: 0, gold18k: 0, silver: 0 });
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    ratesService.getCurrent().then((r) => {
      const data = { gold24k: r.gold24k, gold22k: r.gold22k, gold18k: r.gold18k, silver: r.silver };
      setRates(data); setSaved(data);
      if (r.lastUpdated) setLastUpdated(new Date(r.lastUpdated).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true }));
    }).finally(() => setLoading(false));
  }, []);

  const isDirty = JSON.stringify(rates) !== JSON.stringify(saved);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await ratesService.update(rates);
      setSaved({ gold24k: updated.gold24k, gold22k: updated.gold22k, gold18k: updated.gold18k, silver: updated.silver });
      if (updated.lastUpdated) setLastUpdated(new Date(updated.lastUpdated).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true }));
      toast.success('Rates saved');
    } catch {
      toast.error('Failed to save rates');
    } finally { setSaving(false); }
  };

  return (
    <>
      <PageHeader
        title="Gold & Silver Rates"
        subtitle="Set the daily metal rates shown on the public website."
        actions={
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <AdminButton variant="secondary" onClick={() => setRates(saved)} disabled={!isDirty || saving}>Reset</AdminButton>
            <AdminButton variant="primary" onClick={handleSave} disabled={!isDirty || saving}>
              {saving ? 'Saving…' : 'Save Rates'}
            </AdminButton>
          </div>
        }
      />

      {lastUpdated && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '28px', padding: '12px 16px', backgroundColor: 'rgba(199,161,90,0.06)', border: '1px solid rgba(199,161,90,0.2)', borderRadius: '8px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--admin-text-2)' }}>
            Last updated: <strong style={{ color: 'var(--admin-text)' }}>{lastUpdated}</strong>
          </p>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        {RATE_CARDS.map((card, i) => (
          <motion.div key={card.key} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.07 }}
            style={{ backgroundColor: 'var(--admin-card)', border: '1px solid var(--admin-border)', borderRadius: '12px', padding: '24px', position: 'relative', overflow: 'hidden' }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', backgroundColor: card.color }} />
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--admin-text-2)', marginBottom: '6px' }}>{card.label}</p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--admin-text-3)', marginBottom: '16px' }}>{card.sublabel}</p>

            {loading ? <Skeleton height="44px" style={{ marginBottom: '12px' }} /> : (
              <>
                <div style={{ display: 'flex', border: '1px solid var(--admin-border)', borderRadius: '8px', overflow: 'hidden', backgroundColor: 'var(--admin-bg)', transition: 'border-color 0.2s' }}
                  onFocusCapture={(e) => e.currentTarget.style.borderColor = card.color}
                  onBlurCapture={(e) => e.currentTarget.style.borderColor = 'var(--admin-border)'}
                >
                  <span style={{ padding: '10px 12px', fontFamily: 'var(--font-body)', fontSize: '0.9375rem', fontWeight: 500, color: card.color, backgroundColor: 'var(--admin-card)', borderRight: '1px solid var(--admin-border)', flexShrink: 0 }}>₹</span>
                  <input type="number" value={rates[card.key]} onChange={(e) => setRates((r) => ({ ...r, [card.key]: parseFloat(e.target.value) || 0 }))}
                    style={{ flex: 1, padding: '10px 14px', fontFamily: 'var(--font-body)', fontSize: '1.125rem', fontWeight: 600, color: 'var(--admin-text)', border: 'none', outline: 'none', backgroundColor: 'var(--admin-card)', width: '100%' }}
                  />
                  <span style={{ padding: '10px 12px', fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--admin-text-3)', backgroundColor: 'var(--admin-card)', borderLeft: '1px solid var(--admin-border)', flexShrink: 0 }}>/g</span>
                </div>
                <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 600, color: card.color, marginTop: '12px' }}>
                  ₹{Number(rates[card.key]).toLocaleString('en-IN')}
                </p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--admin-text-3)' }}>per gram</p>
              </>
            )}
          </motion.div>
        ))}
      </div>

      <div style={{ padding: '16px 20px', backgroundColor: 'var(--admin-card)', border: '1px solid var(--admin-border)', borderRadius: '10px' }}>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--admin-text-2)', lineHeight: 1.6 }}>
          <strong style={{ color: 'var(--admin-text)' }}>Note:</strong> These rates are displayed in the "Today's Rates" section on the public homepage. Update them daily to reflect the current market price.
        </p>
      </div>
    </>
  );
}
