import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

interface SidebarItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const NAV: SidebarItem[] = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /></svg> },
  { label: 'Products', path: '/admin/products', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg> },
  { label: 'Categories', path: '/admin/categories', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg> },
  { label: 'Gold & Silver Rates', path: '/admin/rates', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg> },
  { label: 'Gallery', path: '/admin/gallery', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg> },
  { label: 'Testimonials', path: '/admin/testimonials', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg> },
  { label: 'Offers', path: '/admin/offers', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></svg> },
  { label: 'Instagram', path: '/admin/instagram', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg> },
  { label: 'Settings', path: '/admin/settings', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg> },
];

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function AdminSidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: AdminSidebarProps) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    onMobileClose?.();
    await logout();
    navigate('/admin/login', { replace: true });
  };

  const SidebarContent = () => (
    <div
      style={{
        width: collapsed ? 'var(--admin-sidebar-collapsed)' : 'var(--admin-sidebar-w)',
        height: '100%',
        backgroundColor: 'var(--admin-sidebar-bg)',
        borderRight: '1px solid var(--admin-sidebar-border)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s cubic-bezier(0.25,0.46,0.45,0.94)',
        overflow: 'hidden',
      }}
    >
      {/* Logo */}
      <div
        style={{
          height: 'var(--admin-topbar-h)',
          display: 'flex',
          alignItems: 'center',
          padding: collapsed ? '0 20px' : '0 24px',
          borderBottom: '1px solid var(--admin-sidebar-border)',
          gap: '10px',
          cursor: 'pointer',
          flexShrink: 0,
        }}
        onClick={() => navigate('/admin/dashboard')}
      >
        {/* Gold K mark */}
        <div style={{ width: '28px', height: '28px', backgroundColor: 'var(--color-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, borderRadius: '4px' }}>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', color: '#fff', fontWeight: 500, lineHeight: 1 }}>N</span>
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
              style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
            >
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.8125rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-gold)', lineHeight: 1.2 }}>Krishna Jewellers</p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.5625rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--color-gold)', marginTop: '1px' }}>Admin</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto', overflowX: 'hidden' }}>
        {/* Section label */}
        {!collapsed && (
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.5rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', padding: '8px 12px 4px', marginBottom: '4px' }}>
            Navigation
          </p>
        )}

        {NAV.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            title={collapsed ? item.label : undefined}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: collapsed ? '10px 20px' : '10px 12px',
              borderRadius: '8px',
              marginBottom: '2px',
              textDecoration: 'none',
              color: isActive ? 'var(--admin-sidebar-active-text)' : 'rgba(255,255,255,0.5)',
              backgroundColor: isActive ? 'var(--admin-sidebar-active-bg)' : 'transparent',
              transition: 'background-color 0.2s, color 0.2s',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              justifyContent: collapsed ? 'center' : 'flex-start',
            })}
            onMouseEnter={(e) => {
              if (!(e.currentTarget as HTMLElement).style.color.includes('C7A15A')) {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--admin-sidebar-hover)';
                (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.85)';
              }
            }}
            onMouseLeave={(e) => {
              const active = (e.currentTarget as HTMLElement).getAttribute('aria-current') === 'page';
              (e.currentTarget as HTMLElement).style.backgroundColor = active ? 'var(--admin-sidebar-active-bg)' : 'transparent';
              (e.currentTarget as HTMLElement).style.color = active ? 'var(--admin-sidebar-active-text)' : 'rgba(255,255,255,0.5)';
            }}
          >
            <span style={{ flexShrink: 0 }}>{item.icon}</span>
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', fontWeight: 450 }}
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>
        ))}
      </nav>

      {/* Bottom: collapse toggle + logout */}
      <div style={{ padding: '12px 8px', borderTop: '1px solid var(--admin-sidebar-border)', flexShrink: 0 }}>
        <button
          type="button"
          onClick={handleLogout}
          title={collapsed ? 'Logout' : undefined}
          style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            width: '100%', padding: collapsed ? '10px 20px' : '10px 12px', borderRadius: '8px',
            backgroundColor: 'transparent', border: 'none', cursor: 'pointer',
            color: 'rgba(255,255,255,0.3)', transition: 'color 0.2s, background-color 0.2s',
            marginBottom: '4px', justifyContent: collapsed ? 'center' : 'flex-start',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(220,38,38,0.8)'; e.currentTarget.style.backgroundColor = 'rgba(220,38,38,0.06)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.3)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
          {!collapsed && <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', whiteSpace: 'nowrap' }}>Logout</span>}
        </button>

        {/* Collapse toggle */}
        <button
          onClick={onToggle}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            width: '100%', padding: collapsed ? '10px 20px' : '10px 12px', borderRadius: '8px',
            backgroundColor: 'transparent', border: 'none', cursor: 'pointer',
            color: 'rgba(255,255,255,0.25)', transition: 'color 0.2s, background-color 0.2s',
            justifyContent: collapsed ? 'center' : 'flex-start',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; e.currentTarget.style.backgroundColor = 'var(--admin-sidebar-hover)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.25)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }}>
            <polyline points="15 18 9 12 15 6" />
          </svg>
          {!collapsed && <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>Collapse</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop fixed sidebar */}
      <div
        className="admin-sidebar-desktop"
        style={{ position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 100 }}
      >
        <SidebarContent />
      </div>

      {/* Mobile overlay drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'fixed', inset: 0, zIndex: 200, backgroundColor: 'rgba(0,0,0,0.5)' }}
              onClick={onMobileClose}
            />
            <motion.div
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              style={{ position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 201 }}
            >
              <div style={{ width: 'var(--admin-sidebar-w)' }}>
                <SidebarContent />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 900px) {
          .admin-sidebar-desktop { display: none !important; }
        }
      `}</style>
    </>
  );
}
