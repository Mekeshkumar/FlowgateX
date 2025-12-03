import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import { useAuth } from '@hooks/useAuth';

const MainLayout = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  // Pages that should show sidebar (authenticated pages)
  const sidebarRoutes = [
    '/dashboard',
    '/my-events',
    '/bookings',
    '/favorites',
    '/organizer',
    '/admin',
    '/profile',
    '/settings',
  ];

  // Pages that should hide header and footer (auth pages)
  const authRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];

  const showSidebar = user && sidebarRoutes.some((route) => location.pathname.startsWith(route));
  const isAuthPage = authRoutes.some((route) => location.pathname.startsWith(route));

  if (isAuthPage) {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex flex-1">
        {showSidebar && (
          <Sidebar
            isCollapsed={isSidebarCollapsed}
            onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          />
        )}
        <main
          className={`flex-1 transition-all duration-300 ${
            showSidebar ? (isSidebarCollapsed ? 'ml-16' : 'ml-64') : ''
          }`}
        >
          <div className="min-h-[calc(100vh-4rem)]">{children}</div>
        </main>
      </div>
      {!showSidebar && <Footer />}
    </div>
  );
};

export default MainLayout;
