import { Link } from 'react-router-dom';
import { Button } from '@components/common';

const HomePage = () => {
  const features = [
    {
      icon: 'event',
      title: 'Discover Events',
      description: 'Explore thousands of events happening near you',
    },
    {
      icon: 'confirmation_number',
      title: 'Easy Booking',
      description: 'Book tickets in seconds with secure payments',
    },
    {
      icon: 'qr_code_scanner',
      title: 'Digital Tickets',
      description: 'Get instant QR tickets on your phone',
    },
    {
      icon: 'analytics',
      title: 'Real-time Analytics',
      description: 'Track event performance with live insights',
    },
    {
      icon: 'sensors',
      title: 'IoT Integration',
      description: 'Smart entry gates and crowd monitoring',
    },
    {
      icon: 'smart_toy',
      title: 'AI Assistant',
      description: '24/7 chatbot support for all your queries',
    },
  ];

  const stats = [
    { value: '10K+', label: 'Events Hosted' },
    { value: '500K+', label: 'Tickets Sold' },
    { value: '50K+', label: 'Happy Users' },
    { value: '99.9%', label: 'Uptime' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.4"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }} />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 animate__animated animate__fadeInUp">
              Your Gateway to
              <span className="block text-primary-200">Unforgettable Events</span>
            </h1>
            <p className="text-xl text-primary-100 mb-8 animate__animated animate__fadeInUp animate__delay-1s">
              Discover, book, and manage events with the most advanced event
              management platform. Powered by IoT and AI for seamless experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate__animated animate__fadeInUp animate__delay-2s">
              <Link to="/events">
                <Button size="lg" className="bg-white text-primary-600 hover:bg-primary-50">
                  Explore Events
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Create Event
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#f9fafb"/>
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-primary-600">{stat.value}</p>
                <p className="text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Event Success
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              From discovery to check-in, we've got you covered with cutting-edge features.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-shadow group"
              >
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-600 transition-colors">
                  <span className="material-icons-outlined text-primary-600 text-2xl group-hover:text-white transition-colors">
                    {feature.icon}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Events?
          </h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Join thousands of organizers who trust FlowGateX for their event management needs.
          </p>
          <Link to="/register">
            <Button size="lg" variant="primary">
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
