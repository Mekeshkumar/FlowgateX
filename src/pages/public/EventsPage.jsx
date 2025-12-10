import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  mockEvents,
  eventCategories,
  dateRangeOptions,
  sortOptions
} from '../../data/mockEvents';
import EventCard from '../../features/events/components/EventCard';
import EventFilterModal, { FilterButton } from '../../features/events/components/EventFilterModal';

const EventsPage = () => {
  // STATE
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState('grid');
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState(['Tech Summit', 'Music Festival', 'Food Expo']);

  const [filters, setFilters] = useState({
    categories: searchParams.getAll('category') || [],
    dateRange: searchParams.get('date') || 'all',
    priceRange: { min: parseInt(searchParams.get('minPrice')) || 0, max: parseInt(searchParams.get('maxPrice')) || 50000 },
    location: searchParams.get('location') || '',
    eventType: searchParams.get('type') || 'all',
    isFreeOnly: searchParams.get('free') === 'true',
    search: '',
    category: ''
  });

  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'date-asc');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1);
  const eventsPerPage = 12;
  const [isLoading, setIsLoading] = useState(true);
  const [useInfiniteScroll, setUseInfiniteScroll] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const searchInputRef = useRef(null);
  const loadMoreRef = useRef(null);

  // COMPUTED: Filtered Events
  const filteredEvents = useMemo(() => {
    let result = [...mockEvents];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(e =>
        e.title?.toLowerCase().includes(q) ||
        (e.description && e.description.toLowerCase().includes(q)) ||
        (Array.isArray(e.tags) && e.tags.some(t => t.toLowerCase().includes(q))) ||
        e.city?.toLowerCase().includes(q)
      );
    }

    // Category array filter
    if (filters.categories?.length) {
      result = result.filter(e => filters.categories.includes(e.category));
    }

    // Location
    if (filters.location) {
      result = result.filter(e => e.city?.toLowerCase().includes(filters.location.toLowerCase()));
    }

    // Price filter
    result = result.filter(e => e.price >= (filters.priceRange?.min ?? 0) && e.price <= (filters.priceRange?.max ?? 50000));

    // Free only
    if (filters.isFreeOnly) result = result.filter(e => e.price === 0);

    // Event type
    if (filters.eventType === 'online') result = result.filter(e => e.isOnline);
    else if (filters.eventType === 'offline') result = result.filter(e => !e.isOnline);

    // Date ranges
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (filters.dateRange && filters.dateRange !== 'all') {
      result = result.filter((event) => {
        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0);

        switch (filters.dateRange) {
          case 'today': return eventDate.getTime() === today.getTime();
          case 'tomorrow': {
            const t = new Date(today); t.setDate(t.getDate() + 1); return eventDate.getTime() === t.getTime();
          }
          case 'this-week': {
            const end = new Date(today); end.setDate(end.getDate() + 7); return eventDate >= today && eventDate <= end;
          }
          case 'this-month':
            return eventDate.getMonth() === today.getMonth() && eventDate.getFullYear() === today.getFullYear();
          default: return true;
        }
      });
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'date-asc': return new Date(a.date) - new Date(b.date);
        case 'date-desc': return new Date(b.date) - new Date(a.date);
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'popularity': return b.attendees - a.attendees;
        case 'rating': return b.rating - a.rating;
        default: return 0;
      }
    });

    return result;
  }, [searchQuery, filters, sortBy]);

  // PAGINATION / DERIVED LISTS
  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / eventsPerPage));
  const paginatedEvents = useMemo(() => {
    const start = (currentPage - 1) * eventsPerPage;
    return filteredEvents.slice(start, start + eventsPerPage);
  }, [filteredEvents, currentPage]);

  const visiblePageNumbers = useMemo(() => {
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);
    const pages = [];
    for (let p = startPage; p <= endPage; p++) pages.push(p);
    return pages;
  }, [currentPage, totalPages]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.categories?.length) count += filters.categories.length;
    if (filters.dateRange && filters.dateRange !== 'all') count++;
    if (filters.location) count++;
    if (filters.isFreeOnly) count++;
    if (filters.eventType && filters.eventType !== 'all') count++;
    if ((filters.priceRange?.min ?? 0) > 0 || (filters.priceRange?.max ?? 50000) < 50000) count++;
    return count;
  }, [filters]);

  // EFFECTS
  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      const eventSuggestions = mockEvents.filter(e =>
        e.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (Array.isArray(e.tags) && e.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())))
      ).slice(0, 5).map(e => ({ type: 'event', title: e.title, id: e.id }));

      const categorySuggestions = eventCategories.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 3).map(c => ({ type: 'category', title: c.name, id: c.id }));

      setSearchSuggestions([...eventSuggestions, ...categorySuggestions]);
    } else {
      setSearchSuggestions([]);
    }
  }, [searchQuery]);

  // Infinite scroll observer
  useEffect(() => {
    if (!useInfiniteScroll || !loadMoreRef.current) return;
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && currentPage < totalPages && !isLoadingMore) {
        setIsLoadingMore(true);
        setTimeout(() => {
          setCurrentPage(prev => prev + 1);
          setIsLoadingMore(false);
        }, 500);
      }
    }, { threshold: 0.1 });

    obs.observe(loadMoreRef.current);
    return () => obs.disconnect();
  }, [useInfiniteScroll, currentPage, totalPages, isLoadingMore]);

  // Sync URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    filters.categories?.forEach(c => params.append('category', c));
    if (filters.dateRange && filters.dateRange !== 'all') params.set('date', filters.dateRange);
    if (filters.location) params.set('location', filters.location);
    if ((filters.priceRange?.min ?? 0) > 0) params.set('minPrice', String(filters.priceRange.min));
    if ((filters.priceRange?.max ?? 50000) < 50000) params.set('maxPrice', String(filters.priceRange.max));
    if (filters.eventType && filters.eventType !== 'all') params.set('type', filters.eventType);
    if (filters.isFreeOnly) params.set('free', 'true');
    if (sortBy && sortBy !== 'date-asc') params.set('sort', sortBy);
    if (currentPage > 1) params.set('page', String(currentPage));
    setSearchParams(params, { replace: true });
  }, [searchQuery, filters, sortBy, currentPage, setSearchParams]);

  // Handlers
  const handleSearch = useCallback((e) => {
    e.preventDefault();
    setSearchFocused(false);
    setCurrentPage(1);
    if (searchQuery.trim()) {
      setRecentSearches(prev => [searchQuery.trim(), ...prev.filter(s => s !== searchQuery.trim())].slice(0, 6));
    }
  }, [searchQuery]);

  const handleCategoryToggle = useCallback((categoryId) => {
    setFilters(prev => {
      const has = prev.categories?.includes(categoryId);
      return { ...prev, categories: has ? prev.categories.filter(c => c !== categoryId) : [...(prev.categories || []), categoryId] };
    });
    setCurrentPage(1);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({
      categories: [],
      dateRange: 'all',
      priceRange: { min: 0, max: 50000 },
      location: '',
      eventType: 'all',
      isFreeOnly: false,
      search: '',
      category: ''
    });
    setSearchQuery('');
    setCurrentPage(1);
  }, []);

  const loadMoreEvents = useCallback(() => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);
    setTimeout(() => {
      setCurrentPage(prev => prev + 1);
      setIsLoadingMore(false);
    }, 500);
  }, [isLoadingMore]);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Accessibility
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // RENDER
  return (
    <div className="w-full bg-[var(--bg-primary)] text-[var(--text-primary)]">

      {/* Hero Section - Full Width */}
      <section className="relative w-full bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-primary)] border-b border-[var(--border-primary)]">
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-[var(--text-primary)] mb-4 tracking-tight">
              Discover Amazing Events
            </h1>
            <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto font-light">
              Find and book the best events happening around you — concerts, meetups, workshops and more.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSearch} className="relative z-20">
              <div className={`relative flex items-center transition-all duration-300 ${searchFocused ? 'scale-[1.02]' : ''}`}>
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]">
                  <span className="material-icons-outlined text-2xl">search</span>
                </div>

                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                  placeholder="Search events, categories, or locations..."
                  className="input w-full pl-14 pr-36 py-4 rounded-2xl text-lg shadow-lg bg-[var(--bg-card)] border-2 border-[var(--border-primary)] focus:border-[var(--brand-primary)] focus:ring-4 focus:ring-[var(--brand-primary)]/10"
                  aria-label="Search events"
                />

                <div className="absolute right-3 flex items-center gap-2">
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="p-2 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-tertiary)] transition-colors"
                    >
                      <span className="material-icons-outlined">close</span>
                    </button>
                  )}

                  <button
                    type="submit"
                    className="btn-primary py-2.5 px-6 rounded-xl flex items-center gap-2 shadow-red-md"
                  >
                    <span className="hidden sm:inline">Search</span>
                    <span className="material-icons-outlined text-xl sm:hidden">arrow_forward</span>
                  </button>
                </div>
              </div>

              {/* Search Suggestions Dropdown */}
              {searchFocused && (searchSuggestions.length > 0 || recentSearches.length > 0) && (
                <div className="absolute top-full left-0 right-0 mt-3 bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl shadow-2xl overflow-hidden animate-[slideUp_0.2s_ease-out]">
                  {searchSuggestions.length > 0 ? (
                    <div className="p-2">
                      <p className="px-3 py-2 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Suggestions</p>
                      {searchSuggestions.map((sug, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => {
                            if (sug.type === 'event') window.location.href = `/events/${sug.id}`;
                            else handleCategoryToggle(sug.id);
                            setSearchQuery('');
                          }}
                          className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-[var(--bg-hover)] transition-colors text-left group"
                        >
                          <span className="w-8 h-8 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--text-secondary)] group-hover:text-[var(--brand-primary)] transition-colors">
                            <span className="material-icons-outlined text-lg">
                              {sug.type === 'event' ? 'event' : 'category'}
                            </span>
                          </span>
                          <span className="font-medium text-[var(--text-primary)] truncate flex-1">{sug.title}</span>
                          <span className="text-xs text-[var(--text-tertiary)] bg-[var(--bg-secondary)] px-2 py-1 rounded capitalize border border-[var(--border-primary)]">
                            {sug.type}
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-2">
                      <p className="px-3 py-2 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Recent Searches</p>
                      {recentSearches.map((s, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setSearchQuery(s)}
                          className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-[var(--bg-hover)] transition-colors text-left group"
                        >
                          <span className="w-8 h-8 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--text-secondary)]">
                            <span className="material-icons-outlined text-lg">history</span>
                          </span>
                          <span className="font-medium text-[var(--text-primary)] group-hover:text-[var(--brand-primary)] transition-colors">{s}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </form>

            {/* Category Pills */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
              <span className="text-sm font-medium text-[var(--text-secondary)]">Popular:</span>
              {eventCategories.slice(0, 6).map(cat => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryToggle(cat.id)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${filters.categories?.includes(cat.id)
                    ? 'bg-[var(--brand-primary)] border-[var(--brand-primary)] text-white shadow-red-sm'
                    : 'bg-[var(--bg-card)] border-[var(--border-primary)] text-[var(--text-secondary)] hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)]'
                    }`}
                >
                  {cat.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Filter Modal */}
      <EventFilterModal
        isOpen={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        filters={filters}
        categories={eventCategories}
        onFilterChange={(newFilters) => {
          setFilters(newFilters);
          setCurrentPage(1);
        }}
        onClear={handleClearFilters}
        totalResults={filteredEvents.length}
      />

      {/* Main Content Area */}
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col gap-6">

          {/* Results Grid */}
          <main className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <p className="text-[var(--text-secondary)] font-medium">
                Showing <span className="font-bold text-[var(--text-primary)]">{paginatedEvents.length}</span> of <span className="font-bold text-[var(--text-primary)]">{filteredEvents.length}</span> events
              </p>

              <div className="flex items-center gap-3">
                {/* Filter Button */}
                <FilterButton
                  onClick={() => setFilterModalOpen(true)}
                  activeCount={activeFiltersCount}
                />

                {/* Sort Dropdown */}
                <div className="relative group">
                  <select
                    value={sortBy}
                    onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
                    className="appearance-none pl-4 pr-10 py-2.5 bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-xl text-sm font-medium text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-primary)] cursor-pointer hover:bg-[var(--bg-hover)] transition-colors"
                  >
                    {sortOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] pointer-events-none group-hover:text-[var(--brand-primary)] transition-colors">
                    <span className="material-icons-outlined text-xl">expand_more</span>
                  </span>
                </div>

                {/* View Toggles */}
                <div className="flex bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-xl p-1">
                  {[
                    { mode: 'grid', icon: 'grid_view' },
                    { mode: 'list', icon: 'view_list' },
                    { mode: 'map', icon: 'map' }
                  ].map(({ mode, icon }) => (
                    <button
                      key={mode}
                      onClick={() => setViewMode(mode)}
                      className={`p-2 rounded-lg transition-all ${viewMode === mode ? 'bg-[var(--brand-primary)] text-white shadow-sm' : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'}`}
                    >
                      <span className="material-icons-outlined text-xl">{icon}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Active Filters List */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-6 animate-[fadeIn_0.3s_ease-out]">
                <span className="text-sm font-medium text-[var(--text-muted)] mr-1">Active:</span>

                {filters.categories.map(cid => (
                  <button key={cid} onClick={() => handleCategoryToggle(cid)} className="badge badge-primary gap-1 pl-3 pr-2 py-1 cursor-pointer hover:bg-[var(--brand-primary)]/20 transition-colors">
                    {eventCategories.find(c => c.id === cid)?.name}
                    <span className="material-icons-outlined text-sm">close</span>
                  </button>
                ))}

                {filters.dateRange !== 'all' && (
                  <button onClick={() => setFilters(p => ({ ...p, dateRange: 'all' }))} className="badge badge-primary gap-1 pl-3 pr-2 py-1 cursor-pointer hover:bg-[var(--brand-primary)]/20">
                    {dateRangeOptions.find(d => d.value === filters.dateRange)?.label}
                    <span className="material-icons-outlined text-sm">close</span>
                  </button>
                )}

                {filters.isFreeOnly && (
                  <button onClick={() => setFilters(p => ({ ...p, isFreeOnly: false }))} className="badge badge-success gap-1 pl-3 pr-2 py-1 cursor-pointer hover:bg-emerald-500/20">
                    Free Events
                    <span className="material-icons-outlined text-sm">close</span>
                  </button>
                )}

                <button onClick={handleClearFilters} className="text-xs text-[var(--brand-primary)] hover:underline ml-2 font-medium">
                  Clear All
                </button>
              </div>
            )}

            {/* Content Loading/Empty/Grid */}
            {isLoading ? (
              <div className={viewMode === 'list' ? 'space-y-4' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="skeleton h-[360px] w-full rounded-2xl" />
                ))}
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-[var(--bg-card)] border border-[var(--border-primary)] border-dashed rounded-3xl">
                <div className="w-20 h-20 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center mb-6">
                  <span className="material-icons-outlined text-4xl text-[var(--text-muted)]">event_busy</span>
                </div>
                <h3 className="text-2xl font-heading font-bold text-[var(--text-primary)] mb-2">No Events Found</h3>
                <p className="text-[var(--text-secondary)] mb-8 max-w-md">We couldn&apos;t find any events matching your current filters. Try adjusting your search or categories.</p>
                <button onClick={handleClearFilters} className="btn-secondary px-8 py-3">Clear All Filters</button>
              </div>
            ) : viewMode === 'map' ? (
              <div className="card h-[700px] flex items-center justify-center bg-[var(--bg-tertiary)] relative overflow-hidden group">
                <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=40.714728,-73.998672&zoom=12&size=800x600&maptype=roadmap&sensor=false')] bg-cover opacity-20 grayscale group-hover:grayscale-0 transition-all duration-700"></div>
                <div className="relative text-center z-10 p-8 glass rounded-2xl backdrop-blur-md border border-[var(--border-primary)]">
                  <span className="material-icons-outlined text-5xl text-[var(--brand-primary)] mb-4">map</span>
                  <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Map Integration</h3>
                  <p className="text-[var(--text-secondary)] text-sm">Interactive map view would be rendered here.</p>
                </div>
              </div>
            ) : (
              <>
                <div className={viewMode === 'list' ? 'space-y-4' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'}>
                  {paginatedEvents.map(evt => (
                    <EventCard key={evt.id} event={evt} variant={viewMode === 'list' ? 'compact' : 'default'} />
                  ))}
                </div>

                {/* Pagination Controls */}
                {!useInfiniteScroll ? (
                  <div className="flex items-center justify-center gap-2 mt-12">
                    <button
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="w-10 h-10 rounded-xl flex items-center justify-center border border-[var(--border-primary)] bg-[var(--bg-card)] text-[var(--text-primary)] hover:border-[var(--brand-primary)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <span className="material-icons-outlined">chevron_left</span>
                    </button>

                    {visiblePageNumbers.map(page => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-10 h-10 rounded-xl font-bold text-sm transition-all duration-200 ${page === currentPage
                          ? 'bg-[var(--brand-primary)] text-white shadow-red-md transform scale-105'
                          : 'bg-[var(--bg-card)] border border-[var(--border-primary)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
                          }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="w-10 h-10 rounded-xl flex items-center justify-center border border-[var(--border-primary)] bg-[var(--bg-card)] text-[var(--text-primary)] hover:border-[var(--brand-primary)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <span className="material-icons-outlined">chevron_right</span>
                    </button>
                  </div>
                ) : (
                  <div ref={loadMoreRef} className="flex justify-center py-10">
                    {isLoadingMore ? (
                      <div className="flex items-center gap-3 text-[var(--text-muted)] animate-pulse">
                        <div className="w-5 h-5 border-2 border-[var(--brand-primary)] border-t-transparent rounded-full animate-spin" />
                        <span className="font-medium text-sm">Loading more events...</span>
                      </div>
                    ) : (
                      <button onClick={() => loadMoreEvents()} className="btn-secondary px-8 py-3 rounded-xl">Load More Events</button>
                    )}
                  </div>
                )}

                <div className="flex justify-center mt-8">
                  <button onClick={() => setUseInfiniteScroll(!useInfiniteScroll)} className="text-xs font-medium text-[var(--text-muted)] hover:text-[var(--brand-primary)] transition-colors border-b border-dashed border-[var(--text-muted)] hover:border-[var(--brand-primary)] pb-0.5">
                    Switch to {useInfiniteScroll ? 'Pagination' : 'Infinite Scroll'} View
                  </button>
                </div>
              </>
            )}
          </main>
        </div>
      </div>

      {/* CTA Section */}
      <section className="relative overflow-hidden py-20 mt-12">
        {/* Background with Gradient */}
        <div className="absolute inset-0 gradient-primary opacity-95 z-0"></div>
        <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-10 mix-blend-overlay z-0"></div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-6 drop-shadow-md">
            Ready to Experience More?
          </h2>
          <p className="text-white/90 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Join our community to get personalized event recommendations, exclusive early-bird tickets, and seamless booking experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Link to="/register" className="btn bg-white text-[var(--brand-primary)] hover:bg-gray-100 px-8 py-4 text-lg font-bold shadow-lg border-none hover:-translate-y-1">
              <span className="material-icons-outlined mr-2">person_add</span>
              Create Free Account
            </Link>
            <Link to="/login" className="btn border-2 border-white text-white hover:bg-white/10 px-8 py-4 text-lg font-bold">
              <span className="material-icons-outlined mr-2">login</span>
              Sign In Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EventsPage;