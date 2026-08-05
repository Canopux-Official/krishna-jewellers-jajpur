import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageHeader from '../components/ui/PageHeader';
import StatusBadge from '../components/ui/StatusBadge';
import AdminButton from '../components/ui/AdminButton';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import FormField from '../components/ui/FormField';
import { testimonialsService } from '../services/testimonials.service';

function Stars({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      {Array.from({ length: max }).map((_, i) => (
        <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill={i < rating ? '#C7A15A' : 'none'} stroke="#C7A15A" strokeWidth="1.5">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [editTarget, setEditTarget] = useState<any | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [newForm, setNewForm] = useState({ name: '', city: '', quote: '', rating: '5' });

  const fetchTestimonials = () => {
    testimonialsService.getAll().then(setTestimonials);
  };

  useEffect(() => { fetchTestimonials(); }, []);

  const toggleApproved = async (id: string) => {
    await testimonialsService.toggleApproved(id);
    fetchTestimonials();
  };
  const handleDelete = async () => { if (!deleteTarget) return; await testimonialsService.delete(deleteTarget.id); setDeleteTarget(null); fetchTestimonials(); };

  const handleAdd = async () => {
    if (!newForm.name || !newForm.quote) return;
    await testimonialsService.create({ ...newForm, rating: parseInt(newForm.rating) });
    setNewForm({ name: '', city: '', quote: '', rating: '5' }); setAddOpen(false); fetchTestimonials();
  };

  const handleEdit = async () => {
    if (!editTarget) return;
    await testimonialsService.update(editTarget.id, { name: editTarget.name, city: editTarget.city, quote: editTarget.quote, rating: editTarget.rating });
    setEditTarget(null); fetchTestimonials();
  };

  return (
    <>
      <PageHeader
        title="Testimonials"
        subtitle={`${testimonials.filter(t => t.isApproved).length} approved · ${testimonials.filter(t => !t.isApproved).length} pending review`}
        actions={
          <AdminButton variant="primary" onClick={() => setAddOpen(true)}
            icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>}
          >
            Add Testimonial
          </AdminButton>
        }
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <AnimatePresence>
          {testimonials.map((t, i) => (
            <motion.div key={t.id}
              initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              style={{ backgroundColor: 'var(--admin-card)', border: '1px solid var(--admin-border)', borderRadius: '10px', padding: '20px 24px', display: 'flex', gap: '20px', alignItems: 'flex-start' }}
            >
              {/* Avatar */}
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'var(--color-gold)', opacity: 0.15 + (i * 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid rgba(199,161,90,0.3)' }}>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', fontWeight: 600, color: 'var(--color-gold)' }}>
                  {t.name.charAt(0)}
                </span>
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9375rem', fontWeight: 600, color: 'var(--admin-text)' }}>{t.name}</p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--admin-text-3)' }}>{t.city}</p>
                  <Stars rating={t.rating} />
                </div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--admin-text-2)', lineHeight: 1.6, fontStyle: 'italic', marginBottom: '12px' }}>"{t.quote}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.6875rem', color: 'var(--admin-text-3)' }}>Added {t.createdAt}</p>
                  <StatusBadge variant={t.isApproved ? 'approved' : 'pending'} />
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0 }}>
                <button
                  onClick={() => toggleApproved(t.id)}
                  style={{ padding: '6px 12px', borderRadius: '6px', border: `1px solid ${t.isApproved ? 'var(--admin-border)' : 'var(--admin-success)'}`, backgroundColor: t.isApproved ? 'transparent' : 'rgba(22,163,74,0.08)', fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: t.isApproved ? 'var(--admin-text-2)' : 'var(--admin-success)', cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
                >
                  {t.isApproved ? 'Unapprove' : 'Approve'}
                </button>
                <AdminButton variant="secondary" size="sm" onClick={() => setEditTarget({ ...t })}>Edit</AdminButton>
                <AdminButton variant="danger" size="sm" onClick={() => setDeleteTarget(t)}>Delete</AdminButton>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add modal */}
      <AnimatePresence>
        {addOpen && (
          <TestimonialModal title="Add Testimonial" form={newForm} setForm={(k, v) => setNewForm((f) => ({ ...f, [k]: v }))} onClose={() => setAddOpen(false)} onSave={handleAdd} />
        )}
      </AnimatePresence>

      {/* Edit modal */}
      <AnimatePresence>
        {editTarget && (
          <TestimonialModal
            title="Edit Testimonial"
            form={{ name: editTarget.name, city: editTarget.city, quote: editTarget.quote, rating: String(editTarget.rating) }}
            setForm={(k, v) => setEditTarget((t: any) => t ? { ...t, [k]: k === 'rating' ? parseInt(v) : v } : t)}
            onClose={() => setEditTarget(null)}
            onSave={handleEdit}
          />
        )}
      </AnimatePresence>

      <ConfirmDialog open={!!deleteTarget} title={`Delete "${deleteTarget?.name}"'s review?`} description="This testimonial will be permanently removed." onConfirm={handleDelete} onClose={() => setDeleteTarget(null)} confirmLabel="Delete" isDangerous />
    </>
  );
}

function TestimonialModal({ title, form, setForm, onClose, onSave }: { title: string; form: Record<string, string>; setForm: (k: string, v: string) => void; onClose: () => void; onSave: () => void }) {
  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, zIndex: 400, backgroundColor: 'rgba(14,14,13,0.5)', backdropFilter: 'blur(4px)' }} onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.96, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.25 }}
        style={{ position: 'fixed', inset: 0, zIndex: 401, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', pointerEvents: 'none' }}
      >
        <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: 'var(--admin-card)', border: '1px solid var(--admin-border)', borderRadius: '12px', padding: '28px', maxWidth: '480px', width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', pointerEvents: 'all' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--admin-text)', marginBottom: '20px' }}>{title}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <FormField label="Customer Name" required value={form.name} onChange={(e) => setForm('name', e.target.value)} />
              <FormField label="City" value={form.city} onChange={(e) => setForm('city', e.target.value)} />
            </div>
            <FormField as="textarea" label="Review" required rows={4} value={form.quote} onChange={(e) => setForm('quote', e.target.value)} />
            <FormField as="select" label="Rating" value={form.rating} onChange={(e) => setForm('rating', e.target.value)}
              options={[5,4,3,2,1].map((n) => ({ value: String(n), label: '★'.repeat(n) + ' — ' + n + ' star' + (n > 1 ? 's' : '') }))}
            />
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <AdminButton variant="secondary" onClick={onClose}>Cancel</AdminButton>
            <AdminButton variant="primary" onClick={onSave}>Save</AdminButton>
          </div>
        </div>
      </motion.div>
    </>
  );
}
