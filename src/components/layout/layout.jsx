import React, { useState, useEffect, useCallback, useMemo, useRef, memo } from 'react';
import { Link, useLocation } from 'react-router-dom';

// ============================================================================
// CONFIGURATION & CONSTANTS
// ============================================================================

const UserRoles = {
    USER: 'user',
    ORGANIZER: 'organizer',
    ADMIN: 'admin'
};

const getNavigationConfig = (role) => {
    const configs = {
        user: {
            label: "Personal Workspace",
            sections: [
                {
                    id: "home",
                    title: "HOME",
                    items: [{ id: "dashboard", name: "Dashboard", icon: "home", path: "/" }]
                },
                {
                    id: "pages",
                    title: "PAGES",
                    items: [
                        { id: "events", name: "Events", icon: "event", path: "/events" },
                        { id: "tickets", name: "My Tickets", icon: "confirmation_number", path: "/tickets", badge: 3 },
                        { id: "bookings", name: "Bookings", icon: "book_online", path: "/bookings" }
                    ]
                }
            ],
            quickActions: [
                { id: "find-events", name: "Find Events", icon: "search", action: "openSearch", shortcut: "Ctrl+K" },
                { id: "payments", name: "Payments", icon: "payment", path: "/payments" }
            ],
            secondary: [
                { id: "settings", name: "Settings", icon: "settings", path: "/settings" },
                { id: "support", name: "Support", icon: "help_outline", path: "/support" }
            ]
        },
        organizer: {
            label: "Organizer Console",
            sections: [
                {
                    id: "management",
                    title: "MANAGEMENT",
                    items: [
                        { id: "dashboard", name: "Dashboard", icon: "dashboard", path: "/organizer" },
                        { id: "analytics", name: "Analytics", icon: "bar_chart", path: "/organizer/analytics" },
                        {
                            id: "events",
                            name: "Events",
                            icon: "event",
                            path: "/organizer/events",
                            submenu: [
                                { id: "all-events", name: "All Events", path: "/organizer/events" },
                                { id: "create-event", name: "Create Event", path: "/organizer/events/create" },
                                { id: "draft-events", name: "Draft Events", path: "/organizer/events/draft" },
                                { id: "live-events", name: "Live Events", path: "/organizer/events/live", badge: 2 }
                            ]
                        },
                        { id: "attendees", name: "Attendees", icon: "groups", path: "/organizer/attendees" },
                        { id: "finance", name: "Finance", icon: "account_balance", path: "/organizer/finance" },
                        { id: "marketing", name: "Marketing", icon: "campaign", path: "/organizer/marketing" }
                    ]
                }
            ],
            quickActions: [
                { id: "new-event", name: "New Event", icon: "add_circle", action: "createEvent", shortcut: "Ctrl+N" },
                { id: "scan-qr", name: "Scan QR", icon: "qr_code_scanner", action: "openScanner", shortcut: "Ctrl+Q" }
            ],
            liveStatus: { events: 3, alerts: 1 },
            platformHealth: {
                tickets: { sold: 1247, change: "+12%" },
                revenue: { total: "$45,890", change: "+8%" },
                attendance: { rate: "94.2%", change: "+2.1%" }
            },
            secondary: [
                { id: "settings", name: "Settings", icon: "settings", path: "/organizer/settings" },
                { id: "docs", name: "Docs", icon: "description", path: "/docs" }
            ]
        },
        admin: {
            label: "Admin Console",
            sections: [
                {
                    id: "platform",
                    title: "PLATFORM",
                    items: [
                        { id: "overview", name: "Overview", icon: "admin_panel_settings", path: "/admin" },
                        { id: "platform-data", name: "Platform Data", icon: "analytics", path: "/admin/data" },
                        { id: "users", name: "Users", icon: "supervised_user_circle", path: "/admin/users" },
                        { id: "events", name: "Events", icon: "event_available", path: "/admin/events" },
                        { id: "finance", name: "Finance", icon: "attach_money", path: "/admin/finance" },
                        { id: "iot-hub", name: "IoT Hub", icon: "devices", path: "/admin/iot", badge: "NEW" }
                    ]
                }
            ],
            quickActions: [
                { id: "system-status", name: "System Status", icon: "monitor_heart", path: "/admin/status" },
                { id: "export-data", name: "Export Data", icon: "file_download", action: "exportData", shortcut: "Ctrl+E" }
            ],
            platformHealth: {
                tickets: { sold: 15420, change: "+12%" },
                revenue: { total: "$245,890", change: "+8%" },
                attendance: { rate: "94.2%", change: "+2.1%" }
            },
            iotDevices: [
                { id: "hub-01", name: "Gateway Hub 01", status: "online", location: "Main Entrance" },
                { id: "scanner-03", name: "RFID Scanner 03", status: "online", location: "VIP Section" },
                { id: "hub-02", name: "Gateway Hub 02", status: "offline", location: "Exit Gate" }
            ],
            secondary: [
                { id: "sys-settings", name: "System Settings", icon: "admin_panel_settings", path: "/admin/settings" },
                { id: "audit-log", name: "Audit Log", icon: "fact_check", path: "/admin/audit" }
            ]
        }
    };

    return configs[role] || configs.user;
};

// ============================================================================
// HOOKS
// ============================================================================

const useKeyboardShortcuts = (shortcuts) => {
    useEffect(() => {
        const handleKeyDown = (e) => {
            const key = `${e.ctrlKey ? 'ctrl+' : ''}${e.shiftKey ? 'shift+' : ''}${e.key.toLowerCase()}`;
            if (shortcuts[key]) {
                e.preventDefault();
                shortcuts[key]();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [shortcuts]);
};

const useClickOutside = (ref, handler) => {
    useEffect(() => {
        const listener = (event) => {
            if (!ref.current || ref.current.contains(event.target)) return;
            handler(event);
        };
        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);
        return () => {
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchstart', listener);
        };
    }, [ref, handler]);
};

const useTheme = () => {
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') return localStorage.getItem('theme') || 'dark';
        return 'dark';
    });

    useEffect(() => {
        const root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
            root.setAttribute('data-theme', 'dark');
        } else {
            root.classList.remove('dark');
            root.setAttribute('data-theme', 'light');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = useCallback(() => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    }, []);

    return { theme, toggleTheme };
};

// ============================================================================
// UI ATOMS
// ============================================================================

const Icon = memo(({ name, className = "" }) => (
    <span className={`material-icons-outlined ${className}`}>{name}</span>
));

const Badge = memo(({ content }) => {
    if (!content) return null;
    const isNumeric = typeof content === 'number';

    return (
        <span className={`
      inline-flex items-center justify-center text-xs font-bold rounded-full
      ${isNumeric
                ? 'min-w-[20px] h-5 px-1.5 bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg animate-pulse-dot'
                : 'px-2 py-0.5 bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
            }
    `}>
            {content}
        </span>
    );
});

const Tooltip = memo(({ text, children, position = "right" }) => {
    const [show, setShow] = useState(false);

    return (
        <div
            className="relative"
            onMouseEnter={() => setShow(true)}
            onMouseLeave={() => setShow(false)}
        >
            {children}
            {show && (
                <div className={`
          absolute z-50 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-lg
          whitespace-nowrap pointer-events-none animate-fade-in
          ${position === 'right' ? 'left-full ml-3 top-1/2 -translate-y-1/2' : ''}
          ${position === 'top' ? 'bottom-full mb-2 left-1/2 -translate-x-1/2' : ''}
        `}>
                    {text}
                    {position === 'right' && (
                        <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
                    )}
                </div>
            )}
        </div>
    );
});

// ============================================================================
// NAV COMPONENTS
// ============================================================================

const MenuItem = memo(({ item, isActive, isExpanded, onSubmenuToggle, activeSubmenu, depth = 0 }) => {
    const hasSubmenu = item.submenu && item.submenu.length > 0;
    const isSubmenuOpen = activeSubmenu === item.id;

    const ItemContent = (
        <div className={`
      group relative flex items-center gap-x-3 py-2.5 px-3 rounded-lg
      text-sm font-medium transition-all duration-200 cursor-pointer
      ${isActive
                ? 'bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/30 dark:to-pink-950/30 border-l-4 border-red-600 text-red-700 dark:text-red-300 shadow-sm'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800'
            }
      ${depth > 0 ? 'ml-8' : ''}
    `}>
            <Icon name={item.icon} className={`${isActive ? 'text-red-600' : 'text-gray-500 dark:text-gray-400'}`} />

            {isExpanded && (
                <>
                    <span className="flex-1">{item.name}</span>
                    {item.badge && <Badge content={item.badge} />}
                    {hasSubmenu && (
                        <Icon
                            name={isSubmenuOpen ? "expand_less" : "expand_more"}
                            className="text-gray-400"
                        />
                    )}
                    {item.shortcut && !hasSubmenu && (
                        <kbd className="hidden lg:inline-flex items-center gap-1 px-2 py-1 text-xs font-mono bg-gray-100 dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 rounded">
                            {item.shortcut}
                        </kbd>
                    )}
                </>
            )}
        </div>
    );

    const handleClick = (e) => {
        if (hasSubmenu) {
            e.preventDefault();
            onSubmenuToggle?.(item.id);
        } else if (item.action) {
            e.preventDefault();
            console.log(`Action: ${item.action}`);
        }
    };

    return (
        <li className="relative">
            {isExpanded ? (
                hasSubmenu || item.action ? (
                    <button onClick={handleClick} className="w-full text-left">
                        {ItemContent}
                    </button>
                ) : (
                    <Link to={item.path || '#'} onClick={handleClick}>
                        {ItemContent}
                    </Link>
                )
            ) : (
                <Tooltip text={item.name} position="right">
                    <Link to={item.path || '#'} onClick={handleClick}>
                        {ItemContent}
                    </Link>
                </Tooltip>
            )}

            {hasSubmenu && isSubmenuOpen && isExpanded && (
                <ul className="mt-1 space-y-1 animate-slideDown">
                    {item.submenu.map(subItem => (
                        <MenuItem
                            key={subItem.id}
                            item={subItem}
                            isActive={false}
                            isExpanded={isExpanded}
                            depth={depth + 1}
                        />
                    ))}
                </ul>
            )}
        </li>
    );
});

const MenuSection = memo(({ section, isExpanded, onSubmenuToggle, activeSubmenu, currentPath }) => (
    <div className="pt-4 mt-4 border-t border-gray-200 dark:border-neutral-700 first:border-t-0 first:pt-0 first:mt-0">
        {isExpanded && (
            <span className="block px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-neutral-500">
                {section.title}
            </span>
        )}
        <ul className="space-y-1">
            {section.items.map(item => (
                <MenuItem
                    key={item.id}
                    item={item}
                    isActive={currentPath === item.path}
                    isExpanded={isExpanded}
                    onSubmenuToggle={onSubmenuToggle}
                    activeSubmenu={activeSubmenu}
                />
            ))}
        </ul>
    </div>
));

// ============================================================================
// WIDGET COMPONENTS
// ============================================================================

const QuickActionsPanel = memo(({ actions, isExpanded }) => (
    <div className="p-3 bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20 rounded-xl border border-red-100 dark:border-red-900/30">
        {isExpanded && (
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-3">
                Quick Actions
            </h3>
        )}
        <div className={`grid ${isExpanded ? 'grid-cols-2' : 'grid-cols-1'} gap-2`}>
            {actions.map(action => (
                <Tooltip key={action.id} text={action.name} position={isExpanded ? "top" : "right"}>
                    <button className="flex items-center gap-2 p-2 rounded-lg bg-white dark:bg-neutral-800 hover:bg-red-50 dark:hover:bg-red-950/40 transition-all hover:scale-105 shadow-sm">
                        <Icon name={action.icon} className="text-red-600" />
                        {isExpanded && <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{action.name}</span>}
                    </button>
                </Tooltip>
            ))}
        </div>
    </div>
));

const LiveStatusWidget = memo(({ status, isExpanded }) => {
    if (!status) return null;
    return (
        <div className="p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl border border-green-100 dark:border-green-900/30">
            {isExpanded ? (
                <>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-3">Live Status</h3>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Active Events</span>
                            <span className="flex items-center gap-2">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                <span className="text-sm font-bold text-gray-900 dark:text-white">{status.events}</span>
                            </span>
                        </div>
                        {status.alerts > 0 && (
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Alerts</span>
                                <span className="px-2 py-1 text-xs font-bold bg-red-500 text-white rounded-full animate-pulse">{status.alerts}</span>
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <Tooltip text={`${status.events} Active Events`} position="right">
                    <div className="flex items-center justify-center">
                        <Icon name="cell_tower" className="text-green-600 animate-pulse" />
                    </div>
                </Tooltip>
            )}
        </div>
    );
});

const PlatformHealthWidget = memo(({ health, isExpanded }) => {
    if (!health) return null;
    return (
        <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl border border-blue-100 dark:border-blue-900/30">
            {isExpanded ? (
                <>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-3">Platform Health</h3>
                    <div className="space-y-3">
                        {Object.entries(health).map(([key, val]) => (
                            <div key={key}>
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs text-gray-600 dark:text-gray-400 capitalize">{key}</span>
                                    <span className="text-xs font-semibold text-green-600">{val.change}</span>
                                </div>
                                <span className="text-lg font-bold text-gray-900 dark:text-white">{val.sold || val.total || val.rate}</span>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <Tooltip text="Platform Health" position="right">
                    <div className="flex items-center justify-center">
                        <Icon name="monitoring" className="text-blue-600" />
                    </div>
                </Tooltip>
            )}
        </div>
    );
});

const IoTDevicesList = memo(({ devices, isExpanded }) => {
    if (!devices) return null;
    return (
        <div className="p-3 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 rounded-xl border border-purple-100 dark:border-purple-900/30">
            {isExpanded ? (
                <>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-3">IoT Devices</h3>
                    <div className="space-y-2">
                        {devices.map(device => (
                            <div key={device.id} className="flex items-center gap-2 p-2 rounded-lg bg-white dark:bg-neutral-800">
                                <span className={`h-2 w-2 rounded-full ${device.status === 'online' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-gray-900 dark:text-white truncate">{device.name}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{device.location}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <Tooltip text={`${devices.filter(d => d.status === 'online').length}/${devices.length} Online`} position="right">
                    <div className="flex items-center justify-center">
                        <Icon name="devices" className="text-purple-600" />
                    </div>
                </Tooltip>
            )}
        </div>
    );
});

const ProfileCard = memo(({ user, isExpanded }) => (
    <div className={`p-3 rounded-xl border transition-all duration-200 cursor-pointer bg-gradient-to-br from-gray-50 to-gray-100 dark:from-neutral-800 dark:to-neutral-900 border-gray-200 dark:border-neutral-700 hover:shadow-lg hover:scale-[1.02]`}>
        <div className="flex items-center gap-3">
            <div className="relative">
                <img
                    src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=eb1616&color=fff`}
                    alt={user.name}
                    className="w-10 h-10 rounded-full ring-2 ring-red-500"
                />
                <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-neutral-900 ${user.status === 'online' ? 'bg-green-500' : user.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'}`} />
            </div>
            {isExpanded && (
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                </div>
            )}
        </div>
    </div>
));

// ============================================================================
// HEADER COMPONENTS
// ============================================================================

const Dropdown = memo(({ trigger, children, align = "left" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    useClickOutside(dropdownRef, () => setIsOpen(false));

    return (
        <div className="relative" ref={dropdownRef}>
            <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
            {isOpen && (
                <div className={`absolute top-full mt-2 w-64 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl shadow-xl z-50 animate-fade-in ${align === 'right' ? 'right-0' : 'left-0'}`}>
                    {children}
                </div>
            )}
        </div>
    );
});

const ProjectDropdown = memo(({ currentProject }) => (
    <Dropdown trigger={
        <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-neutral-800 transition-colors">
            <img src={currentProject.logo} alt={currentProject.name} className="w-6 h-6 rounded" />
            <span className="text-sm font-medium text-gray-900 dark:text-white hidden sm:inline">{currentProject.name}</span>
            <Icon name="unfold_more" className="text-gray-500 text-base" />
        </button>
    }>
        <div className="p-2">
            <p className="px-3 py-2 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Projects (1)</p>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors">
                <Icon name="check" className="text-red-600" />
                <span className="flex-1 text-left text-sm font-medium text-gray-900 dark:text-white">{currentProject.name}</span>
                <img src={currentProject.logo} alt="" className="w-5 h-5 rounded" />
            </button>
        </div>
        <div className="p-2 border-t border-gray-200 dark:border-neutral-700">
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors text-sm text-gray-700 dark:text-gray-300">
                <Icon name="add_circle" /> Add project
            </button>
        </div>
    </Dropdown>
));

const TeamDropdown = memo(({ currentTeam }) => (
    <Dropdown trigger={
        <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-neutral-800 transition-colors">
            <span className="text-sm font-medium text-gray-900 dark:text-white hidden sm:inline">{currentTeam.name}</span>
            <Icon name="unfold_more" className="text-gray-500 text-base" />
        </button>
    }>
        <div className="p-2">
            <p className="px-3 py-2 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Teams (1)</p>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors">
                <Icon name="check" className="text-red-600" />
                <span className="flex-1 text-left text-sm font-medium text-gray-900 dark:text-white">{currentTeam.name}</span>
            </button>
        </div>
        <div className="p-2 border-t border-gray-200 dark:border-neutral-700">
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors text-sm text-gray-700 dark:text-gray-300">
                <Icon name="add_circle" /> Add team
            </button>
        </div>
    </Dropdown>
));

const UserMenu = memo(({ user, theme, onThemeToggle, onLogout }) => (
    <Dropdown align="right" trigger={
        <button className="p-0.5 rounded-full hover:bg-gray-200 dark:hover:bg-neutral-800 transition-colors">
            <img src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=eb1616&color=fff`} alt={user.name} className="w-8 h-8 rounded-full" />
        </button>
    }>
        <div className="p-3 border-b border-gray-200 dark:border-neutral-700">
            <p className="font-semibold text-gray-900 dark:text-white">{user.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
            <button className="mt-2 w-full py-2 px-3 text-sm font-medium bg-black dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity">Upgrade to Pro</button>
        </div>
        <div className="p-3 border-b border-gray-200 dark:border-neutral-700">
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Theme</span>
                <div className="flex gap-1 p-0.5 bg-gray-100 dark:bg-neutral-800 rounded-full">
                    {['light', 'dark'].map(t => (
                        <button key={t} onClick={() => onThemeToggle(t)} className={`p-1.5 rounded-full transition-colors ${theme === t ? 'bg-white dark:bg-neutral-700 shadow-sm' : ''}`}>
                            <Icon name={t === 'light' ? 'light_mode' : 'dark_mode'} className="text-base" />
                        </button>
                    ))}
                </div>
            </div>
        </div>
        <div className="p-2">
            <Link to="/profile" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors text-sm text-gray-700 dark:text-gray-300">
                <Icon name="person" /> Profile
            </Link>
            <Link to="/settings" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors text-sm text-gray-700 dark:text-gray-300">
                <Icon name="settings" /> Settings
            </Link>
            <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors text-sm text-gray-700 dark:text-gray-300">
                <Icon name="logout" /> Log out
            </button>
        </div>
    </Dropdown>
));

// ============================================================================
// MAIN LAYOUT COMPONENT
// ============================================================================

export default function Layout({ children, user, currentProject, currentTeam }) {
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [activeSubmenu, setActiveSubmenu] = useState(null);
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();
    const currentPath = location.pathname;

    const config = useMemo(() => getNavigationConfig(user?.role || 'user'), [user?.role]);

    useKeyboardShortcuts({
        'ctrl+b': () => setIsSidebarExpanded(prev => !prev),
        'ctrl+k': () => console.log('Open search'),
        'escape': () => setIsMobileOpen(false)
    });

    const handleSubmenuToggle = useCallback((itemId) => setActiveSubmenu(prev => prev === itemId ? null : itemId), []);
    const handleLogout = useCallback(() => console.log('Logout'), []);
    const handleThemeChange = useCallback((newTheme) => { if (newTheme !== theme) toggleTheme(); }, [theme, toggleTheme]);

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-neutral-900 transition-colors duration-200">
            {/* HEADER */}
            <header className="fixed top-0 inset-x-0 z-50 h-14 bg-zinc-100 dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800">
                <nav className="h-full px-4 sm:px-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link to="/" className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg shadow-lg">
                            <Icon name="bolt" className="text-white text-xl" />
                        </Link>
                        <button onClick={() => setIsSidebarExpanded(!isSidebarExpanded)} className="hidden lg:flex items-center justify-center w-7 h-7 rounded-md hover:bg-gray-200 dark:hover:bg-neutral-800 transition-colors">
                            <Icon name="menu_open" className="text-gray-500 dark:text-gray-400 text-base" />
                        </button>
                        <button onClick={() => setIsMobileOpen(true)} className="lg:hidden flex items-center justify-center w-7 h-7 rounded-md hover:bg-gray-200 dark:hover:bg-neutral-800 transition-colors">
                            <Icon name="menu" className="text-gray-500 dark:text-gray-400 text-base" />
                        </button>
                        {currentProject && <ProjectDropdown currentProject={currentProject} />}
                        {currentTeam && <TeamDropdown currentTeam={currentTeam} />}
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="hidden lg:flex items-center gap-2 px-3 py-2 text-xs font-medium bg-gray-200 dark:bg-neutral-800 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-neutral-700 transition-colors">
                            <Icon name="auto_awesome" className="text-indigo-600 dark:text-indigo-400" /> Ask AI
                        </button>
                        <Link to="/docs" className="hidden lg:flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-neutral-800 rounded-lg transition-colors">Docs</Link>
                        <Link to="/api" className="hidden lg:flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-neutral-800 rounded-lg transition-colors">API</Link>
                        {user && <UserMenu user={user} theme={theme} onThemeToggle={handleThemeChange} onLogout={handleLogout} />}
                    </div>
                </nav>
            </header>

            {/* DESKTOP SIDEBAR */}
            <aside className={`fixed inset-y-0 left-0 z-40 hidden lg:block bg-zinc-100 dark:bg-neutral-900 border-r border-gray-200 dark:border-neutral-800 transition-all duration-300 ease-in-out pt-14 ${isSidebarExpanded ? 'w-60' : 'w-20'}`}>
                <div className="h-full flex flex-col">
                    <div className="p-3">
                        <button className="w-full flex items-center gap-3 px-3 py-2 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg hover:border-gray-300 dark:hover:border-neutral-600 transition-colors shadow-sm">
                            <Icon name="search" className="text-gray-500 dark:text-gray-400" />
                            {isSidebarExpanded && (
                                <>
                                    <span className="flex-1 text-left text-sm text-gray-600 dark:text-gray-400">Search</span>
                                    <kbd className="flex items-center gap-1 px-2 py-0.5 text-xs bg-gray-100 dark:bg-neutral-700 border border-gray-200 dark:border-neutral-600 rounded"><Icon name="keyboard_command_key" className="text-xs" /> K</kbd>
                                </>
                            )}
                        </button>
                    </div>
                    <nav className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
                        {config.sections.map(section => (
                            <MenuSection key={section.id} section={section} isExpanded={isSidebarExpanded} onSubmenuToggle={handleSubmenuToggle} activeSubmenu={activeSubmenu} currentPath={currentPath} />
                        ))}
                    </nav>
                    <div className="p-3 space-y-3 border-t border-gray-200 dark:border-neutral-700">
                        {config.quickActions && <QuickActionsPanel actions={config.quickActions} isExpanded={isSidebarExpanded} />}
                        {config.liveStatus && <LiveStatusWidget status={config.liveStatus} isExpanded={isSidebarExpanded} />}
                        {config.platformHealth && <PlatformHealthWidget health={config.platformHealth} isExpanded={isSidebarExpanded} />}
                        {config.iotDevices && <IoTDevicesList devices={config.iotDevices} isExpanded={isSidebarExpanded} />}
                    </div>
                    <div className="p-3 border-t border-gray-200 dark:border-neutral-800">
                        <ul className="space-y-1 mb-3">
                            {config.secondary?.map(item => <MenuItem key={item.id} item={item} isActive={currentPath === item.path} isExpanded={isSidebarExpanded} />)}
                        </ul>
                        {user && <ProfileCard user={user} isExpanded={isSidebarExpanded} />}
                    </div>
                </div>
            </aside>

            {/* MOBILE SIDEBAR */}
            {isMobileOpen && (
                <>
                    <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden animate-fade-in" onClick={() => setIsMobileOpen(false)} aria-hidden="true" />
                    <aside className="fixed inset-y-0 left-0 z-50 w-60 bg-zinc-100 dark:bg-neutral-900 lg:hidden transition-transform duration-300 ease-in-out shadow-2xl">
                        <div className="h-full flex flex-col pt-4">
                            <div className="flex items-center justify-between px-4 pb-4">
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg shadow-lg"><Icon name="bolt" className="text-white text-xl" /></div>
                                    <span className="text-lg font-bold text-gray-900 dark:text-white">FlowGateX</span>
                                </div>
                                <button onClick={() => setIsMobileOpen(false)} className="flex items-center justify-center w-7 h-7 rounded-md hover:bg-gray-200 dark:hover:bg-neutral-800 transition-colors">
                                    <Icon name="close" className="text-gray-500 dark:text-gray-400" />
                                </button>
                            </div>
                            <div className="px-3 pb-3">
                                <button className="w-full flex items-center gap-3 px-3 py-2 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-sm">
                                    <Icon name="search" className="text-gray-500 dark:text-gray-400" />
                                    <span className="flex-1 text-left text-sm text-gray-600 dark:text-gray-400">Search</span>
                                </button>
                            </div>
                            <nav className="flex-1 overflow-y-auto px-3 space-y-2 custom-scrollbar">
                                {config.sections.map(section => (
                                    <MenuSection key={section.id} section={section} isExpanded={true} onSubmenuToggle={handleSubmenuToggle} activeSubmenu={activeSubmenu} currentPath={currentPath} />
                                ))}
                            </nav>
                            <div className="p-3 space-y-3 border-t border-gray-200 dark:border-neutral-800">
                                {config.quickActions && <QuickActionsPanel actions={config.quickActions} isExpanded={true} />}
                                <ul className="space-y-1">
                                    {config.secondary?.map(item => <MenuItem key={item.id} item={item} isActive={currentPath === item.path} isExpanded={true} />)}
                                </ul>
                                {user && <ProfileCard user={user} isExpanded={true} />}
                            </div>
                        </div>
                    </aside>
                </>
            )}

            {/* MOBILE FAB */}
            <button onClick={() => setIsMobileOpen(true)} className="lg:hidden fixed bottom-6 right-6 z-30 flex items-center justify-center w-14 h-14 bg-gradient-to-br from-red-500 to-pink-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110">
                <Icon name="menu" className="text-2xl" />
            </button>

            {/* MAIN CONTENT */}
            <main className={`transition-all duration-300 ease-in-out pt-14 ${isSidebarExpanded ? 'lg:pl-60' : 'lg:pl-20'}`}>
                <div className="p-4 md:p-6 lg:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}