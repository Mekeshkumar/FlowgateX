import { useState } from 'react';
import { createPortal } from 'react-dom';
import classNames from 'classnames';
import dayjs from 'dayjs';
import EventDetailModal from './EventDetailModal';

const EventCard = ({
  event,
  variant = 'default',
  isSelected = false,
  onSelectCard,
  className = ''
}) => {
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

  const {
    id,
    title,
    image,
    date,
    time,
    location,
    price,
    category,
    attendees = 0,
    capacity = 0,
    isFeatured,
  } = event;

  const isCompact = variant === 'compact';
  const formattedDate = date ? dayjs(date).format('MMM D, YYYY') : '';
  const formattedTime = time ? dayjs(`${date} ${time}`).format('h:mm A') : '';
  const spotsLeft = capacity - attendees;
  const isSoldOut = spotsLeft <= 0;
  const percentFilled = capacity > 0 ? (attendees / capacity) * 100 : 0;

  // -- Handlers --

  const handleSelectClick = (e) => {
    e.stopPropagation();
    // If a parent handler exists for selection (e.g. multi-select list), call it
    if (onSelectCard) {
      onSelectCard(id);
    } else {
      // Otherwise, treat "Select" as "Start Booking"
      setShowBookingModal(true);
    }
  };

  const handleDetailsClick = (e) => {
    e.stopPropagation();
    setShowDetailsModal(true);
  };

  const handlePayment = () => {
    if (!selectedPaymentMethod) return;

    // Simulate API call
    setTimeout(() => {
      alert('Payment processed successfully! Ticket sent to email.');
      setShowBookingModal(false);
      setShowDetailsModal(false);
    }, 1000);
  };

  const incrementQuantity = () => {
    if (ticketQuantity < Math.min(10, spotsLeft)) setTicketQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    if (ticketQuantity > 1) setTicketQuantity(prev => prev - 1);
  };

  // -- Calculations --
  const subtotal = price * ticketQuantity;
  const serviceFee = price === 0 ? 0 : 50;
  const total = subtotal + serviceFee;

  return (
    <>
      {/* ===========================
          Main Card Component
      =========================== */}
      <div
        className={classNames(
          'card card-hover group relative flex flex-col h-full',
          isSelected ? 'ring-2 ring-[var(--brand-primary)]' : '',
          isCompact && 'flex-row min-h-[160px]',
          className
        )}
      >
        {/* --- Image Section --- */}
        <div
          className={classNames(
            'relative overflow-hidden',
            isCompact ? 'w-48 shrink-0' : 'aspect-[16/9] w-full'
          )}
        >
          <img
            src={image || '/placeholder-event.jpg'}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />

          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)]/90 via-transparent to-transparent opacity-80" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10">
            <span className="badge-primary shadow-lg backdrop-blur-md">
              {category}
            </span>
            {isFeatured && (
              <span className="badge-warning shadow-lg backdrop-blur-md">
                <span className="material-icons-outlined text-[10px] mr-1">star</span> Featured
              </span>
            )}
          </div>

          {/* Date Badge (Desktop/Default View) */}
          {!isCompact && date && (
            <div className="absolute bottom-3 left-3 z-10 hover-lift">
              <div className="glass rounded-lg px-3 py-1.5 text-center border-l-2 border-[var(--brand-primary)]">
                <div className="text-xs font-bold uppercase text-[var(--text-muted)] tracking-wider">
                  {dayjs(date).format('MMM')}
                </div>
                <div className="text-xl font-heading font-bold text-[var(--text-primary)] leading-none">
                  {dayjs(date).format('DD')}
                </div>
              </div>
            </div>
          )}

          {/* Sold Out Overlay */}
          {isSoldOut && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-20">
              <div className="border-2 border-[var(--brand-primary)] px-6 py-2 rounded-lg transform -rotate-12">
                <span className="text-[var(--brand-primary)] font-heading font-bold text-2xl tracking-widest uppercase">
                  Sold Out
                </span>
              </div>
            </div>
          )}
        </div>

        {/* --- Content Section --- */}
        <div className="flex flex-col flex-1 p-5 relative">

          {/* Title & Price Row */}
          <div className="flex justify-between items-start gap-4 mb-2">
            <h3
              className="font-heading text-xl font-bold text-[var(--text-primary)] leading-tight line-clamp-2 group-hover:text-[var(--brand-primary)] transition-colors cursor-pointer"
              onClick={handleDetailsClick}
            >
              {title}
            </h3>
            <div className="text-right shrink-0">
              {price === 0 ? (
                <span className="text-emerald-500 font-bold font-mono">Free</span>
              ) : (
                <span className="text-[var(--text-primary)] font-bold font-mono">₹{price}</span>
              )}
            </div>
          </div>

          {/* Metadata */}
          <div className="space-y-2 mb-4">
            {/* Time */}
            <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              <span className="material-icons-outlined text-base text-[var(--brand-primary)]">schedule</span>
              <span>{formattedDate} • {formattedTime}</span>
            </div>
            {/* Location */}
            <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              <span className="material-icons-outlined text-base text-[var(--brand-primary)]">location_on</span>
              <span className="truncate">{location?.venue || 'No location'}</span>
            </div>
          </div>

          {/* Capacity Bar */}
          {!isSoldOut && !isCompact && (
            <div className="mt-auto mb-5">
              <div className="flex justify-between text-xs text-[var(--text-muted)] mb-1">
                <span>{attendees} going</span>
                <span className={percentFilled > 80 ? 'text-[var(--brand-primary)]' : ''}>
                  {spotsLeft} spots left
                </span>
              </div>
              <div className="h-1.5 w-full bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                <div
                  className="h-full gradient-primary transition-all duration-500"
                  style={{ width: `${percentFilled}%` }}
                />
              </div>
            </div>
          )}

          {/* --- Action Buttons --- */}
          <div className={classNames("grid gap-3", isCompact ? "mt-2" : "mt-auto grid-cols-2")}>

            {/* 1. View Details Button */}
            <button
              onClick={handleDetailsClick}
              className="btn-secondary text-sm py-2 hover:border-[var(--brand-primary)]"
            >
              View Details
            </button>

            {/* 2. Select / Book Button */}
            <button
              onClick={handleSelectClick}
              disabled={isSoldOut}
              className={classNames(
                "btn-primary text-sm py-2",
                isSoldOut && "opacity-50 cursor-not-allowed grayscale"
              )}
            >
              {isSoldOut ? 'Waitlist' : 'Select'}
            </button>
          </div>
        </div>
      </div>


      {/* ===========================
          1. Event Details Modal
      =========================== */}
      <EventDetailModal
        event={event}
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        onBookNow={() => {
          setShowDetailsModal(false);
          setShowBookingModal(true);
        }}
      />


      {/* ===========================
          2. Booking & Payment Modal
      =========================== */}
      {showBookingModal && createPortal(
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]"
          onClick={() => setShowBookingModal(false)}
        >
          <div
            className="card max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-[slideUp_0.3s_ease-out] border border-[var(--border-focus)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-[var(--border-primary)] flex justify-between items-center bg-[var(--bg-secondary)]">
              <div>
                <h3 className="font-heading text-2xl font-bold text-[var(--text-primary)]">Checkout</h3>
                <p className="text-sm text-[var(--text-muted)]">{title}</p>
              </div>
              <button onClick={() => setShowBookingModal(false)} className="text-[var(--text-muted)] hover:text-white">
                <span className="material-icons-outlined">close</span>
              </button>
            </div>

            <div className="p-6 overflow-y-auto">

              {/* Quantity Selector */}
              <div className="mb-8 p-4 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-primary)]">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-semibold">Number of Tickets</span>
                  <span className="text-[var(--text-muted)] text-sm">Max 10 per user</span>
                </div>
                <div className="flex items-center justify-between bg-[var(--bg-card)] p-2 rounded-lg border border-[var(--border-primary)]">
                  <button onClick={decrementQuantity} className="p-2 hover:bg-[var(--bg-hover)] rounded-md text-[var(--text-primary)]">
                    <span className="material-icons-outlined">remove</span>
                  </button>
                  <span className="font-mono text-xl font-bold">{ticketQuantity}</span>
                  <button onClick={incrementQuantity} className="p-2 hover:bg-[var(--bg-hover)] rounded-md text-[var(--text-primary)]">
                    <span className="material-icons-outlined">add</span>
                  </button>
                </div>
              </div>

              {/* Payment Methods */}
              <h4 className="font-heading text-lg font-semibold mb-4">Select Payment Method</h4>
              <div className="grid gap-3 mb-8">
                {['UPI', 'Card', 'Wallet'].map((method) => (
                  <button
                    key={method}
                    onClick={() => setSelectedPaymentMethod(method)}
                    className={classNames(
                      "flex items-center p-4 rounded-xl border transition-all duration-200 text-left",
                      selectedPaymentMethod === method
                        ? "border-[var(--brand-primary)] bg-[var(--brand-primary)]/10"
                        : "border-[var(--border-primary)] bg-[var(--bg-card)] hover:bg-[var(--bg-hover)]"
                    )}
                  >
                    <span className="material-icons-outlined mr-3 text-[var(--brand-primary)]">
                      {method === 'UPI' ? 'qr_code' : method === 'Card' ? 'credit_card' : 'account_balance_wallet'}
                    </span>
                    <span className="font-semibold">{method}</span>
                    {selectedPaymentMethod === method && (
                      <span className="material-icons ml-auto text-[var(--brand-primary)]">check_circle</span>
                    )}
                  </button>
                ))}
              </div>

              {/* Summary */}
              <div className="border-t border-[var(--border-primary)] pt-4 space-y-2">
                <div className="flex justify-between text-[var(--text-secondary)]">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-[var(--text-secondary)]">
                  <span>Service Fee</span>
                  <span>₹{serviceFee}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-[var(--text-primary)] mt-4 pt-4 border-t border-[var(--border-primary)] border-dashed">
                  <span>Total</span>
                  <span className="text-gradient-primary">₹{total}</span>
                </div>
              </div>
            </div>

            {/* Pay Button */}
            <div className="p-6 bg-[var(--bg-secondary)] border-t border-[var(--border-primary)]">
              <button
                onClick={handlePayment}
                disabled={!selectedPaymentMethod}
                className="w-full btn-primary py-4 text-lg font-bold shadow-red-lg"
              >
                Pay ₹{total}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default EventCard;