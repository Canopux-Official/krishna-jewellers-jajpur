import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '72px 24px', textAlign: 'center' }}>
      {icon && (
        <div style={{ color: 'var(--admin-text-3)', marginBottom: '16px', opacity: 0.5 }}>{icon}</div>
      )}
      <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--admin-text)', marginBottom: '8px' }}>{title}</p>
      {description && (
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--admin-text-2)', maxWidth: '320px', lineHeight: 1.6, marginBottom: action ? '24px' : 0 }}>
          {description}
        </p>
      )}
      {action}
    </div>
  );
}
