import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export default function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        gap: '16px', flexWrap: 'wrap', marginBottom: '32px',
      }}
    >
      <div>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 600, color: 'var(--admin-text)', marginBottom: subtitle ? '4px' : 0 }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--admin-text-2)' }}>
            {subtitle}
          </p>
        )}
      </div>
      {actions && <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>{actions}</div>}
    </motion.div>
  );
}
