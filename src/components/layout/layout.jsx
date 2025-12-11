import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAuthContext } from '@context/AuthContext';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import AIChatAssistant from '@components/common/AIChatAssistant';

/**
 * Layout Component - FlowGateX
 * 
 * Provides adaptive layout structure with:
 * - Fixed Header Navbar (z-50, always on top)
 * - Fixed Sidebar (z-40, collapsible, role-based)
 * - Main Content Area (scrollable, responsive padding)
 * - AI Chat Assistant (floating, conditional)
 * 
 * Layout adapts based on:
 * - User authentication status
 * - User role (guest, user, organizer, admin)
 * - Route type (public, dashboard, auth pages)
 */

const Layout = ({ children }) => {
    const location = useLocation();
    const { user: contextUser, isAuthenticated, logout } = useAuthContext();
    const reduxAuth = useSelector((state) => state.auth) || {};
    const user = contextUser || reduxAuth.user;
    const isAuth = isAuthenticated || reduxAuth.isAuthenticated;
    const userRole = user?.role || 'guest';
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const layoutType = getLayoutType(location.pathname, isAuth);
    const showSidebar = layoutType === 'dashboard' || layoutType === 'admin' || layoutType === 'organizer';
    const showChatAssistant = isAuth && layoutType !== 'auth';
    useEffect(() => { setIsSidebarOpen(false); }, [location.pathname]);
    const handleSidebarToggle = () => setIsSidebarOpen((prev) => !prev);
    const handleSidebarCollapse = () => setIsSidebarCollapsed((prev) => !prev);
    const handleSidebarClose = () => setIsSidebarOpen(false);

    // Render children directly as main content
    return (
        <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col">
            {/* Navbar */}
            <Navbar
                user={user}
                userRole={userRole}
                showSidebarToggle={showSidebar}
                onSidebarToggle={handleSidebarToggle}
                onSidebarCollapse={handleSidebarCollapse}
                isSidebarOpen={isSidebarOpen}
                isSidebarCollapsed={isSidebarCollapsed}
                onLogout={logout}
            />
            <div className="flex flex-1 overflow-hidden">
                {showSidebar && (
                    <Sidebar
                        userRole={userRole}
                        isOpen={isSidebarOpen}
                        isCollapsed={isSidebarCollapsed}
                        onClose={handleSidebarClose}
                    />
                )}
                <main
                    className={`flex-1 overflow-y-auto transition-all duration-300 ${showSidebar ? (isSidebarCollapsed ? 'lg:ml-[4.5rem]' : 'lg:ml-64') : ''}`}
                >
                    <div className="p-4 sm:p-6 lg:p-8 h-full">
                        <div className="max-w-[1600px] mx-auto h-full">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
            {showChatAssistant && (
                <div className="fixed bottom-6 z-30 transition-all duration-300 right-6 lg:right-6">
                    <AIChatAssistant />
                </div>
            )}
        </div>
    );
};


// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Determines the layout type based on current route
 * @param {string} pathname - Current route pathname
 * @param {boolean} isAuthenticated - User authentication status
 * @returns {string} Layout type
 */
const getLayoutType = (pathname, isAuthenticated) => {
    // Auth pages (login, register, forgot-password, verify-email)
    if (
        pathname === '/login' ||
        pathname === '/register' ||
        pathname === '/forgot-password' ||
        pathname.startsWith('/verify-email') ||
        pathname.startsWith('/reset-password')
    ) {
        return 'auth';
    }

    // Landing page (root)
    if (pathname === '/') {
        return 'landing';
    }

    // Admin dashboard
    if (pathname.startsWith('/admin')) {
        return 'admin';
    }

    // Organizer dashboard
    if (pathname.startsWith('/organizer')) {
        return 'organizer';
    }

    // User dashboard and authenticated pages
    if (
        isAuthenticated && (
            pathname === '/dashboard' ||
            pathname.startsWith('/my-bookings') ||
            pathname.startsWith('/favorites') ||
            pathname.startsWith('/profile') ||
            pathname.startsWith('/settings') ||
            pathname.startsWith('/notifications') ||
            pathname.startsWith('/booking') ||
            pathname.startsWith('/bookings') ||
            pathname === '/events'
        )
    ) {
        return 'dashboard';
    }

    // Default layout for public pages (events, help, pricing, etc.)
    return 'default';
};

export default Layout;