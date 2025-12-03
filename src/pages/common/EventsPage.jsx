import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEvents, setFilters, clearFilters } from '@features/events/store/eventsSlice';
import { EventCard, EventFilters } from '@features/events/components';
import { LoadingSpinner, EmptyState } from '@components/common';

const EventsPage = () => {
  const dispatch = useDispatch();
  const { events, isLoading, filters, categories } = useSelector((state) => state.events);

  // Mock categories for demo
  const mockCategories = ['Music', 'Sports', 'Tech', 'Food', 'Art', 'Business'];

  useEffect(() => {
    dispatch(fetchEvents(filters));
  }, [dispatch, filters]);

  const handleFilterChange = (newFilters) => {
    dispatch(setFilters(newFilters));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  // Mock events for demo
  const mockEvents = [
    {
      id: 1,
      title: 'Tech Conference 2024',
      description: 'Join us for the biggest tech conference of the year',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600',
      date: '2024-03-15',
      time: '09:00',
      location: 'Convention Center, San Francisco',
      price: 299,
      category: 'Tech',
      capacity: 500,
      attendees: 423,
      isFeatured: true,
    },
    {
      id: 2,
      title: 'Summer Music Festival',
      description: 'Three days of non-stop music and entertainment',
      image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600',
      date: '2024-06-20',
      time: '14:00',
      location: 'Central Park, New York',
      price: 150,
      category: 'Music',
      capacity: 10000,
      attendees: 8500,
      isFeatured: true,
    },
    {
      id: 3,
      title: 'Startup Pitch Night',
      description: 'Watch innovative startups pitch their ideas',
      image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600',
      date: '2024-02-28',
      time: '18:00',
      location: 'Innovation Hub, Austin',
      price: 0,
      category: 'Business',
      capacity: 200,
      attendees: 156,
      isFeatured: false,
    },
    {
      id: 4,
      title: 'Food & Wine Expo',
      description: 'Taste the best cuisines from around the world',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600',
      date: '2024-04-10',
      time: '11:00',
      location: 'Exhibition Hall, Chicago',
      price: 75,
      category: 'Food',
      capacity: 1000,
      attendees: 678,
      isFeatured: false,
    },
    {
      id: 5,
      title: 'Art Gallery Opening',
      description: 'Exclusive preview of contemporary art collection',
      image: 'https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?w=600',
      date: '2024-03-01',
      time: '19:00',
      location: 'Modern Art Museum, LA',
      price: 50,
      category: 'Art',
      capacity: 300,
      attendees: 245,
      isFeatured: false,
    },
    {
      id: 6,
      title: 'Marathon Championship',
      description: 'Annual city marathon with participants worldwide',
      image: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=600',
      date: '2024-05-05',
      time: '06:00',
      location: 'Downtown, Boston',
      price: 100,
      category: 'Sports',
      capacity: 5000,
      attendees: 4200,
      isFeatured: true,
    },
  ];

  const displayEvents = events.length > 0 ? events : mockEvents;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Discover Events</h1>
          <p className="text-gray-500 mt-2">
            Find and book amazing events happening around you
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-80 flex-shrink-0">
            <EventFilters
              filters={filters}
              categories={categories.length > 0 ? categories : mockCategories}
              onFilterChange={handleFilterChange}
              onClear={handleClearFilters}
            />
          </aside>

          {/* Events Grid */}
          <main className="flex-1">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <LoadingSpinner size="lg" />
              </div>
            ) : displayEvents.length === 0 ? (
              <EmptyState
                icon="event_busy"
                title="No events found"
                description="Try adjusting your filters or check back later for new events."
              />
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <p className="text-gray-500">
                    Showing <span className="font-medium text-gray-900">{displayEvents.length}</span> events
                  </p>
                  <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
                    <option>Sort by Date</option>
                    <option>Sort by Price</option>
                    <option>Sort by Popularity</option>
                  </select>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {displayEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
