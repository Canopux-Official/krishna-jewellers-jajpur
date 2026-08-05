interface BisCredibilityProps {
  /** Dark footer / dark sections */
  variant?: 'light' | 'dark';
  /** Compact inline mark for product / footer rows */
  compact?: boolean;
  style?: React.CSSProperties;
}

/**
 * BIS Hallmark credibility mark.
 * Wording follows BIS jeweller display guidance:
 * “Hallmarked jewellery available for sale”.
 */
export default function BisCredibility({
  variant = 'light',
  compact = false,
  style,
}: BisCredibilityProps) {
  const isDark = variant === 'dark';
  const textColor = isDark ? 'var(--color-on-maroon)' : 'var(--color-muted)';
  const titleColor = isDark ? 'var(--color-ivory)' : 'var(--color-text)';
  const logoSize = compact ? 52 : 88;

  const logo = (
    <img
      src="/BIS.png"
      alt="BIS Hallmark — Bureau of Indian Standards"
      width={logoSize}
      height={logoSize}
      style={{
        display: 'block',
        width: logoSize,
        height: logoSize,
        objectFit: 'contain',
        flexShrink: 0,
        /* Logo asset has a black field — keep it intentional on light surfaces */
        backgroundColor: '#000',
      }}
    />
  );

  if (compact) {
    return (
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '12px',
          ...style,
        }}
      >
        {logo}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.625rem',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: titleColor,
              fontWeight: 500,
            }}
          >
            BIS Hallmarked
          </span>
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.6875rem',
              lineHeight: 1.45,
              color: textColor,
              maxWidth: '220px',
            }}
          >
            Hallmarked jewellery available for sale
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        ...style,
      }}
    >
      {logo}
      <div>
        <p
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.25rem',
            fontWeight: 600,
            color: titleColor,
            marginBottom: '6px',
            letterSpacing: '0.02em',
          }}
        >
          Certified purity
        </p>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.8125rem',
            lineHeight: 1.7,
            color: textColor,
            maxWidth: '280px',
          }}
        >
          Hallmarked jewellery available for sale — every gold piece carries BIS certification and a unique HUID.
        </p>
      </div>
    </div>
  );
}
