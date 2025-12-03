// Crowd Monitoring Feature
export const crowdMonitoringConfig = {
    thresholds: {
        low: 30,
        medium: 60,
        high: 80,
        critical: 95,
    },
    updateInterval: 5000, // 5 seconds
};

export const getCapacityLevel = (percentage) => {
    if (percentage >= 95) return 'critical';
    if (percentage >= 80) return 'high';
    if (percentage >= 60) return 'medium';
    if (percentage >= 30) return 'low';
    return 'empty';
};

export const capacityColors = {
    empty: '#10b981',
    low: '#10b981',
    medium: '#f59e0b',
    high: '#f97316',
    critical: '#ef4444',
};
