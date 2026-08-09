import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import PageTransition from '../components/ui/PageTransition';
import Breadcrumb from '../components/ui/Breadcrumb';
import GoldDivider from '../components/ui/GoldDivider';
import CollectionMasonry from '../components/collection/CollectionMasonry';
import PageMeta from '../components/seo/PageMeta';
import { COLLECTIONS } from '../data/mockCollections';
import { SECTION_IMAGES } from '../data/storeImages';
import { STATIC_PAGE_META, buildCollectionsIndexJsonLd, buildBreadcrumbJsonLd, mergeJsonLd } from '../utils/seo';
import { publicCategoriesService } from '../services/publicApi';
import { mergeCollectionsWithLiveCounts } from '../utils/collections';
import type { Collection } from '../types';

const HERO_IMAGE = SECTION_IMAGES.collections;

export default function CollectionsPage() {
  const meta = STATIC_PAGE_META.collections;
  const [collections, setCollections] = useState<Collection[]>(COLLECTIONS);

  useEffect(() => {
    publicCategoriesService
      .getAll()
      .then((cats) => setCollections(mergeCollectionsWithLiveCounts(cats || [])))
      .catch(() => {
        /* keep curated fallback counts if API unavailable */
      });
  }, []);

  return (
    <PageTransition>
      <PageMeta
        title={meta.title}
        description={meta.description}
        path={meta.path}
        jsonLd={mergeJsonLd(
          buildCollectionsIndexJsonLd(
            collections.map((c) => ({
              name: c.name,
              slug: c.slug,
              shortDescription: c.shortDescription,
            })),
          ),
          buildBreadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Collections' },
          ]),
        )}
      />
      {/* ── Hero ── */}
      <section
        className="collections-index-hero"
        style={{
          position: 'relative',
          height: '62vh',
          minHeight: '460px',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'flex-end',
        }}
      >
        <motion.div
          initial={{ scale: 1.06 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8, ease: 'easeOut' }}
          style={{ position: 'absolute', inset: 0 }}
        >
          <img
            src={HERO_IMAGE}
            alt="Our jewellery collections"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 40%', display: 'block' }}
          />
        </motion.div>

        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(24,24,24,0.2) 0%, rgba(24,24,24,0.75) 100%)' }} />

        <div className="container" style={{ position: 'relative', zIndex: 1, paddingBottom: '64px', width: '100%' }}>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ marginBottom: '20px' }}
          >
            <Breadcrumb light items={[{ label: 'Home', href: '/' }, { label: 'Collections' }]} />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            style={{ fontFamily: 'var(--font-body)', fontSize: '0.625rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: '14px' }}
          >
            Heritage Collections
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.45, ease: 'easeInOut' }}
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.5rem, 5.5vw, 5rem)',
              fontWeight: 600,
              color: '#F8F6F2',
              lineHeight: 1.08,
              marginBottom: '20px',
            }}
          >
            Gold for Rituals
            <br />
            <span style={{ fontStyle: 'italic' }}>&amp; Everyday Grace</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            style={{ fontFamily: 'var(--font-body)', fontSize: '0.9375rem', color: 'rgba(248,246,242,0.65)', maxWidth: '480px', lineHeight: 1.75 }}
          >
            Bridal sets, temple pendants, festive bangles, and daily-wear gold — hallmarked jewellery from our Byasanagar showroom.
          </motion.p>
        </div>
      </section>

      {/* ── Collections grid ── */}
      <section style={{ backgroundColor: 'var(--color-bg)', paddingBlock: 'var(--space-16)' }}>
        <div className="container" style={{ marginBottom: '48px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '24px', marginBottom: '32px', flexWrap: 'wrap' }}>
            <div>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                style={{ fontFamily: 'var(--font-body)', fontSize: '0.625rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: '10px' }}
              >
                {collections.length} Categories
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.85, delay: 0.08, ease: 'easeInOut' }}
                style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.75rem, 3vw, 2.75rem)', fontWeight: 600, color: 'var(--color-text)' }}
              >
                Browse <span style={{ fontStyle: 'italic', color: 'var(--color-bronze)' }}>the Jewellery Room</span>
              </motion.h2>
            </div>
          </div>
          <GoldDivider style={{ marginBottom: '0' }} />
        </div>

        <div className="container" style={{ paddingInline: 0 }}>
          <CollectionMasonry collections={collections} />
        </div>
      </section>

      <style>{`
        @media (max-width: 700px) {
          .collections-index-hero {
            height: 55svh !important;
            min-height: 300px !important;
            max-height: 480px !important;
          }
        }
      `}</style>
    </PageTransition>
  );
}
