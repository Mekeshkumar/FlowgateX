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
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-500">Manage your event tickets and reservations</p>
        </div>
        <Link to="/events">
          <Button>
            <span className="material-icons-outlined mr-2">add</span>
            Book New Event
          </Button>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {['All', 'Upcoming', 'Completed', 'Cancelled'].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === 'All'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      ) : displayBookings.length === 0 ? (
        <EmptyState
          icon="confirmation_number"
          title="No bookings yet"
          description="Start exploring events and book your first ticket!"
          action={
            <Link to="/events">
              <Button>Browse Events</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
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
  );
};

export default BookingsPage;
