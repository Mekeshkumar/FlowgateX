import { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { EventCard } from '@features/events/components';

// Lazy load AOS only when needed
let AOS;

// CountUp Number Component - Optimized with useMemo
const CountUpNumber = ({ target, duration = 2000, decimals = 0, suffix = '' }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(target * easeOut);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [target, duration]);

  return <>{decimals > 0 ? count.toFixed(decimals) : Math.floor(count)}{suffix}</>;
};

// Move static data outside component to prevent recreation on each render
const STATS_DATA = [
  { value: '10K+', numValue: 10000, label: 'Events Hosted', icon: 'celebration' },
  { value: '500K+', numValue: 500000, label: 'Tickets Sold', icon: 'confirmation_number' },
  { value: '50K+', numValue: 50000, label: 'Happy Users', icon: 'groups' },
  { value: '99.9%', numValue: 99.9, label: 'Platform Uptime', icon: 'speed' },
];

const UPCOMING_EVENTS = [
  {
    id: 1,
    title: 'Tech Summit 2025',
    description: 'Join industry leaders for cutting-edge tech discussions, hands-on workshops, and networking opportunities. Explore AI, cloud computing, cybersecurity, and more.',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
    date: '2025-01-15',
    time: '09:00',
    location: 'Mumbai, India',
    price: 2999,
    capacity: 500,
    attendees: 455,
    category: 'Conference',
    isFeatured: true,
    organizer: 'TechWorld Events',
  },
  {
    id: 2,
    title: 'Winter Music Festival',
    description: 'Experience an unforgettable night of live performances featuring top artists. Food stalls, art installations, and an electrifying atmosphere await!',
    image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800',
    date: '2025-01-20',
    time: '18:00',
    location: 'Delhi, India',
    price: 1499,
    capacity: 2000,
    attendees: 1880,
    category: 'Concert',
    isFeatured: false,
    organizer: 'SoundWave Productions',
  },
  {
    id: 3,
    title: 'Startup Networking Night',
    description: 'Connect with founders, investors, and innovators. Pitch your ideas, find co-founders, and build lasting business relationships.',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800',
    date: '2025-01-25',
    time: '19:00',
    location: 'Bangalore, India',
    price: 999,
    capacity: 150,
    attendees: 120,
    category: 'Networking',
    isFeatured: false,
    organizer: 'StartupHub India',
  },
  {
    id: 4,
    title: 'AI & ML Workshop',
    description: 'Hands-on workshop covering machine learning fundamentals, neural networks, and real-world AI applications. Suitable for beginners and intermediates.',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800',
    date: '2025-02-01',
    time: '10:00',
    location: 'Hyderabad, India',
    price: 1999,
    capacity: 80,
    attendees: 65,
    category: 'Workshop',
    isFeatured: true,
    organizer: 'AI Academy',
  },
  {
    id: 5,
    title: 'Esports Championship',
    description: 'Compete in VALORANT, CS2, and FIFA tournaments with prizes worth ₹5 lakhs. Live commentary, gaming zones, and exciting giveaways!',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800',
    date: '2025-02-10',
    time: '14:00',
    location: 'Pune, India',
    price: 799,
    capacity: 500,
    attendees: 300,
    category: 'Gaming',
    isFeatured: false,
    organizer: 'GamersArena',
  },
  {
    id: 6,
    title: 'Art & Culture Fest',
    description: 'Celebrate heritage with traditional art exhibitions, folk performances, craft workshops, and culinary delights from across India.',
    image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800',
    date: '2025-02-15',
    time: '11:00',
    location: 'Jaipur, India',
    price: 599,
    capacity: 300,
    attendees: 300,
    category: 'Festival',
    isFeatured: false,
    organizer: 'Cultural Connect',
  },
];

const BENEFITS = [
  {
    icon: 'sensors',
    title: 'Smart IoT Access Control',
    description: 'QR code-enabled gates with real-time validation and automated entry logging for seamless check-ins.',
  },
  {
    icon: 'confirmation_number',
    title: 'Real-Time Booking',
    description: 'Instant ticket confirmation with live seat availability updates and dynamic pricing.',
  },
  {
    icon: 'smart_toy',
    title: 'AI-Powered Support',
    description: '24/7 multilingual chatbot assistance for bookings, inquiries, and personalized recommendations.',
  },
  {
    icon: 'people',
    title: 'Live Crowd Monitoring',
    description: 'Real-time capacity tracking with automated alerts and crowd flow optimization for organizers.',
  },
  {
    icon: 'payment',
    title: 'Secure Payments',
    description: 'Multiple payment gateways - Razorpay, Cashfree, UPI, Cards with bank-grade security.',
  },
  {
    icon: 'analytics',
    title: 'Detailed Analytics',
    description: 'Comprehensive dashboards with revenue insights, attendee demographics, and performance metrics.',
  },
];

const HOW_IT_WORKS = [
  {
    step: 1,
    icon: 'search',
    title: 'Discover',
    subtitle: 'Browse Events',
    description: 'Search thousands of events by category, location, or date. Use smart filters to find your perfect match.',
  },
  {
    step: 2,
    icon: 'shopping_cart',
    title: 'Book',
    subtitle: 'Secure Your Spot',
    description: 'Select tickets, complete secure payment, and receive instant QR code confirmation via email and SMS.',
  },
  {
    step: 3,
    icon: 'qr_code_scanner',
    title: 'Attend',
    subtitle: 'Quick Entry',
    description: 'Show your QR code at the IoT-enabled gate for instant verification and seamless entry.',
  },
];

const CATEGORIES = [
  { name: 'Concerts & Music', icon: 'headphones', gradient: 'from-purple-500 to-pink-500', count: '2.5K+' },
  { name: 'Sports & Fitness', icon: 'sports_soccer', gradient: 'from-green-500 to-emerald-500', count: '1.8K+' },
  { name: 'Conferences', icon: 'business_center', gradient: 'from-blue-500 to-cyan-500', count: '3.2K+' },
  { name: 'Workshops', icon: 'school', gradient: 'from-orange-500 to-amber-500', count: '2.1K+' },
  { name: 'Festivals', icon: 'celebration', gradient: 'from-red-500 to-rose-500', count: '890+' },
  { name: 'Gaming & Esports', icon: 'sports_esports', gradient: 'from-violet-500 to-purple-500', count: '1.5K+' },
  { name: 'Art & Culture', icon: 'palette', gradient: 'from-teal-500 to-cyan-500', count: '1.2K+' },
  { name: 'Networking', icon: 'groups', gradient: 'from-indigo-500 to-blue-500', count: '2.8K+' },
];

const TESTIMONIALS = [
  {
    type: 'attendee',
    quote: 'The QR code entry was so smooth! No waiting in long queues. FlowGateX made my concert experience amazing.',
    name: 'Priya Sharma',
    location: 'Mumbai',
    avatar: 'PS',
    rating: 5,
  },
  {
    type: 'attendee',
    quote: 'I love how easy it is to find events near me. The AI chatbot helped me book tickets in minutes!',
    name: 'Rahul Verma',
    location: 'Delhi',
    avatar: 'RV',
    rating: 5,
  },
  {
    type: 'attendee',
    quote: 'Secure payments and instant tickets - exactly what modern event booking should be.',
    name: 'Anjali Patel',
    location: 'Bangalore',
    avatar: 'AP',
    rating: 5,
  },
  {
    type: 'organizer',
    quote: 'The IoT gates reduced our check-in time by 80%. Real-time analytics helped us manage crowd flow perfectly.',
    name: 'Vikram Singh',
    role: 'Event Organizer',
    avatar: 'VS',
    rating: 5,
  },
  {
    type: 'organizer',
    quote: "FlowGateX's dashboard gives me complete control. From ticket sales to revenue tracking, everything is automated.",
    name: 'Neha Gupta',
    role: 'Conference Organizer',
    avatar: 'NG',
    rating: 5,
  },
  {
    type: 'organizer',
    quote: 'Best platform for event management. The support team is responsive and the features are industry-leading.',
    name: 'Arjun Malhotra',
    role: 'Festival Organizer',
    avatar: 'AM',
    rating: 5,
  },
];

const HomePage = () => {
  const statsRef = useRef(null);
  const [statsVisible, setStatsVisible] = useState(false);
  const [animatedStats, setAnimatedStats] = useState([0, 0, 0, 0]);
  const [isVisible, setIsVisible] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Initialize AOS lazily after first paint
  useEffect(() => {
    const timer = setTimeout(() => {
      import('aos').then((module) => {
        AOS = module.default;
        import('aos/dist/aos.css');
        AOS.init({
          duration: 600,
          once: true,
          easing: 'ease-out',
          disable: window.innerWidth < 768, // Disable on mobile for better performance
        });
      });
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Hero visibility for entrance animations
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Stats counter animation with IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !statsVisible) {
          setStatsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, [statsVisible]);

  // Animate counters when visible
  useEffect(() => {
    if (!statsVisible) return;

    const targets = [10000, 500000, 50000, 99.9];
    const duration = 1500;
    const steps = 40;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setAnimatedStats(targets.map((target) => Math.floor(target * easeOut)));

      if (currentStep >= steps) {
        clearInterval(interval);
        setAnimatedStats(targets);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [statsVisible]);

  const formatNumber = useMemo(() => (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
    return num.toString();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Video Modal */}
      {isVideoModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setIsVideoModalOpen(false)}
        >
          <div
            className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <span className="material-icons-outlined">close</span>
            </button>

            {/* Video Embed - Replace with your actual video URL */}
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
              title="FlowGateX Demo"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* ===========================
          HERO SECTION
      =========================== */}
      <section className="relative min-h-screen overflow-hidden">
        {/* Background Image - Zoomed Out */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.pexels.com/photos/26654865/pexels-photo-26654865.jpeg"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover"
            style={{
              transform: 'scale(1.2)',
            }}
          />
        </div>

        {/* Dark Shadow Overlay for Text Visibility */}
        <div className="absolute inset-0 z-[1] bg-black/70" />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 z-[2] bg-gradient-to-br from-black/80 via-black/60 to-[var(--brand-primary)]/30" />

        {/* Subtle Grid Pattern */}
        <div
          className="absolute inset-0 z-[3] opacity-[0.02]"
          style={{
            backgroundImage:
              'linear-gradient(var(--brand-primary) 1px, transparent 1px), linear-gradient(90deg, var(--brand-primary) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Radial Glows */}
        <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-[var(--brand-primary)]/15 rounded-full blur-[120px] z-[4]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[var(--brand-primary)]/10 rounded-full blur-[100px] z-[4]" />

        {/* Hero Content */}
        <div className="relative z-[10] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 min-h-screen flex items-start">
          <div className="grid lg:grid-cols-2 gap-12 items-center w-full pt-8">
            {/* Left Column - Text Content */}
            <div
              className={`transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}
              data-aos="fade-right"
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--brand-primary)]/10 border border-[var(--brand-primary)]/20 mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--brand-primary)] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--brand-primary)]"></span>
                </span>
                <span className="text-sm font-medium text-white/80">
                  Next-Gen Event Management Platform
                </span>
              </div>

              {/* Main Heading */}
              <h1
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-5xl font-bold mb-6 leading-[1.1] text-left"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                <span className="text-white">Revolutionize Your</span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--brand-primary)] via-[var(--brand-primary-light)] to-[var(--brand-primary)]">
                  Event Experience
                </span>
              </h1>

              {/* Subheading */}
              <p className="text-lg sm:text-xl text-white/80 mb-10 max-w-xl leading-relaxed">
                From discovery to entry - experience seamless event management powered by{' '}
                <span className="text-[var(--brand-primary)] font-semibold">IoT gates</span>,{' '}
                <span className="text-[var(--brand-primary)] font-semibold">real-time analytics</span>, and{' '}
                <span className="text-[var(--brand-primary)] font-semibold">AI assistance</span>.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link
                  to="/events"
                  className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-primary-dark)] rounded-full shadow-lg shadow-[var(--brand-primary)]/25 hover:shadow-xl hover:shadow-[var(--brand-primary)]/30 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <span className="material-icons-outlined text-xl">explore</span>
                    Explore Events
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-[var(--brand-primary-dark)] to-[var(--brand-primary)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>

                <Link
                  to="/organizer/register"
                  className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-bold text-white bg-transparent border-2 border-white/30 rounded-full hover:border-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/5 hover:-translate-y-1 transition-all duration-300"
                >
                  <span className="material-icons-outlined text-xl group-hover:text-[var(--brand-primary)] transition-colors">
                    business
                  </span>
                  For Organizers
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-6 text-white/70">
                <div className="flex items-center gap-2">
                  <span className="material-icons-outlined text-[var(--brand-primary)]">celebration</span>
                  <span className="text-sm font-medium">10,000+ Events</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-icons-outlined text-[var(--brand-primary)]">confirmation_number</span>
                  <span className="text-sm font-medium">500K+ Tickets</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-icons-outlined text-[var(--brand-primary)]">verified</span>
                  <span className="text-sm font-medium">Trusted Platform</span>
                </div>
              </div>
            </div>

            {/* Right Column - Visual Element */}
            <div
              className={`hidden lg:block transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}
              data-aos="fade-left"
            >
              <div className="relative">
                {/* Main Dashboard Mockup */}
                <div className="relative bg-[var(--bg-card)] rounded-3xl border border-[var(--border-primary)] shadow-2xl shadow-black/20 overflow-hidden">
                  <div className="p-6">
                    { /* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-primary-dark)] flex items-center justify-center">
                          <span className="material-icons-outlined text-white text-xl">qr_code_scanner</span>
                        </div>
                        <div>
                          <p className="font-bold text-[var(--text-primary)]">Entry Gate #1</p>
                          <p className="text-xs text-[var(--text-tertiary)]">Live Scanning</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        <span className="text-sm text-green-500 font-medium">Active</span>
                      </div>
                    </div>

                    {/* QR Scanner Visual */}
                    <div className="relative aspect-square max-w-sm mx-auto mb-6">
                      <div className="absolute inset-0 border-4 border-[var(--brand-primary)]/30 rounded-3xl">
                        <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-[var(--brand-primary)] rounded-tl-3xl"></div>
                        <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-[var(--brand-primary)] rounded-tr-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-[var(--brand-primary)] rounded-bl-3xl"></div>
                        <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-[var(--brand-primary)] rounded-br-3xl"></div>
                      </div>
                      {/* Scanning Line Animation - Going Up and Down */}
                      <div className="absolute inset-4 overflow-hidden rounded-2xl">
                        <div
                          className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[var(--brand-primary)] to-transparent shadow-lg shadow-[var(--brand-primary)]"
                          style={{
                            animation: 'scanLine 2s ease-in-out infinite',
                          }}
                        ></div>
                        <style>{`
                                  @keyframes scanLine {
                                  0%, 100% { top: 0; }
                                  50% { top: calc(100% - 4px); }
                                  }
                                  `}</style>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="material-icons-outlined text-8xl text-[var(--brand-primary)]/50">qr_code_2</span>
                      </div>
                    </div>

                    {/* Stats Row with Animated Numbers */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 rounded-xl bg-[var(--bg-secondary)]">
                        <p className="text-2xl font-bold text-[var(--brand-primary)]">
                          <CountUpNumber target={847} duration={2000} />
                        </p>
                        <p className="text-xs text-[var(--text-tertiary)]">Scanned</p>
                      </div>
                      <div className="text-center p-3 rounded-xl bg-[var(--bg-secondary)]">
                        <p className="text-2xl font-bold text-green-500">
                          <CountUpNumber target={12} duration={1500} />
                        </p>
                        <p className="text-xs text-[var(--text-tertiary)]">In Queue</p>
                      </div>
                      <div className="text-center p-3 rounded-xl bg-[var(--bg-secondary)]">
                        <p className="text-2xl font-bold text-[var(--text-primary)]">
                          <CountUpNumber target={2.3} duration={1800} decimals={1} suffix="s" />
                        </p>
                        <p className="text-xs text-[var(--text-tertiary)]">Avg Time</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Notification Card */}
                <div className="absolute -top-4 -right-4 bg-[var(--bg-card)] rounded-2xl border border-[var(--border-primary)] shadow-xl p-4 animate-bounce-slow">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                      <span className="material-icons-outlined text-green-500">check_circle</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[var(--text-primary)]">Entry Verified</p>
                      <p className="text-xs text-[var(--text-tertiary)]">VIP Pass - John D. </p>
                    </div>
                  </div>
                </div>

                {/* Floating Stats Card */}
                <div className="absolute -bottom-4 -left-4 bg-[var(--bg-card)] rounded-2xl border border-[var(--border-primary)] shadow-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[var(--brand-primary)]/20 flex items-center justify-center">
                      <span className="material-icons-outlined text-[var(--brand-primary)]">trending_up</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[var(--text-primary)]">+23% Entry Rate</p>
                      <p className="text-xs text-[var(--text-tertiary)]">vs. Last Hour</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-8 h-12 rounded-full border-2 border-[var(--border-primary)] flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-[var(--brand-primary)] rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* ===========================
            STATS SECTION - MODERN DESIGN
              =========================== */}
      <section ref={statsRef} className="relative py-24 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-secondary)] via-[var(--bg-primary)] to-[var(--bg-secondary)]" />

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute -top-1/2 -left-1/4 w-[600px] h-[600px] bg-[var(--brand-primary)]/10 rounded-full blur-[150px]" />
          <div className="absolute -bottom-1/2 -right-1/4 w-[500px] h-[500px] bg-[var(--brand-primary)]/10 rounded-full blur-[120px]" />
        </div>

        {/* Subtle Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              'linear-gradient(var(--brand-primary) 1px, transparent 1px), linear-gradient(90deg, var(--brand-primary) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16" data-aos="fade-up">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--brand-primary)]/10 border border-[var(--brand-primary)]/20 text-[var(--brand-primary)] text-sm font-semibold mb-4">
              <span className="material-icons-outlined text-base">insights</span>
              Platform Statistics
            </span>
            <h2
              className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Trusted by <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-primary-light)]">Thousands</span>
            </h2>
            <p className="text-[var(--text-secondary)] max-w-xl mx-auto">
              Real numbers that showcase our commitment to delivering exceptional event experiences.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {STATS_DATA.map((stat, index) => (
              <div
                key={stat.label}
                className="group relative"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                {/* Card */}
                <div className="relative h-full p-8 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-primary)] hover:border-[var(--brand-primary)]/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[var(--brand-primary)]/10 overflow-hidden">
                  {/* Gradient Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand-primary)]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Decorative Corner Accent */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[var(--brand-primary)]/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Icon Container */}
                  <div className="relative mb-6">
                    <div className="relative inline-flex">
                      {/* Outer Ring Animation */}
                      <div className="absolute inset-0 rounded-2xl bg-[var(--brand-primary)]/20 animate-ping opacity-0 group-hover:opacity-100" style={{ animationDuration: '2s' }} />
                      {/* Icon Background */}
                      <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--brand-primary)]/20 to-[var(--brand-primary)]/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <span className="material-icons-outlined text-3xl text-[var(--brand-primary)]">{stat.icon}</span>
                      </div>
                    </div>
                    {/* Decorative Dot */}
                    <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[var(--brand-primary)]/40 group-hover:bg-[var(--brand-primary)] transition-colors duration-300" />
                  </div>

                  {/* Number with Animation */}
                  <div className="relative mb-2">
                    <p
                      className="text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--text-primary)] to-[var(--text-primary)] group-hover:from-[var(--brand-primary)] group-hover:to-[var(--brand-primary-light)] transition-all duration-300"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      {statsVisible ? (
                        index === 3 ? `${animatedStats[index].toFixed(1)}%` : `${formatNumber(animatedStats[index])}+`
                      ) : (
                        stat.value
                      )}
                    </p>
                    {/* Underline Accent */}
                    <div className="mt-2 w-12 h-1 rounded-full bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-primary-light)] opacity-0 group-hover:opacity-100 group-hover:w-20 transition-all duration-500" />
                  </div>

                  {/* Label */}
                  <p className="text-sm lg:text-base text-[var(--text-secondary)] font-medium group-hover:text-[var(--text-primary)] transition-colors duration-300">
                    {stat.label}
                  </p>

                  {/* Bottom Indicator Line */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--brand-primary)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Floating Badge - Only for specific stats */}
                {index === 0 && (
                  <div className="absolute -top-3 -right-3 px-3 py-1 rounded-full bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-primary-dark)] text-white text-xs font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    🔥 Growing Fast
                  </div>
                )}
                {index === 3 && (
                  <div className="absolute -top-3 -right-3 px-3 py-1 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    ✓ Industry Best
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Bottom Trust Indicator */}
          <div className="mt-16 flex justify-center" data-aos="fade-up" data-aos-delay="400">
            <div className="inline-flex items-center gap-4 px-6 py-3 rounded-full bg-[var(--bg-card)] border border-[var(--border-primary)]">
              <div className="flex -space-x-2">
                {['PS', 'RV', 'AP', 'VS'].map((initials, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-primary-dark)] flex items-center justify-center text-white text-xs font-bold border-2 border-[var(--bg-card)]"
                    style={{ zIndex: 4 - i }}
                  >
                    {initials}
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <span className="text-[var(--text-secondary)]">Join </span>
                <span className="text-[var(--brand-primary)] font-semibold">50,000+</span>
                <span className="text-[var(--text-secondary)]"> happy users</span>
              </div>
              <span className="material-icons-outlined text-[var(--brand-primary)] text-lg">arrow_forward</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===========================
            UPCOMING EVENTS CAROUSEL
              =========================== */}
      <section className="py-20 bg-[var(--bg-primary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <div data-aos="fade-right">
              <span className="inline-block px-4 py-1.5 rounded-full bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] text-sm font-semibold mb-4">
                Upcoming Events
              </span>
              <h2
                className="text-3xl md:text-4xl font-bold text-[var(--text-primary)]"
                style={{ fontFamily: 'var(--font-heading)' }}
              >Don&apos;t Miss Out</h2>
            </div>
            <Link
              to="/events"
              className="group flex items-center gap-2 text-[var(--brand-primary)] font-semibold mt-4 md:mt-0 hover:gap-3 transition-all"
              data-aos="fade-left"
            >
              View All Events
              <span className="material-icons-outlined text-xl">arrow_forward</span>
            </Link>
          </div>

          {/* Events Grid/Carousel */}
          <div className="relative">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {UPCOMING_EVENTS.slice(0, 6).map((event, index) => (
                <div
                  key={event.id}
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <EventCard event={event} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===========================
          BENEFITS SECTION
      =========================== */}
      <section className="py-20 bg-[var(--bg-secondary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16" data-aos="fade-up">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] text-sm font-semibold mb-4">
              Why FlowGateX
            </span>
            <h2
              className="text-3xl md:text-5xl font-bold text-[var(--text-primary)] mb-4"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Why Choose FlowGateX?
            </h2>
            <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
              Experience the future of event management with our cutting-edge features.
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BENEFITS.map((benefit, index) => (
              <div
                key={benefit.title}
                className="group p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-primary)] hover:border-[var(--brand-primary)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[var(--brand-primary)]/5"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-primary-dark)] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <span className="material-icons-outlined text-white text-2xl">{benefit.icon}</span>
                </div>

                {/* Content */}
                <h3
                  className="text-xl font-bold text-[var(--text-primary)] mb-3 group-hover:text-[var(--brand-primary)] transition-colors"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {benefit.title}
                </h3>
                <p className="text-[var(--text-secondary)] leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===========================
          HOW IT WORKS SECTION
      =========================== */}
      <section className="py-24 bg-[var(--bg-primary)] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-20" data-aos="fade-up">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] text-sm font-semibold mb-4">
              How It Works
            </span>
            <h2
              className="text-3xl md:text-5xl font-bold text-[var(--text-primary)] mb-4"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Get Started in 3 Simple Steps
            </h2>
            <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
              From browsing to entry, we make it seamless.
            </p>
          </div>

          {/* Steps Container */}
          <div className="relative">
            {/* SVG Curved Connecting Line - Desktop */}
            <svg
              className="hidden lg:block absolute top-32 left-0 w-full h-32 pointer-events-none"
              viewBox="0 0 1200 120"
              fill="none"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="var(--brand-primary)" stopOpacity="0.2" />
                  <stop offset="50%" stopColor="var(--brand-primary)" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="var(--brand-primary)" stopOpacity="0.2" />
                </linearGradient>
                <linearGradient id="dotGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--brand-primary)" />
                  <stop offset="100%" stopColor="var(--brand-primary-dark)" />
                </linearGradient>
              </defs>
              {/* Curved Path */}
              <path
                d="M 100 60 Q 300 120 400 60 Q 500 0 600 60 Q 700 120 800 60 Q 900 0 1100 60"
                stroke="url(#lineGradient)"
                strokeWidth="3"
                strokeDasharray="8 6"
                fill="none"
                className="animate-dash"
              />
              {/* Animated dots along the path */}
              <circle r="6" fill="url(#dotGradient)">
                <animateMotion
                  dur="4s"
                  repeatCount="indefinite"
                  path="M 100 60 Q 300 120 400 60 Q 500 0 600 60 Q 700 120 800 60 Q 900 0 1100 60"
                />
              </circle>
              <circle r="4" fill="var(--brand-primary)" opacity="0.5">
                <animateMotion
                  dur="4s"
                  repeatCount="indefinite"
                  begin="1s"
                  path="M 100 60 Q 300 120 400 60 Q 500 0 600 60 Q 700 120 800 60 Q 900 0 1100 60"
                />
              </circle>
              <circle r="3" fill="var(--brand-primary)" opacity="0.3">
                <animateMotion
                  dur="4s"
                  repeatCount="indefinite"
                  begin="2s"
                  path="M 100 60 Q 300 120 400 60 Q 500 0 600 60 Q 700 120 800 60 Q 900 0 1100 60"
                />
              </circle>
            </svg>

            {/* Add keyframes for dash animation */}
            <style>{`
              @keyframes dash {
                to {
                  stroke-dashoffset: -28;
                }
              }
              .animate-dash {
                animation: dash 1s linear infinite;
              }
            `}</style>

            {/* Steps Grid */}
            <div className="grid md:grid-cols-3 gap-8 lg:gap-16">
              {HOW_IT_WORKS.map((step, index) => (
                <div
                  key={step.step}
                  className="relative group"
                  data-aos="fade-up"
                  data-aos-delay={index * 200}
                >
                  {/* Step Card */}
                  <div className="relative bg-[var(--bg-card)] rounded-3xl border border-[var(--border-primary)] p-8 hover:border-[var(--brand-primary)]/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[var(--brand-primary)]/10">
                    {/* Glow Effect on Hover */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[var(--brand-primary)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Step Number Badge - Floating */}
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                      <div className="relative">
                        {/* Outer Ring Animation */}
                        <div className="absolute inset-0 rounded-full bg-[var(--brand-primary)]/20 animate-ping" style={{ animationDuration: '2s' }} />
                        {/* Step Number */}
                        <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-primary-dark)] flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-[var(--brand-primary)]/40 border-4 border-[var(--bg-card)]">
                          {step.step}
                        </div>
                      </div>
                    </div>

                    {/* Icon Container */}
                    <div className="mt-6 mb-6 flex justify-center">
                      <div className="relative">
                        {/* Background Circle */}
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[var(--brand-primary)]/10 to-[var(--brand-primary)]/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                          <span className="material-icons-outlined text-5xl text-[var(--brand-primary)] group-hover:scale-110 transition-transform duration-300">
                            {step.icon}
                          </span>
                        </div>
                        {/* Decorative Dots */}
                        <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-[var(--brand-primary)]/30 group-hover:bg-[var(--brand-primary)] transition-colors duration-300" />
                        <div className="absolute -bottom-1 -left-1 w-3 h-3 rounded-full bg-[var(--brand-primary)]/20 group-hover:bg-[var(--brand-primary)]/60 transition-colors duration-300" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="text-center relative z-10">
                      <h3
                        className="text-2xl font-bold text-[var(--text-primary)] mb-2 group-hover:text-[var(--brand-primary)] transition-colors duration-300"
                        style={{ fontFamily: 'var(--font-heading)' }}
                      >
                        {step.title}
                      </h3>
                      <p className="text-sm font-semibold text-[var(--brand-primary)] mb-4 tracking-wide uppercase">
                        {step.subtitle}
                      </p>
                      <p className="text-[var(--text-secondary)] leading-relaxed">
                        {step.description}
                      </p>
                    </div>

                    {/* Bottom Accent Line */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-transparent via-[var(--brand-primary)] to-transparent group-hover:w-3/4 transition-all duration-500 rounded-full" />
                  </div>

                  {/* Mobile Connector Arrow - Only between steps */}
                  {index < HOW_IT_WORKS.length - 1 && (
                    <div className="md:hidden flex justify-center my-6">
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-0.5 h-8 bg-gradient-to-b from-[var(--brand-primary)] to-[var(--brand-primary)]/30" />
                        <span className="material-icons-outlined text-[var(--brand-primary)] animate-bounce">
                          keyboard_arrow_down
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Bottom CTA */}
            <div className="mt-16 text-center" data-aos="fade-up" data-aos-delay="600">
              <Link
                to="/events"
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-primary-dark)] text-white font-bold rounded-full shadow-lg shadow-[var(--brand-primary)]/25 hover:shadow-xl hover:shadow-[var(--brand-primary)]/30 hover:-translate-y-1 transition-all duration-300"
              >
                <span>Start Your Journey</span>
                <span className="material-icons-outlined">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===========================
          CATEGORIES SECTION
      =========================== */}
      <section className="py-20 bg-[var(--bg-secondary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12" data-aos="fade-up">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] text-sm font-semibold mb-4">
              Categories
            </span>
            <h2
              className="text-3xl md:text-4xl font-bold text-[var(--text-primary)]"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Explore by Category
            </h2>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CATEGORIES.map((category, index) => (
              <Link
                key={category.name}
                to={`/events? category=${category.name.toLowerCase()}`}
                className={`group relative p-6 rounded-2xl bg-gradient-to-br ${category.gradient} overflow-hidden hover:scale-105 transition-all duration-300 hover:shadow-xl`}
                data-aos="zoom-in"
                data-aos-delay={index * 50}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                      backgroundSize: '20px 20px',
                    }}
                  />
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <span className="material-icons-outlined text-4xl text-white mb-4 block group-hover:scale-110 transition-transform">
                    {category.icon}
                  </span>
                  <h3 className="text-lg font-bold text-white mb-1">{category.name}</h3>
                  <p className="text-sm text-white/80">{category.count} Events</p>
                </div>

                {/* Hover Arrow */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="material-icons-outlined text-white">arrow_forward</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===========================
          TESTIMONIALS SECTION
      =========================== */}
      <section className="py-20 bg-[var(--bg-primary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12" data-aos="fade-up">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] text-sm font-semibold mb-4">
              Testimonials
            </span>
            <h2
              className="text-3xl md:text-4xl font-bold text-[var(--text-primary)]"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              What Our Community Says
            </h2>
          </div>

          {/* Testimonials Carousel */}
          <div className="relative">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {TESTIMONIALS.slice(0, 6).map((testimonial, index) => (
                <div
                  key={index}
                  className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-primary)] hover:border-[var(--brand-primary)] transition-all duration-300"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  {/* Rating */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="material-icons text-yellow-500 text-lg">
                        star
                      </span>
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-[var(--text-secondary)] italic mb-6 leading-relaxed">&ldquo;{testimonial.quote}&rdquo;</p>

                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-primary-dark)] flex items-center justify-center text-white font-bold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-bold text-[var(--text-primary)]">{testimonial.name}</p>
                      <p className="text-sm text-[var(--text-tertiary)]">
                        {testimonial.type === 'organizer' ? testimonial.role : testimonial.location}
                      </p>
                    </div>
                    {testimonial.type === 'organizer' && (
                      <span className="ml-auto px-2 py-1 rounded-full bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] text-xs font-semibold">
                        Organizer
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===========================
          FINAL CTA SECTION - MODERN DESIGN
      =========================== */}
      <section className="relative py-32 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-[var(--bg-primary)]" />

        {/* Gradient Mesh Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[var(--brand-primary)]/20 via-transparent to-[var(--brand-primary)]/10" />
          <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-[var(--brand-primary)]/30 rounded-full blur-[150px] animate-pulse" />
          <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-[var(--brand-primary)]/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--brand-primary)]/5 rounded-full blur-[100px]" />
        </div>

        {/* Floating Particles/Dots */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-[var(--brand-primary)]/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        {/* Subtle Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(var(--brand-primary) 1px, transparent 1px), linear-gradient(90deg, var(--brand-primary) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Floating Animation Keyframes */}
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.3; }
            50% { transform: translateY(-20px) rotate(180deg); opacity: 0.8; }
          }
        `}</style>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8" data-aos="fade-up">
          {/* Glassmorphism Card */}
          <div className="relative rounded-[2.5rem] overflow-hidden">
            {/* Card Background with Glass Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--bg-card)]/80 to-[var(--bg-card)]/60 backdrop-blur-xl" />
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand-primary)]/10 via-transparent to-[var(--brand-primary)]/5" />

            {/* Animated Border */}
            <div className="absolute inset-0 rounded-[2.5rem] p-[1px] bg-gradient-to-r from-[var(--brand-primary)]/50 via-[var(--brand-primary)]/20 to-[var(--brand-primary)]/50">
              <div className="absolute inset-[1px] rounded-[2.5rem] bg-[var(--bg-card)]" />
            </div>

            {/* Content */}
            <div className="relative z-10 px-8 py-16 sm:px-16 sm:py-20 text-center">
              {/* Animated Icon */}
              <div className="relative inline-flex items-center justify-center mb-8">
                {/* Outer Ring */}
                <div className="absolute inset-0 w-24 h-24 rounded-2xl bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-primary-dark)] opacity-20 animate-ping" style={{ animationDuration: '3s' }} />
                {/* Icon Container */}
                <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-primary-dark)] flex items-center justify-center shadow-2xl shadow-[var(--brand-primary)]/40">
                  <span className="material-icons-outlined text-4xl text-white">rocket_launch</span>
                </div>
                {/* Decorative Elements */}
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[var(--brand-primary)]/30 animate-bounce" style={{ animationDelay: '0.5s' }} />
                <div className="absolute -bottom-1 -left-1 w-4 h-4 rounded-full bg-[var(--brand-primary)]/20 animate-bounce" style={{ animationDelay: '1s' }} />
              </div>

              {/* Heading with Gradient */}
              <h2
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                <span className="text-[var(--text-primary)]">Ready to Transform</span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--brand-primary)] via-[var(--brand-primary-light)] to-[var(--brand-primary)]">
                  Your Event Experience?
                </span>
              </h2>

              {/* Subheading */}
              <p className="text-lg sm:text-xl text-[var(--text-secondary)] mb-12 max-w-2xl mx-auto leading-relaxed">
                Join <span className="text-[var(--brand-primary)] font-semibold">10,000+ organizers</span> and{' '}
                <span className="text-[var(--brand-primary)] font-semibold">500K+ attendees</span> who trust FlowGateX
                for seamless event management.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
                {/* Primary CTA */}
                <Link
                  to="/register"
                  className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 text-lg font-bold overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Button Background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-primary-dark)] transition-all duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[var(--brand-primary-dark)] to-[var(--brand-primary)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Shine Effect */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />

                  {/* Button Content */}
                  <span className="relative z-10 flex items-center gap-3 text-white">
                    <span className="material-icons-outlined text-xl">person_add</span>
                    Get Started Free
                    <span className="material-icons-outlined text-xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </span>

                  {/* Shadow */}
                  <div className="absolute inset-0 rounded-2xl shadow-lg shadow-[var(--brand-primary)]/30 group-hover:shadow-xl group-hover:shadow-[var(--brand-primary)]/40 transition-shadow duration-300" />
                </Link>

                {/* Secondary CTA - Watch Demo */}
                <button
                  onClick={() => setIsVideoModalOpen(true)}
                  className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 text-lg font-bold rounded-2xl border-2 border-[var(--border-primary)] hover:border-[var(--brand-primary)] bg-[var(--bg-card)]/50 hover:bg-[var(--brand-primary)]/5 text-[var(--text-primary)] transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Play Icon with Animation */}
                  <span className="relative flex items-center justify-center">
                    <span className="absolute w-10 h-10 rounded-full bg-[var(--brand-primary)]/20 animate-ping" style={{ animationDuration: '2s' }} />
                    <span className="relative w-10 h-10 rounded-full bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-primary-dark)] flex items-center justify-center">
                      <span className="material-icons text-white text-lg ml-0.5">play_arrow</span>
                    </span>
                  </span>
                  <span className="group-hover:text-[var(--brand-primary)] transition-colors">Watch Demo</span>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center justify-center gap-6 text-[var(--text-tertiary)]">
                <div className="flex items-center gap-2">
                  <span className="material-icons-outlined text-[var(--brand-primary)] text-lg">verified</span>
                  <span className="text-sm font-medium">No credit card required</span>
                </div>
                <div className="hidden sm:block w-1 h-1 rounded-full bg-[var(--text-tertiary)]" />
                <div className="flex items-center gap-2">
                  <span className="material-icons-outlined text-[var(--brand-primary)] text-lg">schedule</span>
                  <span className="text-sm font-medium">Setup in 2 minutes</span>
                </div>
                <div className="hidden sm:block w-1 h-1 rounded-full bg-[var(--text-tertiary)]" />
                <div className="flex items-center gap-2">
                  <span className="material-icons-outlined text-[var(--brand-primary)] text-lg">cancel</span>
                  <span className="text-sm font-medium">Cancel anytime</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Decorative Elements */}
          <div className="mt-16 flex justify-center">
            <div className="flex items-center gap-8 opacity-40">
              <div className="w-20 h-[1px] bg-gradient-to-r from-transparent to-[var(--brand-primary)]" />
              <span className="material-icons-outlined text-[var(--brand-primary)]">auto_awesome</span>
              <div className="w-20 h-[1px] bg-gradient-to-l from-transparent to-[var(--brand-primary)]" />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;