import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import muiTheme from './theme/muiTheme';
import { SearchProvider } from './context/SearchContext';
import { StoreSettingsProvider } from './context/StoreSettingsContext';
import { AuthProvider } from './admin/context/AuthContext';
import { ToastProvider } from './admin/context/ToastContext';

import Layout from './components/layout/Layout';
import SearchOverlay from './components/search/SearchOverlay';

import './styles/globals.css';

const HomePage = lazy(() => import('./pages/HomePage'));
const CollectionsPage = lazy(() => import('./pages/CollectionsPage'));
const CollectionDetailPage = lazy(() => import('./pages/CollectionDetailPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const RatesPage = lazy(() => import('./pages/RatesPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsOfServicePage = lazy(() => import('./pages/TermsOfServicePage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

const AdminLogin = lazy(() => import('./admin/pages/AdminLogin'));
const AdminLayout = lazy(() => import('./admin/components/layout/AdminLayout'));
const AdminDashboard = lazy(() => import('./admin/pages/AdminDashboard'));
const AdminProducts = lazy(() => import('./admin/pages/AdminProducts'));
const AdminCategories = lazy(() => import('./admin/pages/AdminCategories'));
const AdminRates = lazy(() => import('./admin/pages/AdminRates'));
const AdminGallery = lazy(() => import('./admin/pages/AdminGallery'));
const AdminTestimonials = lazy(() => import('./admin/pages/AdminTestimonials'));
const AdminOffers = lazy(() => import('./admin/pages/AdminOffers'));
const AdminInstagram = lazy(() => import('./admin/pages/AdminInstagram'));
const AdminSettings = lazy(() => import('./admin/pages/AdminSettings'));

function PageFallback() {
  return (
    <div
      style={{
        minHeight: '40vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-body)',
        fontSize: '0.875rem',
        color: 'var(--color-muted, #6B6966)',
      }}
    >
      Loading…
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/collections" element={<CollectionsPage />} />
          <Route path="/collections/:slug" element={<CollectionDetailPage />} />
          <Route path="/products/:slug" element={<ProductDetailPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/rates" element={<RatesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />
          <Route path="/404" element={<NotFoundPage />} />
        </Route>

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="rates" element={<AdminRates />} />
          <Route path="gallery" element={<AdminGallery />} />
          <Route path="testimonials" element={<AdminTestimonials />} />
          <Route path="offers" element={<AdminOffers />} />
          <Route path="instagram" element={<AdminInstagram />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <AuthProvider>
        <ToastProvider>
          <StoreSettingsProvider>
            <SearchProvider>
              <BrowserRouter>
                <Suspense fallback={<PageFallback />}>
                  <AnimatedRoutes />
                </Suspense>
                <SearchOverlay />
              </BrowserRouter>
            </SearchProvider>
          </StoreSettingsProvider>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
