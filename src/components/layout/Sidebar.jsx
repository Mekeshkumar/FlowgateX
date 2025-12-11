import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

// ============================================================================
// CONFIGURATION (Kept separate for cleanliness)
// ============================================================================
const sidebarConfig = {
  guest: {
    showSearch: false,
    showQuickActions: false,
    showStats: false,
    sections: [
      {
        id: 'explore',
        label: 'Explore',
        items: [
          { id: 'events', label: 'Browse Events', path: '/events', icon: 'event' },
          {
            id: 'how-it-works',
            label: 'How It Works',
            path: '/how-it-works',
            icon: 'info_outline',
          },
          { id: 'pricing', label: 'Pricing Plans', path: '/pricing', icon: 'payments' },
        ],
      },
      {
        id: 'company',
        label: 'Company',
        items: [
          { id: 'about', label: 'About Us', path: '/about', icon: 'business' },
          { id: 'contact', label: 'Contact', path: '/contact', icon: 'contact_support' },
        ],
      },
    ],
    footer: [{ id: 'login', label: 'Sign In', path: '/login', icon: 'login', highlight: true }],
  },
  user: {
    showSearch: true,
    searchPlaceholder: 'Search events...',
    showQuickActions: true,
    showStats: true,
    sections: [
      {
        id: 'overview',
        label: 'Overview',
        items: [
          {
            id: 'dashboard',
            label: 'Dashboard',
            path: '/dashboard',
            icon: 'dashboard',
            exactMatch: true,
          },
          { id: 'help', label: 'Help Center', path: '/help', icon: 'help_outline' },
        ],
      },
      {
        id: 'events',
        label: 'My Events',
        collapsible: true,
        defaultOpen: true,
        items: [
          { id: 'browse-events', label: 'Browse', path: '/events', icon: 'explore' },
          {
            id: 'my-bookings',
            label: 'Bookings',
            path: '/my-bookings',
            icon: 'confirmation_number',
            badge: 'upcomingBookings',
            badgeColor: 'blue',
          },
          {
            id: 'saved-events',
            label: 'Saved',
            path: '/saved-events',
            icon: 'favorite_border',
            badge: 'savedCount',
            badgeColor: 'pink',
          },
          {
            id: 'tickets',
            label: 'My Tickets',
            path: '/tickets',
            icon: 'receipt_long',
            subItems: [
              { id: 'active-tickets', label: 'Active', path: '/tickets/active' },
              { id: 'past-tickets', label: 'History', path: '/tickets/past' },
            ],
          },
        ],
      },
      {
        id: 'account',
        label: 'Account',
        collapsible: true,
        defaultOpen: false,
        items: [
          { id: 'profile', label: 'Profile', path: '/profile', icon: 'person' },
          {
            id: 'notifications',
            label: 'Notifications',
            path: '/notifications',
            icon: 'notifications',
            badge: 'unreadNotifications',
            badgeColor: 'red',
          },
          { id: 'settings', label: 'Settings', path: '/settings', icon: 'settings' },
        ],
      },
    ],
    quickActions: [
      {
        id: 'find-events',
        label: 'Find Event',
        action: 'navigate',
        path: '/events',
        icon: 'search',
        variant: 'primary',
      },
      {
        id: 'view-tickets',
        label: 'My Tickets',
        action: 'navigate',
        path: '/my-bookings',
        icon: 'confirmation_number',
      },
    ],
    footer: [
      {
        id: 'become-organizer',
        label: 'Organizer Mode',
        path: '/organizer/apply',
        icon: 'business_center',
        highlight: true,
      },
      { id: 'help', label: 'Support', path: '/help', icon: 'help_outline' },
    ],
  },
  organizer: {
    showSearch: true,
    searchPlaceholder: 'Search my events...',
    showQuickActions: false,
    showStats: false,
    sections: [
      {
        id: 'management',
        label: 'Management',
        items: [
          { id: 'dashboard', label: 'Dashboard', path: '/organizer/dashboard', icon: 'dashboard' },
          { id: 'create-event', label: 'Create Event', path: '/organizer/events/create', icon: 'add_circle_outline' },
          { id: 'my-events', label: 'My Events', path: '/organizer/events', icon: 'event_note' },
          { id: 'participants', label: 'Participants', path: '/organizer/participants', icon: 'people' },
        ],
      },
      {
        id: 'monitoring',
        label: 'Monitoring',
        items: [
          { id: 'iot-management', label: 'IoT Management', path: '/organizer/iot', icon: 'memory' },
          { id: 'crowd-monitoring', label: 'Crowd Monitoring', path: '/organizer/crowd', icon: 'groups' },
        ],
      },
      {
        id: 'business',
        label: 'Business',
        items: [
          { id: 'analytics', label: 'Analytics', path: '/organizer/analytics', icon: 'analytics' },
          { id: 'revenue', label: 'Revenue', path: '/organizer/revenue', icon: 'monetization_on' },
          { id: 'marketing', label: 'Marketing', path: '/organizer/marketing', icon: 'campaign' },
        ],
      },
    ],
    footer: [
        { id: 'profile', label: 'Profile', path: '/organizer/profile', icon: 'account_circle' },
        { id: 'help', label: 'Support', path: '/help', icon: 'help_outline' },
    ],
  },
  admin: {
    showSearch: true,
    searchPlaceholder: 'Search users, events...',
    showQuickActions: false,
    showStats: false,
    sections: [
      {
        id: 'overview',
        label: 'Overview',
        items: [
          { id: 'dashboard', label: 'Dashboard', path: '/admin/dashboard', icon: 'dashboard' },
        ],
      },
      {
        id: 'management',
        label: 'Management',
        items: [
          { id: 'users', label: 'Users', path: '/admin/users', icon: 'people_outline' },
          { id: 'organizers', label: 'Organizers', path: '/admin/organizers', icon: 'business_center' },
          { id: 'events', label: 'Events', path: '/admin/events', icon: 'event' },
          { id: 'devices', label: 'Devices', path: '/admin/devices', icon: 'devices' },
          { id: 'payments', label: 'Payments', path: '/admin/payments', icon: 'payment' },
        ],
      },
      {
        id: 'platform',
        label: 'Platform',
        items: [
          { id: 'analytics', label: 'Analytics', path: '/admin/analytics', icon: 'analytics' },
          { id: 'support', label: 'Support', path: '/admin/support', icon: 'support_agent' },
          { id: 'content', label: 'Content', path: '/admin/content', icon: 'article' },
          { id: 'settings', label: 'Settings', path: '/admin/settings', icon: 'settings' },
          { id: 'logs', label: 'Logs', path: '/admin/logs', icon: 'receipt_long' },
          { id: 'chatbot', label: 'Chatbot', path: '/admin/chatbot', icon: 'smart_toy' },
        ],
      },
    ],
    footer: [
        { id: 'profile', label: 'Admin Profile', path: '/admin/profile', icon: 'admin_panel_settings' },
    ],
  },
};

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

const Icon = ({ name, className = '' }) => (
  <span
    className={`material-icons-outlined select-none ${className}`}
    aria-hidden="true"
    style={{ fontSize: 'inherit' }}
  >
    {name}
  </span>
);

const SidebarTooltip = ({ text }) => (
  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-2 bg-[var(--bg-card)] text-[var(--text-primary)] text-xs font-semibold rounded-lg shadow-red-lg border border-[var(--border-primary)] opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-[60] animate-fadeIn">
    {text}
    {/* Tooltip Arrow */}
    <div className="absolute top-1/2 right-full -translate-y-1/2 border-[6px] border-transparent border-r-[var(--border-primary)]" />
    <div className="absolute top-1/2 right-full -translate-y-1/2 mr-[-1px] border-[5px] border-transparent border-r-[var(--bg-card)]" />
  </div>
);

// ============================================================================
// SEARCH BAR
// ============================================================================
const SearchBar = ({ placeholder, isCollapsed, onExpand }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`relative px-3 mb-4 transition-all duration-300 ${isCollapsed ? 'px-2' : ''}`}>
      {/* Expanded State */}
      <div
        className={`relative transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 pointer-events-none hidden' : 'opacity-100 w-full'}`}
      >
        <Icon
          name="search"
          className={`absolute left-3 top-1/2 -translate-y-1/2 text-lg transition-colors duration-300 ${isFocused ? 'text-[var(--brand-primary)]' : 'text-[var(--text-muted)]'}`}
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full pl-10 pr-9 py-2.5 text-sm bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-xl focus:outline-none focus:border-[var(--brand-primary)] focus:shadow-[0_0_0_3px_rgba(235,22,22,0.1)] transition-all text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--brand-primary)]"
            aria-label="Clear search"
          >
            <Icon name="close" className="text-base" />
          </button>
        )}
      </div>

      {/* Collapsed State */}
      {isCollapsed && (
        <button
          onClick={onExpand}
          className="w-10 h-10 mx-auto flex items-center justify-center rounded-xl hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-[var(--brand-primary)] transition-all group relative sidebar-item-glow"
          aria-label="Search"
        >
          <Icon name="search" className="text-xl" />
          <SidebarTooltip text="Search" />
        </button>
      )}
    </div>
  );
};

// ============================================================================
// SIDEBAR ITEM
// ============================================================================
const SidebarItem = ({ item, badges, isActive, onItemClick, isCollapsed, onExpand }) => {
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  const badgeCount = item.badge ? badges[item.badge] || 0 : 0;
  const hasSubItems = item.subItems && item.subItems.length > 0;

  // Handle initial open state for submenus if parent is active
  useEffect(() => {
    if (isActive && hasSubItems) setIsSubMenuOpen(true);
  }, [isActive, hasSubItems]);

  const handleItemClick = (e) => {
    if (isCollapsed && hasSubItems) {
      e.preventDefault();
      onExpand();
      setIsSubMenuOpen(true);
      return;
    }

    if (hasSubItems) {
      setIsSubMenuOpen(!isSubMenuOpen);
    } else {
      onItemClick?.();
    }
  };

  const getBadgeStyle = (color) => {
    const styles = {
      red: 'bg-red-500/10 text-red-500',
      blue: 'bg-blue-500/10 text-blue-500',
      green: 'bg-green-500/10 text-green-500',
      pink: 'bg-pink-500/10 text-pink-500',
      orange: 'bg-orange-500/10 text-orange-500',
    };
    return styles[color] || 'bg-gray-500/10 text-gray-500';
  };

  return (
    <li className="relative mb-1">
      <div
        role="button"
        tabIndex={0}
        aria-expanded={hasSubItems ? isSubMenuOpen : undefined}
        onClick={handleItemClick}
        className={`
                    sidebar-item group flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer select-none transition-all duration-200
                    ${isCollapsed ? 'justify-center px-0 w-10 mx-auto' : ''}
                    ${isActive
            ? 'sidebar-active active-gradient text-[var(--brand-primary)] font-medium'
            : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]'
          }
                    ${item.highlight ? 'bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-primary-dark)] text-white shadow-red-sm !border-0' : ''}
                `}
      >
        {/* Icon */}
        <div
          className={`relative z-10 flex items-center justify-center w-6 h-6 transition-transform duration-200 ${!isCollapsed && 'group-hover:scale-110'} ${isActive && 'scale-110'}`}
        >
          <Icon name={item.icon} className="text-xl sidebar-icon" />

          {/* Collapsed Dot Badge */}
          {isCollapsed && badgeCount > 0 && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[var(--brand-primary)] border-2 border-[var(--bg-card)] animate-pulse" />
          )}
        </div>

        {/* Label & Details */}
        <div
          className={`flex-1 flex items-center justify-between overflow-hidden transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0 ml-0' : 'w-auto opacity-100 ml-1'}`}
        >
          <span className="truncate text-sm tracking-wide">{item.label}</span>

          <div className="flex items-center gap-2">
            {badgeCount > 0 && (
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getBadgeStyle(item.badgeColor)}`}
              >
                {badgeCount > 99 ? '99+' : badgeCount}
              </span>
            )}
            {hasSubItems && (
              <Icon
                name="expand_more"
                className={`text-lg transition-transform duration-200 text-[var(--text-muted)] ${isSubMenuOpen ? 'rotate-180' : ''}`}
              />
            )}
          </div>
        </div>

        {/* Tooltip for Collapsed Mode */}
        {isCollapsed && <SidebarTooltip text={item.label} />}
      </div>

      {/* Submenu */}
      {hasSubItems && (
        <div
          className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${isSubMenuOpen && !isCollapsed ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}
        >
          <ul className="mt-1 ml-5 pl-3 border-l border-[var(--border-primary)] space-y-1">
            {item.subItems.map((subItem) => (
              <li key={subItem.id}>
                <Link
                  to={subItem.path}
                  onClick={onItemClick}
                  className="block px-3 py-2 text-sm rounded-lg text-[var(--text-muted)] hover:text-[var(--brand-primary)] hover:bg-[var(--bg-hover)] transition-all relative group/sub"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-current opacity-50 transition-all group-hover/sub:w-2 group-hover/sub:bg-[var(--brand-primary)]" />
                    {subItem.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
};

// ============================================================================
// STATS WIDGET
// ============================================================================
const StatsWidget = ({ badges, isCollapsed }) => {
  if (isCollapsed) return null;

  return (
    <div className="mx-3 mb-4 p-3 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-primary)] relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--brand-primary)] opacity-5 blur-2xl rounded-full pointer-events-none" />

      <div className="flex items-center gap-2 mb-3">
        <Icon name="insights" className="text-[var(--brand-primary)] text-sm" />
        <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">
          Activity
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="bg-[var(--bg-card)] p-2 rounded-lg border border-[var(--border-primary)] hover:border-[var(--brand-primary)]/30 transition-colors group">
          <p className="text-xl font-bold text-[var(--text-primary)] group-hover:text-[var(--brand-primary)] transition-colors">
            {badges.upcomingBookings || 0}
          </p>
          <p className="text-[10px] text-[var(--text-muted)]">Bookings</p>
        </div>
        <div className="bg-[var(--bg-card)] p-2 rounded-lg border border-[var(--border-primary)] hover:border-[var(--brand-primary)]/30 transition-colors group">
          <p className="text-xl font-bold text-[var(--text-primary)] group-hover:text-[var(--brand-primary)] transition-colors">
            {badges.savedCount || 0}
          </p>
          <p className="text-[10px] text-[var(--text-muted)]">Saved</p>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN SIDEBAR COMPONENT
// ============================================================================
const Sidebar = ({ isOpen, onClose, userRole = 'user', isCollapsed = false, onToggleCollapse }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Memoize config to prevent recalculations
  const config = useMemo(() => sidebarConfig[userRole] || sidebarConfig.guest, [userRole]);

  // Mock Badges State (In real app, fetch from context/store)
  const badges = {
    upcomingBookings: 3,
    savedCount: 12,
    unreadNotifications: 5,
    activeEvents: 2,
  };

  const isActivePath = (itemPath, exactMatch = false) => {
    if (exactMatch) return location.pathname === itemPath;
    return location.pathname.startsWith(itemPath);
  };

  const handleAction = (item) => {
    if (item.action === 'navigate') {
      navigate(item.path);
      onClose?.();
    } else if (item.path) {
      navigate(item.path);
      onClose?.();
    }
  };

  return (
    <>
      {/* Mobile Overlay (Backdrop) */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar Container */}
      <aside
        className={`
                    fixed inset-y-0 left-0 z-40 flex flex-col
                    bg-[var(--bg-card)] border-r border-[var(--border-primary)] 
                    transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
                    glass-effect
                    ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                    ${isCollapsed ? 'lg:w-[4.5rem]' : 'lg:w-64'}
                `}
        style={{ top: '0', height: '100vh' }} // Assuming full height, adjust if Navbar exists
      >
        {/* 1. Header / Logo Area */}
        <div
          className={`h-16 flex items-center border-b border-[var(--border-primary)] bg-[var(--bg-card)]/50 shrink-0 px-4 ${isCollapsed ? 'justify-center' : 'justify-between'}`}
        >
          <div
            className={`flex items-center gap-2 font-heading font-bold text-xl tracking-tight text-gradient-primary overflow-hidden whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100'}`}
          >
            <Icon name="auto_awesome" className="text-[var(--brand-primary)]" />
            <span>FlowGateX</span>
          </div>

          {/* Collapsed Logo Icon */}
          {isCollapsed && (
            <Icon
              name="auto_awesome"
              className="text-2xl text-[var(--brand-primary)] animate-pulse-dot"
            />
          )}

          {/* Mobile Close Button */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--brand-primary)] hover:bg-[var(--bg-hover)]"
          >
            <Icon name="close" />
          </button>
        </div>

        {/* Desktop Collapse Toggle (Floating Bubble) */}
        <div className="hidden lg:block absolute -right-3 top-[4.5rem] z-50">
          <button
            onClick={onToggleCollapse}
            className="flex items-center justify-center w-6 h-6 rounded-full bg-[var(--bg-card)] border border-[var(--border-primary)] text-[var(--text-muted)] hover:text-[var(--brand-primary)] shadow-red-sm transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            <Icon name={isCollapsed ? 'chevron_right' : 'chevron_left'} className="text-sm" />
          </button>
        </div>

        {/* 2. Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden sidebar-scroll custom-scrollbar py-4">
          {/* Search Section */}
          {config.showSearch && (
            <SearchBar
              placeholder={config.searchPlaceholder}
              isCollapsed={isCollapsed}
              onExpand={onToggleCollapse}
            />
          )}

          {/* Stats Section */}
          {config.showStats && <StatsWidget badges={badges} isCollapsed={isCollapsed} />}

          {/* Navigation Sections */}
          <div className="space-y-6">
            {config.sections.map((section) => (
              <div key={section.id}>
                {/* Section Header */}
                <div
                  className={`px-4 mb-2 flex items-center ${isCollapsed ? 'justify-center' : ''}`}
                >
                  <span
                    className={`text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest whitespace-nowrap transition-all ${isCollapsed ? 'hidden' : 'block'}`}
                  >
                    {section.label}
                  </span>
                  {isCollapsed && (
                    <div className="w-4 h-0.5 bg-[var(--border-primary)] rounded-full" />
                  )}
                </div>

                {/* Items */}
                <ul className="space-y-0.5">
                  {section.items.map((item) => (
                    <SidebarItem
                      key={item.id}
                      item={item}
                      badges={badges}
                      isActive={isActivePath(item.path, item.exactMatch)}
                      onItemClick={onClose}
                      isCollapsed={isCollapsed}
                      onExpand={onToggleCollapse}
                    />
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          {config.showQuickActions && config.quickActions && (
            <div className="mt-6 pt-4 border-t border-[var(--border-primary)] mx-3">
              {!isCollapsed && (
                <p className="px-1 mb-2 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest flex items-center gap-2">
                  <Icon name="bolt" className="text-[var(--brand-primary)] text-xs" /> Quick Actions
                </p>
              )}
              <div className={`grid gap-2 ${isCollapsed ? 'grid-cols-1' : 'grid-cols-1'}`}>
                {config.quickActions.map((action) => (
                  <button
                    key={action.id}
                    onClick={() => handleAction(action)}
                    className={`
                                            flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative
                                            ${action.variant === 'primary'
                        ? 'bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-primary-dark)] text-white shadow-md hover:shadow-red-md hover:-translate-y-0.5'
                        : 'hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] border border-transparent hover:border-[var(--border-primary)]'
                      }
                                            ${isCollapsed ? 'justify-center px-0 w-10 mx-auto' : ''}
                                        `}
                  >
                    <Icon
                      name={action.icon}
                      className={`text-lg ${isCollapsed ? '' : 'opacity-80'}`}
                    />

                    {!isCollapsed && <span className="text-sm font-medium">{action.label}</span>}

                    {isCollapsed && <SidebarTooltip text={action.label} />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 3. Footer / Profile Area */}
        <div className="p-3 border-t border-[var(--border-primary)] bg-[var(--bg-secondary)]/30 backdrop-blur-md">
          <ul className="space-y-1">
            {config.footer.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleAction(item)}
                  className={`
                                        w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative
                                        ${item.highlight
                      ? 'bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/20'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
                    }
                                        ${isCollapsed ? 'justify-center px-0' : ''}
                                    `}
                >
                  <Icon
                    name={item.icon}
                    className={`text-xl transition-transform duration-300 ${!isCollapsed && 'group-hover:rotate-12'}`}
                  />

                  <span
                    className={`font-medium text-sm overflow-hidden whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}
                  >
                    {item.label}
                  </span>

                  {isCollapsed && <SidebarTooltip text={item.label} />}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
