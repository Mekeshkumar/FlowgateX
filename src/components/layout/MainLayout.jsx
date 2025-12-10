import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import AIChatAssistant from '@components/common/AIChatAssistant';
import { useAuth } from '@hooks/useAuth';

const MainLayout = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Toggle sidebar collapse state
  const handleToggleSidebar = () => {
    setIsSidebarCollapsed(prev => !prev);
  };

  // Pages that should show sidebar (authenticated pages)
  const sidebarRoutes = [
    '/',
    '/dashboard',
    '/my-events',
    '/events',
    '/bookings',
    '/favorites',
    '/tickets',
    '/messages',
    '/activity',
    '/payments',
    '/organizer',
    '/admin',
    '/profile',
    '/settings',
    '/help',
  ];

  // Pages that should hide header and footer (auth pages)
  const authRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];

  // Landing page (home) - full screen with header overlay
  const isLandingPage = location.pathname === '/';

  // Determine if we should show the sidebar (only for authenticated users on specific routes)
  const showSidebar = user && (isLandingPage || sidebarRoutes.some((route) => location.pathname.startsWith(route)));
  const isAuthPage = authRoutes.some((route) => location.pathname.startsWith(route));

  // Public pages that should show header but not sidebar (for non-authenticated users)
  const isPublicPageWithHeader = !user && !isAuthPage;

  if (isAuthPage) {
    return <main className="min-h-screen bg-[var(--bg-primary)]">{children}</main>;
  }

  // Landing page layout for non-authenticated users - header overlays content
  if (isLandingPage && !user) {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--bg-primary)]">
        <Header
          showSidebarTrigger={false}
          isSidebarCollapsed={false}
          onToggleSidebar={handleToggleSidebar}
        />
        <main className="flex-1 pt-20">
          {children}
        </main>
        <Footer />
      </div>
    );
  }

  // Public pages for non-authenticated users (like /events when not logged in)
  if (isPublicPageWithHeader) {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--bg-primary)]">
        <Header
          showSidebarTrigger={false}
          isSidebarCollapsed={false}
          onToggleSidebar={handleToggleSidebar}
        />
        <main className="flex-1 pt-20">
          <div className="pt-6 px-4 lg:px-8 pb-8">
            {children}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Regular pages with integrated layout (authenticated users)
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Header */}
      <Header
        showSidebarTrigger={showSidebar}
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={handleToggleSidebar}
      />

      {/* Sidebar - only for authenticated users */}
      {showSidebar && (
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggle={handleToggleSidebar}
        />
      )}

      {/* Main Content */}
      <main
        className={`
          min-h-screen pt-20 transition-all duration-300
          ${showSidebar ? (isSidebarCollapsed ? 'lg:pl-[80px]' : 'lg:pl-[300px]') : ''}
        `}
      >
        <div className="px-4 lg:px-6 pb-8">
          {/* Breadcrumb Trail */}
          {showSidebar && !isLandingPage && (
            <div className="mb-6 flex items-center gap-2 text-sm text-[var(--text-muted)]">
              <span className="material-icons-outlined text-lg">home</span>
              <span>/</span>
              <span className="text-[var(--text-primary)] capitalize">
                {location.pathname.split('/').filter(Boolean)[0] || 'Dashboard'}
              </span>
              {location.pathname.split('/').filter(Boolean).length > 1 && (
                <>
                  <span>/</span>
                  <span className="text-[var(--text-primary)] capitalize">
                    {location.pathname.split('/').filter(Boolean)[1]}
                  </span>
                </>
              )}
            </div>
          )}

          {children}
        </div>
      </main>

      <Footer />

      {/* AI Chat Assistant - Role-based floating chat */}
      <AIChatAssistant />
    </div>
  );
};

export default MainLayout;
