import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageHeader from '../components/ui/PageHeader';
import AdminButton from '../components/ui/AdminButton';
import FormField from '../components/ui/FormField';
import EmptyState from '../components/ui/EmptyState';
import { productsService } from '../services/products.service';
import { categoriesService } from '../services/categories.service';
import { PURITY_TO_DB } from '../utils/purity';
import { useToast } from '../context/ToastContext';

const PURITIES = ['24K', '22K', '18K', '14K'];
const STOCK_OPTIONS = [
  { value: 'in_stock', label: 'In Stock' },
  { value: 'made_to_order', label: 'Made to Order' },
  { value: 'sold_out', label: 'Sold Out' },
];
const CONCURRENCY = 3;
const MAX_IMAGES_PER_ROW = 8;

type StockStatus = 'in_stock' | 'made_to_order' | 'sold_out';
type RowStatus = 'idle' | 'uploading' | 'success' | 'error';

interface BulkRow {
  id: string;
  images: File[];
  previews: string[];
  name: string;
  weight: string;
  status: RowStatus;
  error?: string;
}

const STATUS_STYLE: Record<RowStatus, { bg: string; color: string; label: string }> = {
  idle: { bg: 'var(--admin-bg)', color: 'var(--admin-text-2)', label: 'Draft' },
  uploading: { bg: 'rgba(199,161,90,0.12)', color: '#C7A15A', label: 'Uploading…' },
  success: { bg: 'rgba(22,163,74,0.1)', color: '#16A34A', label: 'Uploaded' },
  error: { bg: 'rgba(220,38,38,0.08)', color: '#DC2626', label: 'Failed' },
};

function humanizeFilename(filename: string): string {
  const base = filename.replace(/\.[^/.]+$/, '');
  const cleaned = base.replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim();
  if (!cleaned) return '';
  return cleaned.replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function AdminBulkUpload() {
  const toast = useToast();
  const [categories, setCategories] = useState<any[]>([]);
  const [categoryId, setCategoryId] = useState('');
  const [purity, setPurity] = useState('22K');
  const [stockStatus, setStockStatus] = useState<StockStatus>('in_stock');
  const [rows, setRows] = useState<BulkRow[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [banner, setBanner] = useState('');
  const [dragging, setDragging] = useState(false);
  const counterRef = useRef(0);
  const dropInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    categoriesService.getAll().then(setCategories);
  }, []);

  const nextId = () => {
    counterRef.current += 1;
    return `row-${counterRef.current}-${Date.now()}`;
  };

  const handleDroppedFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const imageFiles = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (imageFiles.length === 0) return;
    const newRows: BulkRow[] = imageFiles.map((file) => ({
      id: nextId(),
      images: [file],
      previews: [URL.createObjectURL(file)],
      name: humanizeFilename(file.name),
      weight: '',
      status: 'idle',
    }));
    setRows((r) => [...r, ...newRows]);
    setBanner('');
  };

  const addImagesToRow = (id: string, files: FileList | null) => {
    if (!files || files.length === 0) return;
    const imageFiles = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (imageFiles.length === 0) return;
    setRows((r) =>
      r.map((row) => {
        if (row.id !== id) return row;
        const room = Math.max(0, MAX_IMAGES_PER_ROW - row.images.length);
        const toAdd = imageFiles.slice(0, room);
        return {
          ...row,
          images: [...row.images, ...toAdd],
          previews: [...row.previews, ...toAdd.map((f) => URL.createObjectURL(f))],
        };
      }),
    );
  };

  const removeImageFromRow = (id: string, imgIdx: number) => {
    setRows((r) =>
      r.map((row) => {
        if (row.id !== id) return row;
        return {
          ...row,
          images: row.images.filter((_, i) => i !== imgIdx),
          previews: row.previews.filter((_, i) => i !== imgIdx),
        };
      }),
    );
  };

  const removeRow = (id: string) => setRows((r) => r.filter((row) => row.id !== id));

  const updateRow = (id: string, patch: Partial<BulkRow>) =>
    setRows((r) => r.map((row) => (row.id === id ? { ...row, ...patch } : row)));

  const clearAll = () => {
    if (rows.length > 0 && !window.confirm('Remove all rows from this batch?')) return;
    setRows([]);
    setBanner('');
  };

  const clearSuccessful = () => setRows((r) => r.filter((row) => row.status !== 'success'));

  const buildFormData = (row: BulkRow, effectiveName: string) => {
    const fd = new FormData();
    fd.append('name', effectiveName);
    fd.append('categoryId', categoryId);
    fd.append('purity', PURITY_TO_DB[purity] || purity);
    fd.append('weight', row.weight.trim());
    fd.append('weightGrams', String(parseFloat(row.weight) || 0));
    fd.append('stockStatus', stockStatus);
    row.images.forEach((f) => fd.append('images', f));
    return fd;
  };

  const handleUploadAll = async () => {
    setBanner('');
    if (!categoryId) {
      setBanner('Please select a category for this batch.');
      return;
    }
    const pending = rows.filter((r) => r.status !== 'success');
    if (pending.length === 0) {
      setBanner(rows.length === 0 ? 'Drop some product photos to get started.' : 'Everything in this batch is already uploaded.');
      return;
    }

    // Name is optional — unnamed rows get an auto-generated placeholder that can be renamed later.
    const categoryName = categories.find((c: any) => c.id === categoryId)?.name || 'Product';
    let blankCounter = 0;
    const queueItems = pending.map((row) => ({
      row,
      effectiveName: row.name.trim() || `${categoryName} ${++blankCounter}`,
    }));

    setSubmitting(true);
    const queue = [...queueItems];
    let successCount = 0;
    let failCount = 0;

    const worker = async () => {
      while (queue.length) {
        const item = queue.shift();
        if (!item) return;
        const { row, effectiveName } = item;
        updateRow(row.id, { status: 'uploading', error: undefined });
        try {
          await productsService.create(buildFormData(row, effectiveName));
          successCount += 1;
          updateRow(row.id, { status: 'success', name: effectiveName });
        } catch (err: any) {
          failCount += 1;
          const msg = err?.response?.data?.message;
          updateRow(row.id, { status: 'error', error: Array.isArray(msg) ? msg[0] : msg || 'Upload failed.' });
        }
      }
    };

    await Promise.all(Array.from({ length: Math.min(CONCURRENCY, pending.length) }, worker));
    setSubmitting(false);

    if (failCount === 0) {
      toast.success(`${successCount} product${successCount === 1 ? '' : 's'} uploaded successfully.`);
    } else if (successCount === 0) {
      toast.error(`Upload failed for all ${failCount} product${failCount === 1 ? '' : 's'}.`);
    } else {
      toast.info(`${successCount} uploaded, ${failCount} failed — fix and retry the highlighted rows.`);
    }
  };

  const pendingCount = rows.filter((r) => r.status !== 'success').length;
  const successCount = rows.filter((r) => r.status === 'success').length;

  return (
    <>
      <PageHeader
        title="Bulk Upload Products"
        subtitle="Drop in product photos, name each one, and upload the whole batch to a category at once."
      />

      {/* Batch settings */}
      <div
        style={{
          backgroundColor: 'var(--admin-card)',
          border: '1px solid var(--admin-border)',
          borderRadius: '10px',
          padding: '20px 24px',
          marginBottom: '20px',
        }}
      >
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--admin-text-2)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '14px' }}>
          Batch Settings
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
          <FormField
            as="select"
            label="Category"
            required
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            options={[{ value: '', label: 'Select category' }, ...categories.map((c: any) => ({ value: c.id, label: c.name }))]}
          />
          <FormField
            as="select"
            label="Purity"
            value={purity}
            onChange={(e) => setPurity(e.target.value)}
            options={PURITIES.map((p) => ({ value: p, label: p }))}
          />
          <FormField
            as="select"
            label="Stock Status"
            value={stockStatus}
            onChange={(e) => setStockStatus(e.target.value as StockStatus)}
            options={STOCK_OPTIONS}
          />
        </div>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--admin-text-3)', marginTop: '12px', lineHeight: 1.5 }}>
          These apply to every product in this batch. Naming each photo below is optional — unnamed products get an auto-generated name, and everything (name, price, description, and more) can be edited later from the Products list.
        </p>
      </div>

      {/* Bulk drop zone */}
      <motion.div
        animate={{ borderColor: dragging ? 'var(--color-gold)' : 'var(--admin-border)', backgroundColor: dragging ? 'rgba(199,161,90,0.04)' : 'var(--admin-card)' }}
        transition={{ duration: 0.2 }}
        style={{ border: '2px dashed var(--admin-border)', borderRadius: '10px', padding: '32px 24px', textAlign: 'center', cursor: 'pointer', marginBottom: '20px' }}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleDroppedFiles(e.dataTransfer.files); }}
        onClick={() => dropInputRef.current?.click()}
      >
        <input ref={dropInputRef} type="file" accept="image/*" multiple hidden onChange={(e) => { handleDroppedFiles(e.target.files); e.target.value = ''; }} />
        <div style={{ color: 'var(--admin-text-3)', marginBottom: '10px' }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
        </div>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9375rem', fontWeight: 500, color: 'var(--admin-text)', marginBottom: '4px' }}>
          Drag & drop product photos here
        </p>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--admin-text-3)' }}>
          or click to browse · select as many as you like · one row is created per photo
        </p>
      </motion.div>

      {banner && (
        <div style={{ padding: '10px 14px', backgroundColor: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: '8px', fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--admin-danger)', marginBottom: '16px' }}>
          {banner}
        </div>
      )}

      {rows.length === 0 ? (
        <div style={{ backgroundColor: 'var(--admin-card)', border: '1px solid var(--admin-border)', borderRadius: '10px' }}>
          <EmptyState
            title="No products yet"
            description="Drop product photos above — each photo becomes a row where you just type a name (and optionally a weight)."
            icon={<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>}
          />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--admin-text-3)', margin: '0 2px 4px' }}>
            {rows.length} product{rows.length === 1 ? '' : 's'} in this batch
          </p>
          <AnimatePresence initial={false}>
            {rows.map((row) => (
              <BulkRowCard
                key={row.id}
                row={row}
                onNameChange={(v) => updateRow(row.id, { name: v })}
                onWeightChange={(v) => updateRow(row.id, { weight: v })}
                onAddImages={(files) => addImagesToRow(row.id, files)}
                onRemoveImage={(idx) => removeImageFromRow(row.id, idx)}
                onRemove={() => removeRow(row.id)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Sticky footer summary */}
      {rows.length > 0 && (
        <div
          style={{
            position: 'sticky',
            bottom: '16px',
            backgroundColor: 'var(--admin-card)',
            border: '1px solid var(--admin-border)',
            borderRadius: '10px',
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            flexWrap: 'wrap',
            boxShadow: '0 -8px 24px rgba(0,0,0,0.06)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--admin-text-2)' }}>
              {rows.length} row{rows.length === 1 ? '' : 's'} · {successCount} uploaded{pendingCount > 0 ? ` · ${pendingCount} pending` : ''}
            </span>
            {successCount > 0 && (
              <AdminButton variant="ghost" size="sm" onClick={clearSuccessful}>Clear uploaded</AdminButton>
            )}
            <AdminButton variant="ghost" size="sm" onClick={clearAll}>Clear all</AdminButton>
          </div>
          <AdminButton variant="primary" onClick={handleUploadAll} disabled={submitting || pendingCount === 0}>
            {submitting ? 'Uploading…' : `Upload All${pendingCount > 0 ? ` (${pendingCount})` : ''}`}
          </AdminButton>
        </div>
      )}
    </>
  );
}

function BulkRowCard({
  row,
  onNameChange,
  onWeightChange,
  onAddImages,
  onRemoveImage,
  onRemove,
}: {
  row: BulkRow;
  onNameChange: (v: string) => void;
  onWeightChange: (v: string) => void;
  onAddImages: (files: FileList | null) => void;
  onRemoveImage: (idx: number) => void;
  onRemove: () => void;
}) {
  const isBusy = row.status === 'uploading';
  const isDone = row.status === 'success';
  const statusStyle = STATUS_STYLE[row.status];
  const addInputRef = useRef<HTMLInputElement>(null);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8, height: 0 }}
      transition={{ duration: 0.2 }}
      style={{
        backgroundColor: 'var(--admin-card)',
        border: `1px solid ${row.status === 'error' ? 'rgba(220,38,38,0.3)' : 'var(--admin-border)'}`,
        borderRadius: '10px',
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flexWrap: 'wrap',
        opacity: isDone ? 0.75 : 1,
      }}
    >
      {/* Thumbnails */}
      <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
        {row.previews.map((src, i) => (
          <div key={i} style={{ position: 'relative', width: '52px', height: '52px', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--admin-border)', flexShrink: 0 }}>
            <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            {!isDone && !isBusy && row.previews.length > 1 && (
              <button
                type="button"
                onClick={() => onRemoveImage(i)}
                title="Remove this photo"
                style={{ position: 'absolute', top: '1px', right: '1px', width: '15px', height: '15px', borderRadius: '50%', backgroundColor: 'rgba(14,14,13,0.7)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', padding: 0 }}
              >
                <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            )}
          </div>
        ))}
        {!isDone && !isBusy && row.previews.length < MAX_IMAGES_PER_ROW && (
          <>
            <input ref={addInputRef} type="file" accept="image/*" multiple hidden onChange={(e) => { onAddImages(e.target.files); e.target.value = ''; }} />
            <button
              type="button"
              onClick={() => addInputRef.current?.click()}
              title="Add another photo of this product"
              style={{ width: '52px', height: '52px', borderRadius: '6px', border: '1px dashed var(--admin-border)', backgroundColor: 'var(--admin-bg)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--admin-text-3)', flexShrink: 0 }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            </button>
          </>
        )}
      </div>

      {/* Name */}
      <div style={{ flex: '2', minWidth: '160px' }}>
        <input
          value={row.name}
          disabled={isBusy || isDone}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Product name (optional) — leave blank to auto-name"
          style={{
            width: '100%', fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 500,
            color: 'var(--admin-text)', backgroundColor: 'transparent',
            border: '1px solid var(--admin-border)',
            borderRadius: '6px', padding: '8px 10px', outline: 'none', boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Weight */}
      <div style={{ width: '110px', flexShrink: 0 }}>
        <input
          value={row.weight}
          disabled={isBusy || isDone}
          onChange={(e) => onWeightChange(e.target.value)}
          placeholder="Weight (optional)"
          style={{
            width: '100%', fontFamily: 'var(--font-body)', fontSize: '0.8125rem',
            color: 'var(--admin-text)', backgroundColor: 'transparent',
            border: '1px solid var(--admin-border)', borderRadius: '6px', padding: '8px 10px', outline: 'none', boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Status */}
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '3px 10px', borderRadius: '100px', backgroundColor: statusStyle.bg, fontFamily: 'var(--font-body)', fontSize: '0.6875rem', fontWeight: 500, color: statusStyle.color, whiteSpace: 'nowrap', flexShrink: 0 }}>
        {statusStyle.label}
      </span>

      {!isBusy && !isDone && (
        <button
          type="button"
          onClick={onRemove}
          title="Remove row"
          style={{ padding: '5px 7px', borderRadius: '6px', border: '1px solid var(--admin-border)', backgroundColor: 'transparent', cursor: 'pointer', color: 'var(--admin-text-2)', flexShrink: 0 }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" /></svg>
        </button>
      )}

      {row.status === 'error' && row.error && (
        <p style={{ width: '100%', fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--admin-danger)', margin: 0 }}>{row.error}</p>
      )}
    </motion.div>
  );
}
