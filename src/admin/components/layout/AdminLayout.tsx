import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import AdminSidebar from './AdminSidebar';
import AdminTopbar from './AdminTopbar';
import ProtectedRoute from './ProtectedRoute';
import PageMeta from '../../../components/seo/PageMeta';
import { useSidebar } from '../../hooks/useSidebar';

export default function AdminLayout() {
  const { collapsed, toggle } = useSidebar();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const sidebarW = collapsed ? 'var(--admin-sidebar-collapsed)' : 'var(--admin-sidebar-w)';

  return (
    <ProtectedRoute>
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--admin-bg)', fontFamily: 'var(--font-body)' }}>
      <PageMeta title="Admin | Krishna Jewellers" description="Store admin panel." path="/admin" noindex />
      <AdminSidebar
        collapsed={collapsed}
        onToggle={toggle}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      <AdminTopbar
        collapsed={collapsed}
        onMobileMenuOpen={() => setMobileMenuOpen(true)}
      />

      {/* Main content */}
      <main
        className="admin-main"
        style={{
          marginLeft: sidebarW,
          paddingTop: 'var(--admin-topbar-h)',
          minHeight: '100vh',
          transition: 'margin-left 0.3s cubic-bezier(0.25,0.46,0.45,0.94)',
        }}
      >
        <div style={{ padding: '32px 32px 64px' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <style>{`
        @media (max-width: 900px) {
          .admin-main { margin-left: 0 !important; padding: 16px; padding-top: calc(var(--admin-topbar-h) + 16px) !important; }
        }
      `}</style>
    </div>
    </ProtectedRoute>
  );
}
