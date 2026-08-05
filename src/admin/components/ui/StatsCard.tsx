import { motion } from 'framer-motion';

interface StatsCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  accentColor?: string;
  index?: number;
}

export default function StatsCard({
  label, value, sub, icon, trend, trendValue, accentColor = 'var(--color-gold)', index = 0,
}: StatsCardProps) {
  const trendColor = trend === 'up' ? 'var(--admin-success)' : trend === 'down' ? 'var(--admin-danger)' : 'var(--admin-text-2)';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: 'easeOut' }}
      style={{
        backgroundColor: 'var(--admin-card)',
        border: '1px solid var(--admin-border)',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top accent bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: accentColor, opacity: 0.6 }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.6875rem', fontWeight: 500, letterSpacing: '0.06em', color: 'var(--admin-text-2)', textTransform: 'uppercase' }}>
          {label}
        </p>
        <div style={{ color: accentColor, opacity: 0.8 }}>
          {icon}
        </div>
      </div>

      <p style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 600, color: 'var(--admin-text)', lineHeight: 1, marginBottom: '8px' }}>
        {value}
      </p>

      {(sub || trendValue) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
          {trendValue && trend && (
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.6875rem', color: trendColor, fontWeight: 500 }}>
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '—'} {trendValue}
            </span>
          )}
          {sub && (
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.6875rem', color: 'var(--admin-text-3)' }}>
              {sub}
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
}
