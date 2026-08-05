import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import PageTransition from './PageTransition';
import Breadcrumb from './Breadcrumb';

interface LegalSection {
  title: string;
  body: ReactNode;
}

interface LegalPageProps {
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
}

export default function LegalPage({ title, updated, intro, sections }: LegalPageProps) {
  return (
    <PageTransition>
      <section
        style={{
          position: 'relative',
          minHeight: '280px',
          display: 'flex',
          alignItems: 'flex-end',
          background:
            'linear-gradient(165deg, #1a1816 0%, #2a2420 45%, #1c1917 100%)',
        }}
      >
        <div
          className="container"
          style={{
            position: 'relative',
            zIndex: 1,
            paddingTop: 'calc(var(--navbar-height) + 48px)',
            paddingBottom: '40px',
            width: '100%',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ marginBottom: 20 }}
          >
            <Breadcrumb light items={[{ label: 'Home', href: '/' }, { label: title }]} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35, ease: 'easeInOut' }}
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.25rem, 4.5vw, 3.5rem)',
              fontWeight: 600,
              color: '#F8F6F2',
              lineHeight: 1.08,
              marginBottom: 12,
            }}
          >
            {title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.48 }}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.6875rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'rgba(248,246,242,0.55)',
            }}
          >
            Last updated · {updated}
          </motion.p>
        </div>
      </section>

      <div style={{ backgroundColor: 'var(--color-bg)' }}>
        <div className="container" style={{ maxWidth: 760, paddingTop: 56, paddingBottom: 96 }}>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.2 }}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.9375rem',
              lineHeight: 1.85,
              color: 'var(--color-muted)',
              marginBottom: 48,
            }}
          >
            {intro}
          </motion.p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
            {sections.map((section, i) => (
              <motion.section
                key={section.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.22 + i * 0.05 }}
              >
                <h2
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.375rem',
                    fontWeight: 600,
                    color: 'var(--color-text)',
                    marginBottom: 12,
                  }}
                >
                  {section.title}
                </h2>
                <div
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.9375rem',
                    lineHeight: 1.85,
                    color: 'var(--color-muted)',
                  }}
                >
                  {section.body}
                </div>
              </motion.section>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
