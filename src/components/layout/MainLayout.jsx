import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import AIChatAssistant from '@components/common/AIChatAssistant';
import { useAuth } from '@hooks/useAuth';

const MainLayout = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  // Pages that should hide header and footer (auth pages)
  const authRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];
  const isAuthPage = authRoutes.some((route) => location.pathname.startsWith(route));
  const isLandingPage = location.pathname === '/';

  // If it's an authentication page, return minimal layout
  if (isAuthPage) {
    return <main className="min-h-screen bg-[var(--bg-primary)]">{children}</main>;
  }

  // Determine if breadcrumbs should be shown (Authenticated users on non-landing pages)
  const showBreadcrumbs = user && !isLandingPage;

  // Extract path segments for breadcrumbs logic
  const pathSegments = location.pathname.split('/').filter(Boolean);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)]">
      {/* Header - Fixed Top */}
      <Header showSidebarTrigger={false} />

      {/* Main Content Area */}
      <main className="flex-1 pt-1 transition-all duration-300">
        {/* Container with adaptive padding based on auth state to match original design */}
        <div className={`px-4 pb-8 ${user ? 'lg:px-6' : 'pt-6 lg:px-8'}`}>

          {/* Breadcrumb Trail */}
          {showBreadcrumbs && (
            <div className="mb-6 flex items-center gap-2 text-sm text-[var(--text-muted)]">
              <span className="material-icons-outlined text-lg">home</span>
              <span>/</span>
              <span className="text-[var(--text-primary)] capitalize">
                {pathSegments[0] || 'Dashboard'}
              </span>
              {pathSegments.length > 1 && (
                <>
                  <span>/</span>
                  <span className="text-[var(--text-primary)] capitalize">
                    {pathSegments[1]}
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