import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageHeader from '../components/ui/PageHeader';
import StatusBadge from '../components/ui/StatusBadge';
import AdminButton from '../components/ui/AdminButton';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import FormField from '../components/ui/FormField';
import { Skeleton } from '../components/ui/LoadingSkeleton';
import { categoriesService } from '../services/categories.service';

export default function AdminCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editTarget, setEditTarget] = useState<any | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [_saving, setSaving] = useState(false);

  const fetchCategories = () => {
    setLoading(true);
    categoriesService.getAll().then(setCategories).finally(() => setLoading(false));
  };

  useEffect(() => { fetchCategories(); }, []);

  const toggleActive = async (id: string, current: boolean) => {
    await categoriesService.update(id, { isActive: !current });
    fetchCategories();
  };

  const handleAdd = async () => {
    if (!newName.trim()) return;
    setSaving(true);
    await categoriesService.create({ name: newName.trim() });
    setNewName(''); setAddOpen(false); fetchCategories();
    setSaving(false);
  };

  const handleEdit = async () => {
    if (!editTarget) return;
    setSaving(true);
    await categoriesService.update(editTarget.id, { name: editTarget.name });
    setEditTarget(null); fetchCategories();
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await categoriesService.delete(deleteTarget.id);
    setDeleteTarget(null); fetchCategories();
  };

  return (
    <>
      <PageHeader
        title="Categories"
        subtitle={`${categories.length} categories · ${categories.filter(c => c.isActive).length} active`}
        actions={
          <AdminButton variant="primary" onClick={() => setAddOpen(true)}
            icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>}
          >
            Add Category
          </AdminButton>
        }
      />

      {/* Category grid */}
      {loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {Array.from({ length: 6 }).map((_, i) => <div key={i} style={{ backgroundColor: 'var(--admin-card)', border: '1px solid var(--admin-border)', borderRadius: '10px', padding: '20px', height: '100px' }}><Skeleton height="14px" style={{ marginBottom: '10px' }} /><Skeleton width="60%" height="11px" /></div>)}
        </div>
      )}
      {!loading && <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
        <AnimatePresence>
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              style={{ backgroundColor: 'var(--admin-card)', border: '1px solid var(--admin-border)', borderRadius: '10px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-gold)' }} />
                    <h3 style={{ fontFamily: 'var(--font-body)', fontSize: '0.9375rem', fontWeight: 600, color: 'var(--admin-text)' }}>{cat.name}</h3>
                  </div>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--admin-text-2)' }}>{cat.productCount} products · slug: /{cat.slug}</p>
                </div>
                <button
                  onClick={() => toggleActive(cat.id, cat.isActive)}
                  style={{ width: '36px', height: '20px', borderRadius: '100px', border: 'none', cursor: 'pointer', padding: '2px', backgroundColor: cat.isActive ? 'var(--color-gold)' : 'var(--admin-border)', transition: 'background-color 0.25s', display: 'flex', alignItems: 'center', flexShrink: 0 }}
                >
                  <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#fff', transform: cat.isActive ? 'translateX(16px)' : 'translateX(0)', transition: 'transform 0.25s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <StatusBadge variant={cat.isActive ? 'active' : 'inactive'} />
                <div style={{ display: 'flex', gap: '6px' }}>
                  <AdminButton variant="secondary" size="sm" onClick={() => setEditTarget({ ...cat })}
                    icon={<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>}
                  >Edit</AdminButton>
                  <AdminButton variant="danger" size="sm" onClick={() => setDeleteTarget(cat)}
                    icon={<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /></svg>}
                  >Delete</AdminButton>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>}


      {/* Add modal */}
      <AnimatePresence>
        {addOpen && (
          <SimpleModal title="Add Category" onClose={() => setAddOpen(false)} onSave={handleAdd} saveLabel="Add">
            <FormField label="Category Name" required placeholder="e.g. Diamond Rings" value={newName} onChange={(e) => setNewName(e.target.value)} />
          </SimpleModal>
        )}
      </AnimatePresence>

      {/* Edit modal */}
      <AnimatePresence>
        {editTarget && (
          <SimpleModal title="Edit Category" onClose={() => setEditTarget(null)} onSave={handleEdit}>
            <FormField label="Category Name" required value={editTarget.name} onChange={(e) => setEditTarget({ ...editTarget, name: e.target.value })} />
          </SimpleModal>
        )}
      </AnimatePresence>

      <ConfirmDialog
        open={!!deleteTarget}
        title={`Delete "${deleteTarget?.name}"?`}
        description="This will permanently remove the category. Products in this category will not be deleted."
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
        confirmLabel="Delete"
        isDangerous
      />
    </>
  );
}

function SimpleModal({ title, onClose, onSave, saveLabel = 'Save', children }: { title: string; onClose: () => void; onSave: () => void; saveLabel?: string; children: React.ReactNode }) {
  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, zIndex: 400, backgroundColor: 'rgba(14,14,13,0.5)', backdropFilter: 'blur(4px)' }} onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.96, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.25 }}
        style={{ position: 'fixed', inset: 0, zIndex: 401, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', pointerEvents: 'none' }}
      >
        <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: 'var(--admin-card)', border: '1px solid var(--admin-border)', borderRadius: '12px', padding: '28px', maxWidth: '420px', width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', pointerEvents: 'all' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--admin-text)', marginBottom: '20px' }}>{title}</h3>
          <div style={{ marginBottom: '24px' }}>{children}</div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <AdminButton variant="secondary" onClick={onClose}>Cancel</AdminButton>
            <AdminButton variant="primary" onClick={onSave}>{saveLabel}</AdminButton>
          </div>
        </div>
      </motion.div>
    </>
  );
}
