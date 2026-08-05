import Hero from '../components/sections/Hero';
import BrandStory from '../components/sections/BrandStory';
import MetalRates from '../components/sections/MetalRates';
import Collections from '../components/sections/Collections';
import Craftsmanship from '../components/sections/Craftsmanship';
import Testimonials from '../components/sections/Testimonials';
import VisitStore from '../components/sections/VisitStore';
import OfferStickyNotes from '../components/sections/OfferStickyNotes';
import PageMeta from '../components/seo/PageMeta';
import { useStoreSettings } from '../context/StoreSettingsContext';
import { STATIC_PAGE_META } from '../utils/seo';

export default function HomePage() {
  const meta = STATIC_PAGE_META.home;
  const {
    isLoaded,
    showBrandStory,
    showCollections,
    showCraftsmanship,
    showTestimonials,
    showVisitStore,
    showOffers,
  } = useStoreSettings();

  // Wait for settings so toggled-off sections don't flash from defaults
  const show = (flag: boolean) => isLoaded && flag;

  return (
    <main>
      <PageMeta title={meta.title} description={meta.description} path={meta.path} />
      <Hero />
      {show(showCollections) && <Collections />}
      <MetalRates />
      {show(showBrandStory) && <BrandStory />}
      {show(showCraftsmanship) && <Craftsmanship />}
      {show(showTestimonials) && <Testimonials />}
      {show(showVisitStore) && <VisitStore />}
      {show(showOffers) && <OfferStickyNotes />}
    </main>
  );
}
