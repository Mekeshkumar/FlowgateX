import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import AIChatAssistant from '@components/common/AIChatAssistant';
import { useAuth } from '@hooks/useAuth';

const MainLayout = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  // Check if the current page is the Home page
  const isHomePage = location.pathname === '/';

  // For any page other than Home (Auth, Dashboard, etc.), return minimal layout
  if (!isHomePage) {
    return <main className="min-h-screen bg-[var(--bg-primary)]">{children}</main>;
  }

  // Render Full Layout ONLY for Home Page
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)]">
      {/* Header - Fixed Top */}
      <Header showSidebarTrigger={false} />

      {/* Main Content Area */}
      {/* pt-0 allows the Home page's internal Hero section to handle top spacing/overlay */}
      <main className="flex-1 pt-0 transition-all duration-300">
        {/* Adaptive padding based on auth state to match original design */}
        <div className={`px-4 pb-8 ${user ? 'lg:px-6' : 'pt-6 lg:px-8'}`}>
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