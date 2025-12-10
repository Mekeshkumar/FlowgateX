import { Link } from 'react-router-dom';
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

  const statusIcons = {
    confirmed: 'check_circle',
    pending: 'pending',
    cancelled: 'cancel',
    completed: 'task_alt',
  };

  const isUpcoming = dayjs(event?.date).isAfter(dayjs());
  const canCancel = status === 'confirmed' && isUpcoming;

  return (
    <div className="card group hover:shadow-red-md hover:-translate-y-1 transition-all duration-300 border-[var(--border-primary)] bg-[var(--bg-card)] overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Event Image */}
        <div className="md:w-56 h-48 md:h-auto flex-shrink-0 relative overflow-hidden">
          <img
            src={event?.image || '/placeholder-event.jpg'}
            alt={event?.title}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-3 left-3 text-white text-xs font-medium px-2 py-1 rounded bg-black/40 backdrop-blur-sm border border-white/10">
            {isUpcoming ? 'Upcoming Event' : 'Past Event'}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-5 md:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-4 mb-3">
              <Badge
                className={`
                  ${status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : ''}
                  ${status === 'pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : ''}
                  ${status === 'cancelled' ? 'bg-red-500/10 text-red-500 border-red-500/20' : ''}
                  ${status === 'completed' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : ''}
                  border px-2.5 py-0.5
                `}
              >
                <div className="flex items-center gap-1.5">
                  <span className="material-icons text-[16px]">
                    {statusIcons[status]}
                  </span>
                  <span className="font-semibold tracking-wide text-xs">
                    {status.toUpperCase()}
                  </span>
                </div>
              </Badge>
              {status === 'confirmed' && (
                <div className="hidden sm:block text-right">
                  <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-bold mb-1">Ticket Code</p>
                  <code className="text-xs bg-[var(--bg-tertiary)] px-2 py-1 rounded text-[var(--text-primary)] border border-[var(--border-primary)] font-mono">
                    {ticketCode}
                  </code>
                </div>
              )}
            </div>

            <h3 className="font-bold text-[var(--text-primary)] text-xl mb-3 font-heading leading-tight group-hover:text-[var(--brand-primary)] transition-colors">
              <Link to={`/events/${event?.id}`}>
                {event?.title}
              </Link>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-sm text-[var(--text-secondary)] mb-4">
              <div className="flex items-center gap-2">
                <span className="material-icons-outlined text-[var(--brand-primary)] text-lg">calendar_today</span>
                <span>
                  {dayjs(event?.date).format('MMM D, YYYY')} • {dayjs(`${event?.date} ${event?.time}`).format('h:mm A')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-icons-outlined text-[var(--brand-primary)] text-lg">location_on</span>
                <span className="truncate">{event?.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-icons-outlined text-[var(--brand-primary)] text-lg">confirmation_number</span>
                <span>{quantity} Ticket{quantity > 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-icons-outlined text-[var(--brand-primary)] text-lg">payments</span>
                <span className="font-semibold text-[var(--text-primary)]">${totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-[var(--border-primary)] mt-2">
            <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
              <span className="material-icons-outlined text-sm">history</span>
              Booked on {dayjs(createdAt).format('MMM D, YYYY')}
            </span>
            <div className="flex items-center gap-3">
              {canCancel && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onCancel(id)}
                  className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                >
                  Cancel Booking
                </Button>
              )}
              {status === 'confirmed' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewTicket(booking)}
                  className="border-[var(--brand-primary)] text-[var(--brand-primary)] hover:bg-[var(--brand-primary)] hover:text-white"
                >
                  <span className="material-icons-outlined text-sm mr-2">local_activity</span>
                  View Ticket
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
