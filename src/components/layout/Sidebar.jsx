import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';

const Sidebar = ({ isCollapsed = false, onToggle = () => { } }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const sidebarRef = useRef(null);

  // ===========================
  // STATE MANAGEMENT
  // ===========================
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [showQuickStats, setShowQuickStats] = useState(true);
  const [tooltipContent, setTooltipContent] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [hoveredItem, setHoveredItem] = useState(null);

  // ===========================
  // THEME MANAGEMENT
  // ===========================
  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  }, [theme]);

  // ===========================
  // KEYBOARD SHORTCUTS
  // ===========================
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        onToggle();
      }
      if (e.key === 'Escape' && isMobileOpen) {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onToggle, isMobileOpen]);

  // ===========================
  // EVENT LISTENERS
  // ===========================
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isMobileOpen && sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setIsMobileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileOpen]);

  // ===========================
  // TOOLTIP HANDLERS
  // ===========================
  const showTooltip = useCallback((content, e) => {
    if (!isCollapsed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipContent(content);
    setTooltipPosition({
      top: rect.top + rect.height / 2,
      left: rect.right + 12,
    });
  }, [isCollapsed]);

  const hideTooltip = useCallback(() => {
    setTooltipContent(null);
  }, []);

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

  const toggleSubmenu = useCallback((menuName) => {
    setActiveSubmenu(prev => prev === menuName ? null : menuName);
  }, []);

  const isPathActive = useCallback((href) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  }, [location.pathname]);

  // ===========================
  // ROLE-BASED MENU CONFIGURATION
  // ===========================
  const menuConfig = useMemo(() => {
    // Viewer/User Role
    const userMenu = {
      label: 'Personal Workspace',
      primary: [
        { name: 'Home', href: '/dashboard', icon: 'home', tip: 'Dashboard' },
        { name: 'Discover', href: '/events', icon: 'explore', badge: 'New', tip: 'Browse' },
        { name: 'Bookings', href: '/bookings', icon: 'confirmation_number', badge: 3 },
        { name: 'Favorites', href: '/favorites', icon: 'favorite' },
        { name: 'Tickets', href: '/tickets', icon: 'local_activity' },
        { name: 'Messages', href: '/messages', icon: 'chat', badge: 5 },
        { name: 'Activity', href: '/activity', icon: 'history' },
      ],
      quickActions: [
        { name: 'Find Events', icon: 'search', action: () => { }, color: 'primary' },
        { name: 'Payments', icon: 'payment', href: '/payments', color: 'secondary' },
      ],
      secondary: [
        { name: 'Settings', href: '/settings', icon: 'settings' },
        { name: 'Support', href: '/help', icon: 'help_outline' },
      ],
    };

    // Editor/Organizer Role
    const organizerMenu = {
      label: 'Organizer Console',
      primary: [
        { name: 'Dashboard', href: '/organizer/dashboard', icon: 'dashboard' },
        { name: 'Analytics', href: '/organizer/analytics', icon: 'analytics' },
        {
          name: 'Events',
          icon: 'event',
          submenu: [
            { name: 'All Events', href: '/organizer/events', icon: 'list' },
            { name: 'Create New', href: '/organizer/events/create', icon: 'add' },
            { name: 'Drafts', href: '/organizer/events/drafts', icon: 'drafts', badge: 2 },
          ],
        },
        {
          name: 'Attendees',
          icon: 'groups',
          submenu: [
            { name: 'Guest List', href: '/organizer/attendees', icon: 'people' },
            { name: 'Check-in', href: '/organizer/checkin', icon: 'how_to_reg' },
          ],
        },
        {
          name: 'Finance',
          icon: 'account_balance',
          submenu: [
            { name: 'Revenue', href: '/organizer/finance/revenue', icon: 'trending_up' },
            { name: 'Payouts', href: '/organizer/finance/payouts', icon: 'payments' },
          ],
        },
        {
          name: 'Marketing',
          icon: 'campaign',
          submenu: [
            { name: 'Promotions', href: '/organizer/marketing/promotions', icon: 'local_offer' },
            { name: 'Email', href: '/organizer/marketing/email', icon: 'email' },
          ],
        },
      ],
      quickActions: [
        { name: 'New Event', icon: 'add_circle', href: '/organizer/events/create', color: 'primary', shortcut: 'Ctrl+N' },
        { name: 'Scan QR', icon: 'qr_code_scanner', href: '/organizer/scanner', color: 'accent' },
      ],
      secondary: [
        { name: 'Settings', href: '/organizer/settings', icon: 'settings' },
        { name: 'Docs', href: '/help', icon: 'menu_book' },
      ],
    };

    // Admin Role
    const adminMenu = {
      label: 'Admin Administration',
      primary: [
        { name: 'Overview', href: '/admin/dashboard', icon: 'dashboard' },
        { name: 'Platform Data', href: '/admin/analytics', icon: 'insights' },
        {
          name: 'Users',
          icon: 'manage_accounts',
          submenu: [
            { name: 'All Users', href: '/admin/users', icon: 'people' },
            { name: 'Organizers', href: '/admin/users/organizers', icon: 'person_pin' },
            { name: 'Blocked', href: '/admin/users/blocked', icon: 'block', badge: 2 },
          ],
        },
        {
          name: 'Events',
          icon: 'event_available',
          submenu: [
            { name: 'All Events', href: '/admin/events', icon: 'event_note' },
            { name: 'Approvals', href: '/admin/events/pending', icon: 'pending_actions', badge: 3 },
          ],
        },
        {
          name: 'Finance',
          icon: 'payments',
          submenu: [
            { name: 'Transactions', href: '/admin/finance/transactions', icon: 'receipt_long' },
            { name: 'Refunds', href: '/admin/finance/refunds', icon: 'money_off' },
          ],
        },
        {
          name: 'IoT Hub',
          icon: 'router',
          submenu: [
            { name: 'Devices', href: '/admin/iot/devices', icon: 'router' },
            { name: 'Logs', href: '/admin/iot/logs', icon: 'description' },
          ],
        },
      ],
      quickActions: [
        { name: 'Sys Status', icon: 'monitor_heart', action: () => { }, color: 'success' },
        { name: 'Export Data', icon: 'download', action: () => { }, color: 'secondary' },
      ],
      secondary: [
        { name: 'Sys Settings', href: '/admin/settings', icon: 'admin_panel_settings' },
        { name: 'Audit Log', href: '/admin/docs', icon: 'fact_check' },
      ],
    };

    switch (user?.role) {
      case 'admin': return adminMenu;
      case 'organizer': return organizerMenu;
      default: return userMenu;
    }
  }, [user?.role]);

  // ===========================
  // MOCK DATA FOR LIVE STATUS
  // ===========================
  const liveEventStatus = useMemo(() => ({ live: 3, attention: 2 }), []);
  const quickStats = useMemo(() => ({ ticketsSold: 234, revenue: 12450, attendance: 89 }), []);
  const iotDevices = useMemo(() => ([
    { name: 'Gate 1', status: 'online' },
    { name: 'Gate 2', status: 'online' },
    { name: 'Gate 3', status: 'online' },
    { name: 'Gate 4', status: 'offline' },
  ]), []);
  const suggestions = useMemo(() => (['Create weekend event', 'Check pending bookings']), []);

  // ===========================
  // RENDER HELPERS
  // ===========================
  const filteredMenu = useMemo(() => menuConfig.primary, [menuConfig.primary]);

  // ===========================
  // RENDER MENU ITEM WITH PREMIUM STYLING
  // ===========================
  const renderMenuItem = useCallback((item) => {
    const hasSubmenu = item.submenu && item.submenu.length > 0;
    const isSubmenuOpen = activeSubmenu === item.name;
    const isActive = item.href ? isPathActive(item.href) : false;
    const isSubmenuActive = hasSubmenu && item.submenu.some(sub => isPathActive(sub.href));

    // Premium styling classes
    const baseItemClass = `
      relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium 
      transition-all duration-300 ease-out group w-full
      ${isCollapsed ? 'justify-center' : 'justify-start'}
    `;

    const activeItemClass = `
      bg-gradient-to-r from-[var(--brand-primary)]/10 to-[var(--brand-primary)]/5 
      text-[var(--brand-primary)] shadow-lg shadow-[var(--brand-primary)]/5
      border-l-4 border-[var(--brand-primary)]
    `;

    const inactiveItemClass = `
      text-[var(--text-secondary)] hover:bg-gradient-to-r hover:from-[var(--bg-hover)] 
      hover:to-transparent hover:text-[var(--text-primary)] 
      hover:border-l-4 hover:border-[var(--brand-primary)]/30
      border-l-4 border-transparent
    `;

    const itemContent = (
      <>
        <span
          className={`material-icons-outlined text-xl shrink-0 transition-all duration-300 
            ${(isActive || isSubmenuActive)
              ? 'text-[var(--brand-primary)] scale-110'
              : 'text-[var(--text-muted)] group-hover:text-[var(--brand-primary)] group-hover:scale-110'
            }`}
        >
          {item.icon}
        </span>

        {!isCollapsed && (
          <>
            <span className="flex-1 text-left truncate font-medium">{item.name}</span>

            {item.badge && (
              <span
                className={`px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider 
                  transition-all duration-200 
                  ${typeof item.badge === 'string'
                    ? 'bg-gradient-to-r from-[var(--brand-primary)]/20 to-[var(--brand-primary)]/10 text-[var(--brand-primary)]'
                    : 'bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-primary-dark)] text-white shadow-md shadow-[var(--brand-primary)]/30'
                  }`}
              >
                {item.badge}
              </span>
            )}

            {hasSubmenu && (
              <span
                className={`material-icons-outlined text-lg transition-all duration-300 
                  ${isSubmenuOpen ? 'rotate-180 text-[var(--brand-primary)]' : 'text-[var(--text-muted)]'}
                `}
              >
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
            onClick={() => toggleSubmenu(item.name)}
            onMouseEnter={(e) => {
              showTooltip(item.tip || item.name, e);
              setHoveredItem(item.name);
            }}
            onMouseLeave={() => {
              hideTooltip();
              setHoveredItem(null);
            }}
            className={`${baseItemClass} ${isSubmenuActive ? activeItemClass : inactiveItemClass}`}
            aria-expanded={isSubmenuOpen}
          >
            {itemContent}
          </button>

          {/* Submenu - Expanded View */}
          <div
            className={`overflow-hidden transition-all duration-500 ease-out 
              ${!isCollapsed && isSubmenuOpen ? 'max-h-[500px] opacity-100 mt-2' : 'max-h-0 opacity-0'}
            `}
          >
            <ul className="pl-4 space-y-1 border-l-2 border-[var(--brand-primary)]/20 ml-6">
              {item.submenu.map(subItem => (
                <li key={subItem.name}>
                  <NavLink
                    to={subItem.href}
                    className={({ isActive }) => `
                      flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-200
                      ${isActive
                        ? 'text-[var(--brand-primary)] font-semibold bg-gradient-to-r from-[var(--brand-primary)]/10 to-transparent border-l-2 border-[var(--brand-primary)]'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] hover:border-l-2 hover:border-[var(--brand-primary)]/50 border-l-2 border-transparent'
                      }
                    `}
                  >
                    <span className="material-icons-outlined text-base">{subItem.icon}</span>
                    {!isCollapsed && <span>{subItem.name}</span>}
                    {subItem.badge && (
                      <span className="ml-auto w-2 h-2 rounded-full bg-[var(--brand-primary)] animate-pulse"></span>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Submenu - Collapsed Hover Popup */}
          {isCollapsed && hoveredItem === item.name && (
            <div
              className="absolute left-[calc(100%+16px)] top-0 w-56 bg-[var(--bg-card)] 
                border border-[var(--border-primary)] rounded-xl shadow-2xl z-50 
                overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-left"
            >
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
                  className={({ isActive }) => `
                    flex items-center gap-3 px-4 py-3 text-sm transition-all duration-200
                    ${isActive
                      ? 'text-[var(--brand-primary)] bg-gradient-to-r from-[var(--brand-primary)]/10 to-transparent font-semibold'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]'
                    }
                  `}
                >
                  <span className="material-icons-outlined text-base">{subItem.icon}</span>
                  <span>{subItem.name}</span>
                  {subItem.badge && (
                    <span className="ml-auto w-2 h-2 rounded-full bg-[var(--brand-primary)]"></span>
                  )}
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
          to={item.href}
          onMouseEnter={(e) => {
            showTooltip(item.tip || item.name, e);
            setHoveredItem(item.name);
          }}
          onMouseLeave={() => {
            hideTooltip();
            setHoveredItem(null);
          }}
          className={({ isActive }) => `${baseItemClass} ${isActive ? activeItemClass : inactiveItemClass}`}
        >
          {itemContent}
        </NavLink>
      </li>
    );
  }, [isCollapsed, activeSubmenu, isPathActive, showTooltip, hideTooltip, toggleSubmenu, hoveredItem]);

  // ===========================
  // SIDEBAR CONTENT RENDERER
  // ===========================
  const renderSidebarContent = () => (
    <div className="flex flex-col h-full bg-[var(--bg-card)] text-[var(--text-primary)]">

      {/* HEADER SECTION */}
      <div className={`
        h-20 flex items-center border-b border-[var(--border-primary)] shrink-0
        bg-gradient-to-b from-[var(--bg-secondary)]/50 to-transparent
        ${isCollapsed ? 'justify-center px-3' : 'justify-between px-5'}
      `}>
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="
            w-11 h-11 rounded-xl bg-gradient-to-br from-[var(--brand-primary)] 
            via-[var(--brand-primary-dark)] to-[var(--brand-primary)] 
            flex items-center justify-center shrink-0 text-white 
            shadow-xl shadow-[var(--brand-primary)]/30
            ring-2 ring-[var(--brand-primary)]/20 ring-offset-2 ring-offset-[var(--bg-card)]
            transition-transform duration-300 hover:scale-110 hover:rotate-3
          ">
            <span className="material-icons text-2xl">auto_awesome</span>
          </div>
          {!isCollapsed && (
            <div className="flex flex-col justify-center">
              <span className="font-black text-xl leading-tight tracking-tight bg-gradient-to-r from-[var(--text-primary)] to-[var(--text-secondary)] bg-clip-text text-transparent">
                FlowGate<span className="text-[var(--brand-primary)]">X</span>
              </span>
              <span className="text-[9px] text-[var(--text-muted)] font-bold uppercase tracking-widest">
                {menuConfig.label || 'Enterprise'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* SCROLLABLE NAVIGATION SECTION */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-5 px-3" style={{
        scrollbarWidth: 'thin',
        scrollbarColor: 'var(--brand-primary) transparent'
      }}>

        {/* LIVE STATUS INDICATOR */}
        {(user?.role === 'organizer' || user?.role === 'admin') && !isCollapsed && (
          <div className="mb-5 mx-1 p-4 rounded-xl bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-tertiary)] border border-[var(--border-primary)] shadow-lg">
            <div className="flex items-center justify-between text-xs font-semibold">
              <div className="flex items-center gap-2.5 text-[var(--text-primary)]">
                <div className="relative">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50 animate-pulse block"></span>
                  <span className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                </div>
                <span>{liveEventStatus.live} Live Events</span>
              </div>
              <div className="h-4 w-[1px] bg-[var(--border-primary)]"></div>
              <div className="flex items-center gap-2.5 text-amber-400">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-lg shadow-amber-500/30"></span>
                <span>{liveEventStatus.attention} Alerts</span>
              </div>
            </div>
          </div>
        )}

        {/* MAIN NAVIGATION MENU */}
        <nav>
          <ul className="space-y-1">
            {!isCollapsed && (
              <li className="px-4 mb-3 mt-2 text-[11px] font-extrabold text-[var(--text-muted)] uppercase tracking-widest">
                Navigation
              </li>
            )}
            {filteredMenu.map(item => renderMenuItem(item))}
          </ul>
        </nav>

        {/* QUICK ACTIONS GRID */}
        {menuConfig.quickActions && !isCollapsed && (
          <div className="mt-7 mb-5">
            <p className="px-4 mb-4 text-[11px] font-extrabold text-[var(--text-muted)] uppercase tracking-widest">
              Quick Actions
            </p>
            <div className="grid grid-cols-2 gap-3 px-1">
              {menuConfig.quickActions.map(action => {
                const ActionElement = action.href ? NavLink : 'button';
                const actionProps = action.href ? { to: action.href } : { onClick: action.action };

                return (
                  <ActionElement
                    key={action.name}
                    {...actionProps}
                    className="
                      flex flex-col items-center justify-center p-4 rounded-xl 
                      border-2 border-[var(--border-primary)] 
                      hover:border-[var(--brand-primary)]/50 
                      bg-gradient-to-br from-[var(--bg-secondary)] to-transparent
                      hover:from-[var(--brand-primary)]/5 hover:to-[var(--brand-primary)]/10
                      transition-all duration-300 group
                      hover:shadow-lg hover:shadow-[var(--brand-primary)]/10
                      hover:-translate-y-1
                    "
                  >
                    <span className={`
                      material-icons-outlined text-2xl mb-2 
                      group-hover:scale-125 transition-all duration-300
                      ${action.color === 'primary' ? 'text-[var(--brand-primary)]' :
                        action.color === 'accent' ? 'text-amber-500' :
                          action.color === 'success' ? 'text-emerald-500' :
                            'text-[var(--text-secondary)]'}
                    `}>
                      {action.icon}
                    </span>
                    <span className="text-[11px] font-bold text-[var(--text-muted)] group-hover:text-[var(--text-primary)] text-center transition-colors">
                      {action.name}
                    </span>
                    {action.shortcut && (
                      <span className="text-[9px] text-[var(--text-muted)] mt-1 opacity-50">
                        {action.shortcut}
                      </span>
                    )}
                  </ActionElement>
                );
              })}
            </div>
          </div>
        )}

        {/* AI INSIGHTS CARD */}
        {!isCollapsed && suggestions.length > 0 && (
          <div className="
            mt-5 mx-1 p-4 rounded-xl 
            bg-gradient-to-br from-[var(--brand-primary)]/10 via-[var(--brand-primary)]/5 to-transparent 
            border border-[var(--brand-primary)]/30
            shadow-lg shadow-[var(--brand-primary)]/5
          ">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-primary-dark)] flex items-center justify-center shadow-md">
                <span className="material-icons-outlined text-sm text-white">auto_awesome</span>
              </div>
              <span className="text-xs font-extrabold text-[var(--brand-primary)] uppercase tracking-widest">
                AI Insights
              </span>
            </div>
            <ul className="space-y-2.5">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="
                    flex items-start gap-3 text-xs text-[var(--text-secondary)] 
                    hover:text-[var(--text-primary)] cursor-pointer 
                    transition-all duration-200 group p-2 rounded-lg
                    hover:bg-[var(--bg-hover)]
                  "
                >
                  <span className="
                    mt-1 w-2 h-2 rounded-full 
                    bg-[var(--brand-primary)]/50 
                    group-hover:bg-[var(--brand-primary)] 
                    shrink-0 transition-all duration-200
                    group-hover:scale-125
                  "></span>
                  <span className="flex-1">{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* PLATFORM HEALTH SECTION */}
        {!isCollapsed && (user?.role === 'organizer' || user?.role === 'admin') && (
          <div className="mt-7 border-t border-[var(--border-primary)] pt-5 px-1">
            <button
              onClick={() => setShowQuickStats(!showQuickStats)}
              className="
                w-full flex items-center justify-between px-3 py-2 
                text-[11px] font-extrabold text-[var(--text-muted)] uppercase tracking-widest 
                hover:text-[var(--text-primary)] transition-colors rounded-lg
                hover:bg-[var(--bg-hover)]
              "
            >
              <span>Platform Health</span>
              <span className={`material-icons text-base transition-transform duration-300 ${showQuickStats ? 'rotate-180' : ''}`}>
                expand_more
              </span>
            </button>

            <div className={`
              transition-all duration-500 overflow-hidden 
              ${showQuickStats ? 'max-h-[400px] opacity-100 mt-4' : 'max-h-0 opacity-0'}
            `}>
              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { label: 'Tickets', value: quickStats.ticketsSold, color: 'text-blue-400' },
                  { label: 'Revenue', value: `$${(quickStats.revenue / 1000).toFixed(1)}k`, color: 'text-emerald-400' },
                  { label: 'Attend', value: `${quickStats.attendance}%`, color: 'text-[var(--brand-primary)]' }
                ].map((stat, idx) => (
                  <div
                    key={idx}
                    className="
                      text-center p-3 rounded-xl 
                      bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-tertiary)]
                      border border-[var(--border-primary)]
                      hover:border-[var(--brand-primary)]/30
                      transition-all duration-200
                      hover:scale-105
                    "
                  >
                    <div className="text-[10px] text-[var(--text-muted)] mb-1 font-semibold uppercase tracking-wider">
                      {stat.label}
                    </div>
                    <div className={`text-sm font-bold ${stat.color}`}>
                      {stat.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* IoT Devices List */}
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider px-2 mb-2">
                  IoT Devices
                </p>
                {iotDevices.slice(0, 3).map(device => (
                  <div
                    key={device.name}
                    className="
                      flex items-center justify-between text-xs px-3 py-2.5 rounded-lg 
                      bg-[var(--bg-secondary)]/50 hover:bg-[var(--bg-hover)] 
                      transition-all duration-200 group
                      border border-transparent hover:border-[var(--border-primary)]
                    "
                  >
                    <span className="text-[var(--text-secondary)] font-medium">{device.name}</span>
                    <div className="flex items-center gap-2">
                      <span className={`
                        w-2 h-2 rounded-full transition-all duration-200
                        ${device.status === 'online'
                          ? 'bg-emerald-500 shadow-lg shadow-emerald-500/50'
                          : 'bg-red-500 shadow-lg shadow-red-500/50'
                        }
                      `}></span>
                      <span className={`
                        uppercase text-[10px] font-bold tracking-wider
                        ${device.status === 'online' ? 'text-emerald-400' : 'text-red-400'}
                      `}>
                        {device.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SECONDARY MENU */}
        <div className="mt-6 pt-5 border-t border-[var(--border-primary)]">
          <ul className="space-y-1">
            {menuConfig.secondary.map(item => (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                    transition-all duration-200 group
                    ${isActive
                      ? 'text-[var(--brand-primary)] bg-gradient-to-r from-[var(--brand-primary)]/10 to-transparent'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
                    }
                    ${isCollapsed ? 'justify-center' : ''}
                  `}
                >
                  <span className="material-icons-outlined text-[19px] group-hover:scale-110 transition-transform duration-200">
                    {item.icon}
                  </span>
                  {!isCollapsed && <span>{item.name}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* FOOTER / USER PROFILE SECTION */}
      <div className="
        p-5 border-t border-[var(--border-primary)] 
        bg-gradient-to-t from-[var(--bg-secondary)]/80 to-transparent shrink-0
      ">
        {/* User Profile Card */}
        <div className={`flex items-center mb-4 ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
          <div className="relative shrink-0 group cursor-pointer">
            <div className="
              w-11 h-11 rounded-xl 
              bg-gradient-to-br from-[var(--brand-primary)] via-[var(--brand-primary-dark)] to-[var(--brand-primary)] 
              p-[2px] shadow-xl shadow-[var(--brand-primary)]/25
              transition-all duration-300 group-hover:scale-110 group-hover:rotate-3
            ">
              <div className="w-full h-full rounded-[10px] bg-[var(--bg-card)] flex items-center justify-center overflow-hidden">
                {user?.avatar ? (
                  <img src={user.avatar} alt="User" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-sm font-black text-[var(--brand-primary)]">{getUserInitials}</span>
                )}
              </div>
            </div>
            <span className="
              absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 
              bg-emerald-500 border-[3px] border-[var(--bg-card)] rounded-full 
              shadow-lg shadow-emerald-500/30
            "></span>
          </div>

          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-bold text-[var(--text-primary)] truncate">
                  {user?.name || 'User'}
                </p>
                <span className={`
                  text-[8px] px-2 py-1 rounded-md uppercase tracking-wider font-extrabold
                  ${user?.role === 'admin' ? 'bg-red-500/15 text-red-400 border border-red-500/30' :
                    user?.role === 'organizer' ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30' :
                      'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                  }
                `}>
                  {user?.role || 'Viewer'}
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)] truncate font-medium">
                {user?.email || 'user@flowgate.com'}
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className={`
          flex items-center gap-2 
          ${isCollapsed ? 'flex-col' : 'justify-center bg-[var(--bg-secondary)]/50 rounded-xl p-1.5 border border-[var(--border-primary)]'}
        `}>
          <button
            onClick={toggleTheme}
            className="
              p-2.5 rounded-lg text-[var(--text-secondary)] 
              hover:bg-[var(--bg-hover)] hover:text-[var(--brand-primary)] 
              transition-all duration-200 group
              hover:scale-110
            "
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            <span className="material-icons-outlined text-lg transition-transform duration-500 group-hover:rotate-180">
              {theme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          <button
            onClick={logout}
            className="
              p-2.5 rounded-lg text-[var(--text-secondary)] 
              hover:bg-red-500/10 hover:text-red-500 
              transition-all duration-200 group
              hover:scale-110
            "
            title="Logout"
          >
            <span className="material-icons-outlined text-lg group-hover:translate-x-0.5 transition-transform">
              logout
            </span>
          </button>

          <button
            onClick={onToggle}
            className="
              p-2.5 rounded-lg text-[var(--text-secondary)] 
              hover:bg-[var(--bg-hover)] hover:text-[var(--brand-primary)] 
              transition-all duration-200 
              hidden lg:flex items-center justify-center group
              hover:scale-110
            "
            title={isCollapsed ? "Expand Sidebar (Ctrl+B)" : "Collapse Sidebar (Ctrl+B)"}
          >
            <span className="material-icons-outlined text-lg transition-all duration-300 group-hover:scale-125">
              {isCollapsed ? 'chevron_right' : 'chevron_left'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside
        ref={sidebarRef}
        className={`
          fixed top-0 left-0 h-screen z-40
          bg-[var(--bg-card)] 
          border-r border-[var(--border-primary)]
          hidden lg:block 
          shadow-2xl
          transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
          ${isCollapsed ? 'w-[80px]' : 'w-[300px]'}
        `}
        role="navigation"
        aria-label="Main navigation"
      >
        {renderSidebarContent()}
      </aside>

      {/* MOBILE FAB BUTTON */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="
          lg:hidden fixed left-5 bottom-5 
          w-14 h-14 
          bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-primary-dark)]
          text-white rounded-2xl 
          shadow-2xl shadow-[var(--brand-primary)]/40
          flex items-center justify-center 
          z-40 
          active:scale-90 transition-all duration-300
          hover:shadow-[var(--brand-primary)]/60 hover:scale-110
          ring-4 ring-[var(--brand-primary)]/10
        "
        aria-label="Open navigation menu"
      >
        <span className="material-icons text-2xl">menu</span>
      </button>

      {/* MOBILE DRAWER */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
            onClick={() => setIsMobileOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="absolute inset-y-0 left-0 w-[300px] shadow-2xl transform transition-transform duration-500 ease-out translate-x-0 animate-in slide-in-from-left">
            {renderSidebarContent()}

            {/* Close Button */}
            <button
              onClick={() => setIsMobileOpen(false)}
              className="
                absolute top-5 right-5 
                p-2 rounded-xl 
                bg-[var(--bg-hover)] text-[var(--text-muted)]
                hover:bg-red-500/10 hover:text-red-500
                transition-all duration-200
                hover:scale-110 hover:rotate-90
              "
              aria-label="Close menu"
            >
              <span className="material-icons text-xl">close</span>
            </button>
          </div>
        </div>
      )}

      {/* TOOLTIP */}
      {tooltipContent && (
        <div
          className="
            fixed z-[100] 
            px-4 py-2 
            bg-[var(--bg-inverse)] text-[var(--text-inverse)] 
            text-xs font-semibold rounded-lg 
            shadow-2xl 
            pointer-events-none whitespace-nowrap 
            animate-in fade-in zoom-in-95 duration-150
            border border-[var(--brand-primary)]/20
          "
          style={{
            top: tooltipPosition.top,
            left: tooltipPosition.left,
            transform: 'translateY(-50%)',
          }}
        >
          {tooltipContent}
          <div
            className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-[var(--bg-inverse)] rotate-45 border-l border-b border-[var(--brand-primary)]/20"
          ></div>
        </div>
      )}
    </>
  );
};

export default Sidebar;