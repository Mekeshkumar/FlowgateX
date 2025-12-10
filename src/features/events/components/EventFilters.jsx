import { useState } from 'react';
import classNames from 'classnames';
import { Badge } from '@components/common';

const EventFilters = ({ filters, categories, onFilterChange, onClear }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const priceRanges = [
    { label: 'Free', value: 'free', min: 0, max: 0 },
    { label: 'Under ₹2,000', value: '0-2000', min: 0, max: 2000 },
    { label: '₹2,000 - ₹5,000', value: '2000-5000', min: 2000, max: 5000 },
    { label: 'Over ₹5,000', value: '5000+', min: 5000, max: 50000 },
  ];

  const dateRanges = [
    { label: 'All', value: 'all' },
    { label: 'Today', value: 'today' },
    { label: 'Tomorrow', value: 'tomorrow' },
    { label: 'This week', value: 'this-week' },
    { label: 'This month', value: 'this-month' },
  ];

  // Fixed: Calculate active filters count correctly
  const activeFiltersCount = (() => {
    let count = 0;

    // Count category filters
    if (Array.isArray(filters.categories) && filters.categories.length > 0) {
      count += filters.categories.length;
    } else if (filters.category) {
      count++;
    }

    // Count date range (exclude 'all')
    if (filters.dateRange && filters.dateRange !== 'all') {
      count++;
    }

    // Count location
    if (filters.location && filters.location.trim()) {
      count++;
    }

    // Count search
    if (filters.search && filters.search.trim()) {
      count++;
    }

    // Count price range (check if different from default)
    if (filters.priceRange) {
      const hasMin = (filters.priceRange.min ?? 0) > 0;
      const hasMax = (filters.priceRange.max ?? 50000) < 50000;
      if (hasMin || hasMax) {
        count++;
      }
    }

    // Count free only filter
    if (filters.isFreeOnly) {
      count++;
    }

    // Count event type (exclude 'all')
    if (filters.eventType && filters.eventType !== 'all') {
      count++;
    }

    return count;
  })();

  // Helper to check if a price range is active
  const isPriceRangeActive = (range) => {
    if (!filters.priceRange) return false;

    const currentMin = filters.priceRange.min ?? 0;
    const currentMax = filters.priceRange.max ?? 50000;

    return currentMin === range.min && currentMax === range.max;
  };

  // Handle price range selection
  const handlePriceRangeClick = (range) => {
    const isActive = isPriceRangeActive(range);

    if (isActive) {
      // Clear price filter
      onFilterChange({
        priceRange: { min: 0, max: 50000 },
        isFreeOnly: false
      });
    } else {
      // Set new price range
      onFilterChange({
        priceRange: { min: range.min, max: range.max },
        isFreeOnly: range.value === 'free'
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="material-icons-outlined text-gray-400">filter_list</span>
          <h3 className="font-medium text-gray-900">Filters</h3>
          {activeFiltersCount > 0 && <Badge variant="primary" size="sm">{activeFiltersCount}</Badge>}
        </div>

        <div className="flex items-center gap-2">
          {activeFiltersCount > 0 && (
            <button onClick={onClear} className="text-sm text-gray-500 hover:text-gray-700">Clear all</button>
          )}
          <button onClick={() => setIsExpanded(!isExpanded)} className="md:hidden p-1" aria-expanded={isExpanded}>
            <span className="material-icons text-gray-400">{isExpanded ? 'expand_less' : 'expand_more'}</span>
            <span className="sr-only">Toggle filters</span>
          </button>
        </div>
      </div>

      {/* Fixed: Correct visibility logic - always show on desktop, toggle on mobile */}
      <div className={classNames('space-y-6 md:block', { 'hidden': !isExpanded })}>
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
          <div className="relative">
            <input
              type="text"
              value={filters.search || ''}
              onChange={(e) => onFilterChange({ search: e.target.value })}
              placeholder="Search events..."
              aria-label="Search events"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
            />
            <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">search</span>
          </div>
        </div>

        {/* Categories */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const slug = category.slug || category.id || category;
              const active = filters.category === slug || (Array.isArray(filters.categories) && filters.categories.includes(slug));
              return (
                <button
                  key={slug}
                  onClick={() => onFilterChange({ category: active ? '' : slug })}
                  className={classNames(
                    'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                    active ? 'bg-[var(--brand-primary)] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  )}
                  aria-pressed={active}
                >
                  {category.name || category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Date Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
          <div className="flex flex-wrap gap-2">
            {dateRanges.map((range) => (
              <button
                key={range.value}
                onClick={() => onFilterChange({ dateRange: filters.dateRange === range.value ? '' : range.value })}
                className={classNames(
                  'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                  filters.dateRange === range.value ? 'bg-[var(--brand-primary)] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {/* Price - Fixed to use min/max object structure */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
          <div className="flex flex-wrap gap-2">
            {priceRanges.map((range) => (
              <button
                key={range.value}
                onClick={() => handlePriceRangeClick(range)}
                className={classNames(
                  'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                  isPriceRangeActive(range) ? 'bg-[var(--brand-primary)] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
          <div className="relative">
            <input
              type="text"
              value={filters.location || ''}
              onChange={(e) => onFilterChange({ location: e.target.value })}
              placeholder="City or venue..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
              aria-label="Filter by location"
            />
            <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">location_on</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventFilters;