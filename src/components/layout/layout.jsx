import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
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

const Layout = () => {
    const location = useLocation();

    // Get auth data from context (primary source)
    const { user: contextUser, isAuthenticated, logout } = useAuthContext();

    // Fallback to Redux state if context not available
    const reduxAuth = useSelector((state) => state.auth) || {};

    // Combine sources: context takes precedence over Redux
    const user = contextUser || reduxAuth.user;
    const isAuth = isAuthenticated || reduxAuth.isAuthenticated;
    const userRole = user?.role || 'guest';

    // Local State
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    // Determine layout type based on route
    const layoutType = getLayoutType(location.pathname, isAuth);

    // Sidebar visibility rules
    const showSidebar = layoutType === 'dashboard' || layoutType === 'admin' || layoutType === 'organizer';
    const showChatAssistant = isAuth && layoutType !== 'auth';

    // Close mobile sidebar on route change
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [location.pathname]);

    // Handle sidebar open/close (mobile)
    const handleSidebarToggle = () => {
        setIsSidebarOpen((prev) => !prev);
    };
    // Collapse/expand sidebar (desktop)
    const handleSidebarCollapse = () => {
        setIsSidebarCollapsed((prev) => !prev);
    };
    // Close sidebar (mobile)
    const handleSidebarClose = () => {
        setIsSidebarOpen(false);
    };

    // Render different layouts based on type
    switch (layoutType) {
        case 'auth':
            return <AuthLayout />;

        case 'landing':
            return (
                <LandingLayout
                    user={user}
                    isAuthenticated={isAuth}
                    onSidebarToggle={handleSidebarToggle}
                    onSidebarCollapse={handleSidebarCollapse}
                    isSidebarCollapsed={isSidebarCollapsed}
                    onLogout={logout}
                />
            );

        case 'dashboard':
        case 'organizer':
        case 'admin':
            return (
                <DashboardLayout
                    user={user}
                    userRole={userRole}
                    showSidebar={showSidebar}
                    showChatAssistant={showChatAssistant}
                    isSidebarOpen={isSidebarOpen}
                    isSidebarCollapsed={isSidebarCollapsed}
                    onSidebarToggle={handleSidebarToggle}
                    onSidebarCollapse={handleSidebarCollapse}
                    onSidebarClose={handleSidebarClose}
                />
            );

        default:
            return (
                <DefaultLayout
                    user={user}
                    userRole={userRole}
                    showChatAssistant={showChatAssistant}
                    onSidebarToggle={handleSidebarToggle}
                    onSidebarCollapse={handleSidebarCollapse}
                    isSidebarCollapsed={isSidebarCollapsed}
                    onLogout={logout}
                />
            );
    }
};

// ============================================================================
// AUTH LAYOUT (Login/Register/Forgot Password Pages)
// ============================================================================
const AuthLayout = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900">
            <Outlet />
        </div>
    );
};

// ============================================================================
// LANDING PAGE LAYOUT (Homepage)
// ============================================================================
const LandingLayout = ({ user, onSidebarToggle, onSidebarCollapse, isSidebarCollapsed, onLogout }) => {
    return (
        <div className="min-h-screen bg-[var(--bg-primary)]">
            {/* Fixed Navbar */}
            <Navbar
                user={user}
                onLogout={onLogout}
                showSidebarToggle={false}
                onToggleSidebar={onSidebarToggle}
                onSidebarCollapse={onSidebarCollapse}
                isSidebarCollapsed={isSidebarCollapsed}
            />

            {/* Main Content - No top padding, hero handles spacing */}
            <main className="pt-0">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-[var(--bg-secondary)] border-t border-[var(--border-primary)]">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="text-center text-sm text-[var(--text-muted)]">
                        © {new Date().getFullYear()} FlowGateX. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

// ============================================================================
// DEFAULT LAYOUT (Public pages with navbar, no sidebar)
// ============================================================================
const DefaultLayout = ({ user, showChatAssistant, onSidebarToggle, onSidebarCollapse, isSidebarCollapsed, onLogout }) => {
    return (
        <div className="min-h-screen bg-[var(--bg-primary)]">
            {/* Fixed Navbar - z-50 */}
            <Navbar
                user={user}
                onLogout={onLogout}
                showSidebarToggle={false}
                onToggleSidebar={onSidebarToggle}
                onSidebarCollapse={onSidebarCollapse}
                isSidebarCollapsed={isSidebarCollapsed}
            />

            {/* Main Content - Below navbar (h-16 = 64px navbar height) */}
            <main className="h-[calc(100vh-64px)] mt-16 overflow-y-auto">
                <Outlet />
            </main>

            {/* AI Chat Assistant */}
            {showChatAssistant && <AIChatAssistant />}
        </div>
    );
};

// ============================================================================
// DASHBOARD LAYOUT (With Sidebar - User/Organizer/Admin)
// ============================================================================
const DashboardLayout = ({
    user,
    userRole,
    showSidebar,
    showChatAssistant,
    isSidebarOpen,
    isSidebarCollapsed,
    onSidebarToggle,
    onSidebarCollapse,
    onSidebarClose
}) => {
    // Get logout from context
    const { logout } = useAuthContext();

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col">
            {/* Layer 1: Fixed Navbar - z-50, always on top, h-16 */}
            <Navbar
                user={user}
                userRole={userRole}
                showSidebarToggle={showSidebar}
                onSidebarToggle={onSidebarToggle}
                onSidebarCollapse={onSidebarCollapse}
                isSidebarOpen={isSidebarOpen}
                isSidebarCollapsed={isSidebarCollapsed}
                onLogout={logout}
            />

            {/* Layer 2: Main Content + Sidebar Container - flex row layout */}
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar - z-40, fixed height, below navbar, left side */}
                {showSidebar && (
                    <Sidebar
                        userRole={userRole}
                        isOpen={isSidebarOpen}
                        isCollapsed={isSidebarCollapsed}
                        onClose={onSidebarClose}
                    />
                )}

                {/* Main Content Area - flex-1 to fill remaining space */}
                <main
                    className={`
                        flex-1 overflow-y-auto transition-all duration-300
                        ${showSidebar ? 'lg:ml-0' : ''}
                    `}
                >
                    {/* Content Container with Padding */}
                    <div className="p-4 sm:p-6 lg:p-8 h-full">
                        {/* Scrollable Content with max-width */}
                        <div className="max-w-[1600px] mx-auto h-full">
                            <Outlet />
                        </div>
                    </div>
                </main>
            </div>

            {/* Layer 3: AI Chat Assistant - z-30, floating overlay */}
            {showChatAssistant && (
                <div
                    className={`
                        fixed bottom-6 z-30 transition-all duration-300
                        ${showSidebar ? 'right-6 lg:right-6' : 'right-6'}
                    `}
                >
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
            pathname.startsWith('/saved-events') ||
            pathname.startsWith('/profile') ||
            pathname.startsWith('/settings') ||
            pathname.startsWith('/notifications')
        )
    ) {
        return 'dashboard';
    }

    // Default layout for public pages (events, help, pricing, etc.)
    return 'default';
};

export default Layout;