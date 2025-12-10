import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserBookings, cancelBooking } from '@features/booking/store/bookingSlice';
import { BookingCard } from '@features/booking/components';
import { LoadingSpinner, EmptyState, Button } from '@components/common';
import { Link } from 'react-router-dom';

const BookingsPage = () => {
  const dispatch = useDispatch();
  const { bookings, isLoading } = useSelector((state) => state.booking);

  useEffect(() => {
    dispatch(fetchUserBookings());
  }, [dispatch]);

  const handleCancelBooking = (id) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      dispatch(cancelBooking(id));
    }
  };

  const handleViewTicket = (booking) => {
    // Open ticket modal or navigate to ticket page
    console.log('View ticket:', booking);
  };

  // Mock bookings for demo
  const mockBookings = [
    {
      id: 1,
      event: {
        id: 1,
        title: 'Tech Conference 2024',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600',
        date: '2024-03-15',
        time: '09:00',
        location: 'Convention Center, San Francisco',
      },
      status: 'confirmed',
      quantity: 2,
      totalAmount: 598,
      ticketCode: 'TKT-2024-001',
      createdAt: '2024-01-15T10:30:00Z',
    },
    {
      id: 2,
      event: {
        id: 2,
        title: 'Music Festival',
        image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600',
        date: '2024-06-20',
        time: '14:00',
        location: 'Central Park, New York',
      },
      status: 'pending',
      quantity: 1,
      totalAmount: 150,
      ticketCode: 'TKT-2024-002',
      createdAt: '2024-01-20T14:00:00Z',
    },
    {
      id: 3,
      event: {
        id: 3,
        title: 'Startup Pitch Night',
        image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600',
        date: '2024-01-28',
        time: '18:00',
        location: 'Innovation Hub, Austin',
      },
      status: 'completed',
      quantity: 1,
      totalAmount: 0,
      ticketCode: 'TKT-2024-003',
      createdAt: '2024-01-10T09:00:00Z',
    },
  ];

  const displayBookings = bookings.length > 0 ? bookings : mockBookings;

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-6">
          <Link to="/" className="hover:text-[var(--brand-primary)] transition-colors flex items-center gap-1">
            <span className="material-icons-outlined text-base">home</span>
            Home
          </Link>
          <span className="material-icons-outlined text-sm">chevron_right</span>
          <span className="text-[var(--text-primary)] font-medium">My Bookings</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)] font-heading">My Bookings</h1>
            <p className="text-[var(--text-secondary)] mt-1">Manage your event tickets and upcoming reservations</p>
          </div>
          <Link to="/events">
            <Button className="btn-primary shadow-red-sm hover:shadow-red-md transition-all duration-200">
              <span className="material-icons-outlined mr-2">add_circle_outline</span>
              Book New Event
            </Button>
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="glass rounded-xl p-1 mb-8 inline-flex bg-[var(--bg-tertiary)] border border-[var(--border-primary)]">
          {['All', 'Upcoming', 'Completed', 'Cancelled'].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                // In a real app, you'd add filtering logic here
                console.log('Filter by:', tab);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${tab === 'All' // Demo: "All" is active by default
                  ? 'bg-[var(--bg-elevated)] text-[var(--brand-primary)] shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <LoadingSpinner size="lg" className="text-[var(--brand-primary)]" />
            <p className="mt-4 text-[var(--text-secondary)] animate-pulse">Loading your bookings...</p>
          </div>
        ) : displayBookings.length === 0 ? (
          <div className="card border-[var(--border-primary)] bg-[var(--bg-card)] p-12 text-center">
            <EmptyState
              icon="confirmation_number"
              title="No bookings found"
              description="You haven't booked any events yet. Start exploring now!"
              action={
                <Link to="/events" className="mt-4 inline-block">
                  <Button className="btn-primary">Browse Upcoming Events</Button>
                </Link>
              }
            />
          </div>
        ) : (
          <div className="grid gap-6 animate-slide-up">
            {displayBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onCancel={handleCancelBooking}
                onViewTicket={handleViewTicket}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsPage;
