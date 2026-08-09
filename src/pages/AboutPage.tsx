import { motion } from 'framer-motion';
import PageTransition from '../components/ui/PageTransition';
import Breadcrumb from '../components/ui/Breadcrumb';
import BrandStory from '../components/sections/BrandStory';
import VisitStore from '../components/sections/VisitStore';
import PageMeta from '../components/seo/PageMeta';
import { SECTION_IMAGES } from '../data/storeImages';
import { useStoreSettings } from '../context/StoreSettingsContext';
import { STATIC_PAGE_META, buildBreadcrumbJsonLd } from '../utils/seo';

const HERO_IMAGE = SECTION_IMAGES.about;

export default function AboutPage() {
  const meta = STATIC_PAGE_META.about;
  const { showBrandStory, showVisitStore } = useStoreSettings();
  return (
    <PageTransition>
      <PageMeta
        title={meta.title}
        description={meta.description}
        path={meta.path}
        jsonLd={buildBreadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'About' },
        ])}
      />
      <section
        className="page-hero page-hero--md"
      >
        <motion.div
          initial={{ scale: 1.06 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8, ease: 'easeOut' }}
          style={{ position: 'absolute', inset: 0 }}
        >
          <img
            src={HERO_IMAGE}
            alt="About Krishna Jewellers"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
          />
        </motion.div>

        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(24,24,24,0.55) 0%, rgba(24,24,24,0.25) 40%, rgba(24,24,24,0.78) 100%)',
          }}
        />

        <div
          className="container page-hero__content"
          style={{
            position: 'relative',
            zIndex: 1,
            paddingTop: 'calc(var(--navbar-height) + 24px)',
            paddingBottom: '48px',
            width: '100%',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ marginBottom: '20px' }}
          >
            <Breadcrumb light items={[{ label: 'Home', href: '/' }, { label: 'About' }]} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35, ease: 'easeInOut' }}
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 600,
              color: '#F8F6F2',
              lineHeight: 1.08,
              marginBottom: '12px',
            }}
          >
            About Us
          </motion.h1>

          <motion.p
            className="page-hero__lede"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.9375rem',
              color: 'rgba(248,246,242,0.7)',
              maxWidth: '440px',
              lineHeight: 1.7,
            }}
          >
            Our story as a temple-town jewellery house in Byasanagar — craft, purity, and families we’ve served.
          </motion.p>
        </div>
      </section>

      {showBrandStory && <BrandStory />}
      {showVisitStore && <VisitStore />}
    </PageTransition>
  );
}
