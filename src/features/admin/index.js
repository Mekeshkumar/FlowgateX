// Admin Feature - Admin panel utilities and configuration
export const adminConfig = {
    roles: {
        SUPER_ADMIN: 'super_admin',
        ADMIN: 'admin',
        MODERATOR: 'moderator',
    },
    permissions: {
        MANAGE_USERS: 'manage_users',
        MANAGE_EVENTS: 'manage_events',
        MANAGE_BOOKINGS: 'manage_bookings',
        VIEW_ANALYTICS: 'view_analytics',
        MANAGE_IOT: 'manage_iot',
        MANAGE_SETTINGS: 'manage_settings',
    },
};

export const hasPermission = (userRole, permission) => {
    const rolePermissions = {
        super_admin: Object.values(adminConfig.permissions),
        admin: [
            adminConfig.permissions.MANAGE_USERS,
            adminConfig.permissions.MANAGE_EVENTS,
            adminConfig.permissions.MANAGE_BOOKINGS,
            adminConfig.permissions.VIEW_ANALYTICS,
        ],
        moderator: [
            adminConfig.permissions.MANAGE_EVENTS,
            adminConfig.permissions.VIEW_ANALYTICS,
        ],
    };

    return rolePermissions[userRole]?.includes(permission) || false;
};
