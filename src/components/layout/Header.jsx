import { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';

// ===========================
// MOCK DATA (Moved outside to prevent re-creation on render)
// ===========================
const NOTIFICATIONS = [
  { id: 1, title: 'Tournament Starting Soon', message: 'Winter Championship begins in 30 minutes', time: '5 min ago', icon: 'emoji_events', unread: true },
  { id: 2, title: 'New Match Result', message: 'Your team won the quarter-finals!', time: '1 hour ago', icon: 'celebration', unread: true },
  { id: 3, title: 'Team Invitation', message: 'You have been invited to join Team Phoenix', time: '2 hours ago', icon: 'group_add', unread: false },
  { id: 4, title: 'Schedule Update', message: 'Match schedule has been updated', time: '1 day ago', icon: 'update', unread: false },
];

const SCHEDULED_EVENTS = [
  { date: new Date(2024, 11, 15), title: 'Winter Championship Finals', time: '18:00', type: 'tournament' },
  { date: new Date(2024, 11, 20), title: 'Team Practice Session', time: '14:00', type: 'practice' },
  { date: new Date(2024, 11, 25), title: 'League Match', time: '20:00', type: 'match' },
];

const TOURNAMENTS = [
  { id: 1, title: 'Winter Championship', game: 'Valorant', status: 'live', prize: '$50,000', teams: 128, startDate: 'Dec 15, 2024' },
  { id: 2, title: 'Pro League Season 4', game: 'CS2', status: 'upcoming', prize: '$25,000', teams: 64, startDate: 'Dec 20, 2024' },
  { id: 3, title: 'Battle Royale Masters', game: 'Apex Legends', status: 'upcoming', prize: '$15,000', teams: 40, startDate: 'Dec 25, 2024' },
];

const EVENTS = [
  { id: 1, title: 'Community Game Night', type: 'community', date: 'Dec 10, 2024', time: '19:00', attendees: 156 },
  { id: 2, title: 'Pro Player Meet & Greet', type: 'meetup', date: 'Dec 12, 2024', time: '14:00', attendees: 89 },
  { id: 3, title: 'Strategy Workshop', type: 'workshop', date: 'Dec 18, 2024', time: '16:00', attendees: 45 },
];

const Header = ({
  showSidebarTrigger = false,
  isSidebarCollapsed = false,
  onSidebarCollapse = () => { },
}) => {
  // ===========================
  // STATE MANAGEMENT
  // ===========================
  const { user, logout } = useAuth();
  const location = useLocation();
  const navRef = useRef(null);

  // UI State
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal States
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);
  const [eventsModalOpen, setEventsModalOpen] = useState(false);
  const [tournamentsModalOpen, setTournamentsModalOpen] = useState(false);

  // Calendar/Clock State
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());

  // Helper: User Initials
  const userInitials = useMemo(() => {
    if (!user?.name) return 'U';
    const names = user.name.split(' ');
    return names.length >= 2
      ? `${names[0][0]}${names[1][0]}`.toUpperCase()
      : names[0].substring(0, 2).toUpperCase();
  }, [user]);

  // Helper: Derived Data
  const unreadCount = useMemo(() => NOTIFICATIONS.filter(n => n.unread).length, []);

  const filteredTournaments = useMemo(() => {
    if (!searchQuery) return [];
    return TOURNAMENTS.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery]);

  const filteredEvents = useMemo(() => {
    if (!searchQuery) return [];
    return EVENTS.filter(e => e.title.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery]);

  const hasResults = filteredTournaments.length > 0 || filteredEvents.length > 0;

  // ===========================
  // EFFECTS
  // ===========================

  // Theme Application
  useEffect(() => {
    const root = window.document.documentElement;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    root.classList.remove('light', 'dark');

    const activeTheme = theme === 'system' ? systemTheme : theme;
    root.classList.add(activeTheme);
    root.setAttribute('data-theme', activeTheme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Scroll, Click Outside, and Clock
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);

    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };

    const timer = setInterval(() => setCurrentTime(new Date()), 1000);

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
      clearInterval(timer);
    };
  }, []);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  // ===========================
  // CALENDAR LOGIC
  // ===========================
  const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const isSameDay = (date1, date2) => {
    return date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear();
  };

  const hasEvent = (date) => SCHEDULED_EVENTS.some(event => isSameDay(event.date, date));
  const getEventsForDate = (date) => SCHEDULED_EVENTS.filter(event => isSameDay(event.date, date));

  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));

  return (
    <>
      {/* Floating Header Container */}
      <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${isScrolled ? 'pt-4 px-4 sm:px-6 lg:px-8' : 'pt-0 px-0'}`}>
        <header
          ref={navRef}
          style={{
            backgroundColor: theme === 'dark' ? 'rgba(17, 17, 17, 0.85)' : 'rgba(248, 248, 248, 0.85)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          }}
          className={`w-full mx-auto transition-all duration-500 ease-in-out ${isScrolled
            ? 'max-w-7xl rounded-2xl shadow-2xl border border-[var(--border-primary)]'
            : 'max-w-full rounded-none border-b border-[var(--border-primary)]'
            }`}
        >
          <div className="px-4 sm:px-6 py-3">
            <div className="flex items-center justify-between gap-3 lg:gap-6">

              {/* 0. SIDEBAR TOGGLE */}
              {showSidebarTrigger && !isScrolled && (
                <button
                  onClick={onSidebarCollapse}
                  className="hidden lg:flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-[var(--text-secondary)] hover:text-[var(--brand-primary)] hover:border-[var(--brand-primary)] hover:bg-[var(--bg-hover)] transition-all duration-200 shrink-0"
                  aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                  title={isSidebarCollapsed ? 'Expand sidebar (Ctrl+B)' : 'Collapse sidebar (Ctrl+B)'}
                >
                  <span className="material-icons-outlined text-xl transition-transform duration-200">
                    {isSidebarCollapsed ? 'menu' : 'menu_open'}
                  </span>
                </button>
              )}

              {/* 1. BRAND LOGO */}
              <Link to="/" className="flex items-center gap-2 sm:gap-3 group shrink-0" aria-label="FlowGateX">
                <div className="relative">
                  <span className="material-icons-outlined text-3xl sm:text-4xl text-[var(--brand-primary)] transition-all duration-500 group-hover:scale-110">
                    auto_awesome
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl sm:text-2xl font-bold tracking-wide text-[var(--text-primary)] leading-none" style={{ fontFamily: 'var(--font-heading)' }}>
                    FlowGate<span className="text-[var(--brand-primary)]">X</span>
                  </span>
                  <span className="hidden sm:block text-[9px] text-[var(--text-muted)] font-medium tracking-widest uppercase">
                    Access Control
                  </span>
                </div>
              </Link>

              {/* 2. SEARCH BAR - Desktop */}
              <div className="hidden md:flex flex-1 max-w-md lg:max-w-lg xl:max-w-xl">
                <div className={`relative w-full transition-all duration-300 transform ${searchFocused ? 'scale-[1.02] origin-left' : ''}`}>
                  {/* Search Icon */}
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <span className={`material-icons-outlined text-lg transition-all duration-300 ${searchFocused ? 'text-[var(--brand-primary)] animate-pulse' : 'text-[var(--text-muted)]'}`}>
                      search
                    </span>
                  </div>

                  {/* Input Field */}
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                    className="w-full pl-12 pr-28 py-3 h-11 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-2xl text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary)]/20 focus:bg-[var(--bg-card)] transition-all shadow-sm hover:shadow-md focus:shadow-lg"
                    placeholder="Search events, tournaments, teams..."
                  />

                  {/* Right Side Actions */}
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="p-1.5 rounded-lg hover:bg-[var(--bg-hover)] transition-all flex items-center justify-center"
                        aria-label="Clear search"
                      >
                        <span className="material-icons-outlined text-base text-[var(--text-muted)] hover:text-[var(--text-primary)] leading-none">close</span>
                      </button>
                    )}
                    <div className="hidden lg:flex items-center justify-center gap-0.5 px-2 py-1 bg-[var(--bg-hover)] rounded-lg border border-[var(--border-primary)]">
                      <span className="text-[10px] font-mono font-medium text-[var(--text-muted)] leading-none">⌘K</span>
                    </div>
                  </div>

                  {/* Search Dropdown Results */}
                  {searchFocused && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      {/* Quick Filters */}
                      <div className="p-3 border-b border-[var(--border-primary)] bg-[var(--bg-secondary)]">
                        <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">Quick Filters</p>
                        <div className="flex flex-wrap gap-2">
                          <FilterButton icon="emoji_events" label="Tournaments" />
                          <FilterButton icon="groups" label="Teams" />
                          <FilterButton icon="person" label="Players" />
                          <FilterButton icon="celebration" label="Events" />
                        </div>
                      </div>

                      {/* Search Results or Recent Searches */}
                      <div className="max-h-80 overflow-y-auto">
                        {searchQuery ? (
                          <div className="p-3">
                            <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">Results for &quot;{searchQuery}&quot;</p>
                            <div className="space-y-1">
                              {filteredTournaments.map((result) => (
                                <Link
                                  key={result.id}
                                  to={`/tournaments/${result.id}`}
                                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[var(--bg-hover)] transition-all group"
                                >
                                  <div className="w-10 h-10 rounded-xl bg-[var(--brand-primary)]/10 flex items-center justify-center">
                                    <span className="material-icons-outlined text-[var(--brand-primary)]">emoji_events</span>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--brand-primary)] transition-colors truncate">{result.title}</p>
                                    <p className="text-xs text-[var(--text-muted)]">{result.game} • {result.teams} teams</p>
                                  </div>
                                  <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${result.status === 'live' ? 'bg-[var(--brand-primary)] text-white' : 'bg-[var(--bg-tertiary)] text-[var(--text-muted)]'}`}>
                                    {result.status}
                                  </span>
                                </Link>
                              ))}
                              {filteredEvents.map((result) => (
                                <Link
                                  key={result.id}
                                  to={`/events/${result.id}`}
                                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[var(--bg-hover)] transition-all group"
                                >
                                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                                    <span className="material-icons-outlined text-purple-500">celebration</span>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--brand-primary)] transition-colors truncate">{result.title}</p>
                                    <p className="text-xs text-[var(--text-muted)]">{result.date} • {result.attendees} attending</p>
                                  </div>
                                  <span className="material-icons-outlined text-sm text-[var(--text-muted)] group-hover:text-[var(--brand-primary)] transition-colors">arrow_forward</span>
                                </Link>
                              ))}

                              {!hasResults && (
                                <div className="py-8 text-center">
                                  <span className="material-icons-outlined text-4xl text-[var(--text-muted)] opacity-50 mb-2 block">search_off</span>
                                  <p className="text-sm text-[var(--text-muted)]">No results found for &quot;{searchQuery}&quot;</p>
                                  <p className="text-xs text-[var(--text-muted)] mt-1">Try different keywords or filters</p>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <>
                            {/* Recent Searches */}
                            <div className="p-3">
                              <div className="flex items-center justify-between mb-2">
                                <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Recent Searches</p>
                                <button className="text-[10px] text-[var(--brand-primary)] font-medium hover:underline">Clear All</button>
                              </div>
                              <div className="space-y-1">
                                {['Winter Championship', 'Valorant teams', 'Pro League'].map((term, i) => (
                                  <RecentSearchItem key={i} term={term} onClick={() => setSearchQuery(term)} icon="history" />
                                ))}
                              </div>
                            </div>

                            {/* Trending Searches */}
                            <div className="p-3 border-t border-[var(--border-primary)]">
                              <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">🔥 Trending Now</p>
                              <div className="space-y-1">
                                {['CS2 Major', 'Apex Legends Finals', 'New Teams'].map((term, i) => (
                                  <RecentSearchItem key={i} term={term} onClick={() => setSearchQuery(term)} icon="trending_up" badge={`#${i + 1}`} />
                                ))}
                              </div>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Footer with Tips */}
                      <div className="p-3 bg-[var(--bg-secondary)] border-t border-[var(--border-primary)] flex items-center justify-between">
                        <div className="flex items-center gap-4 text-[10px] text-[var(--text-muted)]">
                          <KeyboardTip k="↵" label="to select" />
                          <KeyboardTip k="↑↓" label="to navigate" />
                          <KeyboardTip k="esc" label="to close" />
                        </div>
                        <Link to="/search" className="text-[10px] text-[var(--brand-primary)] font-medium hover:underline flex items-center gap-1">
                          Advanced Search
                          <span className="material-icons-outlined text-xs">arrow_forward</span>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 3. DESKTOP NAVIGATION */}
              <nav className="hidden lg:flex items-center gap-1">
                <NavButton icon="emoji_events" label="Tournaments" onClick={() => setTournamentsModalOpen(true)} active={location.pathname === '/tournaments'} />
                <NavButton icon="celebration" label="Events" onClick={() => setEventsModalOpen(true)} />
                <NavButton icon="calendar_today" label="Schedule" onClick={() => setScheduleModalOpen(true)} />

                <div className="w-px h-6 bg-[var(--border-primary)] mx-2"></div>

                {/* Notifications */}
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

                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="p-2.5 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-all"
                >
                  <span className="material-icons-outlined text-xl transition-transform duration-300 hover:rotate-180">
                    {theme === 'dark' ? 'light_mode' : 'dark_mode'}
                  </span>
                </button>

                {/* Account Menu */}
                <div
                  className="relative"
                  onMouseEnter={() => setActiveDropdown('account')}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-[var(--bg-hover)] transition-all">
                    {user ? (
                      <>
                        <div className="w-8 h-8 rounded-full bg-[var(--brand-primary)] flex items-center justify-center text-white font-bold text-sm">
                          {userInitials}
                        </div>
                        <div className="hidden xl:block text-left">
                          <p className="text-sm font-medium text-[var(--text-primary)] leading-none">{user.name || 'User'}</p>
                          <p className="text-xs text-[var(--text-muted)]">{user.role || 'Member'}</p>
                        </div>
                        <span className={`material-icons-outlined text-sm text-[var(--text-muted)] transition-transform ${activeDropdown === 'account' ? 'rotate-180' : ''}`}>expand_more</span>
                      </>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="material-icons-outlined text-xl text-[var(--text-secondary)]">person</span>
                        <span className="text-sm font-medium">Sign In</span>
                      </div>
                    )}
                  </button>

                  {/* Account Dropdown */}
                  <div className={`absolute top-full right-0 mt-2 w-56 bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-xl shadow-xl overflow-hidden transform transition-all duration-200 ${activeDropdown === 'account' ? 'opacity-100 scale-100 visible translate-y-0' : 'opacity-0 scale-95 invisible -translate-y-2'}`}>
                    {user ? (
                      <div className="p-2">
                        <div className="px-3 py-2 border-b border-[var(--border-primary)] mb-1">
                          <p className="text-sm font-bold text-[var(--text-primary)]">{user.name || 'User'}</p>
                          <p className="text-xs text-[var(--text-muted)]">{user.email || ''}</p>
                        </div>
                        <AccountMenuItem icon="person" label="Profile" to="/profile" />
                        <AccountMenuItem icon="settings" label="Settings" to="/settings" />
                        <AccountMenuItem icon="emoji_events" label="My Tournaments" to="/my-tournaments" />
                        <div className="border-t border-[var(--border-primary)] mt-1 pt-1">
                          <button
                            onClick={logout}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[var(--brand-primary)] hover:bg-[var(--bg-hover)] rounded-lg transition-all"
                          >
                            <span className="material-icons-outlined text-base">logout</span>
                            <span>Logout</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3">
                        <Link
                          to="/login"
                          className="flex items-center justify-center w-full bg-[var(--brand-primary)] text-white text-sm font-bold py-2.5 rounded-lg hover:bg-[var(--brand-primary-dark)] transition-all"
                        >
                          Sign In
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </nav>

              {/* 4. MOBILE MENU TOGGLE */}
              <div className="flex items-center gap-2 lg:hidden">
                <button
                  onClick={() => setNotificationModalOpen(true)}
                  className="relative p-2 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-all"
                >
                  <span className="material-icons-outlined text-xl">notifications</span>
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-[var(--brand-primary)] rounded-full text-white text-[9px] font-bold flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                <button
                  className="p-2 rounded-xl text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-all"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  <span className="material-icons-outlined text-2xl">
                    {isMobileMenuOpen ? 'close' : 'menu'}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* MOBILE MENU */}
          <div className={`lg:hidden border-t border-[var(--border-primary)] transition-all duration-300 overflow-hidden ${isMobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="p-4 space-y-3">
              <div className="relative">
                <span className="material-icons-outlined text-base text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2">search</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[var(--bg-tertiary)] py-2.5 pl-10 pr-4 rounded-xl text-sm border border-[var(--border-primary)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--brand-primary)]"
                  placeholder="Search..."
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <MobileNavButton icon="emoji_events" label="Tournaments" onClick={() => { setTournamentsModalOpen(true); setIsMobileMenuOpen(false); }} />
                <MobileNavButton icon="celebration" label="Events" onClick={() => { setEventsModalOpen(true); setIsMobileMenuOpen(false); }} />
                <MobileNavButton icon="calendar_today" label="Schedule" onClick={() => { setScheduleModalOpen(true); setIsMobileMenuOpen(false); }} />
                <MobileNavButton icon={theme === 'dark' ? 'light_mode' : 'dark_mode'} label={theme === 'dark' ? 'Light Mode' : 'Dark Mode'} onClick={toggleTheme} />
              </div>

              <div className="pt-3 border-t border-[var(--border-primary)]">
                <div className="flex items-center justify-between bg-[var(--bg-tertiary)] p-3 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${user ? 'bg-[var(--brand-primary)]' : 'bg-[var(--bg-hover)]'}`}>
                      {user ? userInitials : <span className="material-icons-outlined text-xl text-[var(--text-muted)]">person</span>}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[var(--text-primary)]">{user ? (user.name || 'User') : 'Guest'}</p>
                      <p className="text-xs text-[var(--text-muted)]">{user ? 'Online' : 'Not logged in'}</p>
                    </div>
                  </div>
                  {user ? (
                    <button onClick={logout} className="text-[var(--brand-primary)] p-2 hover:bg-[var(--bg-hover)] rounded-lg transition-all">
                      <span className="material-icons-outlined text-xl">logout</span>
                    </button>
                  ) : (
                    <Link to="/login" className="text-white font-medium text-sm px-4 py-2 bg-[var(--brand-primary)] rounded-lg hover:bg-[var(--brand-primary-dark)] transition-all">
                      Login
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>
      </div>

      {/* Spacer for fixed header */}
      {location.pathname !== '/' && <div className="h-20 sm:h-24"></div>}

      {/* Tournaments Modal */}
      {tournamentsModalOpen && (
        <ModalContainer onClose={() => setTournamentsModalOpen(false)} title="Tournaments" icon="emoji_events" subtitle="Browse and join competitions">
          <div className="grid grid-cols-3 gap-3 mb-6">
            {['shield', 'military_tech', 'sports_esports'].map((icon, i) => (
              <button key={i} className="p-4 rounded-xl bg-[var(--bg-tertiary)] hover:bg-[var(--bg-hover)] border border-[var(--border-primary)] hover:border-[var(--brand-primary)] transition-all text-center group">
                <span className="material-icons-outlined text-2xl text-[var(--text-muted)] group-hover:text-[var(--brand-primary)] mb-2 block">{icon}</span>
                <p className="text-sm font-medium text-[var(--text-primary)]">{i === 0 ? 'FPS' : i === 1 ? 'Battle Royale' : 'MOBA'}</p>
              </button>
            ))}
          </div>

          <h3 className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider mb-3">Active Tournaments</h3>
          <div className="space-y-3">
            {TOURNAMENTS.map((tournament) => (
              <div key={tournament.id} className="p-4 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-primary)] hover:border-[var(--brand-primary)] transition-all group cursor-pointer">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${tournament.status === 'live' ? 'bg-[var(--brand-primary)] text-white' : 'bg-[var(--bg-hover)] text-[var(--text-muted)]'}`}>
                      {tournament.status}
                    </span>
                    <span className="text-xs text-[var(--text-muted)]">{tournament.game}</span>
                  </div>
                  {tournament.status === 'live' && <div className="w-2 h-2 bg-[var(--brand-primary)] rounded-full animate-pulse"></div>}
                </div>
                <h4 className="font-bold text-[var(--text-primary)] group-hover:text-[var(--brand-primary)] transition-colors mb-1">{tournament.title}</h4>
                <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
                  <span className="flex items-center gap-1"><span className="material-icons-outlined text-sm">payments</span>{tournament.prize}</span>
                  <span className="flex items-center gap-1"><span className="material-icons-outlined text-sm">groups</span>{tournament.teams} Teams</span>
                  <span className="flex items-center gap-1"><span className="material-icons-outlined text-sm">event</span>{tournament.startDate}</span>
                </div>
              </div>
            ))}
          </div>
          <Link to="/tournaments" onClick={() => setTournamentsModalOpen(false)} className="mt-4 w-full py-3 bg-[var(--brand-primary)] text-white font-semibold rounded-xl hover:bg-[var(--brand-primary-dark)] transition-all flex items-center justify-center gap-2">
            <span>View All Tournaments</span>
            <span className="material-icons-outlined text-lg">arrow_forward</span>
          </Link>
        </ModalContainer>
      )}

      {/* Events Modal */}
      {eventsModalOpen && (
        <ModalContainer onClose={() => setEventsModalOpen(false)} title="Events" icon="celebration" subtitle="Discover community activities">
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            <button className="px-4 py-2 rounded-full bg-[var(--brand-primary)] text-white text-sm font-medium whitespace-nowrap">All Events</button>
            {['Community', 'Meetups', 'Workshops'].map((type) => (
              <button key={type} className="px-4 py-2 rounded-full bg-[var(--bg-tertiary)] text-[var(--text-secondary)] text-sm font-medium whitespace-nowrap hover:bg-[var(--bg-hover)] transition-all">{type}</button>
            ))}
          </div>
          <div className="space-y-3">
            {EVENTS.map((event) => (
              <div key={event.id} className="p-4 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-primary)] hover:border-[var(--brand-primary)] transition-all group cursor-pointer">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <span className={`inline-block text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider mb-2 ${event.type === 'community' ? 'bg-blue-500/20 text-blue-400' : event.type === 'meetup' ? 'bg-green-500/20 text-green-400' : 'bg-purple-500/20 text-purple-400'}`}>
                      {event.type}
                    </span>
                    <h4 className="font-bold text-[var(--text-primary)] group-hover:text-[var(--brand-primary)] transition-colors mb-2">{event.title}</h4>
                    <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
                      <span className="flex items-center gap-1"><span className="material-icons-outlined text-sm">event</span>{event.date}</span>
                      <span className="flex items-center gap-1"><span className="material-icons-outlined text-sm">schedule</span>{event.time}</span>
                      <span className="flex items-center gap-1"><span className="material-icons-outlined text-sm">people</span>{event.attendees} attending</span>
                    </div>
                  </div>
                  <button className="px-3 py-1.5 bg-[var(--bg-hover)] text-[var(--text-primary)] text-xs font-medium rounded-lg hover:bg-[var(--brand-primary)] hover:text-white transition-all">Join</button>
                </div>
              </div>
            ))}
          </div>
          <Link to="/events" onClick={() => setEventsModalOpen(false)} className="mt-4 w-full py-3 bg-[var(--brand-primary)] text-white font-semibold rounded-xl hover:bg-[var(--brand-primary-dark)] transition-all flex items-center justify-center gap-2">
            <span>View All Events</span>
            <span className="material-icons-outlined text-lg">arrow_forward</span>
          </Link>
        </ModalContainer>
      )}

      {/* Schedule Modal */}
      {scheduleModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setScheduleModalOpen(false)}></div>
          <div className="relative bg-[var(--bg-card)] rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden border border-[var(--border-primary)]">
            <div className="flex items-center justify-between p-5 border-b border-[var(--border-primary)] bg-[var(--bg-secondary)]">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[var(--brand-primary)]/10 rounded-xl">
                  <span className="material-icons-outlined text-2xl text-[var(--brand-primary)]">calendar_month</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[var(--text-primary)]">Schedule</h2>
                  <p className="text-sm text-[var(--text-muted)]">View and manage your events</p>
                </div>
              </div>
              <button onClick={() => setScheduleModalOpen(false)} className="p-2 rounded-xl hover:bg-[var(--bg-hover)] transition-all text-[var(--text-secondary)]">
                <span className="material-icons-outlined text-xl">close</span>
              </button>
            </div>

            <div className="p-5 overflow-y-auto max-h-[calc(85vh-80px)]">
              <div className="grid md:grid-cols-2 gap-5">
                <div className="bg-[var(--bg-tertiary)] p-4 rounded-xl border border-[var(--border-primary)]">
                  <div className="flex items-center justify-between mb-5">
                    <button onClick={prevMonth} className="p-2 hover:bg-[var(--bg-hover)] rounded-lg transition-all">
                      <span className="material-icons-outlined text-[var(--text-primary)]">chevron_left</span>
                    </button>
                    <div className="text-center">
                      <h3 className="text-base font-bold text-[var(--text-primary)]">
                        {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </h3>
                      <p className="text-xs text-[var(--text-muted)] font-mono mt-1">
                        {currentTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </p>
                    </div>
                    <button onClick={nextMonth} className="p-2 hover:bg-[var(--bg-hover)] rounded-lg transition-all">
                      <span className="material-icons-outlined text-[var(--text-primary)]">chevron_right</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-7 mb-3">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                      <div key={day} className="text-center text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">{day}</div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: getFirstDayOfMonth(currentMonth) }).map((_, i) => <div key={`empty-${i}`} className="h-9 md:h-10" />)}
                    {Array.from({ length: getDaysInMonth(currentMonth) }).map((_, i) => {
                      const day = i + 1;
                      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                      const isSelected = isSameDay(date, selectedDate);
                      const isToday = isSameDay(date, new Date());
                      const hasEventDot = hasEvent(date);

                      return (
                        <button
                          key={day}
                          onClick={() => setSelectedDate(date)}
                          className={`relative h-9 md:h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-all ${isSelected ? 'bg-[var(--brand-primary)] text-white' : isToday ? 'bg-[var(--bg-hover)] text-[var(--brand-primary)] border border-[var(--brand-primary)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'}`}
                        >
                          {day}
                          {hasEventDot && <span className={`absolute bottom-1 w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-[var(--brand-primary)]'}`}></span>}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col">
                  <div className="mb-4">
                    <h3 className="text-base font-bold text-[var(--text-primary)]">
                      {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </h3>
                    <p className="text-sm text-[var(--text-muted)]">
                      {getEventsForDate(selectedDate).length} events scheduled
                    </p>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                    {getEventsForDate(selectedDate).length > 0 ? (
                      getEventsForDate(selectedDate).map((event, index) => (
                        <div key={index} className="p-4 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-primary)] hover:border-[var(--brand-primary)] transition-all group">
                          <div className="flex items-start justify-between mb-2">
                            <span className={`text-[10px] font-bold px-2 py-1 rounded text-white uppercase tracking-wider ${event.type === 'tournament' ? 'bg-red-500' : event.type === 'practice' ? 'bg-blue-500' : 'bg-green-500'}`}>
                              {event.type}
                            </span>
                            <span className="text-sm font-mono font-medium text-[var(--text-secondary)]">{event.time}</span>
                          </div>
                          <h4 className="font-bold text-[var(--text-primary)] group-hover:text-[var(--brand-primary)] transition-colors">{event.title}</h4>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center h-40 text-[var(--text-muted)] border-2 border-dashed border-[var(--border-primary)] rounded-xl">
                        <span className="material-icons-outlined text-4xl mb-2 opacity-50">event_busy</span>
                        <p>No events scheduled</p>
                      </div>
                    )}
                  </div>
                  <button className="w-full mt-4 py-3 bg-[var(--bg-tertiary)] hover:bg-[var(--brand-primary)] hover:text-white text-[var(--text-primary)] font-semibold rounded-xl transition-all flex items-center justify-center gap-2 border border-[var(--border-primary)] hover:border-[var(--brand-primary)]">
                    <span className="material-icons-outlined">add</span>
                    Add New Event
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification Modal */}
      {notificationModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center md:justify-end md:items-start md:pt-20 md:pr-6 p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setNotificationModalOpen(false)}></div>
          <div className="relative w-full max-w-sm bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-[var(--border-primary)] flex justify-between items-center bg-[var(--bg-secondary)]">
              <div className="flex items-center gap-2">
                <span className="material-icons-outlined text-[var(--brand-primary)]">notifications</span>
                <h3 className="font-bold text-[var(--text-primary)]">Notifications</h3>
              </div>
              <div className="flex items-center gap-3">
                <button className="text-xs text-[var(--brand-primary)] font-bold uppercase hover:underline">Mark all read</button>
                <button onClick={() => setNotificationModalOpen(false)} className="text-[var(--text-secondary)] p-1 hover:bg-[var(--bg-hover)] rounded-lg">
                  <span className="material-icons-outlined text-lg">close</span>
                </button>
              </div>
            </div>
            <div className="max-h-[60vh] md:max-h-[400px] overflow-y-auto">
              {NOTIFICATIONS.map((notif) => (
                <div key={notif.id} className={`p-4 flex gap-3 hover:bg-[var(--bg-hover)] border-b border-[var(--border-primary)] last:border-0 transition-colors cursor-pointer ${notif.unread ? 'bg-[var(--brand-primary)]/5' : ''}`}>
                  <div className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${notif.unread ? 'bg-[var(--brand-primary)] text-white' : 'bg-[var(--bg-tertiary)] text-[var(--text-muted)]'}`}>
                    <span className="material-icons-outlined text-base">{notif.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <p className={`text-sm truncate ${notif.unread ? 'font-bold text-[var(--text-primary)]' : 'font-medium text-[var(--text-secondary)]'}`}>{notif.title}</p>
                      <span className="text-[10px] text-[var(--text-muted)] whitespace-nowrap">{notif.time}</span>
                    </div>
                    <p className="text-xs text-[var(--text-muted)] mt-1 line-clamp-2">{notif.message}</p>
                  </div>
                  {notif.unread && <div className="w-2 h-2 bg-[var(--brand-primary)] rounded-full self-center shrink-0"></div>}
                </div>
              ))}
            </div>
            <div className="p-3 bg-[var(--bg-secondary)] border-t border-[var(--border-primary)] text-center">
              <Link to="/notifications" onClick={() => setNotificationModalOpen(false)} className="text-xs font-medium text-[var(--text-muted)] hover:text-[var(--brand-primary)] block py-1 transition-colors">
                View All History
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// ===========================
// SUB-COMPONENTS
// ===========================

const FilterButton = ({ icon, label }) => (
  <button className="px-3 py-1.5 text-xs font-medium bg-[var(--bg-tertiary)] hover:bg-[var(--brand-primary)] hover:text-white text-[var(--text-secondary)] rounded-full transition-all flex items-center gap-1">
    <span className="material-icons-outlined text-sm">{icon}</span>
    {label}
  </button>
);

const NavButton = ({ icon, label, onClick, active }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all group ${active ? 'text-[var(--brand-primary)] bg-[var(--brand-primary)]/10' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'}`}
  >
    <span className="material-icons-outlined text-lg group-hover:text-[var(--brand-primary)] transition-colors">{icon}</span>
    <span>{label}</span>
  </button>
);

const RecentSearchItem = ({ term, onClick, icon, badge }) => (
  <button onClick={onClick} className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-[var(--bg-hover)] transition-all text-left group">
    <span className={`material-icons-outlined text-base ${icon === 'trending_up' ? 'text-[var(--brand-primary)]' : 'text-[var(--text-muted)]'}`}>{icon}</span>
    <span className="text-sm text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] flex-1">{term}</span>
    {badge ? (
      <span className="text-[10px] text-[var(--text-muted)] bg-[var(--bg-tertiary)] px-2 py-0.5 rounded-full">{badge}</span>
    ) : (
      <span className="material-icons-outlined text-sm text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity">north_west</span>
    )}
  </button>
);

const KeyboardTip = ({ k, label }) => (
  <span className="flex items-center gap-1">
    <kbd className="px-1.5 py-0.5 bg-[var(--bg-tertiary)] rounded text-[9px] font-mono">{k}</kbd> {label}
  </span>
);

const AccountMenuItem = ({ icon, label, to }) => (
  <Link
    to={to}
    className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-lg transition-all"
  >
    <span className="material-icons-outlined text-base text-[var(--text-muted)]">{icon}</span>
    <span>{label}</span>
  </Link>
);

const MobileNavButton = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-[var(--bg-tertiary)] hover:bg-[var(--bg-hover)] border border-[var(--border-primary)] hover:border-[var(--brand-primary)] transition-all group"
  >
    <span className="material-icons-outlined text-xl text-[var(--text-muted)] group-hover:text-[var(--brand-primary)] transition-colors">{icon}</span>
    <span className="text-xs font-medium text-[var(--text-primary)]">{label}</span>
  </button>
);

const ModalContainer = ({ onClose, title, icon, subtitle, children }) => (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/60" onClick={onClose}></div>
    <div className="relative bg-[var(--bg-card)] rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden border border-[var(--border-primary)]">
      <div className="flex items-center justify-between p-5 border-b border-[var(--border-primary)] bg-[var(--bg-secondary)]">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[var(--brand-primary)]/10 rounded-xl">
            <span className="material-icons-outlined text-2xl text-[var(--brand-primary)]">{icon}</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-[var(--text-primary)]">{title}</h2>
            <p className="text-sm text-[var(--text-muted)]">{subtitle}</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 rounded-xl hover:bg-[var(--bg-hover)] transition-all text-[var(--text-secondary)]">
          <span className="material-icons-outlined text-xl">close</span>
        </button>
      </div>
      <div className="p-5 overflow-y-auto max-h-[calc(85vh-80px)]">
        {children}
      </div>
    </div>
  </div>
);

export default Header;