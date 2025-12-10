import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '@hooks/useAuth';

// --- UTILITIES ---

// Fix 5: Floating Point Math Helper
const safeRound = (num) => Math.round((num + Number.EPSILON) * 100) / 100;

// Fix 3: Unique ID Generator for React Keys
const generateId = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const PROMO_CATALOG = {
    SAVE10: { type: 'percent', value: 10, label: '10% off tickets' },
    EARLYBIRD: { type: 'flat', value: 15, label: '$15 off cart' },
};

const MOCK_EVENTS = {
    summit2025: {
        id: 'summit2025',
        title: 'Future of AI Summit 2025',
        date: 'Feb 12, 2025',
        time: '10:00 AM IST',
        venue: 'Mumbai Innovation Hub',
        thumbnail: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=900&q=80',
        basePrice: 149,
        ticketLimit: 6,
        ticketsAvailable: 42,
        taxRate: 0.07,
        serviceFeeRate: 0.05,
        addOns: [
            { id: 'parking', name: 'Premium Parking Pass', price: 12, available: 30, description: 'Closest lot to venue entrances.' },
            { id: 'merch', name: 'Merch Bundle', price: 25, available: 18, description: 'Event tee + enamel pin set.' },
            { id: 'food', name: 'Food Voucher', price: 10, available: 50, description: '₹800 food credit redeemable onsite.' },
            { id: 'seat', name: 'Seat Upgrade', price: 40, available: 10, description: 'Front two rows with concierge support.' },
        ],
    },
};

const formatCurrency = (value) =>
    value.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
    });

// Fix 3: Add ID to attendee object
const createEmptyAttendee = (user) => ({
    id: generateId(),
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    seatPreference: '',
});

const BookingPage = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const ticketSelectorRef = useRef(null);
    const attendeeSectionRef = useRef(null);
    const termsRef = useRef(null);

    const effectiveEventId = eventId || 'summit2025';

    const event = useMemo(() => {
        return MOCK_EVENTS[effectiveEventId] || {
            id: effectiveEventId,
            title: 'Featured Event',
            date: 'TBD',
            time: 'To be announced',
            venue: 'Venue to be confirmed',
            thumbnail: 'https://images.unsplash.com/photo-1515169067865-5387ec356754?auto=format&fit=crop&w=900&q=80',
            basePrice: 99,
            ticketLimit: 4,
            ticketsAvailable: 12,
            taxRate: 0.07,
            serviceFeeRate: 0.05,
            addOns: [],
        };
    }, [effectiveEventId]);

    // Fix 1: Initialize state, allowing for number or empty string
    const [ticketQty, setTicketQty] = useState(1);
    const [addOnSelections, setAddOnSelections] = useState({});

    // Fix 2: Initialize with one attendee safely
    const [attendees, setAttendees] = useState(() => [createEmptyAttendee(user)]);

    const [promoInput, setPromoInput] = useState('');
    const [appliedPromo, setAppliedPromo] = useState(null);
    const [promoMessage, setPromoMessage] = useState({ type: 'neutral', text: '' });
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [showBreakdown, setShowBreakdown] = useState(true);
    const [isApplyingPromo, setIsApplyingPromo] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    // Validation errors derived from attendee data; avoids setState in render
    const validationErrors = useMemo(() => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const errors = {};

        attendees.forEach((attendee, index) => {
            const attendeeErrors = {};
            if (!attendee.name?.trim()) attendeeErrors.name = 'Name is required';
            if (!attendee.email?.trim()) {
                attendeeErrors.email = 'Email is required';
            } else if (!emailPattern.test(attendee.email.trim())) {
                attendeeErrors.email = 'Invalid email format';
            }
            if (!attendee.phone?.trim()) {
                attendeeErrors.phone = 'Phone is required';
            } else if (attendee.phone.trim().length < 8) {
                attendeeErrors.phone = 'Phone must be at least 8 digits';
            }

            if (Object.keys(attendeeErrors).length > 0) {
                errors[index] = attendeeErrors;
            }
        });

        return errors;
    }, [attendees]);
    const [copiedIndex, setCopiedIndex] = useState(null);

    // Fix 2: Correct useEffect dependencies to prevent infinite loop
    useEffect(() => {
        setAttendees((prev) => {
            const currentLen = prev.length;
            // Handle case where ticketQty is empty string ''
            const targetLen = typeof ticketQty === 'number' ? ticketQty : 1;

            if (targetLen === currentLen) return prev;

            if (targetLen > currentLen) {
                const toAdd = targetLen - currentLen;
                const newAttendees = [];
                for (let i = 0; i < toAdd; i += 1) {
                    newAttendees.push(createEmptyAttendee(user));
                }
                return [...prev, ...newAttendees];
            } else {
                // Remove from the end
                return prev.slice(0, targetLen);
            }
        });
    }, [ticketQty, user]); // React hook deps include user to keep attendee defaults in sync

    // Fix 4: Ensure add-ons don't exceed ticket quantity when tickets are reduced
    useEffect(() => {
        const qty = typeof ticketQty === 'number' ? ticketQty : 1;
        setAddOnSelections(prev => {
            const next = { ...prev };
            let changed = false;
            Object.keys(next).forEach(key => {
                if (next[key] > qty) {
                    next[key] = qty;
                    changed = true;
                }
            });
            return changed ? next : prev;
        });
    }, [ticketQty]);

    const availabilityLabel = useMemo(() => {
        if (event.ticketsAvailable <= 5) return 'Selling fast';
        if (event.ticketsAvailable <= 15) return 'Limited';
        return 'Available';
    }, [event.ticketsAvailable]);

    // Fix 1: Handle Change (Allow typing)
    const handleTicketChange = (e) => {
        const value = e.target.value;
        if (value === '') {
            setTicketQty('');
            return;
        }
        const num = Number(value);
        if (!isNaN(num)) {
            // Cap at limit immediately for UX, or let them type and cap on blur.
            // Here we allow typing up to limit, but prevent exceeding it immediately
            if (num <= event.ticketLimit) setTicketQty(num);
        }
    };

    // Fix 1: Handle Blur (Clamp values)
    const handleTicketBlur = () => {
        let val = Number(ticketQty);
        if (isNaN(val) || val < 1) val = 1;
        if (val > event.ticketLimit) val = event.ticketLimit;
        setTicketQty(val);
    };

    const changeTicketCountBtn = (delta) => {
        const current = typeof ticketQty === 'number' ? ticketQty : 1;
        const next = Math.min(Math.max(1, current + delta), event.ticketLimit);
        setTicketQty(next);
    };

    // Fix 4: Add-on Logic (Cap at Ticket Qty)
    const handleAddOnChange = (addOnId, delta, stockAvailable) => {
        const qty = typeof ticketQty === 'number' ? ticketQty : 1;
        // The absolute limit is the smaller of: Available Stock OR Current Ticket Qty
        const absoluteLimit = Math.min(stockAvailable, qty);

        setAddOnSelections((prev) => {
            const current = prev[addOnId] || 0;
            const next = Math.min(Math.max(0, current + delta), absoluteLimit);
            return { ...prev, [addOnId]: next };
        });
    };

    const updateAttendee = (index, field, value) => {
        setAttendees((prev) => {
            const next = [...prev];
            next[index] = { ...next[index], [field]: value };
            return next;
        });
    };

    const copyFromPrimary = (targetIndex) => {
        if (!attendees[0]) return;
        setAttendees((prev) => {
            const next = [...prev];
            // Copy data but keep the unique ID of the target
            next[targetIndex] = {
                ...prev[targetIndex],
                name: prev[0].name,
                email: prev[0].email,
                phone: prev[0].phone,
                seatPreference: prev[0].seatPreference
            };
            return next;
        });
        setCopiedIndex(targetIndex);
        toast.success('Details copied from primary attendee.');
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    // --- CALCULATIONS (Fix 5 & 6) ---

    const qtyForCalc = typeof ticketQty === 'number' ? ticketQty : 1;

    const baseSubtotal = safeRound(qtyForCalc * event.basePrice);

    const addOnsSubtotal = useMemo(() => {
        const total = event.addOns.reduce((sum, addOn) => {
            const qty = addOnSelections[addOn.id] || 0;
            return sum + qty * addOn.price;
        }, 0);
        return safeRound(total);
    }, [addOnSelections, event.addOns]);

    const taxes = safeRound(baseSubtotal * event.taxRate);
    const serviceFees = safeRound(Math.max(baseSubtotal * event.serviceFeeRate, 3));

    const promoDiscount = useMemo(() => {
        if (!appliedPromo) return 0;
        if (appliedPromo.type === 'percent') {
            // Fix 6: Apply percent discount ONLY to base tickets, not add-ons/fees
            return safeRound((baseSubtotal * appliedPromo.value) / 100);
        }
        return appliedPromo.value; // Flat discount
    }, [appliedPromo, baseSubtotal]);

    // Fix 5: Ensure non-negative total
    const totalDue = Math.max(0, safeRound(baseSubtotal + addOnsSubtotal + taxes + serviceFees - promoDiscount));

    const formIsValid = Object.keys(validationErrors).length === 0 && acceptedTerms && qtyForCalc >= 1;

    const hasFieldError = (attendeeIndex, field) => validationErrors[attendeeIndex]?.[field];
    const getFieldErrorMessage = (attendeeIndex, field) => validationErrors[attendeeIndex]?.[field] || '';

    const handleApplyPromo = () => {
        const code = promoInput.trim().toUpperCase();
        setPromoMessage({ type: 'neutral', text: '' });
        if (!code) {
            setPromoMessage({ type: 'error', text: 'Enter a promo code to apply.' });
            return;
        }
        setIsApplyingPromo(true);
        setTimeout(() => {
            const promo = PROMO_CATALOG[code];
            if (!promo) {
                setPromoMessage({ type: 'error', text: 'Promo code is invalid or expired.' });
                setAppliedPromo(null);
            } else {
                setAppliedPromo(promo);
                setPromoMessage({ type: 'success', text: `${promo.label} applied.` });
                toast.success(`Promo applied: ${promo.label}`);
            }
            setIsApplyingPromo(false);
        }, 500);
    };

    const scrollToIssues = () => {
        if (!acceptedTerms && termsRef.current) {
            termsRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }
        if (Object.keys(validationErrors).length > 0 && attendeeSectionRef.current) {
            attendeeSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const handleCheckout = () => {
        if (!formIsValid) {
            scrollToIssues();
            toast.error('Please complete required details before checkout.');
            return;
        }
        setIsProcessing(true);
        setTimeout(() => {
            toast.success('Booking confirmed! Redirecting to your bookings...');
            setIsProcessing(false);
            navigate('/my-bookings');
        }, 900);
    };

    return (
        <div className="min-h-screen bg-[var(--bg-secondary)] pb-24">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-6">
                <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-4">
                    <span className="material-icons-outlined text-base">home</span>
                    <span>/</span>
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="hover:text-[var(--brand-primary)] transition-colors"
                    >
                        Events
                    </button>
                    <span>/</span>
                    <span className="text-[var(--text-primary)] font-medium capitalize">Booking</span>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Ticket Section */}
                        <section
                            ref={ticketSelectorRef}
                            className="card-hover p-6"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-xs font-bold uppercase text-[var(--text-muted)] tracking-widest mb-2">
                                        Ticket Selection
                                    </p>
                                    <h2 className="text-xl font-bold text-[var(--text-primary)]">Choose your tickets</h2>
                                    <p className="text-sm text-[var(--text-secondary)] mt-1">
                                        Max {event.ticketLimit} per booking • {event.ticketsAvailable} available
                                    </p>
                                </div>
                                <span
                                    className={`badge ${availabilityLabel === 'Selling fast'
                                        ? 'badge-danger pulse-urgency'
                                        : availabilityLabel === 'Limited'
                                            ? 'badge-warning'
                                            : 'badge-success'
                                        }`}
                                >
                                    {availabilityLabel}
                                </span>
                            </div>

                            <div className="mt-6 flex flex-col sm:flex-row items-center gap-4">
                                <div className="flex items-center rounded-xl border border-[var(--border-primary)] bg-[var(--bg-tertiary)] p-2 shadow-sm">
                                    <button
                                        type="button"
                                        onClick={() => changeTicketCountBtn(-1)}
                                        className="btn-secondary w-10 h-10 p-0 rounded-lg"
                                        aria-label="Decrease tickets"
                                    >
                                        <span className="material-icons-outlined">remove</span>
                                    </button>
                                    {/* Fix 1: Controlled input with blur handling */}
                                    <input
                                        type="number"
                                        min={1}
                                        max={event.ticketLimit}
                                        value={ticketQty}
                                        onChange={handleTicketChange}
                                        onBlur={handleTicketBlur}
                                        className="ticket-selector-input w-16 text-center bg-transparent text-lg font-bold text-[var(--text-primary)] focus:outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => changeTicketCountBtn(1)}
                                        className="btn-secondary w-10 h-10 p-0 rounded-lg"
                                        aria-label="Increase tickets"
                                    >
                                        <span className="material-icons-outlined">add</span>
                                    </button>
                                </div>
                                <div className="flex-1 flex items-center justify-between w-full">
                                    <div>
                                        <p className="text-sm text-[var(--text-muted)]">Base price</p>
                                        <p className="text-xl font-bold text-[var(--text-primary)]">{formatCurrency(event.basePrice)}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-[var(--text-muted)]">Subtotal</p>
                                        <p className="text-xl font-bold text-[var(--text-primary)]">
                                            {formatCurrency(baseSubtotal)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Add-ons Section */}
                        <section className="card-hover p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <p className="text-xs font-bold uppercase text-[var(--text-muted)] tracking-widest mb-2">
                                        Add-ons
                                    </p>
                                    <h3 className="text-lg font-bold text-[var(--text-primary)]">Enhance your experience</h3>
                                </div>
                                <span className="badge badge-primary">Limit: 1 per ticket</span>
                            </div>

                            {event.addOns.length === 0 ? (
                                <p className="text-[var(--text-secondary)] text-sm">No add-ons available for this event.</p>
                            ) : (
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {event.addOns.map((addOn) => {
                                        const qty = addOnSelections[addOn.id] || 0;
                                        const isSelected = qty > 0;
                                        const isMaxed = qty >= Math.min(addOn.available, qtyForCalc);

                                        return (
                                            <div
                                                key={addOn.id}
                                                className={`addon-card card-hover p-4 ${isSelected ? 'selected border-[var(--brand-primary)]/40 shadow-red-md bg-[var(--bg-hover)]' : ''}`}
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <div>
                                                        <p className="font-semibold text-[var(--text-primary)]">{addOn.name}</p>
                                                        <p className="text-sm text-[var(--text-secondary)] mt-1">{addOn.description}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm font-bold text-[var(--text-primary)]">
                                                            {formatCurrency(addOn.price)}
                                                        </p>
                                                        <p className="text-xs text-[var(--text-muted)]">ea.</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between mt-4">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleAddOnChange(addOn.id, -1, addOn.available)}
                                                            className="btn-secondary w-9 h-9 p-0 rounded-lg"
                                                            aria-label={`Decrease ${addOn.name}`}
                                                        >
                                                            <span className="material-icons-outlined text-base">remove</span>
                                                        </button>
                                                        <span className="w-10 text-center font-semibold text-[var(--text-primary)]">{qty}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleAddOnChange(addOn.id, 1, addOn.available)}
                                                            className="btn-secondary w-9 h-9 p-0 rounded-lg disabled:opacity-50"
                                                            disabled={isMaxed}
                                                            aria-label={`Increase ${addOn.name}`}
                                                        >
                                                            <span className="material-icons-outlined text-base">add</span>
                                                        </button>
                                                    </div>
                                                    <div className="text-right text-xs text-[var(--text-muted)]">
                                                        <p>{addOn.available - qty} left</p>
                                                        {isMaxed && (
                                                            <p className="text-amber-400 font-semibold">Max reached</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </section>

                        {/* Attendee Section */}
                        <section
                            ref={attendeeSectionRef}
                            className="card-hover p-6 space-y-4"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold uppercase text-[var(--text-muted)] tracking-widest mb-2">
                                        Attendee information
                                    </p>
                                    <h3 className="text-lg font-bold text-[var(--text-primary)]">
                                        Details required for each ticket
                                    </h3>
                                </div>
                                <span className="text-xs text-[var(--text-muted)]">All fields required</span>
                            </div>

                            {/* Fix 3: Use unique ID for Key */}
                            {attendees.map((attendee, index) => (
                                <div
                                    key={attendee.id}
                                    className="border border-[var(--border-primary)] rounded-xl p-4 bg-[var(--bg-tertiary)]"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <span className="material-icons-outlined text-[var(--brand-primary)]">badge</span>
                                            <p className="font-semibold text-[var(--text-primary)]">Ticket {index + 1}</p>
                                        </div>
                                        {index > 0 && (
                                            <button
                                                type="button"
                                                onClick={() => copyFromPrimary(index)}
                                                className={`text-xs px-3 py-1.5 rounded-lg bg-[var(--bg-hover)] text-[var(--text-primary)] hover:text-[var(--brand-primary)] transition-all ${copiedIndex === index ? 'copy-btn-success' : ''}`}
                                            >
                                                {copiedIndex === index ? (
                                                    <>
                                                        <span className="material-icons-outlined text-xs">check</span> Copied!
                                                    </>
                                                ) : (
                                                    'Copy primary details'
                                                )}
                                            </button>
                                        )}
                                    </div>

                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-semibold text-[var(--text-muted)]">
                                                Full name <span className="text-red-400">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={attendee.name}
                                                onChange={(e) => updateAttendee(index, 'name', e.target.value)}
                                                className={`mt-1 text-sm ${hasFieldError(index, 'name') ? 'input-error' : 'input'}`}
                                                placeholder="Alex Johnson"
                                                required
                                            />
                                            {hasFieldError(index, 'name') && (
                                                <p className="mt-1 text-xs text-red-400">{getFieldErrorMessage(index, 'name')}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-[var(--text-muted)]">
                                                Email <span className="text-red-400">*</span>
                                            </label>
                                            <input
                                                type="email"
                                                value={attendee.email}
                                                onChange={(e) => updateAttendee(index, 'email', e.target.value)}
                                                className={`mt-1 text-sm ${hasFieldError(index, 'email') ? 'input-error' : 'input'}`}
                                                placeholder="name@email.com"
                                                required
                                            />
                                            {hasFieldError(index, 'email') && (
                                                <p className="mt-1 text-xs text-red-400">{getFieldErrorMessage(index, 'email')}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-[var(--text-muted)]">
                                                Phone number <span className="text-red-400">*</span>
                                            </label>
                                            <input
                                                type="tel"
                                                value={attendee.phone}
                                                onChange={(e) => updateAttendee(index, 'phone', e.target.value)}
                                                className={`mt-1 text-sm ${hasFieldError(index, 'phone') ? 'input-error' : 'input'}`}
                                                placeholder="+91 9876543210"
                                                required
                                            />
                                            {hasFieldError(index, 'phone') && (
                                                <p className="mt-1 text-xs text-red-400">{getFieldErrorMessage(index, 'phone')}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-[var(--text-muted)]">
                                                Seat preference (optional)
                                            </label>
                                            <input
                                                type="text"
                                                value={attendee.seatPreference}
                                                onChange={(e) => updateAttendee(index, 'seatPreference', e.target.value)}
                                                className="input mt-1 text-sm"
                                                placeholder="Aisle, near stage, etc."
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </section>

                        {/* Promo & Checkout Section */}
                        <section className="card-hover p-6 space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                <div>
                                    <p className="text-xs font-bold uppercase text-[var(--text-muted)] tracking-widest mb-1">
                                        Promotional code
                                    </p>
                                    <h3 className="text-lg font-bold text-[var(--text-primary)]">Apply discount</h3>
                                </div>
                                <div className="flex items-center gap-2 w-full sm:w-auto">
                                    <input
                                        type="text"
                                        value={promoInput}
                                        onChange={(e) => setPromoInput(e.target.value)}
                                        className="flex-1 sm:w-48 input text-sm"
                                        placeholder="SAVE10 or EARLYBIRD"
                                        aria-label="Promo code"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleApplyPromo}
                                        disabled={isApplyingPromo}
                                        className="btn-primary px-4 py-2 text-sm font-semibold"
                                    >
                                        {isApplyingPromo ? 'Applying...' : 'Apply'}
                                    </button>
                                </div>
                            </div>
                            {promoMessage.text && (
                                <div
                                    className={`flex items-center gap-2 text-sm p-3 rounded-lg ${promoMessage.type === 'error'
                                        ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                                        : promoMessage.type === 'success'
                                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 promo-applied'
                                            : 'text-[var(--text-muted)]'
                                        }`}
                                >
                                    <span className="material-icons-outlined text-base">
                                        {promoMessage.type === 'error' ? 'error_outline' : promoMessage.type === 'success' ? 'check_circle' : 'info'}
                                    </span>
                                    <span>{promoMessage.text}</span>
                                </div>
                            )}

                            <div className="border border-[var(--border-primary)] rounded-xl overflow-hidden">
                                <button
                                    type="button"
                                    onClick={() => setShowBreakdown(!showBreakdown)}
                                    className="w-full flex items-center justify-between px-4 py-3 bg-[var(--bg-tertiary)] hover:bg-[var(--bg-hover)] transition-colors focus-ring"
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="material-icons-outlined text-[var(--text-primary)]">receipt_long</span>
                                        <span className="font-semibold text-[var(--text-primary)]">Pricing breakdown</span>
                                    </div>
                                    <span className={`material-icons-outlined text-sm text-[var(--text-muted)] transition-transform ${showBreakdown ? 'rotate-180' : ''
                                        }`}>
                                        expand_more
                                    </span>
                                </button>
                                {showBreakdown && (
                                    <div className="pricing-details expanded p-4 space-y-3 bg-[var(--bg-card)]">
                                        <div className="flex items-center justify-between text-sm text-[var(--text-secondary)]">
                                            <span>Tickets ({qtyForCalc} × {formatCurrency(event.basePrice)})</span>
                                            <span className="font-semibold text-[var(--text-primary)]">{formatCurrency(baseSubtotal)}</span>
                                        </div>
                                        {addOnsSubtotal > 0 && (
                                            <div className="flex items-center justify-between text-sm text-[var(--text-secondary)]">
                                                <div className="flex items-center gap-2">
                                                    <span className="material-icons-outlined text-xs">add_circle</span>
                                                    <span>Add-ons</span>
                                                </div>
                                                <span className="font-semibold text-[var(--text-primary)]">{formatCurrency(addOnsSubtotal)}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center justify-between text-sm text-[var(--text-secondary)]">
                                            <span>Taxes ({Math.round(event.taxRate * 100)}%)</span>
                                            <span className="font-semibold text-[var(--text-primary)]">{formatCurrency(taxes)}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm text-[var(--text-secondary)]">
                                            <span>Service fees</span>
                                            <span className="font-semibold text-[var(--text-primary)]">{formatCurrency(serviceFees)}</span>
                                        </div>
                                        {appliedPromo && (
                                            <div className="flex items-center justify-between text-sm p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                                                <div className="flex items-center gap-2 text-emerald-400">
                                                    <span className="material-icons-outlined text-base">local_offer</span>
                                                    <span>Promo ({appliedPromo.label})</span>
                                                </div>
                                                <span className="font-bold text-emerald-400">-{formatCurrency(promoDiscount)}</span>
                                            </div>
                                        )}
                                        <div className="border-t border-[var(--border-primary)] pt-3 flex items-center justify-between">
                                            <span className="font-bold text-[var(--text-primary)]">Total due</span>
                                            <span className="text-xl font-extrabold text-[var(--brand-primary)]">
                                                {formatCurrency(totalDue)}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Terms & Checkout */}
                            <div className="flex items-start gap-3" ref={termsRef}>
                                <input
                                    id="terms"
                                    type="checkbox"
                                    checked={acceptedTerms}
                                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                                    className="custom-checkbox mt-1 w-5 h-5 rounded border-[var(--border-primary)] text-[var(--brand-primary)] focus:ring-[var(--brand-primary)] cursor-pointer"
                                />
                                <label htmlFor="terms" className="text-sm text-[var(--text-secondary)] leading-relaxed cursor-pointer">
                                    I agree to the{' '}
                                    <a className="text-[var(--brand-primary)] hover:underline font-semibold" href="/terms" target="_blank" rel="noreferrer">
                                        Terms & Conditions
                                    </a>{' '}
                                    and acknowledge the event&apos;s cancellation & refund policies.
                                </label>
                            </div>

                            <button
                                type="button"
                                onClick={handleCheckout}
                                disabled={!formIsValid || isProcessing}
                                className={`btn-primary w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-base transition-all disabled:opacity-60 disabled:cursor-not-allowed ${isProcessing ? 'checkout-btn-loading' : ''}`}
                            >
                                <span className={`material-icons-outlined ${isProcessing ? '' : 'secure-icon'}`}>
                                    {isProcessing ? 'hourglass_empty' : 'lock'}
                                </span>
                                {isProcessing ? 'Processing your order...' : 'Proceed to Secure Checkout'}
                            </button>

                            {!formIsValid && (
                                <div className="flex items-start gap-2 text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                                    <span className="material-icons-outlined text-sm">info</span>
                                    <div>
                                        <p className="font-semibold mb-1">Action required:</p>
                                        <ul className="list-disc list-inside space-y-1">
                                            {!acceptedTerms && <li>Accept Terms & Conditions</li>}
                                            {Object.keys(validationErrors).length > 0 && <li>Complete all required attendee information</li>}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </section>
                    </div>

                    {/* Fix 7: Sidebar Sticky & Fix 8: Ref Safety */}
                    <aside className="lg:col-span-1 sticky top-8 h-fit">
                        <div className="space-y-4">
                            <div className="card-hover overflow-hidden">
                                <div className="relative h-40">
                                    <img
                                        src={event.thumbnail}
                                        alt={event.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="event-thumbnail-overlay absolute inset-0" />
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="material-icons-outlined text-white text-sm">calendar_today</span>
                                            <p className="text-xs text-white/90 font-medium">{event.date} • {event.time}</p>
                                        </div>
                                        <h2 className="text-xl font-bold text-white mb-1">{event.title}</h2>
                                        <div className="flex items-center gap-1 text-white/90">
                                            <span className="material-icons-outlined text-sm">location_on</span>
                                            <p className="text-sm">{event.venue}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-5 space-y-3">
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-hover)] border border-[var(--border-primary)]">
                                        <div className="flex items-center gap-2">
                                            <span className="material-icons-outlined text-[var(--brand-primary)]">confirmation_number</span>
                                            <span className="text-sm text-[var(--text-secondary)]">Base price</span>
                                        </div>
                                        <span className="font-semibold text-[var(--text-primary)]">
                                            {formatCurrency(event.basePrice)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-[var(--text-secondary)]">Availability</span>
                                        <span className={`text-xs px-3 py-1 rounded-full font-semibold ${availabilityLabel === 'Selling fast'
                                            ? 'bg-red-500/10 text-red-400'
                                            : availabilityLabel === 'Limited'
                                                ? 'bg-amber-500/10 text-amber-400'
                                                : 'bg-emerald-500/10 text-emerald-400'
                                            }`}>
                                            {availabilityLabel}
                                        </span>
                                    </div>
                                    <div className="border-t border-[var(--border-primary)] pt-3 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-[var(--text-secondary)]">Tickets selected</span>
                                            <span className="font-bold text-[var(--text-primary)] text-lg">{qtyForCalc}</span>
                                        </div>
                                        {addOnsSubtotal > 0 && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-[var(--text-secondary)]">Add-ons total</span>
                                                <span className="font-bold text-[var(--text-primary)]">
                                                    {formatCurrency(addOnsSubtotal)}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="border-t border-[var(--border-primary)] pt-3 flex items-center justify-between p-3 rounded-lg bg-[var(--brand-primary)]/5">
                                        <div>
                                            <p className="text-xs text-[var(--text-muted)] mb-1">Total amount</p>
                                            <span className="text-2xl font-extrabold text-[var(--brand-primary)]">
                                                {formatCurrency(totalDue)}
                                            </span>
                                        </div>
                                        {appliedPromo && (
                                            <div className="flex items-center gap-1 text-emerald-400 text-xs font-semibold">
                                                <span className="material-icons-outlined text-sm">local_offer</span>
                                                <span>Promo applied</span>
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (ticketSelectorRef.current) {
                                                ticketSelectorRef.current.scrollIntoView({ behavior: 'smooth' });
                                            }
                                        }}
                                        className="btn-secondary w-full mt-2 flex items-center justify-center gap-2"
                                    >
                                        <span className="material-icons-outlined text-base">north</span>
                                        <span>Jump to ticket selection</span>
                                    </button>
                                </div>
                            </div>

                            <div className="card p-4 text-sm text-[var(--text-secondary)]">
                                <div className="flex items-center gap-2 text-[var(--text-primary)] font-semibold mb-3">
                                    <span className="material-icons-outlined text-[var(--brand-primary)] secure-icon">verified_user</span>
                                    <span>Secure & Protected</span>
                                </div>
                                <ul className="space-y-2">
                                    <li className="flex items-center gap-2">
                                        <span className="material-icons-outlined text-emerald-400 text-sm">lock</span>
                                        <span>256-bit SSL encrypted payment</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="material-icons-outlined text-emerald-400 text-sm">verified</span>
                                        <span>Instant email confirmation</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="material-icons-outlined text-emerald-400 text-sm">refresh</span>
                                        <span>Free cancellation within 24h</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="material-icons-outlined text-emerald-400 text-sm">support_agent</span>
                                        <span>24/7 customer support</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            {/* Mobile sticky checkout bar */}
            <div className="lg:hidden fixed inset-x-0 bottom-0 z-30 px-4 pb-4 pointer-events-none">
                <div className="card-hover p-4 flex items-center justify-between gap-3 shadow-red-md pointer-events-auto">
                    <div>
                        <p className="text-xs text-[var(--text-muted)] mb-0.5">Total due</p>
                        <p className="text-xl font-bold text-[var(--brand-primary)]">{formatCurrency(totalDue)}</p>
                    </div>
                    <button
                        type="button"
                        onClick={handleCheckout}
                        disabled={!formIsValid || isProcessing}
                        className={`btn-primary w-full justify-center gap-2 py-3 text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed ${isProcessing ? 'checkout-btn-loading' : ''}`}
                    >
                        <span className="material-icons-outlined text-sm">
                            {isProcessing ? 'hourglass_empty' : 'lock'}
                        </span>
                        {isProcessing ? 'Processing...' : 'Pay & Continue'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookingPage;