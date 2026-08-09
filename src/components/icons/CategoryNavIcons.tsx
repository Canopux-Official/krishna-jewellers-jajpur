import type { ReactNode } from 'react';

/** Thin line-art icons for the nav category bar (Tanishq-style). */

type IconProps = {
  size?: number;
  className?: string;
};

function Svg({
  size = 28,
  className,
  children,
}: IconProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {children}
    </svg>
  );
}

export function IconBridal(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12.5" cy="17" r="6.5" />
      <circle cx="19.5" cy="17" r="6.5" />
    </Svg>
  );
}

export function IconNecklace(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M6 8c2.5 10 7 14 10 14s7.5-4 10-14" />
      <path d="M16 22v3.5" />
      <circle cx="16" cy="27" r="2" />
      <path d="M16 25l1.4 1.6H14.6L16 25z" />
    </Svg>
  );
}

export function IconChain(props: IconProps) {
  return (
    <Svg {...props}>
      <ellipse cx="9" cy="16" rx="4" ry="5.5" transform="rotate(-35 9 16)" />
      <ellipse cx="16" cy="16" rx="4" ry="5.5" transform="rotate(-35 16 16)" />
      <ellipse cx="23" cy="16" rx="4" ry="5.5" transform="rotate(-35 23 16)" />
    </Svg>
  );
}

export function IconBangles(props: IconProps) {
  return (
    <Svg {...props}>
      <ellipse cx="13" cy="16" rx="7" ry="9" />
      <ellipse cx="19" cy="16" rx="7" ry="9" />
    </Svg>
  );
}

export function IconBracelet(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M7 14c0-4 4-7 9-7s9 3 9 7c0 2.2-1.2 4-3 5.2" />
      <path d="M7 18c0 4 4 7 9 7s9-3 9-7c0-1.4-.5-2.7-1.4-3.8" />
      <circle cx="16" cy="12" r="1.4" />
    </Svg>
  );
}

export function IconEarrings(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="11" cy="7" r="1.6" />
      <path d="M11 8.6v6.2" />
      <path d="M11 14.8c-2.2 0-3.6 1.6-3.6 3.8S9.4 26 11 26s3.6-2.2 3.6-4.4-1.4-3.8-3.6-3.8z" />
      <circle cx="21" cy="7" r="1.6" />
      <path d="M21 8.6v6.2" />
      <path d="M21 14.8c-2.2 0-3.6 1.6-3.6 3.8S19.4 26 21 26s3.6-2.2 3.6-4.4-1.4-3.8-3.6-3.8z" />
    </Svg>
  );
}

export function IconPendant(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M10 6c1.8 4 4 6 6 6s4.2-2 6-6" />
      <path d="M16 12v5" />
      <path d="M16 17l4 7H12l4-7z" />
      <circle cx="16" cy="21" r="1.2" />
    </Svg>
  );
}

export function IconCoins(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="13" cy="16" r="7.5" />
      <path d="M20.2 11.2a7.5 7.5 0 0 1 0 9.6" />
      <path d="M13 11.5v9" />
      <path d="M10.5 13.8c.7-.7 1.6-1.1 2.5-1.1s1.8.4 2.5 1.1" />
      <path d="M10.5 18.2c.7.7 1.6 1.1 2.5 1.1s1.8-.4 2.5-1.1" />
    </Svg>
  );
}

export function IconMangalsutra(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M7 8c2.8 9 6.2 13 9 13s6.2-4 9-13" />
      <circle cx="11" cy="14" r="1.1" />
      <circle cx="14" cy="17.5" r="1.1" />
      <circle cx="18" cy="17.5" r="1.1" />
      <circle cx="21" cy="14" r="1.1" />
      <path d="M14.2 21.2h3.6l-1.8 3.4-1.8-3.4z" />
    </Svg>
  );
}

export function IconWatches(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="10" y="9" width="12" height="14" rx="3.5" />
      <path d="M13 9V6.5h6V9" />
      <path d="M13 23v2.5h6V23" />
      <path d="M16 13.5v4l2.5 1.5" />
      <circle cx="16" cy="16" r="0.8" fill="currentColor" stroke="none" />
    </Svg>
  );
}

const BY_ID: Record<string, (props: IconProps) => ReactNode> = {
  bridal: IconBridal,
  necklaces: IconNecklace,
  chains: IconChain,
  bangles: IconBangles,
  bracelets: IconBracelet,
  earrings: IconEarrings,
  pendants: IconPendant,
  coins: IconCoins,
  mangalsutra: IconMangalsutra,
  watches: IconWatches,
};

/** Short labels for the category strip (Tanishq-style). */
export const CATEGORY_NAV_LABELS: Record<string, string> = {
  bridal: 'Bridal',
  necklaces: 'Necklaces',
  chains: 'Chains',
  bangles: 'Bangles',
  bracelets: 'Bracelets',
  earrings: 'Earrings',
  pendants: 'Pendants',
  coins: 'Coins',
  mangalsutra: 'Mangalsutra',
  watches: 'Watches',
};

export function CategoryNavIcon({
  id,
  size = 28,
  className,
}: {
  id: string;
  size?: number;
  className?: string;
}) {
  const Icon = BY_ID[id] ?? IconNecklace;
  return <Icon size={size} className={className} />;
}
