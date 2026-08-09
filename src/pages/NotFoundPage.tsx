import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import PageMeta from '../components/seo/PageMeta';
import { STATIC_PAGE_META } from '../utils/seo';

export default function NotFoundPage() {
  const meta = STATIC_PAGE_META.notFound;
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-bg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '40px 24px',
      }}
    >
      <PageMeta title={meta.title} description={meta.description} path={meta.path} noindex setCanonical={false} />
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ fontFamily: 'var(--font-body)', fontSize: '0.625rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: '20px' }}
      >
        404
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.1, ease: 'easeInOut' }}
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(3rem, 8vw, 7rem)',
          fontWeight: 600,
          fontStyle: 'italic',
          color: 'var(--color-text)',
          lineHeight: 1,
          marginBottom: '24px',
        }}
      >
        Page Not Found
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.25 }}
        style={{ fontFamily: 'var(--font-body)', fontSize: '0.9375rem', color: 'var(--color-muted)', maxWidth: '360px', lineHeight: 1.75, marginBottom: '48px' }}
      >
        This page has moved or no longer exists. Let us guide you back to our collections.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}
      >
        <Link
          to="/"
          style={{
            fontFamily: 'var(--font-body)', fontSize: '0.6875rem', letterSpacing: '0.2em', textTransform: 'uppercase',
            color: 'var(--color-text)', borderBottom: '1px solid var(--color-text)', paddingBottom: '2px',
          }}
        >
          Return Home
        </Link>
        <Link
          to="/collections"
          style={{
            fontFamily: 'var(--font-body)', fontSize: '0.6875rem', letterSpacing: '0.2em', textTransform: 'uppercase',
            color: 'var(--color-gold)', borderBottom: '1px solid var(--color-gold)', paddingBottom: '2px',
          }}
        >
          View Collections →
        </Link>
      </motion.div>
    </div>
  );
}
