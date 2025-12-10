import { useState, useEffect } from 'react';
import classNames from 'classnames';

const EventFilterModal = ({
    isOpen,
    onClose,
    filters,
    categories,
    onFilterChange,
    onClear
}) => {
    const [localFilters, setLocalFilters] = useState(filters);

    // Sync local filters when modal opens
    useEffect(() => {
        if (isOpen) {
            setLocalFilters(filters);
        }
    }, [isOpen, filters]);

    const priceRanges = [
        { label: 'Free', value: 'free', min: 0, max: 0 },
        { label: 'Under ₹2,000', value: '0-2000', min: 0, max: 2000 },
        { label: '₹2,000 - ₹5,000', value: '2000-5000', min: 2000, max: 5000 },
        { label: 'Over ₹5,000', value: '5000+', min: 5000, max: 50000 },
    ];

    const dateRanges = [
        { label: 'All Dates', value: 'all', icon: 'date_range' },
        { label: 'Today', value: 'today', icon: 'today' },
        { label: 'Tomorrow', value: 'tomorrow', icon: 'event' },
        { label: 'This Week', value: 'this-week', icon: 'view_week' },
        { label: 'This Month', value: 'this-month', icon: 'calendar_month' },
    ];

    const eventTypes = [
        { label: 'All Events', value: 'all', icon: 'apps' },
        { label: 'In-Person', value: 'offline', icon: 'location_on' },
        { label: 'Online', value: 'online', icon: 'videocam' },
    ];

    // Calculate active filters count
    const activeFiltersCount = (() => {
        let count = 0;
        if (Array.isArray(localFilters.categories) && localFilters.categories.length > 0) {
            count += localFilters.categories.length;
        } else if (localFilters.category) {
            count++;
        }
        if (localFilters.dateRange && localFilters.dateRange !== 'all') count++;
        if (localFilters.location && localFilters.location.trim()) count++;
        if (localFilters.priceRange) {
            const hasMin = (localFilters.priceRange.min ?? 0) > 0;
            const hasMax = (localFilters.priceRange.max ?? 50000) < 50000;
            if (hasMin || hasMax) count++;
        }
        if (localFilters.isFreeOnly) count++;
        if (localFilters.eventType && localFilters.eventType !== 'all') count++;
        return count;
    })();

    const isPriceRangeActive = (range) => {
        if (!localFilters.priceRange) return false;
        const currentMin = localFilters.priceRange.min ?? 0;
        const currentMax = localFilters.priceRange.max ?? 50000;
        return currentMin === range.min && currentMax === range.max;
    };

    const handlePriceRangeClick = (range) => {
        const isActive = isPriceRangeActive(range);
        if (isActive) {
            setLocalFilters(prev => ({
                ...prev,
                priceRange: { min: 0, max: 50000 },
                isFreeOnly: false
            }));
        } else {
            setLocalFilters(prev => ({
                ...prev,
                priceRange: { min: range.min, max: range.max },
                isFreeOnly: range.value === 'free'
            }));
        }
    };

    const handleCategoryToggle = (slug) => {
        setLocalFilters(prev => {
            const categories = prev.categories || [];
            const isActive = categories.includes(slug);
            return {
                ...prev,
                categories: isActive
                    ? categories.filter(c => c !== slug)
                    : [...categories, slug],
                category: isActive ? '' : slug
            };
        });
    };

    const handleLocalClear = () => {
        const clearedFilters = {
            categories: [],
            dateRange: 'all',
            priceRange: { min: 0, max: 50000 },
            location: '',
            eventType: 'all',
            isFreeOnly: false,
            search: '',
            category: ''
        };
        setLocalFilters(clearedFilters);
        onClear?.();
    };

    const handleApply = () => {
        onFilterChange(localFilters);
        onClose();
    };

    if (!isOpen) return null; return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 flex items-end sm:items-center justify-center p-0 sm:p-4">
                <div className="relative w-full sm:max-w-2xl bg-[var(--bg-card)] rounded-t-3xl sm:rounded-2xl shadow-2xl transform transition-all animate-slide-up max-h-[90vh] flex flex-col">

                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-primary)] shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-secondary)] flex items-center justify-center">
                                <span className="material-icons-outlined text-white text-xl">tune</span>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-[var(--text-primary)]">Filter Events</h3>
                                <p className="text-sm text-[var(--text-secondary)]">
                                    {activeFiltersCount > 0 ? `${activeFiltersCount} filter${activeFiltersCount > 1 ? 's' : ''} applied` : 'Find your perfect event'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-xl hover:bg-[var(--bg-hover)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
                        >
                            <span className="material-icons">close</span>
                        </button>
                    </div>

                    {/* Body - Scrollable */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-8">

                        {/* Categories */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)] mb-3">
                                <span className="material-icons-outlined text-lg text-[var(--brand-primary)]">category</span>
                                Categories
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {categories.map((category) => {
                                    const slug = category.slug || category.id || category;
                                    const name = category.name || category;
                                    const active = localFilters.category === slug ||
                                        (Array.isArray(localFilters.categories) && localFilters.categories.includes(slug));
                                    return (
                                        <button
                                            key={slug}
                                            onClick={() => handleCategoryToggle(slug)}
                                            className={classNames(
                                                'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border',
                                                active
                                                    ? 'bg-[var(--brand-primary)] text-white border-[var(--brand-primary)] shadow-lg shadow-[var(--brand-primary)]/25'
                                                    : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-primary)] hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)]'
                                            )}
                                        >
                                            {name}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Date Range */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)] mb-3">
                                <span className="material-icons-outlined text-lg text-[var(--brand-primary)]">event</span>
                                When
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                                {dateRanges.map((range) => (
                                    <button
                                        key={range.value}
                                        onClick={() => setLocalFilters(prev => ({ ...prev, dateRange: range.value }))}
                                        className={classNames(
                                            'flex flex-col items-center gap-1 p-3 rounded-xl text-sm font-medium transition-all duration-200 border',
                                            localFilters.dateRange === range.value
                                                ? 'bg-[var(--brand-primary)] text-white border-[var(--brand-primary)] shadow-lg shadow-[var(--brand-primary)]/25'
                                                : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-primary)] hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)]'
                                        )}
                                    >
                                        <span className="material-icons-outlined text-xl">{range.icon}</span>
                                        <span className="text-xs">{range.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Event Type */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)] mb-3">
                                <span className="material-icons-outlined text-lg text-[var(--brand-primary)]">devices</span>
                                Event Type
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {eventTypes.map((type) => (
                                    <button
                                        key={type.value}
                                        onClick={() => setLocalFilters(prev => ({ ...prev, eventType: type.value }))}
                                        className={classNames(
                                            'flex items-center justify-center gap-2 p-3 rounded-xl text-sm font-medium transition-all duration-200 border',
                                            localFilters.eventType === type.value
                                                ? 'bg-[var(--brand-primary)] text-white border-[var(--brand-primary)] shadow-lg shadow-[var(--brand-primary)]/25'
                                                : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-primary)] hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)]'
                                        )}
                                    >
                                        <span className="material-icons-outlined text-lg">{type.icon}</span>
                                        {type.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Price Range */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)] mb-3">
                                <span className="material-icons-outlined text-lg text-[var(--brand-primary)]">payments</span>
                                Price Range
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {priceRanges.map((range) => (
                                    <button
                                        key={range.value}
                                        onClick={() => handlePriceRangeClick(range)}
                                        className={classNames(
                                            'p-3 rounded-xl text-sm font-medium transition-all duration-200 border text-center',
                                            isPriceRangeActive(range)
                                                ? 'bg-[var(--brand-primary)] text-white border-[var(--brand-primary)] shadow-lg shadow-[var(--brand-primary)]/25'
                                                : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-primary)] hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)]'
                                        )}
                                    >
                                        {range.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Location */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)] mb-3">
                                <span className="material-icons-outlined text-lg text-[var(--brand-primary)]">location_on</span>
                                Location
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={localFilters.location || ''}
                                    onChange={(e) => setLocalFilters(prev => ({ ...prev, location: e.target.value }))}
                                    placeholder="Enter city or venue..."
                                    className="w-full pl-12 pr-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary)]/20 transition-all"
                                />
                                <span className="material-icons-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">search</span>
                            </div>
                        </div>

                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-[var(--border-primary)] bg-[var(--bg-secondary)] shrink-0">
                        <button
                            onClick={handleLocalClear}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors font-medium"
                        >
                            <span className="material-icons-outlined text-lg">refresh</span>
                            Reset All
                        </button>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={onClose}
                                className="px-5 py-2.5 rounded-xl border border-[var(--border-primary)] text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleApply}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)] text-white font-semibold shadow-lg shadow-[var(--brand-primary)]/25 hover:shadow-xl hover:shadow-[var(--brand-primary)]/30 transition-all"
                            >
                                <span className="material-icons-outlined text-lg">check</span>
                                Apply Filters
                                {activeFiltersCount > 0 && (
                                    <span className="ml-1 px-2 py-0.5 rounded-full bg-white/20 text-xs">
                                        {activeFiltersCount}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
        </div>
    );
};

// Filter Button Component
export const FilterButton = ({ onClick, activeCount = 0, className = '' }) => {
    return (
        <button
            onClick={onClick}
            className={classNames(
                'flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-200 font-medium',
                activeCount > 0
                    ? 'bg-[var(--brand-primary)]/10 border-[var(--brand-primary)] text-[var(--brand-primary)]'
                    : 'bg-[var(--bg-card)] border-[var(--border-primary)] text-[var(--text-primary)] hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)]',
                className
            )}
        >
            <span className="material-icons-outlined text-xl">tune</span>
            <span className="hidden sm:inline">Filters</span>
            {activeCount > 0 && (
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[var(--brand-primary)] text-white text-xs font-bold">
                    {activeCount}
                </span>
            )}
        </button>
    );
};

export default EventFilterModal;
