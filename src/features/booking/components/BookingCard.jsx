import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { Badge, Button } from '@components/common';
import dayjs from 'dayjs';

const BookingCard = ({ booking, onCancel, onViewTicket }) => {
  const {
    id,
    event,
    status,
    quantity,
    totalAmount,
    createdAt,
    ticketCode,
  } = booking;

  const statusColors = {
    confirmed: 'success',
    pending: 'warning',
    cancelled: 'danger',
    completed: 'info',
  };

  const statusIcons = {
    confirmed: 'check_circle',
    pending: 'pending',
    cancelled: 'cancel',
    completed: 'task_alt',
  };

  const isUpcoming = dayjs(event?.date).isAfter(dayjs());
  const canCancel = status === 'confirmed' && isUpcoming;

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row">
        {/* Event Image */}
        <div className="md:w-48 h-32 md:h-auto flex-shrink-0">
          <img
            src={event?.image || '/placeholder-event.jpg'}
            alt={event?.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex-1 p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Badge variant={statusColors[status]} size="sm" className="mb-2">
                <span className="material-icons text-xs mr-1">
                  {statusIcons[status]}
                </span>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Badge>
              <h3 className="font-semibold text-gray-900 text-lg mb-1">
                <Link to={`/events/${event?.id}`} className="hover:text-primary-600">
                  {event?.title}
                </Link>
              </h3>
              <div className="space-y-1 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <span className="material-icons-outlined text-base">calendar_today</span>
                  <span>
                    {dayjs(event?.date).format('MMM D, YYYY')} at{' '}
                    {dayjs(`${event?.date} ${event?.time}`).format('h:mm A')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-icons-outlined text-base">location_on</span>
                  <span>{event?.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-icons-outlined text-base">confirmation_number</span>
                  <span>{quantity} ticket(s) • ${totalAmount}</span>
                </div>
              </div>
            </div>

            {/* QR Code Preview */}
            {status === 'confirmed' && (
              <div className="hidden sm:block">
                <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="material-icons text-3xl text-gray-400">qr_code_2</span>
                </div>
                <p className="text-xs text-gray-400 text-center mt-1">{ticketCode}</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <span className="text-xs text-gray-400">
              Booked on {dayjs(createdAt).format('MMM D, YYYY')}
            </span>
            <div className="flex gap-2">
              {status === 'confirmed' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewTicket(booking)}
                  leftIcon={<span className="material-icons text-sm">confirmation_number</span>}
                >
                  View Ticket
                </Button>
              )}
              {canCancel && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onCancel(id)}
                  className="text-red-600 hover:bg-red-50"
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
