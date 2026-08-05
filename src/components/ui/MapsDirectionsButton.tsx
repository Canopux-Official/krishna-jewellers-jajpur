import { useState } from 'react';
import { openStoreDirections } from '../../utils/maps';

interface MapsDirectionsButtonProps {
  style?: React.CSSProperties;
}

export default function MapsDirectionsButton({ style }: MapsDirectionsButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    openStoreDirections();
    window.setTimeout(() => setLoading(false), 1200);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        fontFamily: 'var(--font-body)',
        fontSize: '0.6875rem',
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        color: '#F8F6F2',
        backgroundColor: 'var(--color-text)',
        border: 'none',
        padding: '14px 22px',
        cursor: loading ? 'wait' : 'pointer',
        transition: 'background-color 0.25s, opacity 0.25s',
        opacity: loading ? 0.75 : 1,
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!loading) e.currentTarget.style.backgroundColor = 'var(--color-bronze)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--color-text)';
      }}
    >
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="3 11 22 2 13 21 11 13 3 11" />
      </svg>
      {loading ? 'Getting your location…' : 'Get Directions'}
    </button>
  );
}
