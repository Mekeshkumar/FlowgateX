import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const EventDetailModal = ({ event, isOpen, onClose, onBookNow }) => {
    const [activeTab, setActiveTab] = useState('overview');
    const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [selectedTicketTier, setSelectedTicketTier] = useState(null);
    const [showAllFaq, setShowAllFaq] = useState(false);
    const [showAllReviews, setShowAllReviews] = useState(false);

    // Destructure event properties with defaults
    const {
        title = 'Event Title',
        description = 'No description available.',
        image = '/api/placeholder/800/400',
        video = null,
        date,
        time,
        location = 'Location TBA',
        price = 0,
        category = 'General',
        attendees = 0,
        capacity = 500,
        isFeatured = false,
        isTrending = false,
        organizer = {
            name: 'FlowGate Events',
            avatar: null,
            verified: true,
            rating: 4.8,
            eventsHosted: 45
        },
        venue = {
            name: location,
            address: 'Venue address',
            mapUrl: null,
            amenities: ['Parking', 'WiFi', 'Wheelchair Access', 'Food Court']
        },
        agenda = [],
        ticketTiers = [
            { id: 1, name: 'Early Bird', price: price * 0.8, available: 50, perks: ['Priority Entry', 'Free Drink'] },
            { id: 2, name: 'General', price: price, available: 200, perks: ['Standard Entry', 'Event Kit'] },
            { id: 3, name: 'VIP', price: price * 2.5, available: 20, perks: ['VIP Lounge', 'Meet & Greet', 'Premium Seating', 'Free Drinks', 'Exclusive Merch'] }
        ],
        faq = [
            { q: 'What is the refund policy?', a: 'Full refund up to 7 days before the event. 50% refund up to 48 hours before.' },
            { q: 'Is parking available?', a: 'Yes, complimentary parking is available on-site with valid ticket.' },
            { q: 'Can I transfer my ticket?', a: 'Yes, tickets are transferable. Contact support for assistance.' },
            { q: 'What time should I arrive?', a: 'We recommend arriving 30 minutes early for check-in and seating.' }
        ],
        reviews = [
            { id: 1, user: 'Sarah M.', avatar: null, rating: 5, comment: 'Amazing experience! The organization was flawless.', date: '2024-12-15' },
            { id: 2, user: 'John D.', avatar: null, rating: 4, comment: 'Great event, but parking was a bit tight.', date: '2024-12-10' },
            { id: 3, user: 'Emily R.', avatar: null, rating: 5, comment: 'Will definitely attend again next year!', date: '2024-12-05' }
        ],
        relatedEvents = []
    } = event || {};

    // Formatted values
    const formattedDate = date ? dayjs(date).format('dddd, MMMM D, YYYY') : 'Date TBA';
    const formattedTime = time ? dayjs(`${date} ${time}`).format('h:mm A') : 'Time TBA';
    const spotsLeft = capacity - attendees;
    const isSoldOut = spotsLeft <= 0;
    const percentFilled = capacity > 0 ? Math.round((attendees / capacity) * 100) : 0;

    // Countdown timer
    useEffect(() => {
        if (!date) return;

        const eventDate = dayjs(`${date} ${time || '00:00'}`);

        const updateCountdown = () => {
            const now = dayjs();
            const diff = eventDate.diff(now);

            if (diff <= 0) {
                setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setCountdown({ days, hours, minutes, seconds });
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);
        return () => clearInterval(interval);
    }, [date, time]);

    // Keyboard escape to close
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    // Default agenda if not provided
    const eventAgenda = agenda.length > 0 ? agenda : [
        { time: '09:00 AM', title: 'Doors Open', description: 'Registration & networking' },
        { time: '10:00 AM', title: 'Opening Ceremony', description: 'Welcome address and introduction' },
        { time: '11:00 AM', title: 'Main Event', description: 'Core program begins' },
        { time: '01:00 PM', title: 'Lunch Break', description: 'Refreshments and networking' },
        { time: '02:00 PM', title: 'Afternoon Session', description: 'Continued activities' },
        { time: '05:00 PM', title: 'Closing', description: 'Final remarks and wrap-up' }
    ];

    // Average rating
    const avgRating = reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : 'N/A';

    // Share handlers
    const handleShare = (platform) => {
        const eventUrl = window.location.href;
        const text = `Check out ${title} on FlowGateX!`;

        const urls = {
            twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(eventUrl)}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(eventUrl)}`,
            linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(eventUrl)}&title=${encodeURIComponent(title)}`,
            whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + eventUrl)}`,
            copy: null
        };

        if (platform === 'copy') {
            navigator.clipboard.writeText(eventUrl);
            alert('Link copied to clipboard!');
        } else if (urls[platform]) {
            window.open(urls[platform], '_blank', 'width=600,height=400');
        }
    };

    const handleBookNow = () => {
        onClose();
        if (onBookNow) onBookNow(selectedTicketTier);
    };

    if (!isOpen) return null;

    const organizerData = typeof organizer === 'string'
        ? { name: organizer, avatar: null, verified: true, rating: 4.8, eventsHosted: 45 }
        : organizer;

    const venueData = typeof venue === 'string'
        ? { name: venue, address: location, mapUrl: null, amenities: ['Parking', 'WiFi', 'Wheelchair Access'] }
        : venue;

    // Use createPortal to render modal at document body level
    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/70 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div className="relative w-full max-w-5xl mx-4 my-8 animate-fadeIn">
                <div className="bg-[var(--bg-card)] rounded-2xl shadow-2xl overflow-hidden border border-[var(--border-color)]">

                    {/* ============================================
              HERO SECTION - Banner Image/Video
          ============================================ */}
                    <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden">
                        {video ? (
                            <video
                                src={video}
                                autoPlay
                                muted
                                loop
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <img
                                src={image}
                                alt={title}
                                className="w-full h-full object-cover"
                            />
                        )}

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-all z-10"
                            aria-label="Close"
                        >
                            <span className="material-icons-outlined">close</span>
                        </button>

                        {/* Badges */}
                        <div className="absolute top-4 left-4 flex gap-2">
                            {isFeatured && (
                                <span className="px-3 py-1 bg-[var(--brand-primary)] text-white text-xs font-semibold rounded-full flex items-center gap-1">
                                    <span className="material-icons-outlined text-sm">star</span>
                                    Featured
                                </span>
                            )}
                            {isTrending && (
                                <span className="px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                                    <span className="material-icons-outlined text-sm">trending_up</span>
                                    Trending
                                </span>
                            )}
                            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                                {category}
                            </span>
                        </div>

                        {/* Event Info Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 line-clamp-2">
                                {title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-4 text-white/90 text-sm">
                                <span className="flex items-center gap-1">
                                    <span className="material-icons-outlined text-lg">calendar_today</span>
                                    {formattedDate}
                                </span>
                                <span className="flex items-center gap-1">
                                    <span className="material-icons-outlined text-lg">schedule</span>
                                    {formattedTime}
                                </span>
                                <span className="flex items-center gap-1">
                                    <span className="material-icons-outlined text-lg">location_on</span>
                                    {typeof venue === 'string' ? venue : venue?.name || location}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* ============================================
              COUNTDOWN TIMER
          ============================================ */}
                    <div className="bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-primary-dark,#c91414)] px-6 py-4">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-2 text-white">
                                <span className="material-icons-outlined">timer</span>
                                <span className="font-medium">Event starts in:</span>
                            </div>
                            <div className="flex gap-3">
                                {[
                                    { value: countdown.days, label: 'Days' },
                                    { value: countdown.hours, label: 'Hours' },
                                    { value: countdown.minutes, label: 'Mins' },
                                    { value: countdown.seconds, label: 'Secs' }
                                ].map((item, idx) => (
                                    <div key={idx} className="text-center">
                                        <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 min-w-[50px]">
                                            <span className="text-xl font-bold text-white">{String(item.value).padStart(2, '0')}</span>
                                        </div>
                                        <span className="text-xs text-white/80 mt-1">{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ============================================
              NAVIGATION TABS
          ============================================ */}
                    <div className="border-b border-[var(--border-color)] bg-[var(--bg-secondary)] sticky top-0 z-10">
                        <div className="flex overflow-x-auto scrollbar-hide">
                            {[
                                { id: 'overview', label: 'Overview', icon: 'info' },
                                { id: 'tickets', label: 'Tickets', icon: 'confirmation_number' },
                                { id: 'agenda', label: 'Agenda', icon: 'event_note' },
                                { id: 'venue', label: 'Venue', icon: 'place' },
                                { id: 'reviews', label: 'Reviews', icon: 'star' },
                                { id: 'faq', label: 'FAQ', icon: 'help_outline' }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-5 py-4 text-sm font-medium whitespace-nowrap transition-all border-b-2 ${activeTab === tab.id
                                        ? 'text-[var(--brand-primary)] border-[var(--brand-primary)]'
                                        : 'text-[var(--text-secondary)] border-transparent hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
                                        }`}
                                >
                                    <span className="material-icons-outlined text-lg">{tab.icon}</span>
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ============================================
              MAIN CONTENT AREA
          ============================================ */}
                    <div className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                            {/* Left Column - Main Content */}
                            <div className="lg:col-span-2 space-y-6">

                                {/* OVERVIEW TAB */}
                                {activeTab === 'overview' && (
                                    <>
                                        {/* Description */}
                                        <section>
                                            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
                                                <span className="material-icons-outlined text-[var(--brand-primary)]">description</span>
                                                About This Event
                                            </h2>
                                            <p className="text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">
                                                {description}
                                            </p>
                                        </section>

                                        {/* Quick Stats */}
                                        <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                            {[
                                                { icon: 'people', label: 'Attendees', value: attendees },
                                                { icon: 'event_seat', label: 'Capacity', value: capacity },
                                                { icon: 'hourglass_bottom', label: 'Spots Left', value: spotsLeft > 0 ? spotsLeft : 'Sold Out' },
                                                { icon: 'percent', label: 'Filled', value: `${percentFilled}%` }
                                            ].map((stat, idx) => (
                                                <div key={idx} className="bg-[var(--bg-secondary)] rounded-xl p-4 text-center">
                                                    <span className="material-icons-outlined text-2xl text-[var(--brand-primary)] mb-2">{stat.icon}</span>
                                                    <div className="text-xl font-bold text-[var(--text-primary)]">{stat.value}</div>
                                                    <div className="text-xs text-[var(--text-muted)]">{stat.label}</div>
                                                </div>
                                            ))}
                                        </section>

                                        {/* Capacity Progress Bar */}
                                        <section className="bg-[var(--bg-secondary)] rounded-xl p-4">
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="text-[var(--text-secondary)]">Registration Progress</span>
                                                <span className="font-medium text-[var(--text-primary)]">{attendees} / {capacity}</span>
                                            </div>
                                            <div className="h-3 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-[var(--brand-primary)] to-red-400 rounded-full transition-all duration-500"
                                                    style={{ width: `${Math.min(percentFilled, 100)}%` }}
                                                />
                                            </div>
                                            {percentFilled >= 80 && (
                                                <p className="text-xs text-orange-500 mt-2 flex items-center gap-1">
                                                    <span className="material-icons-outlined text-sm">warning</span>
                                                    Almost sold out! Only {spotsLeft} spots remaining.
                                                </p>
                                            )}
                                        </section>

                                        {/* Highlights */}
                                        <section>
                                            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
                                                <span className="material-icons-outlined text-[var(--brand-primary)]">auto_awesome</span>
                                                Event Highlights
                                            </h2>
                                            <div className="grid grid-cols-2 gap-3">
                                                {['Live Entertainment', 'Networking', 'Food & Drinks', 'Photo Opportunities', 'Guest Speakers', 'Interactive Sessions'].map((highlight, idx) => (
                                                    <div key={idx} className="flex items-center gap-2 text-[var(--text-secondary)]">
                                                        <span className="material-icons-outlined text-[var(--brand-primary)] text-lg">check_circle</span>
                                                        {highlight}
                                                    </div>
                                                ))}
                                            </div>
                                        </section>
                                    </>
                                )}

                                {/* TICKETS TAB */}
                                {activeTab === 'tickets' && (
                                    <section className="space-y-4">
                                        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                                            <span className="material-icons-outlined text-[var(--brand-primary)]">confirmation_number</span>
                                            Select Your Ticket
                                        </h2>

                                        {ticketTiers.map((tier) => (
                                            <div
                                                key={tier.id}
                                                onClick={() => setSelectedTicketTier(tier)}
                                                className={`relative border-2 rounded-xl p-5 cursor-pointer transition-all ${selectedTicketTier?.id === tier.id
                                                    ? 'border-[var(--brand-primary)] bg-[var(--brand-primary)]/5'
                                                    : 'border-[var(--border-color)] hover:border-[var(--brand-primary)]/50'
                                                    }`}
                                            >
                                                {tier.name === 'VIP' && (
                                                    <span className="absolute -top-2 right-4 px-2 py-0.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-semibold rounded-full">
                                                        Best Value
                                                    </span>
                                                )}

                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-[var(--text-primary)]">{tier.name}</h3>
                                                        <p className="text-sm text-[var(--text-muted)]">{tier.available} tickets left</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-2xl font-bold text-[var(--brand-primary)]">
                                                            {tier.price === 0 ? 'Free' : `₹${tier.price.toLocaleString()}`}
                                                        </div>
                                                        {tier.name === 'Early Bird' && (
                                                            <span className="text-xs text-green-500">Save 20%</span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap gap-2">
                                                    {tier.perks.map((perk, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="px-2 py-1 bg-[var(--bg-secondary)] text-[var(--text-secondary)] text-xs rounded-full flex items-center gap-1"
                                                        >
                                                            <span className="material-icons-outlined text-xs text-[var(--brand-primary)]">check</span>
                                                            {perk}
                                                        </span>
                                                    ))}
                                                </div>

                                                {selectedTicketTier?.id === tier.id && (
                                                    <div className="absolute top-4 right-4">
                                                        <span className="material-icons-outlined text-[var(--brand-primary)]">check_circle</span>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </section>
                                )}

                                {/* AGENDA TAB */}
                                {activeTab === 'agenda' && (
                                    <section>
                                        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                                            <span className="material-icons-outlined text-[var(--brand-primary)]">event_note</span>
                                            Event Schedule
                                        </h2>

                                        <div className="relative">
                                            {/* Timeline line */}
                                            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[var(--border-color)]" />

                                            <div className="space-y-4">
                                                {eventAgenda.map((item, idx) => (
                                                    <div key={idx} className="relative flex gap-4 pl-10">
                                                        {/* Timeline dot */}
                                                        <div className="absolute left-2.5 w-3 h-3 bg-[var(--brand-primary)] rounded-full border-2 border-[var(--bg-card)]" />

                                                        <div className="flex-1 bg-[var(--bg-secondary)] rounded-xl p-4">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className="text-sm font-medium text-[var(--brand-primary)]">{item.time}</span>
                                                            </div>
                                                            <h3 className="font-semibold text-[var(--text-primary)]">{item.title}</h3>
                                                            <p className="text-sm text-[var(--text-secondary)]">{item.description}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </section>
                                )}

                                {/* VENUE TAB */}
                                {activeTab === 'venue' && (
                                    <section className="space-y-6">
                                        <div>
                                            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
                                                <span className="material-icons-outlined text-[var(--brand-primary)]">place</span>
                                                Venue Information
                                            </h2>

                                            <div className="bg-[var(--bg-secondary)] rounded-xl p-4">
                                                <h3 className="font-semibold text-[var(--text-primary)] text-lg">{venueData.name}</h3>
                                                <p className="text-[var(--text-secondary)] mb-3">{venueData.address}</p>

                                                {/* Placeholder Map */}
                                                <div className="h-48 bg-[var(--bg-tertiary)] rounded-lg flex items-center justify-center mb-4">
                                                    <div className="text-center text-[var(--text-muted)]">
                                                        <span className="material-icons-outlined text-4xl mb-2">map</span>
                                                        <p className="text-sm">Interactive Map</p>
                                                        <a
                                                            href={`https://www.google.com/maps/search/${encodeURIComponent(venueData.address)}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-[var(--brand-primary)] text-sm hover:underline"
                                                        >
                                                            View on Google Maps →
                                                        </a>
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(venueData.address)}`, '_blank')}
                                                    className="w-full btn-secondary flex items-center justify-center gap-2"
                                                >
                                                    <span className="material-icons-outlined">directions</span>
                                                    Get Directions
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
                                                <span className="material-icons-outlined text-[var(--brand-primary)]">local_parking</span>
                                                Amenities & Facilities
                                            </h2>

                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                                {venueData.amenities.map((amenity, idx) => (
                                                    <div key={idx} className="bg-[var(--bg-secondary)] rounded-lg p-3 flex items-center gap-2">
                                                        <span className="material-icons-outlined text-[var(--brand-primary)]">
                                                            {amenity.toLowerCase().includes('parking') ? 'local_parking' :
                                                                amenity.toLowerCase().includes('wifi') ? 'wifi' :
                                                                    amenity.toLowerCase().includes('wheelchair') ? 'accessible' :
                                                                        amenity.toLowerCase().includes('food') ? 'restaurant' :
                                                                            amenity.toLowerCase().includes('restroom') ? 'wc' :
                                                                                'check_circle'}
                                                        </span>
                                                        <span className="text-sm text-[var(--text-secondary)]">{amenity}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </section>
                                )}

                                {/* REVIEWS TAB */}
                                {activeTab === 'reviews' && (
                                    <section className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2">
                                                <span className="material-icons-outlined text-[var(--brand-primary)]">star</span>
                                                Reviews & Ratings
                                            </h2>
                                            <div className="flex items-center gap-2 bg-[var(--bg-secondary)] px-3 py-1.5 rounded-full">
                                                <span className="material-icons-outlined text-yellow-500 text-lg">star</span>
                                                <span className="font-semibold text-[var(--text-primary)]">{avgRating}</span>
                                                <span className="text-sm text-[var(--text-muted)]">({reviews.length} reviews)</span>
                                            </div>
                                        </div>

                                        {/* Rating Distribution */}
                                        <div className="bg-[var(--bg-secondary)] rounded-xl p-4">
                                            {[5, 4, 3, 2, 1].map(stars => {
                                                const count = reviews.filter(r => Math.round(r.rating) === stars).length;
                                                const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                                                return (
                                                    <div key={stars} className="flex items-center gap-3 mb-2 last:mb-0">
                                                        <span className="text-sm text-[var(--text-secondary)] w-6">{stars}</span>
                                                        <span className="material-icons-outlined text-yellow-500 text-sm">star</span>
                                                        <div className="flex-1 h-2 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-yellow-500 rounded-full"
                                                                style={{ width: `${percentage}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-sm text-[var(--text-muted)] w-8">{count}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Reviews List */}
                                        <div className="space-y-4">
                                            {(showAllReviews ? reviews : reviews.slice(0, 3)).map(review => (
                                                <div key={review.id} className="bg-[var(--bg-secondary)] rounded-xl p-4">
                                                    <div className="flex items-start gap-3 mb-2">
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--brand-primary)] to-red-400 flex items-center justify-center text-white font-semibold">
                                                            {review.user.charAt(0)}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center justify-between">
                                                                <h4 className="font-medium text-[var(--text-primary)]">{review.user}</h4>
                                                                <span className="text-xs text-[var(--text-muted)]">{dayjs(review.date).fromNow()}</span>
                                                            </div>
                                                            <div className="flex gap-0.5">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <span key={i} className={`material-icons-outlined text-sm ${i < review.rating ? 'text-yellow-500' : 'text-[var(--border-color)]'}`}>
                                                                        star
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <p className="text-[var(--text-secondary)] text-sm pl-13">{review.comment}</p>
                                                </div>
                                            ))}

                                            {reviews.length > 3 && (
                                                <button
                                                    onClick={() => setShowAllReviews(!showAllReviews)}
                                                    className="w-full text-center text-[var(--brand-primary)] text-sm font-medium hover:underline"
                                                >
                                                    {showAllReviews ? 'Show Less' : `View All ${reviews.length} Reviews`}
                                                </button>
                                            )}
                                        </div>
                                    </section>
                                )}

                                {/* FAQ TAB */}
                                {activeTab === 'faq' && (
                                    <section className="space-y-4">
                                        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                                            <span className="material-icons-outlined text-[var(--brand-primary)]">help_outline</span>
                                            Frequently Asked Questions
                                        </h2>

                                        {(showAllFaq ? faq : faq.slice(0, 3)).map((item, idx) => (
                                            <details
                                                key={idx}
                                                className="group bg-[var(--bg-secondary)] rounded-xl overflow-hidden"
                                            >
                                                <summary className="flex items-center justify-between p-4 cursor-pointer list-none">
                                                    <span className="font-medium text-[var(--text-primary)]">{item.q}</span>
                                                    <span className="material-icons-outlined text-[var(--text-muted)] group-open:rotate-180 transition-transform">
                                                        expand_more
                                                    </span>
                                                </summary>
                                                <div className="px-4 pb-4 text-[var(--text-secondary)]">
                                                    {item.a}
                                                </div>
                                            </details>
                                        ))}

                                        {faq.length > 3 && (
                                            <button
                                                onClick={() => setShowAllFaq(!showAllFaq)}
                                                className="w-full text-center text-[var(--brand-primary)] text-sm font-medium hover:underline"
                                            >
                                                {showAllFaq ? 'Show Less' : `View All ${faq.length} Questions`}
                                            </button>
                                        )}

                                        <div className="bg-[var(--bg-secondary)] rounded-xl p-4 mt-6">
                                            <p className="text-[var(--text-secondary)] text-sm mb-3">
                                                {"Can't find what you're looking for?"}
                                            </p>
                                            <button className="btn-secondary flex items-center gap-2">
                                                <span className="material-icons-outlined text-lg">support_agent</span>
                                                Contact Support
                                            </button>
                                        </div>
                                    </section>
                                )}
                            </div>

                            {/* Right Column - Sidebar */}
                            <div className="space-y-6">

                                {/* Organizer Card */}
                                <div className="bg-[var(--bg-secondary)] rounded-xl p-4">
                                    <h3 className="text-sm font-medium text-[var(--text-muted)] mb-3">Organized by</h3>
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--brand-primary)] to-red-400 flex items-center justify-center text-white font-bold text-lg">
                                            {organizerData.name.charAt(0)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-1">
                                                <span className="font-semibold text-[var(--text-primary)]">{organizerData.name}</span>
                                                {organizerData.verified && (
                                                    <span className="material-icons-outlined text-blue-500 text-sm">verified</span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                                                <span className="flex items-center gap-0.5">
                                                    <span className="material-icons-outlined text-yellow-500 text-xs">star</span>
                                                    {organizerData.rating}
                                                </span>
                                                <span>•</span>
                                                <span>{organizerData.eventsHosted} events</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="w-full mt-3 text-sm text-[var(--brand-primary)] hover:underline">
                                        View Profile →
                                    </button>
                                </div>

                                {/* Price & Book CTA */}
                                <div className="bg-[var(--bg-secondary)] rounded-xl p-5 sticky top-20">
                                    <div className="text-center mb-4">
                                        <div className="text-sm text-[var(--text-muted)] mb-1">Starting from</div>
                                        <div className="text-3xl font-bold text-[var(--text-primary)]">
                                            {price === 0 ? 'Free' : `₹${price.toLocaleString()}`}
                                        </div>
                                        {selectedTicketTier && (
                                            <div className="text-sm text-[var(--brand-primary)] mt-1">
                                                {selectedTicketTier.name} selected
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        onClick={handleBookNow}
                                        disabled={isSoldOut}
                                        className="w-full btn-primary py-3 text-lg font-semibold mb-3 flex items-center justify-center gap-2"
                                    >
                                        {isSoldOut ? (
                                            <>
                                                <span className="material-icons-outlined">notification_add</span>
                                                Join Waitlist
                                            </>
                                        ) : (
                                            <>
                                                <span className="material-icons-outlined">confirmation_number</span>
                                                Book Now
                                            </>
                                        )}
                                    </button>

                                    <p className="text-center text-xs text-[var(--text-muted)] flex items-center justify-center gap-1">
                                        <span className="material-icons-outlined text-sm text-green-500">lock</span>
                                        Secure payment powered by FlowGateX
                                    </p>

                                    {spotsLeft <= 20 && spotsLeft > 0 && (
                                        <div className="mt-3 text-center text-sm text-orange-500 flex items-center justify-center gap-1 animate-pulse">
                                            <span className="material-icons-outlined text-sm">local_fire_department</span>
                                            Only {spotsLeft} spots left!
                                        </div>
                                    )}
                                </div>

                                {/* Share Buttons */}
                                <div className="bg-[var(--bg-secondary)] rounded-xl p-4">
                                    <h3 className="text-sm font-medium text-[var(--text-muted)] mb-3">Share this event</h3>
                                    <div className="flex gap-2">
                                        {[
                                            { id: 'twitter', icon: 'share', color: 'bg-blue-400' },
                                            { id: 'facebook', icon: 'share', color: 'bg-blue-600' },
                                            { id: 'whatsapp', icon: 'share', color: 'bg-green-500' },
                                            { id: 'linkedin', icon: 'share', color: 'bg-blue-700' },
                                            { id: 'copy', icon: 'link', color: 'bg-gray-500' }
                                        ].map(platform => (
                                            <button
                                                key={platform.id}
                                                onClick={() => handleShare(platform.id)}
                                                className={`w-9 h-9 rounded-full ${platform.color} text-white flex items-center justify-center hover:opacity-80 transition-opacity`}
                                                title={platform.id.charAt(0).toUpperCase() + platform.id.slice(1)}
                                            >
                                                <span className="material-icons-outlined text-sm">{platform.icon}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Quick Info */}
                                <div className="bg-[var(--bg-secondary)] rounded-xl p-4 space-y-3">
                                    {[
                                        { icon: 'calendar_today', label: 'Date', value: formattedDate },
                                        { icon: 'schedule', label: 'Time', value: formattedTime },
                                        { icon: 'location_on', label: 'Venue', value: venueData.name },
                                        { icon: 'category', label: 'Category', value: category }
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-3">
                                            <span className="material-icons-outlined text-[var(--brand-primary)]">{item.icon}</span>
                                            <div>
                                                <div className="text-xs text-[var(--text-muted)]">{item.label}</div>
                                                <div className="text-sm text-[var(--text-primary)]">{item.value}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                            </div>
                        </div>

                        {/* ============================================
                RELATED EVENTS SECTION
            ============================================ */}
                        {relatedEvents.length > 0 && (
                            <section className="mt-8 pt-6 border-t border-[var(--border-color)]">
                                <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                                    <span className="material-icons-outlined text-[var(--brand-primary)]">recommend</span>
                                    You Might Also Like
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {relatedEvents.slice(0, 3).map(relEvent => (
                                        <div key={relEvent.id} className="bg-[var(--bg-secondary)] rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                                            <img
                                                src={relEvent.image}
                                                alt={relEvent.title}
                                                className="w-full h-32 object-cover"
                                            />
                                            <div className="p-3">
                                                <h3 className="font-medium text-[var(--text-primary)] text-sm line-clamp-1">{relEvent.title}</h3>
                                                <p className="text-xs text-[var(--text-muted)]">{dayjs(relEvent.date).format('MMM D, YYYY')}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                </div>
            </div>
        </div>,
        document.body
    );
};

export default EventDetailModal;
