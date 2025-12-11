import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthContext } from '@context/AuthContext'; // Ensure alias is configured in vite.config/webpack

// ===========================
// CONFIGURATION & HELPERS
// ===========================

const Icon = ({ name, className = '' }) => (
    <span className={`material-icons-outlined select-none ${className}`} style={{ fontSize: 'inherit' }}>
        {name}
    </span>
);

const Badge = ({ count }) => {
    if (!count || count <= 0) return null;
    return (
        <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1.5 text-[9px] font-black text-white bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-primary-dark)] rounded-full shadow-lg ring-2 ring-[var(--bg-primary)] animate-pulse pointer-events-none">
            {count > 99 ? '99+' : count}
        </span>
    );
};

// ===========================
// ROLE-BASED NAVIGATION CONFIG
// ===========================
const NAVIGATION_CONFIG = {
    // Viewer / User (Personal Workspace)
    viewer: {
        label: 'Personal Workspace',
        primaryLinks: [
            { label: 'Home', to: '/dashboard', icon: 'home', description: 'Your personal dashboard' },
            { label: 'Discover', to: '/events', icon: 'explore', description: 'Browse all events' },
            { label: 'Bookings', to: '/bookings', icon: 'confirmation_number', description: 'Your tickets & bookings' },
            { label: 'Favorites', to: '/favorites', icon: 'favorite', description: 'Saved events' }
        ],
        quickActions: [
            { label: 'Book Tickets', icon: 'add_shopping_cart', to: '/events' },
            { label: 'My QR Codes', icon: 'qr_code_2', to: '/bookings' }
        ]
    },
    // Organizer (Organizer Console)
    organizer: {
        label: 'Organizer Console',
        primaryLinks: [
            { label: 'Dashboard', to: '/organizer/dashboard', icon: 'dashboard', description: 'Overview & metrics' },
            { label: 'Analytics', to: '/organizer/analytics', icon: 'insights', description: 'Revenue & performance' },
            { label: 'Events', to: '/organizer/events', icon: 'event_note', description: 'Manage your events' },
            { label: 'Attendees', to: '/organizer/attendees', icon: 'groups', description: 'Guest management' }
        ],
        quickActions: [
            { label: 'Create Event', icon: 'add_circle', to: '/organizer/events/create' },
            { label: 'View Reports', icon: 'assessment', to: '/organizer/analytics' }
        ]
    },
    // Admin (Administration Console)
    admin: {
        label: 'Admin Console',
        primaryLinks: [
            { label: 'Overview', to: '/admin/dashboard', icon: 'admin_panel_settings', description: 'System overview' },
            { label: 'Platform Data', to: '/admin/analytics', icon: 'query_stats', description: 'Platform analytics' },
            { label: 'Users', to: '/admin/users', icon: 'manage_accounts', description: 'User management' },
            { label: 'Approvals', to: '/admin/events/pending', icon: 'fact_check', description: 'Pending approvals', badge: 5 }
        ],
        quickActions: [
            { label: 'System Health', icon: 'health_and_safety', to: '/admin/system' },
            { label: 'Moderation', icon: 'verified_user', to: '/admin/moderation' }
        ]
    },
    // Guest (Fallback)
    guest: {
        label: 'Guest',
        primaryLinks: [
            { label: 'Home', to: '/', icon: 'home', description: 'Welcome page' },
            { label: 'Discover', to: '/events', icon: 'explore', description: 'Browse events' },
            { label: 'Pricing', to: '/pricing', icon: 'sell', description: 'View pricing plans' },
            { label: 'About', to: '/about', icon: 'info', description: 'Learn more' }
        ],
        quickActions: [
            { label: 'Sign Up', icon: 'person_add', to: '/register' },
            { label: 'Sign In', icon: 'login', to: '/login' }
        ]
    }
};

// Mock notifications for demo
const MOCK_NOTIFICATIONS = [
    { id: 1, title: 'New booking confirmed', message: 'Your ticket for Tech Summit 2024 is ready', time: '2m ago', icon: 'confirmation_number', unread: true, type: 'success' },
    { id: 2, title: 'Event reminder', message: 'Music Festival starts in 2 hours', time: '1h ago', icon: 'notifications_active', unread: true, type: 'info' },
    { id: 3, title: 'Payment received', message: '$250 payment successful', time: '3h ago', icon: 'payment', unread: false, type: 'success' },
];

// ===========================
// MAIN NAVBAR COMPONENT
// ===========================

const Navbar = ({
    user: propUser,
    onLogout: propOnLogout,
    onToggleSidebar,
    onSidebarCollapse,
    isSidebarOpen,
    isSidebarCollapsed
}) => {
    const location = useLocation();
    const navigate = useNavigate();

    // Get auth data from context (primary source of truth)
    // Fallback to empty object to prevent crashes if context provider is missing
    const { user: contextUser, logout, isAuthenticated } = useAuthContext() || {};

    // Use context user if available, fall back to prop
    const user = contextUser || propUser;
    const onLogout = propOnLogout || logout;

    // State
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'system');
    const [isScrolled, setIsScrolled] = useState(false);
    const [showQuickActions, setShowQuickActions] = useState(false);

    const navRef = useRef(null);

    // Determine Current Role & Config
    // Defensive check: ensure user exists before checking role
    const currentRole = (isAuthenticated && user?.role)
        ? (NAVIGATION_CONFIG[user.role] ? user.role : 'viewer')
        : 'guest';

    const roleConfig = NAVIGATION_CONFIG[currentRole] || NAVIGATION_CONFIG.guest;

    // Memoize notification count
    const unreadCount = useMemo(() => MOCK_NOTIFICATIONS.filter(n => n.unread).length, []);

    // ===========================
    // EFFECTS & HANDLERS
    // ===========================

    // Handle Click Outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (navRef.current && !navRef.current.contains(event.target)) {
                setActiveDropdown(null);
                setShowQuickActions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Scroll detection
    useEffect(() => {
        const handleScroll = () => {
            const scrolled = window.scrollY > 20;
            if (isScrolled !== scrolled) {
                setIsScrolled(scrolled);
            }
        };
        // Passive listener for performance
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isScrolled]);

    // Theme Handler (Enhanced with System Listener)
    useEffect(() => {
        const root = window.document.documentElement;

        const applyTheme = (targetTheme) => {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            const activeTheme = targetTheme === 'system' ? systemTheme : targetTheme;

            root.classList.remove('light', 'dark');
            root.classList.add(activeTheme);
            root.setAttribute('data-theme', activeTheme);
        };

        applyTheme(theme);
        localStorage.setItem('theme', theme);

        // Listen for system changes if theme is set to system
        if (theme === 'system') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handleChange = () => applyTheme('system');

            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        }
    }, [theme]);

    // Helper to toggle dropdowns
    const toggleDropdown = (name) => {
        if (activeDropdown === name) {
            setActiveDropdown(null);
        } else {
            setActiveDropdown(name);
            setShowQuickActions(false); // Close others
        }
    };

    // User Initials & Display Name
    const getUserName = () => {
        if (user?.name) return user.name;
        if (user?.firstName && user?.lastName) return `${user.firstName} ${user.lastName}`;
        if (user?.firstName) return user.firstName;
        return 'Guest User';
    };

    const userInitials = getUserName()
        .split(' ')
        .map(n => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase();

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyPress = (e) => {
            // Ctrl/Cmd + K for search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                document.getElementById('main-search')?.focus();
            }
            // Ctrl/Cmd + B for sidebar toggle
            if ((e.ctrlKey || e.metaKey) && e.key === 'b' && isAuthenticated && currentRole !== 'guest') {
                e.preventDefault();
                onToggleSidebar?.();
            }
            // Escape to close dropdowns
            if (e.key === 'Escape') {
                setActiveDropdown(null);
                setShowQuickActions(false);
            }
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [isAuthenticated, currentRole, onToggleSidebar]);

    return (
        <header
            ref={navRef}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? 'bg-[var(--bg-primary)]/95 backdrop-blur-xl shadow-lg border-b border-[var(--border-primary)]'
                : 'bg-[var(--bg-primary)] border-b border-[var(--border-primary)]'
                }`}
            style={{ '--navbar-height': '64px' }}
        >
            <div className="w-full h-16 px-4 sm:px-6 flex items-center justify-between gap-4">

                {/* ===========================
                    LEFT: SIDEBAR TOGGLE + BRAND
                   =========================== */}
                <div className="flex items-center gap-3 lg:gap-4">
                    {/* Sidebar Toggle Button (Icon-based) */}
                    {isAuthenticated && currentRole !== 'guest' && (
                        <button
                            onClick={onSidebarCollapse}
                            className="flex items-center justify-center w-10 h-10 rounded-xl text-[var(--text-secondary)] hover:text-[var(--brand-primary)] hover:bg-[var(--bg-hover)] transition-all duration-200 border border-transparent hover:border-[var(--border-primary)]"
                            title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                        >
                            <Icon name={isSidebarCollapsed ? "menu" : "menu_open"} className="text-2xl" />
                        </button>
                    )}

                    {/* Brand Logo - Enhanced */}
                    <Link to="/" className="flex items-center gap-3 group relative">
                        {/* Logo Container with enhanced effects */}
                        <div className="relative w-10 h-10 rounded-xl overflow-hidden">
                            {/* Animated gradient background */}
                            <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand-primary)] via-[var(--brand-primary-light)] to-[var(--brand-primary-dark)] animate-gradient-shift" />

                            {/* Pattern overlay */}
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay" />

                            {/* Icon */}
                            <div className="relative z-10 w-full h-full flex items-center justify-center">
                                <Icon name="auto_awesome" className="text-white text-2xl drop-shadow-lg group-hover:scale-110 transition-transform duration-300" />
                            </div>

                            {/* Glow effect on hover */}
                            <div className="absolute inset-0 bg-[var(--brand-primary)] opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-300" />
                        </div>

                        {/* Brand Text */}
                        <div className="hidden lg:flex flex-col">
                            <span className="text-xl font-bold tracking-wide text-[var(--text-primary)] leading-none group-hover:text-[var(--brand-primary)] transition-colors" style={{ fontFamily: 'var(--font-heading)' }}>
                                FlowGate<span className="text-[var(--brand-primary)]">X</span>
                            </span>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[9px] text-[var(--text-muted)] font-medium tracking-widest uppercase">
                                    {roleConfig?.label}
                                </span>
                                {/* Live indicator for active roles */}
                                {isAuthenticated && currentRole !== 'guest' && (
                                    <div className="flex items-center gap-1">
                                        <span className="relative flex h-1.5 w-1.5">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Link>
                </div>

                {/* ===========================
                    CENTER: DYNAMIC ROLE-BASED NAVIGATION
                   =========================== */}
                <div className="hidden xl:flex items-center justify-center flex-1 max-w-3xl mx-auto">
                    {/* Enhanced Glass Container with more details */}
                    <nav className="flex items-center gap-1 p-1.5 bg-[var(--bg-secondary)]/80 rounded-2xl border border-[var(--border-primary)]/80 backdrop-blur-md shadow-lg relative overflow-hidden">
                        {/* Animated background gradient */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--brand-primary)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        {roleConfig?.primaryLinks?.map((link) => {
                            const isActive = location.pathname.startsWith(link.to);
                            return (
                                <div key={link.to} className="relative group/item">
                                    <Link
                                        to={link.to}
                                        className={`
                                            relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 overflow-hidden
                                            ${isActive
                                                ? 'bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-primary-dark)] text-white shadow-lg shadow-[var(--brand-primary)]/30'
                                                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
                                            }
                                        `}
                                    >
                                        {/* Active indicator glow */}
                                        {isActive && (
                                            <div className="absolute inset-0 bg-white/10 animate-pulse" />
                                        )}

                                        <Icon
                                            name={link.icon}
                                            className={`text-lg relative z-10 transition-transform duration-300 group-hover/item:scale-110 ${isActive ? "text-white" : "text-[var(--text-muted)]"
                                                }`}
                                        />
                                        <span className="relative z-10">{link.label}</span>

                                        {/* Badge if exists */}
                                        {link.badge && (
                                            <span className="relative z-10 ml-1 px-2 py-0.5 bg-white/20 rounded-full text-[10px] font-black">
                                                {link.badge}
                                            </span>
                                        )}
                                    </Link>

                                    {/* Hover tooltip with description */}
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-2 bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-lg shadow-xl opacity-0 invisible group-hover/item:opacity-100 group-hover/item:visible transition-all duration-200 pointer-events-none whitespace-nowrap z-50">
                                        <p className="text-xs font-medium text-[var(--text-primary)] mb-0.5">{link.label}</p>
                                        <p className="text-[10px] text-[var(--text-muted)]">{link.description}</p>
                                        {/* Arrow */}
                                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[var(--bg-card)] border-t border-l border-[var(--border-primary)] rotate-45" />
                                    </div>
                                </div>
                            );
                        })}
                    </nav>
                </div>

                {/* ===========================
                    RIGHT: GLOBAL ACTIONS
                   =========================== */}
                <div className="flex items-center gap-2">

                    {/* Search Bar - Enhanced */}
                    <div className="relative hidden lg:block group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Icon
                                name="search"
                                className="text-[var(--text-muted)] group-focus-within:text-[var(--brand-primary)] transition-all duration-300 group-focus-within:scale-110"
                            />
                        </div>
                        <input
                            id="main-search"
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search events, venues..."
                            className="w-48 xl:w-64 pl-10 pr-20 py-2.5 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-[var(--text-primary)] text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)] focus:bg-[var(--bg-card)] transition-all placeholder:text-[var(--text-muted)]/60 shadow-inner hover:shadow-md focus:shadow-lg"
                            autoComplete="off"
                        />
                        <div className="absolute inset-y-0 right-0 pr-2 flex items-center gap-1 pointer-events-none">
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="pointer-events-auto p-1 rounded hover:bg-[var(--bg-hover)] transition-all"
                                >
                                    <Icon name="close" className="text-sm text-[var(--text-muted)]" />
                                </button>
                            )}
                            <kbd className="hidden xl:inline-flex items-center px-2 py-1 border border-[var(--border-primary)] rounded-md text-[10px] font-mono text-[var(--text-muted)] bg-[var(--bg-card)] shadow-sm">
                                ⌘K
                            </kbd>
                        </div>
                    </div>

                    {/* Quick Actions Button - New Feature */}
                    {isAuthenticated && currentRole !== 'guest' && roleConfig?.quickActions && (
                        <div className="relative">
                            <button
                                onClick={() => setShowQuickActions(!showQuickActions)}
                                aria-expanded={showQuickActions}
                                aria-haspopup="true"
                                className="p-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-secondary)] hover:text-[var(--brand-primary)] hover:bg-[var(--bg-hover)] hover:border-[var(--brand-primary)] transition-all duration-200 relative overflow-hidden group"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand-primary)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <Icon name="bolt" className="text-xl relative z-10 group-hover:rotate-12 transition-transform" />
                            </button>

                            {/* Quick Actions Dropdown */}
                            {showQuickActions && (
                                <div className="absolute top-full right-0 mt-2 w-72 bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 z-50">
                                    <div className="p-4 border-b border-[var(--border-primary)] bg-gradient-to-r from-[var(--brand-primary)]/10 to-transparent">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Icon name="bolt" className="text-[var(--brand-primary)]" />
                                            <h3 className="font-bold text-[var(--text-primary)] font-heading tracking-wide">Quick Actions</h3>
                                        </div>
                                        <p className="text-xs text-[var(--text-muted)]">Fast access to common tasks</p>
                                    </div>
                                    <div className="p-3 space-y-2">
                                        {roleConfig.quickActions.map((action, idx) => (
                                            <Link
                                                key={idx}
                                                to={action.to}
                                                onClick={() => setShowQuickActions(false)}
                                                className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--bg-hover)] transition-all group"
                                            >
                                                <div className="w-10 h-10 rounded-lg bg-[var(--brand-primary)]/10 flex items-center justify-center group-hover:bg-[var(--brand-primary)]/20 transition-colors">
                                                    <Icon name={action.icon} className="text-[var(--brand-primary)]" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--brand-primary)] transition-colors">
                                                        {action.label}
                                                    </p>
                                                </div>
                                                <Icon name="arrow_forward" className="text-sm text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Notifications - Enhanced */}
                    <div className="relative">
                        <button
                            onClick={() => toggleDropdown('notifications')}
                            aria-expanded={activeDropdown === 'notifications'}
                            aria-haspopup="true"
                            className={`relative p-2.5 rounded-xl transition-all duration-200 border overflow-hidden group ${activeDropdown === 'notifications'
                                ? 'bg-[var(--brand-primary)] text-white shadow-lg shadow-[var(--brand-primary)]/30 border-[var(--brand-primary)]'
                                : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] border-[var(--border-primary)] hover:border-[var(--brand-primary)]'
                                }`}
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <Icon name="notifications" className="text-xl relative z-10" />
                            <Badge count={unreadCount} />
                            {/* Ring animation for unread */}
                            {unreadCount > 0 && (
                                <span className="absolute inset-0 rounded-xl border-2 border-[var(--brand-primary)] animate-ping opacity-20" />
                            )}
                        </button>

                        {/* Enhanced Notifications Dropdown */}
                        {activeDropdown === 'notifications' && (
                            <div className="absolute top-full right-0 mt-3 w-96 bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 z-50">
                                {/* Header */}
                                <div className="flex items-center justify-between p-4 border-b border-[var(--border-primary)] bg-gradient-to-r from-[var(--bg-secondary)] to-[var(--bg-secondary)]/50 backdrop-blur-xl">
                                    <div className="flex items-center gap-2">
                                        <Icon name="notifications" className="text-[var(--brand-primary)]" />
                                        <span className="font-bold text-[var(--text-primary)] font-heading tracking-wide">NOTIFICATIONS</span>
                                        {unreadCount > 0 && (
                                            <span className="px-2 py-0.5 bg-[var(--brand-primary)]/20 text-[var(--brand-primary)] text-[10px] font-black rounded-full">
                                                {unreadCount} NEW
                                            </span>
                                        )}
                                    </div>
                                    <button className="text-[10px] text-[var(--brand-primary)] hover:underline font-bold uppercase tracking-wider">
                                        Mark all read
                                    </button>
                                </div>

                                {/* Notifications List */}
                                <div className="max-h-96 overflow-y-auto custom-scrollbar">
                                    {MOCK_NOTIFICATIONS.length > 0 ? (
                                        MOCK_NOTIFICATIONS.map((notif) => (
                                            <div
                                                key={notif.id}
                                                className={`p-4 border-b border-[var(--border-primary)] hover:bg-[var(--bg-hover)] transition-all cursor-pointer group ${notif.unread ? 'bg-[var(--brand-primary)]/5' : ''
                                                    }`}
                                            >
                                                <div className="flex gap-3">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${notif.type === 'success' ? 'bg-green-500/20 text-green-500' :
                                                        notif.type === 'warning' ? 'bg-yellow-500/20 text-yellow-500' :
                                                            'bg-blue-500/20 text-blue-500'
                                                        }`}>
                                                        <Icon name={notif.icon} className="text-lg" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between gap-2 mb-1">
                                                            <h4 className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--brand-primary)] transition-colors">
                                                                {notif.title}
                                                            </h4>
                                                            {notif.unread && (
                                                                <span className="w-2 h-2 bg-[var(--brand-primary)] rounded-full shrink-0 mt-1" />
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-[var(--text-muted)] mb-2 line-clamp-2">
                                                            {notif.message}
                                                        </p>
                                                        <span className="text-[10px] text-[var(--text-muted)] font-medium">
                                                            {notif.time}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-8 text-center">
                                            <Icon name="notifications_off" className="text-5xl mb-3 opacity-20 block mx-auto text-[var(--text-muted)]" />
                                            <p className="text-sm font-medium text-[var(--text-muted)]">No new notifications</p>
                                            <p className="text-xs text-[var(--text-muted)] mt-1">You&apos;re all caught up!</p>
                                        </div>
                                    )}
                                </div>

                                {/* Footer */}
                                <div className="p-3 border-t border-[var(--border-primary)] bg-[var(--bg-secondary)]/50">
                                    <Link
                                        to="/notifications"
                                        className="block text-center text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--brand-primary)] transition-colors py-1"
                                    >
                                        View All Notifications →
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Profile Dropdown - Enhanced */}
                    <div className="relative ml-1">
                        <button
                            onClick={() => toggleDropdown('profile')}
                            aria-expanded={activeDropdown === 'profile'}
                            aria-haspopup="true"
                            className={`flex items-center gap-2 pl-1 pr-3 py-1.5 rounded-full border transition-all duration-200 group ${activeDropdown === 'profile'
                                ? 'border-[var(--brand-primary)] bg-[var(--bg-card)] shadow-lg'
                                : 'border-transparent hover:bg-[var(--bg-hover)] hover:border-[var(--border-primary)]'
                                }`}
                        >
                            {/* Avatar with enhanced styling */}
                            <div className="relative w-9 h-9">
                                {/* Gradient ring */}
                                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-primary-dark)] p-[2px] group-hover:scale-110 transition-transform">
                                    <div className="w-full h-full rounded-full bg-[var(--bg-card)] flex items-center justify-center overflow-hidden">
                                        {user?.avatar ? (
                                            <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-xs font-black text-[var(--brand-primary)]">{userInitials}</span>
                                        )}
                                    </div>
                                </div>
                                {/* Online status indicator */}
                                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-[var(--bg-primary)] rounded-full">
                                    <span className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75" />
                                </div>
                            </div>

                            {/* User info - desktop only */}
                            <div className="hidden xl:block text-left">
                                <p className="text-xs font-semibold text-[var(--text-primary)] leading-none group-hover:text-[var(--brand-primary)] transition-colors">
                                    {getUserName()}
                                </p>
                                <p className="text-[10px] text-[var(--text-muted)] mt-0.5">
                                    {user?.email?.substring(0, 20) || 'guest@flowgate.com'}
                                </p>
                            </div>

                            <Icon
                                name="expand_more"
                                className={`text-[var(--text-muted)] text-lg transition-all duration-300 ${activeDropdown === 'profile' ? 'rotate-180 text-[var(--brand-primary)]' : ''
                                    }`}
                            />
                        </button>

                        {/* Enhanced Profile Menu */}
                        {activeDropdown === 'profile' && (
                            <div className="absolute top-full right-0 mt-3 w-72 bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 z-50 ring-1 ring-white/5">
                                {/* User Info Section */}
                                <div className="p-5 border-b border-[var(--border-primary)] bg-gradient-to-br from-[var(--bg-secondary)] via-[var(--bg-secondary)]/80 to-transparent backdrop-blur-xl relative overflow-hidden">
                                    {/* Decorative background */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--brand-primary)]/10 rounded-full blur-3xl" />

                                    <div className="relative">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-primary-dark)] flex items-center justify-center text-white font-black text-lg shadow-lg">
                                                {userInitials}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-[var(--text-primary)] text-base font-heading truncate">
                                                    {getUserName()}
                                                </h4>
                                                <p className="text-xs text-[var(--text-muted)] font-mono truncate">{user?.email || 'guest@flowgate.com'}</p>
                                            </div>
                                        </div>

                                        {/* Role badge */}
                                        <div className="flex items-center justify-between">
                                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-[var(--brand-primary)]/20 to-[var(--brand-primary)]/10 border border-[var(--brand-primary)]/30">
                                                <Icon name="workspace_premium" className="text-[var(--brand-primary)] text-sm" />
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--brand-primary)]">
                                                    {currentRole}
                                                </span>
                                            </div>
                                            {/* Quick stats if applicable */}
                                            {isAuthenticated && currentRole !== 'guest' && (
                                                <div className="flex items-center gap-1 text-[10px] text-[var(--text-muted)]">
                                                    <Icon name="verified" className="text-green-500 text-sm" />
                                                    <span>Verified</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Menu Links (Shared / Global) */}
                                <div className="p-2 space-y-1">
                                    {[
                                        { label: 'My Profile', to: '/profile', icon: 'badge', desc: 'View & edit profile' },
                                        { label: 'Account Settings', to: '/settings', icon: 'settings', desc: 'Preferences & security' },
                                        { label: 'Help Center', to: '/help', icon: 'help_center', desc: 'Get support' },
                                    ].map((item) => (
                                        <Link
                                            key={item.label}
                                            to={item.to}
                                            onClick={() => setActiveDropdown(null)}
                                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-all group relative overflow-hidden"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-[var(--brand-primary)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <div className="w-9 h-9 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center group-hover:bg-[var(--brand-primary)]/10 transition-colors">
                                                <Icon name={item.icon} className="text-[var(--text-muted)] group-hover:text-[var(--brand-primary)] transition-colors text-lg" />
                                            </div>
                                            <div className="flex-1 relative z-10">
                                                <p className="font-semibold">{item.label}</p>
                                                <p className="text-[10px] text-[var(--text-muted)]">{item.desc}</p>
                                            </div>
                                            <Icon name="arrow_forward" className="text-sm text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </Link>
                                    ))}
                                </div>

                                {/* Theme Switcher - Enhanced */}
                                <div className="px-4 py-3 border-t border-[var(--border-primary)] bg-[var(--bg-secondary)]/30">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Interface Theme</p>
                                        <Icon name="palette" className="text-sm text-[var(--text-muted)]" />
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                        {[
                                            { id: 'light', icon: 'light_mode', label: 'Light' },
                                            { id: 'dark', icon: 'dark_mode', label: 'Dark' },
                                            { id: 'system', icon: 'contrast', label: 'Auto' },
                                        ].map((t) => (
                                            <button
                                                key={t.id}
                                                onClick={() => setTheme(t.id)}
                                                className={`relative flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all duration-200 group overflow-hidden ${theme === t.id
                                                    ? 'bg-gradient-to-br from-[var(--brand-primary)]/20 to-[var(--brand-primary)]/10 border-[var(--brand-primary)] text-[var(--brand-primary)] shadow-md'
                                                    : 'bg-[var(--bg-tertiary)] border-transparent text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] hover:border-[var(--border-primary)]'
                                                    }`}
                                            >
                                                {theme === t.id && (
                                                    <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-[var(--brand-primary)] rounded-full" />
                                                )}
                                                <Icon name={t.icon} className="text-xl mb-1 transition-transform group-hover:scale-110" />
                                                <span className="text-[9px] font-bold">{t.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Logout - Enhanced */}
                                <div className="p-2 border-t border-[var(--border-primary)] bg-gradient-to-r from-red-500/5 to-transparent">
                                    <button
                                        onClick={async () => {
                                            setActiveDropdown(null);
                                            if (onLogout) {
                                                await onLogout();
                                            }
                                            navigate('/login');
                                        }}
                                        className="flex items-center justify-center gap-2 w-full px-3 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-500/10 transition-all group relative overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <Icon name="logout" className="text-lg relative z-10 group-hover:rotate-12 transition-transform" />
                                        <span className="relative z-10">Sign Out</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;