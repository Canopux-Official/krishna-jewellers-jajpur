import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageHeader from '../components/ui/PageHeader';
import StatsCard from '../components/ui/StatsCard';
import StatusBadge from '../components/ui/StatusBadge';
import AdminButton from '../components/ui/AdminButton';
import AddProductModal from '../components/modals/AddProductModal';
import { TableSkeleton, Skeleton } from '../components/ui/LoadingSkeleton';
import { dashboardService } from '../services/dashboard.service';
import { PURITY_LABEL } from '../../admin/utils/purity';

const Icon = {
  box: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" /></svg>,
  folder: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>,
  star: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>,
  image: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>,
  msg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>,
  trending: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /></svg>,
  silver: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="9" /></svg>,
};

const activityTypeColor: Record<string, string> = {
  product: 'var(--color-gold)', rate: 'var(--admin-success)', gallery: 'var(--admin-info)',
  offer: 'var(--admin-warning)', testimonial: '#8B5CF6', category: 'var(--admin-text-3)',
};

export default function AdminDashboard() {
  const [addOpen, setAddOpen] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [recentProducts, setRecentProducts] = useState<any[]>([]);
  const [activity, setActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      dashboardService.getStats(),
      dashboardService.getRecentProducts(),
      dashboardService.getActivity(),
    ]).then(([s, p, a]) => {
      setStats(s); setRecentProducts(p); setActivity(a);
    }).finally(() => setLoading(false));
  }, []);

  const buildStats = () => {
    if (!stats) return [];
    return [
      { label: 'Total Products', value: stats.totalProducts, sub: 'In active catalogue', icon: Icon.box, accentColor: 'var(--color-gold)' },
      { label: 'Categories', value: stats.totalCategories, sub: 'Active categories', icon: Icon.folder, accentColor: '#8B5CF6' },
      { label: 'Featured Products', value: stats.featuredProducts, sub: 'Showing on homepage', icon: Icon.star, accentColor: 'var(--admin-warning)' },
      { label: 'Gallery Images', value: stats.galleryImages, sub: 'In public gallery', icon: Icon.image, accentColor: 'var(--admin-info)' },
      { label: 'Testimonials', value: `${stats.testimonials.approved}/${stats.testimonials.approved + stats.testimonials.pending}`, sub: 'Approved / Total', icon: Icon.msg, accentColor: 'var(--admin-success)' },
      { label: '24K Gold Rate', value: stats.currentRate?.gold24k || '—', sub: 'Per gram', icon: Icon.trending, accentColor: 'var(--color-gold)' },
      { label: 'Silver Rate', value: stats.currentRate?.silver || '—', sub: 'Per gram', icon: Icon.silver, accentColor: 'var(--admin-text-3)' },
    ];
  };

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Welcome back. Here's what's happening."
        actions={
          <AdminButton variant="primary" onClick={() => setAddOpen(true)} icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>}>
            Add Product
          </AdminButton>
        }
      />

      {/* Stats */}
      {loading
        ? <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} style={{ backgroundColor: 'var(--admin-card)', border: '1px solid var(--admin-border)', padding: '24px' }}>
                <Skeleton width="60%" height="12px" style={{ marginBottom: '16px' }} />
                <Skeleton width="40%" height="28px" style={{ marginBottom: '8px' }} />
                <Skeleton width="50%" height="11px" />
              </div>
            ))}
          </div>
        : <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
            {buildStats().map((s, i) => <StatsCard key={s.label} {...s} index={i} />)}
          </div>
      }

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', alignItems: 'start' }} className="admin-dash-grid">
        {/* Recent products */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{ backgroundColor: 'var(--admin-card)', border: '1px solid var(--admin-border)', borderRadius: '10px', overflow: 'hidden' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid var(--admin-border)' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.125rem', fontWeight: 600, color: 'var(--admin-text)' }}>Recent Products</h3>
            <AdminButton variant="ghost" size="sm" onClick={() => navigate('/admin/products')}>View all →</AdminButton>
          </div>
          {loading ? <div style={{ padding: '16px 24px' }}><TableSkeleton rows={5} /></div> : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--admin-border)' }}>
                    {['Product', 'Category', 'Purity', 'Price', 'Status', ''].map((h) => (
                      <th key={h} style={{ padding: '10px 24px', textAlign: 'left', fontFamily: 'var(--font-body)', fontSize: '0.6875rem', fontWeight: 600, color: 'var(--admin-text-2)', letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentProducts.map((p, i) => (
                    <tr key={p.id} style={{ borderBottom: i < recentProducts.length - 1 ? '1px solid var(--admin-border)' : 'none', transition: 'background-color 0.15s' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--admin-bg)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td style={{ padding: '12px 24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          {p.image && <img src={p.image} alt={p.name} style={{ width: '36px', height: '36px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0 }} />}
                          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', fontWeight: 500, color: 'var(--admin-text)', whiteSpace: 'nowrap' }}>{p.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '12px 24px' }}><span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--admin-text-2)', whiteSpace: 'nowrap' }}>{p.category}</span></td>
                      <td style={{ padding: '12px 24px' }}><span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--admin-text)' }}>{PURITY_LABEL[p.purity] || p.purity}</span></td>
                      <td style={{ padding: '12px 24px' }}><span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--admin-text)', whiteSpace: 'nowrap' }}>{p.price ?? '—'}</span></td>
                      <td style={{ padding: '12px 24px' }}>
                        <StatusBadge variant={p.isHidden ? 'hidden' : p.isAvailable ? 'active' : 'pending'} label={p.isHidden ? 'Hidden' : p.isAvailable ? 'Active' : 'Made to Order'} />
                      </td>
                      <td style={{ padding: '12px 24px' }}>
                        <AdminButton variant="ghost" size="sm" onClick={() => navigate('/admin/products')}>Edit</AdminButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Right panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Quick Actions */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}
            style={{ backgroundColor: 'var(--admin-card)', border: '1px solid var(--admin-border)', borderRadius: '10px', padding: '20px 24px' }}
          >
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.125rem', fontWeight: 600, color: 'var(--admin-text)', marginBottom: '16px' }}>Quick Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { label: 'Add New Product', icon: '＋', action: () => setAddOpen(true) },
                { label: 'Update Gold Rates', icon: '↑', action: () => navigate('/admin/rates') },
                { label: 'Add Gallery Images', icon: '⊞', action: () => navigate('/admin/gallery') },
              ].map((a) => (
                <button key={a.label} onClick={a.action} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--admin-border)', backgroundColor: 'transparent', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', width: '100%' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--admin-bg)'; e.currentTarget.style.borderColor = 'var(--color-gold)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = 'var(--admin-border)'; }}
                >
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--color-gold)', width: '20px', textAlign: 'center', flexShrink: 0 }}>{a.icon}</span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--admin-text)' }}>{a.label}</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Activity */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}
            style={{ backgroundColor: 'var(--admin-card)', border: '1px solid var(--admin-border)', borderRadius: '10px', padding: '20px 24px' }}
          >
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.125rem', fontWeight: 600, color: 'var(--admin-text)', marginBottom: '20px' }}>Recent Activity</h3>
            {loading ? <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} height="14px" />)}</div> : (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {activity.length === 0 ? <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--admin-text-3)' }}>No recent activity</p> :
                  activity.map((a: any, i: number) => (
                    <div key={a.id} style={{ display: 'flex', gap: '12px', paddingBottom: i < activity.length - 1 ? '16px' : 0, marginBottom: i < activity.length - 1 ? '16px' : 0, borderBottom: i < activity.length - 1 ? '1px solid var(--admin-border)' : 'none' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: activityTypeColor[a.type] || 'var(--admin-text-3)', flexShrink: 0, marginTop: '5px' }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', fontWeight: 500, color: 'var(--admin-text)', marginBottom: '2px' }}>{a.action}</p>
                        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--admin-text-2)', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.detail}</p>
                        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.6875rem', color: 'var(--admin-text-3)' }}>
                          {new Date(a.createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true })}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <AddProductModal open={addOpen} onClose={() => setAddOpen(false)} />

      <style>{`
        @media (max-width: 1100px) { .admin-dash-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </>
  );
}
