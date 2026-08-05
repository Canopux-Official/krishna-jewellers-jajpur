import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageHeader from '../components/ui/PageHeader';
import StatusBadge from '../components/ui/StatusBadge';
import AdminButton from '../components/ui/AdminButton';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import FormField from '../components/ui/FormField';
import { offersService } from '../services/offers.service';

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: 'Active',
  SCHEDULED: 'Scheduled',
  EXPIRED: 'Expired',
};

function toDateInput(value: string | undefined | null): string {
  if (!value) return '';
  return value.slice(0, 10);
}

function formatDisplayDate(value: string | undefined | null): string {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function normalizeStatus(status: string | undefined): 'active' | 'scheduled' | 'expired' {
  const key = (status || 'ACTIVE').toUpperCase();
  if (key === 'SCHEDULED') return 'scheduled';
  if (key === 'EXPIRED') return 'expired';
  return 'active';
}

export default function AdminOffers() {
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [editTarget, setEditTarget] = useState<Record<string, string> | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [newForm, setNewForm] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    status: 'ACTIVE',
  });

  const fetchOffers = () => {
    setLoading(true);
    offersService
      .getAll()
      .then((data) => setOffers(Array.isArray(data) ? data : []))
      .catch(() => setOffers([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await offersService.delete(deleteTarget.id);
    setDeleteTarget(null);
    fetchOffers();
  };

  const handleAdd = async () => {
    if (!newForm.title || !newForm.startDate || !newForm.endDate) return;
    await offersService.create({
      ...newForm,
      status: newForm.status.toUpperCase(),
    });
    setNewForm({ title: '', description: '', startDate: '', endDate: '', status: 'ACTIVE' });
    setAddOpen(false);
    fetchOffers();
  };

  const handleEdit = async () => {
    if (!editTarget?.id || !editTarget.title || !editTarget.startDate || !editTarget.endDate) return;
    await offersService.update(editTarget.id, {
      title: editTarget.title,
      description: editTarget.description,
      startDate: editTarget.startDate,
      endDate: editTarget.endDate,
      status: (editTarget.status || 'ACTIVE').toUpperCase(),
    });
    setEditTarget(null);
    fetchOffers();
  };

  const openEdit = (offer: any) => {
    setEditTarget({
      id: offer.id,
      title: offer.title || '',
      description: offer.description || '',
      startDate: toDateInput(offer.startDate),
      endDate: toDateInput(offer.endDate),
      status: (offer.status || 'ACTIVE').toUpperCase(),
    });
  };

  const activeCount = offers.filter((o) => (o.status || '').toUpperCase() === 'ACTIVE').length;
  const scheduledCount = offers.filter((o) => (o.status || '').toUpperCase() === 'SCHEDULED').length;

  return (
    <>
      <PageHeader
        title="Offers & Promotions"
        subtitle={`${activeCount} active · ${scheduledCount} scheduled`}
        actions={
          <AdminButton
            variant="primary"
            onClick={() => setAddOpen(true)}
            icon={
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            }
          >
            Add Offer
          </AdminButton>
        }
      />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          backgroundColor: 'var(--admin-card)',
          border: '1px solid var(--admin-border)',
          borderRadius: '10px',
          overflow: 'hidden',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--admin-border)', backgroundColor: 'var(--admin-bg)' }}>
                {['Title', 'Description', 'Start Date', 'End Date', 'Status', 'Actions'].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: '12px 20px',
                      textAlign: 'left',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.6875rem',
                      fontWeight: 600,
                      color: 'var(--admin-text-2)',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {!loading && offers.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    style={{
                      padding: '40px 20px',
                      textAlign: 'center',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.875rem',
                      color: 'var(--admin-text-2)',
                    }}
                  >
                    No offers yet. Add your first promotion.
                  </td>
                </tr>
              )}
              <AnimatePresence>
                {offers.map((offer, i) => {
                  const statusKey = (offer.status || 'ACTIVE').toUpperCase();
                  const badgeVariant = normalizeStatus(statusKey);
                  return (
                    <motion.tr
                      key={offer.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2, delay: i * 0.04 }}
                      style={{
                        borderBottom: i < offers.length - 1 ? '1px solid var(--admin-border)' : 'none',
                        transition: 'background-color 0.15s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--admin-bg)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div
                            style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              backgroundColor:
                                badgeVariant === 'active'
                                  ? 'var(--admin-success)'
                                  : badgeVariant === 'scheduled'
                                    ? 'var(--admin-info)'
                                    : 'var(--admin-text-3)',
                              flexShrink: 0,
                            }}
                          />
                          <p
                            style={{
                              fontFamily: 'var(--font-body)',
                              fontSize: '0.875rem',
                              fontWeight: 600,
                              color: 'var(--admin-text)',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {offer.title}
                          </p>
                        </div>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <p
                          style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: '0.8125rem',
                            color: 'var(--admin-text-2)',
                            maxWidth: '280px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {offer.description}
                        </p>
                      </td>
                      <td style={{ padding: '16px 20px', whiteSpace: 'nowrap' }}>
                        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--admin-text-2)' }}>
                          {formatDisplayDate(offer.startDate)}
                        </p>
                      </td>
                      <td style={{ padding: '16px 20px', whiteSpace: 'nowrap' }}>
                        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--admin-text-2)' }}>
                          {formatDisplayDate(offer.endDate)}
                        </p>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <StatusBadge variant={badgeVariant} label={STATUS_LABELS[statusKey] || statusKey} />
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <AdminButton variant="secondary" size="sm" onClick={() => openEdit(offer)}>
                            Edit
                          </AdminButton>
                          <AdminButton variant="danger" size="sm" onClick={() => setDeleteTarget(offer)}>
                            Delete
                          </AdminButton>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>

      <AnimatePresence>
        {(addOpen || editTarget) && (
          <OfferModal
            title={addOpen ? 'New Offer' : 'Edit Offer'}
            form={addOpen ? newForm : editTarget || {}}
            setForm={(k, v) =>
              addOpen
                ? setNewForm((f) => ({ ...f, [k]: v }))
                : setEditTarget((t) => (t ? { ...t, [k]: v } : t))
            }
            onClose={() => {
              setAddOpen(false);
              setEditTarget(null);
            }}
            onSave={addOpen ? handleAdd : handleEdit}
          />
        )}
      </AnimatePresence>

      <ConfirmDialog
        open={!!deleteTarget}
        title={`Delete "${deleteTarget?.title}"?`}
        description="This offer will be permanently removed."
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
        confirmLabel="Delete"
        isDangerous
      />
    </>
  );
}

function OfferModal({
  title,
  form,
  setForm,
  onClose,
  onSave,
}: {
  title: string;
  form: Record<string, string>;
  setForm: (k: string, v: string) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 400,
          backgroundColor: 'rgba(14,14,13,0.5)',
          backdropFilter: 'blur(4px)',
        }}
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.25 }}
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
            borderRadius: '12px',
            padding: '28px',
            maxWidth: '520px',
            width: '100%',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            pointerEvents: 'all',
          }}
        >
          <h3
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.25rem',
              fontWeight: 600,
              color: 'var(--admin-text)',
              marginBottom: '20px',
            }}
          >
            {title}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
            <FormField label="Offer Title" required value={form.title || ''} onChange={(e) => setForm('title', e.target.value)} />
            <FormField
              as="textarea"
              label="Description"
              rows={3}
              value={form.description || ''}
              onChange={(e) => setForm('description', e.target.value)}
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <FormField
                label="Start Date"
                type="date"
                value={form.startDate || ''}
                onChange={(e) => setForm('startDate', e.target.value)}
              />
              <FormField
                label="End Date"
                type="date"
                value={form.endDate || ''}
                onChange={(e) => setForm('endDate', e.target.value)}
              />
            </div>
            <FormField
              as="select"
              label="Status"
              value={(form.status || 'ACTIVE').toUpperCase()}
              onChange={(e) => setForm('status', e.target.value)}
              options={[
                { value: 'ACTIVE', label: 'Active' },
                { value: 'SCHEDULED', label: 'Scheduled' },
                { value: 'EXPIRED', label: 'Expired' },
              ]}
            />
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <AdminButton variant="secondary" onClick={onClose}>
              Cancel
            </AdminButton>
            <AdminButton variant="primary" onClick={onSave}>
              Save Offer
            </AdminButton>
          </div>
        </div>
      </motion.div>
    </>
  );
}
