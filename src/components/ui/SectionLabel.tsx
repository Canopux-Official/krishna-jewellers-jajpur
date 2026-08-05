import { motion } from 'framer-motion';

interface SectionLabelProps {
  children: React.ReactNode;
  light?: boolean;
  className?: string;
}

export default function SectionLabel({ children, light, className }: SectionLabelProps) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: 'easeInOut' }}
      className={className}
      style={{
        display: 'inline-block',
        fontFamily: 'var(--font-body)',
        fontSize: '0.6875rem',
        fontWeight: 500,
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        color: light ? 'var(--color-on-maroon)' : 'var(--color-muted)',
        fontWeight: 400,
      }}
    >
      {children}
    </motion.span>
  );
}
