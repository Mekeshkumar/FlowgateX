import React, { useState, useCallback, useEffect } from 'react';
import { ChevronDown, Zap, Star, TrendingUp, Sun, Copy, Download, Settings, Play, Pause } from 'lucide-react';

import Button from '@components/common/Button';
import EventCard from '@features/events/components/EventCard';
import { Toast } from '@components/common/Toast';


// --- MOCK DATA GENERATION LOGIC ---

const eventTemplates = [
  { title: 'Tech Summit', category: 'tech', tags: ['technology', 'innovation', 'AI'], venues: ['Convention Centre', 'Tech Park', 'Innovation Hub'], capacityRange: [100, 1000], priceRange: [1000, 8000] },
  { title: 'Music Festival', category: 'music', tags: ['music', 'concert', 'live'], venues: ['Stadium', 'Arena', 'Concert Hall'], capacityRange: [500, 15000], priceRange: [1500, 6000] },
  { title: 'Fitness Expo', category: 'sports', tags: ['sports', 'fitness', 'health'], venues: ['Expo Center', 'Gymnasium', 'Sports Complex'], capacityRange: [200, 5000], priceRange: [500, 3000] },
  { title: 'Gourmet Food Fair', category: 'food', tags: ['food', 'drinks', 'culinary'], venues: ['Exhibition Grounds', 'Food Park', 'City Square'], capacityRange: [150, 2500], priceRange: [200, 4000] },
  { title: 'Modern Art Showcase', category: 'art', tags: ['art', 'culture', 'exhibition'], venues: ['Art Gallery', 'Museum', 'Cultural Center'], capacityRange: [50, 800], priceRange: [0, 2500] },
  { title: 'Startup Pitch Night', category: 'business', tags: ['business', 'networking', 'entrepreneurship'], venues: ['Co-working Space', 'Auditorium', 'Hotel Ballroom'], capacityRange: [80, 500], priceRange: [500, 5000] },
  { title: 'Data Science Workshop', category: 'education', tags: ['education', 'workshop', 'tech'], venues: ['University Campus', 'Online', 'Training Center'], capacityRange: [30, 200], priceRange: [2500, 10000] },
  { title: 'Esports Championship', category: 'gaming', tags: ['gaming', 'esports', 'competition'], venues: ['Gaming Arena', 'Stadium', 'Online'], capacityRange: [300, 10000], priceRange: [300, 5500] },
];

const cities = [
  { name: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lng: 72.8777 },
  { name: 'Delhi', state: 'Delhi', lat: 28.7041, lng: 77.1025 },
  { name: 'Bangalore', state: 'Karnataka', lat: 12.9716, lng: 77.5946 },
  { name: 'Hyderabad', state: 'Telangana', lat: 17.3850, lng: 78.4867 },
  { name: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707 },
  { name: 'Pune', state: 'Maharashtra', lat: 18.5204, lng: 73.8567 },
  { name: 'Kolkata', state: 'West Bengal', lat: 22.5726, lng: 88.3639 },
  { name: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lng: 72.5714 },
];

const organizerNames = ['EventCorp', 'InnovateX', 'MediaPro', 'NextGen Events', 'Alpha Bookings', 'Creative Minds'];
const unsplashKeywords = {
  tech: 'technology',
  music: 'concert',
  sports: 'sports',
  food: 'gourmet,food',
  art: 'art,museum',
  business: 'business,conference',
  education: 'workshop,education',
  gaming: 'gaming,esports',
};

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomNumber = (min, max) => Math.random() * (max - min) + min;
const roundTo = (n, to) => Math.round(n / to) * to;

const generateMockEvent = (index) => {
  const template = getRandom(eventTemplates);
  const city = getRandom(cities);

  const date = new Date();
  date.setDate(date.getDate() + Math.floor(getRandomNumber(1, 60)));
  const time = new Date();
  time.setHours(Math.floor(getRandomNumber(8, 22)), Math.random() > 0.5 ? 30 : 0, 0, 0);

  const capacity = roundTo(getRandomNumber(template.capacityRange[0], template.capacityRange[1]), 50);
  const attendees = Math.floor(capacity * getRandomNumber(0.6, 0.95));
  
  const isFree = Math.random() < 0.2;
  const hasDiscount = Math.random() < 0.4;
  let price = isFree ? 0 : roundTo(getRandomNumber(template.priceRange[0], template.priceRange[1]), 100);
  let originalPrice = hasDiscount && !isFree ? roundTo(price * getRandomNumber(1.2, 1.8), 100) : null;
  if (price === originalPrice) originalPrice = null;

  const organizerName = getRandom(organizerNames);
  
  return {
    id: `evt-${new Date().getTime()}-${index}`,
    title: `${template.title} ${city.name}`,
    description: `A premier ${template.tags[0]} event focusing on ${template.tags[1]} and ${template.tags[2]}. Join us in ${city.name} for an unforgettable experience.`,
    image: `https://source.unsplash.com/random/400x300/?${unsplashKeywords[template.category]}&sig=${index}`,
    date: date.toISOString().split('T')[0],
    time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
    location: {
      venue: `${getRandom(template.venues)} ${city.name}`,
      city: city.name,
      state: city.state,
      coordinates: {
        lat: city.lat + getRandomNumber(-0.05, 0.05),
        lng: city.lng + getRandomNumber(-0.05, 0.05),
      },
    },
    category: template.category,
    price,
    originalPrice,
    currency: '₹',
    capacity,
    attendees,
    available: capacity - attendees,
    rating: getRandomNumber(3.8, 5.0).toFixed(1),
    reviews: Math.floor(attendees * getRandomNumber(0.1, 0.4)),
    isFeatured: Math.random() < 0.3,
    isTrending: Math.random() < 0.4,
    isOnline: template.venues.includes('Online') || Math.random() < 0.15,
    tags: [...new Set([...template.tags, city.name.toLowerCase()])],
    organizer: {
      name: organizerName,
      avatar: organizerName.match(/\b(\w)/g).join('').slice(0,2),
      verified: Math.random() > 0.2,
    },
    generatedAt: new Date().toISOString(),
  };
};

const generateMockEvents = (count) => {
  return Array.from({ length: count }, (_, i) => generateMockEvent(i));
};


// --- UI COMPONENTS ---

const StatCard = ({ icon, label, value, color }) => (
  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 flex items-center space-x-4">
    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
      {icon}
    </div>
    <div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-sm text-white/70">{label}</div>
    </div>
  </div>
);

const Controls = ({ onGenerate, onExport, count, setCount, autoRefresh, setAutoRefresh, isRunning, onToggleRun }) => (
    <div className="bg-black/20 border border-white/20 backdrop-blur-lg rounded-xl">
        <div className="p-4 border-b border-white/20 flex flex-row items-center justify-between">
            <h3 className="text-white flex items-center font-bold"><Settings className="mr-2"/>Controls</h3>
            <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => onExport('copy')}>
                    <Copy className="w-4 h-4 mr-2" /> Copy JSON
                </Button>
                <Button variant="outline" size="sm" onClick={() => onExport('download')}>
                    <Download className="w-4 h-4 mr-2" /> Download JSON
                </Button>
            </div>
        </div>
        <div className="p-4 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-1 w-full sm:w-auto">
                <label htmlFor="event-count" className="block text-sm font-medium text-white/70 mb-1">Number of Events</label>
                <input
                    id="event-count"
                    type="number"
                    value={count}
                    onChange={(e) => setCount(Math.max(1, Math.min(100, Number(e.target.value))))}
                    className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 bg-black/20 border-white/30 focus:ring-purple-500 focus:border-transparent text-white"
                    min="1"
                    max="100"
                />
            </div>
            <div className="flex items-center space-x-4">
                <div className="flex items-center pt-6">
                    <input
                        id="auto-refresh"
                        type="checkbox"
                        checked={autoRefresh}
                        onChange={(e) => setAutoRefresh(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 bg-black/20"
                    />
                    <label htmlFor="auto-refresh" className="ml-2 text-sm font-medium text-white">Auto-refresh (5s)</label>
                </div>
                <Button onClick={onToggleRun} size="md" className="w-12 h-12 rounded-full">
                    {isRunning ? <Pause /> : <Play />}
                </Button>
            </div>
            <div className="pt-6">
                <Button onClick={() => onGenerate(count)} className="w-full sm:w-auto">Generate Manually</Button>
            </div>
        </div>
    </div>
);

const LayoutPreview = () => {
    const [events, setEvents] = useState([]);
    const [eventCount, setEventCount] = useState(12);
    const [autoRefresh, setAutoRefresh] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const handleGenerate = useCallback((count) => {
        setEvents(generateMockEvents(count));
        setToast({ show: true, message: `${count} events generated!`, type: 'success' });
    }, []);

    useEffect(() => {
        handleGenerate(eventCount);
    }, [handleGenerate, eventCount]);

    useEffect(() => {
        let intervalId = null;
        if (autoRefresh && isRunning) {
            intervalId = setInterval(() => {
                handleGenerate(eventCount);
            }, 5000);
        }
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [autoRefresh, isRunning, eventCount, handleGenerate]);
    
    useEffect(() => {
        if (toast.show) {
            const timer = setTimeout(() => {
                setToast({ ...toast, show: false });
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    const handleToggleRun = () => {
        if (!autoRefresh && !isRunning) {
            setAutoRefresh(true);
        }
        setIsRunning(!isRunning);
    }

    const handleExport = (type) => {
        const dataStr = JSON.stringify(events, null, 2);
        if (type === 'copy') {
            navigator.clipboard.writeText(dataStr);
            setToast({ show: true, message: 'Copied to clipboard!', type: 'success' });
        } else {
            const dataUri = 'data:application/json;charset=utf-t,' + encodeURIComponent(dataStr);
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', 'mock-events.json');
            linkElement.click();
            setToast({ show: true, message: 'Downloading JSON file!', type: 'success' });
        }
    };
    
    const stats = {
        total: events.length,
        featured: events.filter(e => e.isFeatured).length,
        trending: events.filter(e => e.isTrending).length,
        online: events.filter(e => e.isOnline).length,
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800 text-white p-4 sm:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-4xl font-bold tracking-tighter">Event Cards Mock Data Generator</h1>
                    <p className="text-lg text-white/70 mt-1">A tool to generate realistic, randomized test data for development.</p>
                </header>
                
                <section className="mb-8">
                    <Controls 
                        onGenerate={handleGenerate}
                        onExport={handleExport}
                        count={eventCount}
                        setCount={setEventCount}
                        autoRefresh={autoRefresh}
                        setAutoRefresh={setAutoRefresh}
                        isRunning={isRunning}
                        onToggleRun={handleToggleRun}
                    />
                </section>

                <section className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard icon={<Zap size={24} />} label="Total Events" value={stats.total} color="bg-blue-500" />
                    <StatCard icon={<Star size={24} />} label="Featured" value={stats.featured} color="bg-yellow-500" />
                    <StatCard icon={<TrendingUp size={24} />} label="Trending" value={stats.trending} color="bg-green-500" />
                    <StatCard icon={<Sun size={24} />} label="Online" value={stats.online} color="bg-red-500" />
                </section>
                
                <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {events.map((event) => (
                        <EventCard key={event.id} event={event} />
                    ))}
                </main>
            </div>
            {toast.show && (
                <div className="fixed bottom-10 right-10 z-50">
                    <Toast message={toast.message} type={toast.type} />
                </div>
            )}
        </div>
    );
};

export default LayoutPreview;
