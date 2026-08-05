import { motion, AnimatePresence } from 'framer-motion';
import AdminButton from './AdminButton';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  isDangerous?: boolean;
  onConfirm: () => void;
  onClose?: () => void;
  onCancel?: () => void;
}

export default function ConfirmDialog({ open, title, description, confirmLabel = 'Confirm', isDangerous = false, onConfirm, onClose, onCancel }: ConfirmDialogProps) {
  const handleClose = () => { onClose?.(); onCancel?.(); };
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ position: 'fixed', inset: 0, zIndex: 400, backgroundColor: 'rgba(14,14,13,0.5)', backdropFilter: 'blur(4px)' }}
            onClick={handleClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            style={{
              position: 'fixed', inset: 0, zIndex: 401,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              pointerEvents: 'none',
            }}
          >
            <div
              style={{
                backgroundColor: 'var(--admin-card)', border: '1px solid var(--admin-border)',
                borderRadius: '12px', padding: '32px', maxWidth: '420px', width: '90%',
                boxShadow: '0 20px 60px rgba(0,0,0,0.15)', pointerEvents: 'all',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'rgba(220,38,38,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--admin-danger)" strokeWidth="1.5"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" /></svg>
              </div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--admin-text)', marginBottom: '10px' }}>{title}</h3>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--admin-text-2)', lineHeight: 1.6, marginBottom: '28px' }}>{description}</p>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <AdminButton variant="secondary" onClick={handleClose}>Cancel</AdminButton>
                <AdminButton variant={isDangerous ? 'danger' : 'primary'} onClick={onConfirm}>{confirmLabel}</AdminButton>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
