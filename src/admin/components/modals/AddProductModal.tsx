import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FormField from '../ui/FormField';
import ImageUploader from '../ui/ImageUploader';
import AdminButton from '../ui/AdminButton';
import { productsService } from '../../services/products.service';
import { categoriesService } from '../../services/categories.service';
import { PURITY_TO_DB } from '../../utils/purity';

interface AddProductModalProps {
  open: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

const PURITIES = ['24K', '22K', '18K', '14K'];
const MAKING_STYLES = ['Hand-crafted', 'Die-struck', 'Machine-woven', 'Lost-wax casting', 'Kundan setting', 'Temple work', 'Minted'];

type StockStatus = 'in_stock' | 'made_to_order' | 'sold_out';

export default function AddProductModal({ open, onClose, onSaved }: AddProductModalProps) {
  const [form, setForm] = useState({
    name: '',
    categoryId: '',
    purity: '22K',
    weight: '',
    weightGrams: '',
    price: '',
    description: '',
    makingStyle: '',
    isNewArrival: false,
    stockStatus: 'in_stock' as StockStatus,
  });
  const [images, setImages] = useState<File[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) categoriesService.getAll().then(setCategories);
  }, [open]);

  const set = (key: string, val: string | boolean) => setForm((f) => ({ ...f, [key]: val }));

  const resetForm = () => {
    setForm({
      name: '',
      categoryId: '',
      purity: '22K',
      weight: '',
      weightGrams: '',
      price: '',
      description: '',
      makingStyle: '',
      isNewArrival: false,
      stockStatus: 'in_stock',
    });
    setImages([]);
  };

  const handleSave = async () => {
    setError('');
    if (!form.name || !form.categoryId || !form.weight || !form.description) {
      setError('Please fill in all required fields.');
      return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('categoryId', form.categoryId);
      fd.append('purity', PURITY_TO_DB[form.purity] || form.purity);
      fd.append('weight', form.weight);
      fd.append('weightGrams', String(parseFloat(form.weight) || 0));
      if (form.price) fd.append('price', form.price);
      fd.append('description', form.description);
      if (form.makingStyle) fd.append('makingStyle', form.makingStyle);

      // Single stock field — avoids FormData boolean coercion bugs
      fd.append('stockStatus', form.stockStatus);

      // Only send highlight flags when ON
      if (form.isNewArrival) fd.append('isNewArrival', '1');

      images.forEach((f) => fd.append('images', f));
      await productsService.create(fd);
      onSaved?.();
      onClose();
      resetForm();
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      setError(Array.isArray(msg) ? msg[0] : msg || 'Failed to save product.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ position: 'fixed', inset: 0, zIndex: 400, backgroundColor: 'rgba(14,14,13,0.6)', backdropFilter: 'blur(6px)' }}
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 401,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
              pointerEvents: 'none',
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: 'var(--admin-card)',
                border: '1px solid var(--admin-border)',
                borderRadius: '14px',
                width: '100%',
                maxWidth: '900px',
                maxHeight: '90vh',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 32px 80px rgba(0,0,0,0.2)',
                pointerEvents: 'all',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 28px', borderBottom: '1px solid var(--admin-border)', flexShrink: 0 }}>
                <div>
                  <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.375rem', fontWeight: 600, color: 'var(--admin-text)', marginBottom: '2px' }}>Add New Product</h2>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--admin-text-2)' }}>Fill in the details to add a new jewellery piece to the catalogue.</p>
                </div>
                <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--admin-text-2)', padding: '6px' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', overflow: 'hidden', flex: 1, minHeight: 0 }}>
                <div style={{ padding: '28px', borderRight: '1px solid var(--admin-border)', overflowY: 'auto' }}>
                  <ImageUploader label="Product Images" maxFiles={10} onFilesChange={setImages} />
                </div>

                <div style={{ padding: '28px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  {error && (
                    <div style={{ padding: '10px 14px', backgroundColor: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: '8px', fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--admin-danger)' }}>
                      {error}
                    </div>
                  )}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <FormField label="Product Name" required placeholder="e.g. Classic Jhumka Earrings" value={form.name} onChange={(e) => set('name', e.target.value)} />
                    </div>
                    <FormField
                      as="select"
                      label="Category"
                      required
                      value={form.categoryId}
                      onChange={(e) => set('categoryId', e.target.value)}
                      options={[{ value: '', label: 'Select category' }, ...categories.map((c: any) => ({ value: c.id, label: c.name }))]}
                    />
                    <FormField
                      as="select"
                      label="Purity"
                      required
                      value={form.purity}
                      onChange={(e) => set('purity', e.target.value)}
                      options={PURITIES.map((p) => ({ value: p, label: p }))}
                    />
                    <FormField label="Weight" required placeholder="e.g. 4.2g" value={form.weight} onChange={(e) => set('weight', e.target.value)} />
                    <FormField label="Price" placeholder="e.g. ₹28,566" value={form.price} onChange={(e) => set('price', e.target.value)} />
                    <FormField
                      as="select"
                      label="Making Style"
                      value={form.makingStyle}
                      onChange={(e) => set('makingStyle', e.target.value)}
                      options={[{ value: '', label: 'Select style' }, ...MAKING_STYLES.map((s) => ({ value: s, label: s }))]}
                    />
                    <FormField
                      as="select"
                      label="Stock Status"
                      required
                      value={form.stockStatus}
                      onChange={(e) => set('stockStatus', e.target.value)}
                      options={[
                        { value: 'in_stock', label: 'In Stock' },
                        { value: 'made_to_order', label: 'Made to Order' },
                        { value: 'sold_out', label: 'Sold Out' },
                      ]}
                    />
                  </div>

                  <FormField as="textarea" label="Description" rows={4} placeholder="Describe this piece..." value={form.description} onChange={(e) => set('description', e.target.value)} />

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <Toggle
                      label="New Arrival"
                      hint="Mark with a New Arrival badge on the website"
                      value={form.isNewArrival}
                      onChange={(v) => set('isNewArrival', v)}
                    />
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--admin-text-2)', lineHeight: 1.5 }}>
                      Products are published to the website as soon as you save. To hide one later, use the eye icon in the Products list.
                    </p>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', padding: '16px 28px', borderTop: '1px solid var(--admin-border)', backgroundColor: 'var(--admin-bg)', flexShrink: 0 }}>
                <AdminButton variant="secondary" onClick={onClose} disabled={saving}>
                  Cancel
                </AdminButton>
                <AdminButton variant="primary" onClick={handleSave} disabled={saving}>
                  {saving ? 'Saving…' : 'Save Product'}
                </AdminButton>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function Toggle({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div style={{ maxWidth: '200px' }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 500, color: 'var(--admin-text-2)', marginBottom: '8px' }}>{label}</p>
      <button
        type="button"
        onClick={() => onChange(!value)}
        role="switch"
        aria-checked={value}
        style={{
          width: '44px',
          height: '24px',
          borderRadius: '100px',
          border: 'none',
          cursor: 'pointer',
          padding: '2px',
          backgroundColor: value ? 'var(--color-gold)' : 'var(--admin-border)',
          transition: 'background-color 0.25s',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            backgroundColor: '#fff',
            transform: value ? 'translateX(20px)' : 'translateX(0)',
            transition: 'transform 0.25s',
            boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
          }}
        />
      </button>
      {hint && (
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.6875rem', color: 'var(--admin-text-3)', marginTop: '8px', lineHeight: 1.4 }}>
          {hint}
        </p>
      )}
    </div>
  );
}
