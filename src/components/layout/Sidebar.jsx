import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import classNames from 'classnames';
import { useAuth } from '@hooks/useAuth';

const Sidebar = ({ isCollapsed, onToggle }) => {
  const { user } = useAuth();
  const location = useLocation();

  const getMenuItems = () => {
    const baseItems = [
      { name: 'Dashboard', href: '/dashboard', icon: 'dashboard' },
    ];

    const userItems = [
      { name: 'My Events', href: '/my-events', icon: 'event' },
      { name: 'My Bookings', href: '/bookings', icon: 'confirmation_number' },
      { name: 'Favorites', href: '/favorites', icon: 'favorite' },
    ];

    const organizerItems = [
      { name: 'Create Event', href: '/organizer/create', icon: 'add_circle' },
      { name: 'My Events', href: '/organizer/events', icon: 'event_available' },
      { name: 'Analytics', href: '/organizer/analytics', icon: 'analytics' },
      { name: 'Attendees', href: '/organizer/attendees', icon: 'groups' },
      { name: 'Check-in', href: '/organizer/checkin', icon: 'qr_code_scanner' },
    ];

    const adminItems = [
      { name: 'Users', href: '/admin/users', icon: 'people' },
      { name: 'All Events', href: '/admin/events', icon: 'event_note' },
      { name: 'Reports', href: '/admin/reports', icon: 'assessment' },
      { name: 'IoT Devices', href: '/admin/iot', icon: 'sensors' },
      { name: 'Crowd Monitor', href: '/admin/crowd', icon: 'groups' },
      { name: 'Settings', href: '/admin/settings', icon: 'settings' },
    ];

    switch (user?.role) {
      case 'admin':
        return [...baseItems, ...adminItems];
      case 'organizer':
        return [...baseItems, ...organizerItems];
      default:
        return [...baseItems, ...userItems];
    }
  };

  const menuItems = getMenuItems();

  return (
    <aside
      className={classNames(
        'fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r border-gray-100 transition-all duration-300 z-30',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex flex-col h-full">
        {/* Toggle Button */}
        <button
          onClick={onToggle}
          className="absolute -right-3 top-6 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:border-gray-300 shadow-sm transition-colors"
        >
          <span className="material-icons text-sm">
            {isCollapsed ? 'chevron_right' : 'chevron_left'}
          </span>
        </button>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 overflow-y-auto">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    classNames(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50',
                      isCollapsed && 'justify-center'
                    )
                  }
                  title={isCollapsed ? item.name : undefined}
                >
                  <span className="material-icons-outlined text-lg">{item.icon}</span>
                  {!isCollapsed && <span>{item.name}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-gray-100">
          <NavLink
            to="/help"
            className={classNames(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors',
              isCollapsed && 'justify-center'
            )}
          >
            <span className="material-icons-outlined text-lg">help_outline</span>
            {!isCollapsed && <span>Help & Support</span>}
          </NavLink>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
