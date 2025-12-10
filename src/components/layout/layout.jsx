import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useAuth } from '@hooks/useAuth';

export const Layout = ({ children }) => {
    // ===========================
    // STATE MANAGEMENT
    // ===========================
    const auth = useAuth();
    const user = auth?.user || {
        name: 'James Collison',
        email: 'james@flowgate.com',
        role: 'admin',
        avatar: null
    };
    const logout = auth?.logout || (() => console.log('Logging out...'));
    const [isScrolled, setIsScrolled] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [theme, setTheme] = useState('dark');
    const [searchFocused, setSearchFocused] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [notificationModalOpen, setNotificationModalOpen] = useState(false);
    const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
    const [activeSubmenu, setActiveSubmenu] = useState(null);
    const [tooltipContent, setTooltipContent] = useState(null);
    const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
    const [showQuickStats, setShowQuickStats] = useState(true);
    const [hoveredItem, setHoveredItem] = useState(null);

    const sidebarRef = useRef(null);
    const headerRef = useRef(null);

    // ===========================
    // HELPER FUNCTIONS
    // ===========================
    const getUserInitials = useMemo(() => {
        if (!user?.name) return 'U';
        const names = user.name.split(' ');
        if (names.length >= 2) {
            return `${names[0][0]}${names[1][0]}`.toUpperCase();
        }
        return names[0].substring(0, 2).toUpperCase();
    }, [user?.name]);

    // ===========================
    // THEME MANAGEMENT
    // ===========================
    const toggleTheme = useCallback(() => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    }, [theme]);

    // ===========================
    // EVENT LISTENERS
    // ===========================
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        const handleClickOutside = (event) => {
            if (headerRef.current && !headerRef.current.contains(event.target)) {
                setActiveDropdown(null);
            }
            if (isMobileSidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setIsMobileSidebarOpen(false);
            }
        };

        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
                e.preventDefault();
                setIsSidebarCollapsed(prev => !prev);
            }
            if (e.key === 'Escape') {
                setIsMobileSidebarOpen(false);
                setActiveDropdown(null);
            }
        };

        window.addEventListener('scroll', handleScroll);
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isMobileSidebarOpen]);

    // ===========================
    // MOCK DATA
    // ===========================
    const notifications = [
        { id: 1, title: 'System Update', message: 'New features available', time: '5 min ago', icon: 'info', unread: true },
        { id: 2, title: 'New User Registered', message: 'John Doe joined the platform', time: '1 hour ago', icon: 'person_add', unread: true },
        { id: 3, title: 'Backup Complete', message: 'Database backup successful', time: '2 hours ago', icon: 'backup', unread: false },
    ];

    const menuConfig = useMemo(() => ({
        label: 'Admin Console',
        primary: [
            { name: 'Dashboard', href: '#dashboard', icon: 'dashboard' },
            { name: 'Analytics', href: '#analytics', icon: 'analytics' },
            {
                name: 'Users',
                icon: 'manage_accounts',
                submenu: [
                    { name: 'All Users', href: '#users', icon: 'people' },
                    { name: 'Roles', href: '#roles', icon: 'admin_panel_settings' },
                    { name: 'Permissions', href: '#permissions', icon: 'security' }
                ]
            },
            {
                name: 'Events',
                icon: 'event_available',
                submenu: [
                    { name: 'All Events', href: '#events', icon: 'event_note' },
                    { name: 'Approvals', href: '#approvals', icon: 'pending_actions', badge: 3 }
                ]
            },
            { name: 'Reports', href: '#reports', icon: 'assessment' },
            { name: 'Settings', href: '#settings', icon: 'settings' }
        ],
        quickActions: [
            { name: 'New Event', icon: 'add_circle', action: () => console.log('New Event'), color: 'primary' },
            { name: 'Export', icon: 'download', action: () => console.log('Export'), color: 'secondary' }
        ]
    }), []);

    // ===========================
    // MOCK DATA
    // ===========================
    const quickStats = useMemo(() => ({ ticketsSold: 234, revenue: 12450, attendance: 89 }), []);
    const iotDevices = useMemo(() => [
        { name: 'Gate 1', status: 'online' },
        { name: 'Gate 2', status: 'online' },
        { name: 'Gate 3', status: 'offline' }
    ], []);

    // Check if path is active
    const isPathActive = useCallback((href) => {
        if (!href) return false;
        return location.pathname === href || location.pathname.startsWith(href + '/');
    }, [location.pathname]);

    const unreadCount = notifications.filter(n => n.unread).length;

    // ===========================
    // TOOLTIP HANDLERS
    // ===========================
    const showTooltip = useCallback((content, e) => {
        if (!isSidebarCollapsed) return;
        const rect = e.currentTarget.getBoundingClientRect();
        setTooltipContent(content);
        setTooltipPosition({
            top: rect.top + rect.height / 2,
            left: rect.right + 12,
        });
    }, [isSidebarCollapsed]);

    const hideTooltip = useCallback(() => {
        setTooltipContent(null);
    }, []);

    // ===========================
    // RENDER MENU ITEM (FUTURISTIC DESIGN)
    // ===========================
    const renderMenuItem = useCallback((item) => {
        const hasSubmenu = item.submenu && item.submenu.length > 0;
        const isSubmenuOpen = activeSubmenu === item.name;
        const isActive = item.href && isPathActive(item.href);

        const baseItemClass = `
            relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium 
            transition-all duration-300 ease-out group w-full
            ${isSidebarCollapsed ? 'justify-center' : 'justify-start'}
        `;

        const activeItemClass = `
            bg-gradient-to-r from-[var(--brand-primary)]/20 via-[var(--brand-primary)]/10 to-transparent
            text-[var(--brand-primary)] border-l-4 border-[var(--brand-primary)]
            shadow-lg shadow-[var(--brand-primary)]/20
        `;

        const inactiveItemClass = `
            text-[var(--text-secondary)] hover:bg-gradient-to-r hover:from-[var(--bg-hover)] 
            hover:to-transparent hover:text-[var(--text-primary)] 
            hover:border-l-4 hover:border-[var(--brand-primary)]/30
            border-l-4 border-transparent
            hover:shadow-md hover:shadow-[var(--brand-primary)]/10
        `;

        const itemContent = (
            <>
                <span className={`material-icons-outlined text-xl shrink-0 transition-all duration-300 ${isActive
                    ? 'text-[var(--brand-primary)] scale-110'
                    : 'text-[var(--text-muted)] group-hover:text-[var(--brand-primary)] group-hover:scale-110'
                    }`}>
                    {item.icon}
                </span>

                {!isSidebarCollapsed && (
                    <>
                        <span className="flex-1 text-left truncate font-medium">{item.name}</span>
                        {item.badge && (
                            <span className="px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-primary-dark)] text-white shadow-md animate-pulse">
                                {item.badge}
                            </span>
                        )}
                        {hasSubmenu && (
                            <span className={`material-icons-outlined text-lg transition-all duration-300 ${isSubmenuOpen ? 'rotate-180 text-[var(--brand-primary)]' : 'text-[var(--text-muted)]'
                                }`}>
                                expand_more
                            </span>
                        )}
                    </>
                )}
            </>
        );

        if (hasSubmenu) {
            return (
                <li key={item.name} className="relative mb-2">
                    <button
                        onClick={() => setActiveSubmenu(prev => prev === item.name ? null : item.name)}
                        onMouseEnter={(e) => {
                            showTooltip(item.name, e);
                            setHoveredItem(item.name);
                        }}
                        onMouseLeave={() => {
                            hideTooltip();
                            setHoveredItem(null);
                        }}
                        className={`${baseItemClass} ${isActive ? activeItemClass : inactiveItemClass}`}
                    >
                        {itemContent}
                    </button>

                    <div className={`overflow-hidden transition-all duration-500 ease-out ${!isSidebarCollapsed && isSubmenuOpen ? 'max-h-[500px] opacity-100 mt-2' : 'max-h-0 opacity-0'
                        }`}>
                        <ul className="pl-4 space-y-1 border-l-2 border-[var(--brand-primary)]/20 ml-6">
                            {item.submenu.map(subItem => {
                                const isSubActive = isPathActive(subItem.href);
                                return (
                                    <li key={subItem.name}>
                                        <NavLink
                                            to={subItem.href}
                                            className={({ isActive: navActive }) => `
                                                flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-200
                                                ${navActive || isSubActive
                                                    ? 'text-[var(--brand-primary)] bg-[var(--brand-primary)]/10 font-semibold'
                                                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
                                                }
                                            `}
                                        >
                                            <span className="material-icons-outlined text-base">{subItem.icon}</span>
                                            {!isSidebarCollapsed && <span>{subItem.name}</span>}
                                            {subItem.badge && (
                                                <span className="ml-auto w-2 h-2 rounded-full bg-[var(--brand-primary)] animate-pulse"></span>
                                            )}
                                        </NavLink>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    {isSidebarCollapsed && hoveredItem === item.name && (
                        <div className="absolute left-[calc(100%+16px)] top-0 w-56 bg-[var(--bg-card)]/95 backdrop-blur-xl border border-[var(--border-primary)] rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            <div className="px-4 py-3 bg-gradient-to-r from-[var(--brand-primary)]/10 to-transparent border-b border-[var(--border-primary)]">
                                <div className="flex items-center gap-2">
                                    <span className="material-icons-outlined text-[var(--brand-primary)] text-lg">{item.icon}</span>
                                    <span className="text-xs font-bold text-[var(--brand-primary)] uppercase tracking-wider">{item.name}</span>
                                </div>
                            </div>
                            {item.submenu.map(subItem => (
                                <NavLink
                                    key={subItem.name}
                                    to={subItem.href}
                                    className="flex items-center gap-3 px-4 py-3 text-sm transition-all duration-200 text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
                                >
                                    <span className="material-icons-outlined text-base">{subItem.icon}</span>
                                    <span>{subItem.name}</span>
                                </NavLink>
                            ))}
                        </div>
                    )}
                </li>
            );
        }

        return (
            <li key={item.name} className="mb-2">
                <NavLink
                    to={item.href || '#'}
                    onMouseEnter={(e) => showTooltip(item.name, e)}
                    onMouseLeave={hideTooltip}
                    className={({ isActive: navActive }) => `
                        ${baseItemClass} ${navActive || isActive ? activeItemClass : inactiveItemClass}
                    `}
                >
                    {itemContent}
                </NavLink>
            </li>
        );
    }, [isSidebarCollapsed, activeSubmenu, showTooltip, hideTooltip, hoveredItem, isPathActive]);

    return (
        <div className="min-h-screen bg-[var(--bg-primary)]">
            {/* ===========================
          HEADER
      =========================== */}
            <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${isScrolled ? 'pt-4 px-4 sm:px-6 lg:px-8' : 'pt-0 px-0'}`}>
                <header
                    ref={headerRef}
                    style={{
                        backgroundColor: theme === 'dark' ? 'rgba(17, 17, 17, 0.85)' : 'rgba(248, 248, 248, 0.85)',
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                    }}
                    className={`w-full mx-auto transition-all duration-500 ease-in-out ${isScrolled ? 'max-w-7xl rounded-2xl shadow-2xl border border-[var(--border-primary)]' : 'max-w-full rounded-none border-b border-[var(--border-primary)]'}`}
                >
                    <div className="px-4 sm:px-6 py-3">
                        <div className="flex items-center justify-between gap-3 lg:gap-6">
                            {/* Sidebar Toggle */}
                            {showSidebarTrigger && (
                                <button
                                    onClick={handleToggleSidebar}
                                    className="hidden lg:flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-[var(--text-secondary)] hover:text-[var(--brand-primary)] hover:border-[var(--brand-primary)] hover:bg-[var(--bg-hover)] transition-all duration-200 shrink-0 group relative overflow-hidden"
                                >
                                    <span className="material-icons-outlined text-xl relative z-10 transition-transform group-hover:scale-110">
                                        {isSidebarCollapsed ? 'menu' : 'menu_open'}
                                    </span>
                                    <span className="absolute inset-0 bg-gradient-to-r from-[var(--brand-primary)]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                </button>
                            )}

                            {/* Brand Logo */}
                            <NavLink to="/" className="flex items-center gap-2 sm:gap-3 group shrink-0">
                                <div className="relative">
                                    <span className="material-icons-outlined text-3xl sm:text-4xl text-[var(--brand-primary)] transition-all duration-500 group-hover:scale-110 group-hover:rotate-12">
                                        auto_awesome
                                    </span>
                                    <span className="absolute inset-0 bg-[var(--brand-primary)]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xl sm:text-2xl font-bold tracking-wide text-[var(--text-primary)] leading-none group-hover:text-[var(--brand-primary)] transition-colors">
                                        FlowGate<span className="text-[var(--brand-primary)]">X</span>
                                    </span>
                                    <span className="hidden sm:block text-[9px] text-[var(--text-muted)] font-medium tracking-widest uppercase">
                                        Access Control
                                    </span>
                                </div>
                            </NavLink>

                            {/* Search Bar */}
                            <div className="hidden md:flex flex-1 max-w-md lg:max-w-lg xl:max-w-xl">
                                <div className={`relative w-full transition-all duration-300 ${searchFocused ? 'scale-[1.02]' : ''}`}>
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                        <span className={`material-icons-outlined text-lg transition-all duration-300 ${searchFocused ? 'text-[var(--brand-primary)] animate-pulse' : 'text-[var(--text-muted)]'}`}>
                                            search
                                        </span>
                                    </div>
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onFocus={() => setSearchFocused(true)}
                                        onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                                        className="w-full pl-12 pr-12 py-3 h-11 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-2xl text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary)]/20 transition-all"
                                        placeholder="Search..."
                                    />
                                </div>
                            </div>

                            {/* Header Actions */}
                            <nav className="hidden lg:flex items-center gap-2">
                                <button
                                    onClick={() => setNotificationModalOpen(true)}
                                    className="relative p-2.5 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-all"
                                >
                                    <span className="material-icons-outlined text-xl">notifications</span>
                                    {unreadCount > 0 && (
                                        <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[var(--brand-primary)] rounded-full text-white text-[10px] font-bold flex items-center justify-center">
                                            {unreadCount}
                                        </span>
                                    )}
                                </button>

                                <button
                                    onClick={toggleTheme}
                                    className="p-2.5 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-all relative overflow-hidden group"
                                >
                                    <span className="material-icons-outlined text-xl relative z-10 transition-transform group-hover:rotate-180">
                                        {theme === 'dark' ? 'light_mode' : 'dark_mode'}
                                    </span>
                                    <span className="absolute inset-0 bg-gradient-to-r from-[var(--brand-primary)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                </button>

                                <div className="relative">
                                    <button
                                        onClick={() => setActiveDropdown(activeDropdown === 'account' ? null : 'account')}
                                        className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-[var(--bg-hover)] transition-all"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-[var(--brand-primary)] flex items-center justify-center text-white font-bold text-sm">
                                            {getUserInitials}
                                        </div>
                                        <span className="material-icons-outlined text-sm text-[var(--text-muted)]">expand_more</span>
                                    </button>

                                    {activeDropdown === 'account' && (
                                        <div className="absolute top-full right-0 mt-2 w-64 bg-[var(--bg-card)]/95 backdrop-blur-xl border border-[var(--border-primary)] rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                            <div className="p-2">
                                                <div className="px-3 py-3 border-b border-[var(--border-primary)] mb-1 bg-gradient-to-r from-[var(--brand-primary)]/5 to-transparent">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-primary-dark)] flex items-center justify-center text-white font-bold text-sm">
                                                            {getUserInitials}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-bold text-[var(--text-primary)] truncate">{user.name || user.firstName || 'User'}</p>
                                                            <p className="text-xs text-[var(--text-muted)] truncate">{user.email}</p>
                                                            <span className={`inline-block mt-1 px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider ${user.role === 'admin' ? 'bg-red-500/20 text-red-400' :
                                                                user.role === 'organizer' ? 'bg-blue-500/20 text-blue-400' :
                                                                    'bg-emerald-500/20 text-emerald-400'
                                                                }`}>
                                                                {user.role || 'user'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <NavLink
                                                    to="/profile"
                                                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] rounded-lg transition-all"
                                                    onClick={() => setActiveDropdown(null)}
                                                >
                                                    <span className="material-icons-outlined text-base">person</span>
                                                    <span>Profile</span>
                                                </NavLink>
                                                <NavLink
                                                    to="/settings"
                                                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] rounded-lg transition-all"
                                                    onClick={() => setActiveDropdown(null)}
                                                >
                                                    <span className="material-icons-outlined text-base">settings</span>
                                                    <span>Settings</span>
                                                </NavLink>
                                                <div className="border-t border-[var(--border-primary)] mt-1 pt-1">
                                                    <button
                                                        onClick={logout}
                                                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                                    >
                                                        <span className="material-icons-outlined text-base">logout</span>
                                                        <span>Logout</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </nav>

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setIsMobileSidebarOpen(true)}
                                className="lg:hidden p-2 rounded-xl text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-all"
                            >
                                <span className="material-icons-outlined text-2xl">menu</span>
                            </button>
                        </div>
                    </div>
                </header>
            </div>

            {/* Spacer */}
            <div className="h-20 sm:h-24"></div>

            {/* ===========================
          DESKTOP SIDEBAR
      =========================== */}
            <aside
                ref={sidebarRef}
                className={`fixed top-0 left-0 h-screen z-40 bg-[var(--bg-card)] border-r border-[var(--border-primary)] hidden lg:block shadow-2xl transition-all duration-500 ${isSidebarCollapsed ? 'w-[80px]' : 'w-[300px]'}`}
            >
                <div className="flex flex-col h-full">
                    {/* Sidebar Header */}
                    <div className={`h-20 flex items-center border-b border-[var(--border-primary)] shrink-0 bg-gradient-to-b from-[var(--bg-secondary)]/50 to-transparent relative overflow-hidden ${isSidebarCollapsed ? 'justify-center px-3' : 'justify-between px-5'}`}>
                        <div className="absolute inset-0 bg-gradient-to-r from-[var(--brand-primary)]/5 via-transparent to-transparent opacity-50"></div>
                        <div className="flex items-center gap-3 overflow-hidden relative z-10">
                            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-primary-dark)] flex items-center justify-center text-white shadow-xl relative group">
                                <span className="material-icons text-2xl relative z-10 transition-transform group-hover:rotate-12">auto_awesome</span>
                                <span className="absolute inset-0 bg-[var(--brand-primary)] blur-xl opacity-50 group-hover:opacity-100 transition-opacity"></span>
                            </div>
                            {!isSidebarCollapsed && (
                                <div className="flex flex-col">
                                    <span className="font-black text-xl leading-tight bg-gradient-to-r from-[var(--text-primary)] to-[var(--brand-primary)] bg-clip-text text-transparent">
                                        FlowGate<span className="text-[var(--brand-primary)]">X</span>
                                    </span>
                                    <span className="text-[9px] text-[var(--text-muted)] font-bold uppercase tracking-widest flex items-center gap-1">
                                        <span className="w-1 h-1 rounded-full bg-[var(--brand-primary)] animate-pulse"></span>
                                        {menuConfig.label}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex-1 overflow-y-auto py-5 px-3">
                        <nav>
                            <ul className="space-y-1">
                                {menuConfig.primary.map(item => renderMenuItem(item))}
                            </ul>
                        </nav>

                        {/* Quick Actions */}
                        {menuConfig.quickActions && !isSidebarCollapsed && (
                            <div className="mt-7">
                                <p className="px-4 mb-4 text-[11px] font-extrabold text-[var(--text-muted)] uppercase tracking-widest flex items-center gap-2">
                                    <span className="w-1 h-1 rounded-full bg-[var(--brand-primary)] animate-pulse"></span>
                                    Quick Actions
                                </p>
                                <div className="grid grid-cols-2 gap-3 px-1">
                                    {menuConfig.quickActions.map(action => {
                                        const ActionComponent = action.href ? NavLink : 'button';
                                        const actionProps = action.href
                                            ? { to: action.href }
                                            : { onClick: action.action || (() => { }) };

                                        return (
                                            <ActionComponent
                                                key={action.name}
                                                {...actionProps}
                                                className={({ isActive }) => `
                                                    flex flex-col items-center justify-center p-4 rounded-xl border-2 
                                                    ${isActive
                                                        ? 'border-[var(--brand-primary)] bg-gradient-to-br from-[var(--brand-primary)]/10 to-[var(--brand-primary)]/5'
                                                        : 'border-[var(--border-primary)] hover:border-[var(--brand-primary)]/50 bg-gradient-to-br from-[var(--bg-secondary)] to-transparent hover:from-[var(--brand-primary)]/5 hover:to-[var(--brand-primary)]/10'
                                                    }
                                                    transition-all duration-300 group relative overflow-hidden
                                                `}
                                            >
                                                <span className="absolute inset-0 bg-gradient-to-br from-[var(--brand-primary)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                                <span className={`material-icons-outlined text-2xl mb-2 relative z-10 ${action.color === 'primary' ? 'text-[var(--brand-primary)]' :
                                                    action.color === 'accent' ? 'text-purple-500' :
                                                        action.color === 'success' ? 'text-emerald-500' :
                                                            'text-[var(--text-muted)]'
                                                    } group-hover:scale-125 transition-all`}>
                                                    {action.icon}
                                                </span>
                                                <span className="text-[11px] font-bold text-[var(--text-muted)] group-hover:text-[var(--text-primary)] text-center relative z-10">
                                                    {action.name}
                                                </span>
                                            </ActionComponent>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Platform Health */}
                        {!isSidebarCollapsed && (
                            <div className="mt-7 border-t border-[var(--border-primary)] pt-5 px-1">
                                <button
                                    onClick={() => setShowQuickStats(!showQuickStats)}
                                    className="w-full flex items-center justify-between px-3 py-2 text-[11px] font-extrabold text-[var(--text-muted)] uppercase tracking-widest hover:text-[var(--text-primary)] transition-colors rounded-lg hover:bg-[var(--bg-hover)]"
                                >
                                    <span>Platform Health</span>
                                    <span className={`material-icons text-base transition-transform duration-300 ${showQuickStats ? 'rotate-180' : ''}`}>
                                        expand_more
                                    </span>
                                </button>

                                <div className={`transition-all duration-500 overflow-hidden ${showQuickStats ? 'max-h-[400px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                                    <div className="grid grid-cols-3 gap-3 mb-4">
                                        {[
                                            { label: 'Tickets', value: quickStats.ticketsSold, color: 'text-blue-400' },
                                            { label: 'Revenue', value: `$${(quickStats.revenue / 1000).toFixed(1)}k`, color: 'text-emerald-400' },
                                            { label: 'Attend', value: `${quickStats.attendance}%`, color: 'text-[var(--brand-primary)]' }
                                        ].map((stat, idx) => (
                                            <div key={idx} className="text-center p-3 rounded-xl bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-tertiary)] border border-[var(--border-primary)]">
                                                <div className="text-[10px] text-[var(--text-muted)] mb-1 font-semibold uppercase">
                                                    {stat.label}
                                                </div>
                                                <div className={`text-sm font-bold ${stat.color}`}>
                                                    {stat.value}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="space-y-2">
                                        <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider px-2 mb-2">
                                            IoT Devices
                                        </p>
                                        {iotDevices.map(device => (
                                            <div key={device.name} className="flex items-center justify-between text-xs px-3 py-2.5 rounded-lg bg-[var(--bg-secondary)]/50 hover:bg-[var(--bg-hover)] transition-all">
                                                <span className="text-[var(--text-secondary)] font-medium">{device.name}</span>
                                                <div className="flex items-center gap-2">
                                                    <span className={`w-2 h-2 rounded-full ${device.status === 'online' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                                                    <span className={`uppercase text-[10px] font-bold ${device.status === 'online' ? 'text-emerald-400' : 'text-red-400'}`}>
                                                        {device.status}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-5 border-t border-[var(--border-primary)] bg-gradient-to-t from-[var(--bg-secondary)]/80 to-transparent shrink-0">
                        <div className={`flex items-center mb-4 ${isSidebarCollapsed ? 'justify-center' : 'gap-3'}`}>
                            <div className="relative shrink-0">
                                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-primary-dark)] p-[2px]">
                                    <div className="w-full h-full rounded-[10px] bg-[var(--bg-card)] flex items-center justify-center">
                                        <span className="text-sm font-black text-[var(--brand-primary)]">{getUserInitials}</span>
                                    </div>
                                </div>
                                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-[3px] border-[var(--bg-card)] rounded-full"></span>
                            </div>

                            {!isSidebarCollapsed && (
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-[var(--text-primary)] truncate">{user.name}</p>
                                    <p className="text-[11px] text-[var(--text-muted)] truncate">{user.email}</p>
                                </div>
                            )}
                        </div>

                        <div className={`flex items-center gap-2 ${isSidebarCollapsed ? 'flex-col' : 'justify-center bg-[var(--bg-secondary)]/50 rounded-xl p-1.5 border border-[var(--border-primary)]'}`}>
                            <button
                                onClick={toggleTheme}
                                className="p-2.5 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--brand-primary)] transition-all relative overflow-hidden group"
                            >
                                <span className="material-icons-outlined text-lg relative z-10 transition-transform group-hover:rotate-180">
                                    {theme === 'dark' ? 'light_mode' : 'dark_mode'}
                                </span>
                                <span className="absolute inset-0 bg-gradient-to-r from-[var(--brand-primary)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></span>
                            </button>

                            <button
                                onClick={logout}
                                className="p-2.5 rounded-lg text-[var(--text-secondary)] hover:bg-red-500/10 hover:text-red-500 transition-all relative overflow-hidden group"
                            >
                                <span className="material-icons-outlined text-lg relative z-10">logout</span>
                                <span className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></span>
                            </button>

                            {showSidebarTrigger && (
                                <button
                                    onClick={handleToggleSidebar}
                                    className="p-2.5 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--brand-primary)] transition-all hidden lg:flex relative overflow-hidden group"
                                >
                                    <span className="material-icons-outlined text-lg relative z-10 transition-transform group-hover:scale-110">
                                        {isSidebarCollapsed ? 'chevron_right' : 'chevron_left'}
                                    </span>
                                    <span className="absolute inset-0 bg-gradient-to-r from-[var(--brand-primary)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </aside>

            {/* ===========================
          MOBILE SIDEBAR
      =========================== */}
            {isMobileSidebarOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setIsMobileSidebarOpen(false)} />
                    <div className="absolute inset-y-0 left-0 w-[300px] bg-[var(--bg-card)] shadow-2xl">
                        <div className="flex flex-col h-full">
                            <div className="h-20 flex items-center justify-between px-5 border-b border-[var(--border-primary)]">
                                <div className="flex items-center gap-3">
                                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-primary-dark)] flex items-center justify-center text-white">
                                        <span className="material-icons text-2xl">auto_awesome</span>
                                    </div>
                                    <div>
                                        <span className="font-black text-xl">FlowGate<span className="text-[var(--brand-primary)]">X</span></span>
                                    </div>
                                </div>
                                <button onClick={() => setIsMobileSidebarOpen(false)} className="p-2 rounded-xl hover:bg-[var(--bg-hover)]">
                                    <span className="material-icons text-xl">close</span>
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto py-5 px-3">
                                <nav>
                                    <ul className="space-y-1">
                                        {menuConfig.primary.map(item => renderMenuItem(item))}
                                    </ul>
                                </nav>
                            </div>

                            <div className="p-5 border-t border-[var(--border-primary)]">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-primary-dark)] p-[2px]">
                                        <div className="w-full h-full rounded-[10px] bg-[var(--bg-card)] flex items-center justify-center">
                                            <span className="text-sm font-black text-[var(--brand-primary)]">{getUserInitials}</span>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-[var(--text-primary)]">{user.name}</p>
                                        <p className="text-xs text-[var(--text-muted)]">{user.email}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={toggleTheme} className="flex-1 p-3 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--bg-hover)] transition-all">
                                        <span className="material-icons-outlined">{theme === 'dark' ? 'light_mode' : 'dark_mode'}</span>
                                    </button>
                                    <button onClick={logout} className="flex-1 p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all">
                                        <span className="material-icons-outlined">logout</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ===========================
          MAIN CONTENT
      =========================== */}
            <main
                className={`transition-all duration-500 ${isSidebarCollapsed ? 'lg:pl-[80px]' : 'lg:pl-[300px]'}`}
                style={{ minHeight: 'calc(100vh - 5rem)' }}
            >
                <div className="px-4 sm:px-6 lg:px-8 py-6">
                    {children}
                </div>
            </main>

            {/* ===========================
          NOTIFICATION MODAL
      =========================== */}
            {notificationModalOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center md:justify-end md:items-start md:pt-20 md:pr-6 p-4">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setNotificationModalOpen(false)} />
                    <div className="relative w-full max-w-sm bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl shadow-2xl overflow-hidden">
                        <div className="px-4 py-3 border-b border-[var(--border-primary)] flex justify-between items-center bg-[var(--bg-secondary)]">
                            <div className="flex items-center gap-2">
                                <span className="material-icons-outlined text-[var(--brand-primary)]">notifications</span>
                                <h3 className="font-bold text-[var(--text-primary)]">Notifications</h3>
                            </div>
                            <button onClick={() => setNotificationModalOpen(false)} className="text-[var(--text-secondary)] p-1 hover:bg-[var(--bg-hover)] rounded-lg">
                                <span className="material-icons-outlined text-lg">close</span>
                            </button>
                        </div>

                        <div className="max-h-[400px] overflow-y-auto">
                            {notifications.map((notif) => (
                                <div
                                    key={notif.id}
                                    className={`p-4 flex gap-3 hover:bg-[var(--bg-hover)] border-b border-[var(--border-primary)] transition-colors cursor-pointer ${notif.unread ? 'bg-[var(--brand-primary)]/5' : ''}`}
                                >
                                    <div className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${notif.unread ? 'bg-[var(--brand-primary)] text-white' : 'bg-[var(--bg-tertiary)] text-[var(--text-muted)]'}`}>
                                        <span className="material-icons-outlined text-base">{notif.icon}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start gap-2">
                                            <p className={`text-sm truncate ${notif.unread ? 'font-bold text-[var(--text-primary)]' : 'font-medium text-[var(--text-secondary)]'}`}>
                                                {notif.title}
                                            </p>
                                            <span className="text-[10px] text-[var(--text-muted)] whitespace-nowrap">{notif.time}</span>
                                        </div>
                                        <p className="text-xs text-[var(--text-muted)] mt-1">{notif.message}</p>
                                    </div>
                                    {notif.unread && <div className="w-2 h-2 bg-[var(--brand-primary)] rounded-full self-center shrink-0"></div>}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ===========================
          TOOLTIP
      =========================== */}
            {tooltipContent && (
                <div
                    className="fixed z-[100] px-4 py-2 bg-[var(--bg-inverse)] text-[var(--text-inverse)] text-xs font-semibold rounded-lg shadow-2xl pointer-events-none whitespace-nowrap animate-in fade-in zoom-in-95 duration-150 border border-[var(--brand-primary)]/20"
                    style={{
                        top: tooltipPosition.top,
                        left: tooltipPosition.left,
                        transform: 'translateY(-50%)',
                    }}
                >
                    {tooltipContent}
                </div>
            )}
        </div>
    );
};

export default Layout;