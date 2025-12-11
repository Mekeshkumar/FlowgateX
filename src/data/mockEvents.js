// ============================================================================
// HELPER UTILITIES
// ============================================================================
import { faker } from '@faker-js/faker';
const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomFloat = (min, max, decimals) => parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
const generateInitials = (name) => name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

// ============================================================================
// MOCK DATA (Replaces Faker.js)
// ============================================================================

const MOCK_FIRST_NAMES = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan', 'Saanvi', 'Aanya', 'Aadhya', 'Aaradhya', 'Ananya', 'Pari', 'Anika', 'Navya', 'Diya', 'Myra'];
const MOCK_LAST_NAMES = ['Sharma', 'Verma', 'Gupta', 'Singh', 'Kumar', 'Patel', 'Shah', 'Mehta', 'Jain', 'Reddy'];
const MOCK_LOREM_PARAGRAPHS = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
    'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.',
    'Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?'
];
const MOCK_EVENT_ADJECTIVES = ['Global', 'Live', 'United', 'X', 'Pro', 'Max', 'Fest', 'Summit'];
const MOCK_AMENITIES = ['Free WiFi', 'Parking Available', 'Wheelchair Accessible', 'Food & Drinks', 'Air Conditioning', 'Pet Friendly'];
const MOCK_PERKS = ['General Access', 'Early Entry', 'Front Row Seats', 'Merchandise', 'VIP Lounge', 'After Party Access'];

const generateFullName = () => `${getRandomElement(MOCK_FIRST_NAMES)} ${getRandomElement(MOCK_LAST_NAMES)}`;
const generateSentence = (wordCount) => {
    const words = ['lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do', 'eiusmod', 'tempor'];
    let sentence = '';
    for (let i = 0; i < wordCount; i++) {
        sentence += getRandomElement(words) + ' ';
    }
    return sentence.charAt(0).toUpperCase() + sentence.slice(1).trim() + '.';
};
const generateParagraph = (sentenceCount) => {
    let paragraph = '';
    for (let i = 0; i < sentenceCount; i++) {
        paragraph += generateSentence(getRandomNumber(5, 10)) + ' ';
    }
    return paragraph.trim();
}

// ============================================================================
// CONSTANTS & TEMPLATES
// ============================================================================

const CITIES = [
    { city: 'Mumbai', state: 'Maharashtra', coordinates: { lat: 19.076, lng: 72.8777 } },
    { city: 'Delhi', state: 'Delhi NCR', coordinates: { lat: 28.6139, lng: 77.209 } },
    { city: 'Bangalore', state: 'Karnataka', coordinates: { lat: 12.9716, lng: 77.5946 } },
    { city: 'Hyderabad', state: 'Telangana', coordinates: { lat: 17.385, lng: 78.4867 } },
    { city: 'Chennai', state: 'Tamil Nadu', coordinates: { lat: 13.0827, lng: 80.2707 } },
    { city: 'Pune', state: 'Maharashtra', coordinates: { lat: 18.5204, lng: 73.8567 } },
    { city: 'Kolkata', state: 'West Bengal', coordinates: { lat: 22.5726, lng: 88.3639 } },
    { city: 'Ahmedabad', state: 'Gujarat', coordinates: { lat: 23.0225, lng: 72.5714 } },
];

const EVENT_TEMPLATES = [
    {
        title: 'Tech Summit',
        category: 'tech',
        tags: ['technology', 'innovation', 'AI', 'startup', 'networking'],
        venues: ['Convention Centre', 'Tech Park', 'Innovation Hub', 'Exhibition Center'],
        organizers: ['TechEvents India', 'Future Forward', 'Innovate Hub'],
        capacityRange: [200, 1000],
        priceRange: [1000, 8000],
        images: [
            'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop',
            'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=400&fit=crop',
        ],
    },
    {
        title: 'Music Festival',
        category: 'music',
        tags: ['music', 'concert', 'live', 'festival', 'entertainment'],
        venues: ['Stadium', 'Arena', 'Open Air Ground', 'Concert Hall'],
        organizers: ['SoundWave Productions', 'Live Nation', 'Rhythm & Hues'],
        capacityRange: [2000, 15000],
        priceRange: [1500, 7000],
        images: [
            'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&h=400&fit=crop',
            'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&h=400&fit=crop',
        ],
    },
    {
        title: 'Fitness Marathon',
        category: 'sports',
        tags: ['sports', 'fitness', 'marathon', 'running', 'health'],
        venues: ['City Park', 'Marine Drive', 'Athletic Stadium'],
        organizers: ['Fit India', 'Runners Club', 'HealthFirst'],
        capacityRange: [1000, 10000],
        priceRange: [500, 2000],
        images: [
            'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800&h=400&fit=crop',
            'https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=800&h=400&fit=crop',
        ]
    },
    {
        title: 'Gourmet Food Fair',
        category: 'food',
        tags: ['food', 'culinary', 'gourmet', 'wine', 'chef'],
        venues: ['Exhibition Grounds', 'Luxury Hotel', 'Food Plaza'],
        organizers: ['Gourmet Events', 'Foodie Nation', 'TasteMakers'],
        capacityRange: [300, 2000],
        priceRange: [500, 4000],
        images: [
            'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=400&fit=crop',
            'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=400&fit=crop',
        ],
    },
    {
        title: 'Art & Sculpture Expo',
        category: 'art',
        tags: ['art', 'culture', 'exhibition', 'gallery', 'painting'],
        venues: ['Art Gallery', 'Museum', 'Cultural Center'],
        organizers: ['Creative Canvas', 'Art Circle', 'Modern Art Foundation'],
        capacityRange: [100, 800],
        priceRange: [0, 1500],
        images: [
            'https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?w=800&h=400&fit=crop',
            'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=400&fit=crop',
        ],
    },
    {
        title: 'Networking Conference',
        category: 'business',
        tags: ['business', 'networking', 'startup', 'corporate', 'summit'],
        venues: ['Business Hotel', 'Conference Center', 'Co-working Space'],
        organizers: ['BizConnect', 'Startup Sphere', 'Corporate Leaders Forum'],
        capacityRange: [150, 600],
        priceRange: [2000, 10000],
        images: [
            'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=400&fit=crop',
            'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&h=400&fit=crop',
        ],
    },
    {
        title: 'Web Development Bootcamp',
        category: 'education',
        tags: ['education', 'workshop', 'coding', 'webdev', 'learning'],
        venues: ['University Campus', 'Online', 'Training Institute'],
        organizers: ['CodeAcademy', 'DevSkills', 'LearnHub'],
        capacityRange: [50, 300],
        priceRange: [1000, 5000],
        images: [
            'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&h=400&fit=crop',
            'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=800&h=400&fit=crop',
        ],
    },
    {
        title: 'Esports Championship',
        category: 'gaming',
        tags: ['gaming', 'esports', 'tournament', 'live', 'competition'],
        venues: ['Indoor Stadium', 'Gaming Arena', 'Exhibition Hall'],
        organizers: ['GameOn', 'Esports Federation', 'Digital Warriors'],
        capacityRange: [1000, 12000],
        priceRange: [800, 4500],
        images: [
            'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=400&fit=crop',
            'https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?w=800&h=400&fit=crop',
        ],
    },
];

// ============================================================================
// MOCK DATA GENERATOR
// ============================================================================

export const generateMockEvents = (count = 50) => {
    const events = [];

    for (let i = 0; i < count; i++) {
        const template = getRandomElement(EVENT_TEMPLATES);
        const city = getRandomElement(CITIES);

        // --- Basic Info ---
        const id = `evt-${Date.now()}-${i}`;
        const title = `${template.title} ${getRandomElement(MOCK_EVENT_ADJECTIVES)}`;
        const description = generateParagraph(3);
        const image = getRandomElement(template.images);

        // --- Date & Time ---
        const eventDate = new Date();
        eventDate.setDate(eventDate.getDate() + getRandomNumber(1, 60));
        const date = eventDate.toISOString().split('T')[0];
        const eventTime = new Date(eventDate);
        eventTime.setHours(getRandomNumber(8, 22), getRandomNumber(0, 1) * 30, 0, 0);
        const time = eventTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

        // --- Location ---
        const isOnline = Math.random() < 0.15;
        const venueName = isOnline ? 'Online Event' : `${getRandomElement(template.venues)} ${city.city}`;
        const location = {
            venue: venueName,
            city: isOnline ? 'Online' : city.city,
            state: isOnline ? '' : city.state,
            coordinates: {
                lat: parseFloat((city.coordinates.lat + (Math.random() - 0.5) * 0.1).toFixed(4)),
                lng: parseFloat((city.coordinates.lng + (Math.random() - 0.5) * 0.1).toFixed(4)),
            }
        };

        // --- Pricing ---
        const isFree = Math.random() < 0.2;
        let price = isFree ? 0 : getRandomNumber(template.priceRange[0] / 100, template.priceRange[1] / 100) * 100;
        let originalPrice = null;
        if (!isFree && Math.random() < 0.4) {
            originalPrice = price + getRandomNumber(5, 30) * 100;
            const temp = price;
            price = Math.min(price, originalPrice);
            if (price !== temp) originalPrice = temp;
        }

        // --- Capacity & Attendees ---
        const capacity = getRandomNumber(template.capacityRange[0], template.capacityRange[1]);
        const attendees = Math.floor(capacity * getRandomFloat(0.6, 0.9));
        const available = capacity - attendees;

        // --- Ratings & Flags ---
        const rating = getRandomFloat(3.8, 5.0, 1);
        const reviewsCount = Math.floor(attendees * getRandomFloat(0.05, 0.15));
        const isFeatured = Math.random() < 0.3;
        const isTrending = Math.random() < 0.4;

        // --- Organizer ---
        const organizerName = getRandomElement(template.organizers);
        const organizer = {
            name: organizerName,
            avatar: generateInitials(organizerName),
            verified: Math.random() < 0.8,
        };

        // --- Extended Details ---
        const video = Math.random() < 0.2 ? 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' : null;
        const venue = {
            name: venueName,
            address: `${getRandomNumber(100, 999)} ${generateFullName()} Street, ${location.city}, ${location.state}`,
            mapUrl: `https://www.google.com/maps?q=${location.coordinates.lat},${location.coordinates.lng}`,
            amenities: MOCK_AMENITIES.slice(0, getRandomNumber(2, 4))
        };
        const agenda = Array.from({ length: getRandomNumber(3, 5) }, (_, j) => ({
            time: `${String(9 + j).padStart(2, '0')}:00 AM`,
            title: generateSentence(5),
            description: generateParagraph(2),
        }));
        const ticketTiers = [
            { id: 1, name: 'General', price: price, available: Math.floor(available * 0.7), perks: MOCK_PERKS.slice(0, 1) },
            { id: 2, name: 'VIP', price: price * 2, available: Math.floor(available * 0.2), perks: MOCK_PERKS.slice(2, 5) },
            { id: 3, name: 'Early Bird', price: price * 0.8, available: Math.floor(available * 0.1), perks: MOCK_PERKS.slice(0, 2) },
        ];
        const faq = Array.from({ length: getRandomNumber(3, 5) }, () => ({
            q: generateSentence(getRandomNumber(6, 10)).replace('.', '?'),
            a: generateParagraph(2),
        }));
        const reviewsList = Array.from({ length: reviewsCount }, (_, k) => {
            const reviewDate = new Date();
            reviewDate.setDate(reviewDate.getDate() - getRandomNumber(1, 365));
            return {
                id: k,
                user: generateFullName(),
                avatar: null, // No faker for images
                rating: getRandomFloat(3.5, 5, 1),
                comment: generateParagraph(1),
                date: reviewDate.toISOString(),
            };
        });

        events.push({
            id,
            title,
            description,
            image,
            date,
            time,
            location,
            category: template.category,
            price,
            originalPrice,
            currency: '₹',
            capacity,
            attendees,
            available,
            rating,
            reviews: reviewsCount,
            isFeatured,
            isTrending,
            isOnline,
            tags: template.tags.slice(0, getRandomNumber(3, 5)),
            organizer,
            generatedAt: new Date().toISOString(),

            // Extended fields
            video,
            venue,
            agenda,
            ticketTiers,
            faq,
            reviewsList,
            relatedEvents: [] // to be populated later
        });
    }

    // Populate relatedEvents
    for (const event of events) {
        event.relatedEvents = events
            .filter(e => e.id !== event.id && e.category === event.category)
            .slice(0, 3)
            .map(e => e.id);
    }

    return events;
};


// ============================================================================
// EXPORTS
// ============================================================================

let _mockEvents = generateMockEvents(50);
if (!_mockEvents || !_mockEvents.length) {
    _mockEvents = [{
        id: 'evt-debug',
        title: 'Debug Event',
        description: 'This is a debug event to ensure rendering works.',
        image: 'https://via.placeholder.com/800x400?text=Debug+Event',
        date: new Date().toISOString().split('T')[0],
        time: '10:00 AM',
        location: { venue: 'Debug Venue', city: 'Debug City', state: 'Debug State' },
        category: 'debug',
        price: 0,
        originalPrice: null,
        currency: '₹',
        capacity: 100,
        attendees: 0,
        available: 100,
        rating: 5,
        reviews: 0,
        isFeatured: false,
        isTrending: false,
        isOnline: false,
        tags: ['debug'],
        organizer: { name: 'Debug Organizer', avatar: 'DO', verified: true },
        generatedAt: new Date().toISOString(),
        video: null,
        venue: { name: 'Debug Venue', address: '123 Debug St', mapUrl: '', amenities: [] },
        agenda: [],
        ticketTiers: [],
        faq: [],
        reviewsList: [],
        relatedEvents: []
    }];
}
export const mockEvents = _mockEvents;

// Categories configuration
export const eventCategories = [
    { id: 'music', name: 'Music & Concerts', icon: 'headphones', count: mockEvents.filter(e => e.category === 'music').length, color: 'from-purple-500 to-pink-500' },
    { id: 'sports', name: 'Sports & Fitness', icon: 'sports_soccer', count: mockEvents.filter(e => e.category === 'sports').length, color: 'from-green-500 to-emerald-500' },
    { id: 'tech', name: 'Tech & Innovation', icon: 'computer', count: mockEvents.filter(e => e.category === 'tech').length, color: 'from-blue-500 to-cyan-500' },
    { id: 'food', name: 'Food & Drinks', icon: 'restaurant', count: mockEvents.filter(e => e.category === 'food').length, color: 'from-orange-500 to-amber-500' },
    { id: 'art', name: 'Art & Culture', icon: 'palette', count: mockEvents.filter(e => e.category === 'art').length, color: 'from-rose-500 to-pink-500' },
    { id: 'business', name: 'Business & Networking', icon: 'business_center', count: mockEvents.filter(e => e.category === 'business').length, color: 'from-indigo-500 to-blue-500' },
    { id: 'education', name: 'Education & Workshops', icon: 'school', count: mockEvents.filter(e => e.category === 'education').length, color: 'from-teal-500 to-cyan-500' },
    { id: 'gaming', name: 'Gaming & Esports', icon: 'sports_esports', count: mockEvents.filter(e => e.category === 'gaming').length, color: 'from-violet-500 to-purple-500' },
];

// Locations configuration
export const eventLocations = CITIES.map(c => ({ ...c, count: mockEvents.filter(e => e.location.city === c.city).length }));

// Date range options
export const dateRangeOptions = [
    { value: 'all', label: 'All Dates', icon: 'date_range' },
    { value: 'today', label: 'Today', icon: 'today' },
    { value: 'tomorrow', label: 'Tomorrow', icon: 'event' },
    { value: 'this-week', label: 'This Week', icon: 'view_week' },
    { value: 'this-weekend', label: 'This Weekend', icon: 'weekend' },
    { value: 'this-month', label: 'This Month', icon: 'calendar_month' },
    { value: 'next-month', label: 'Next Month', icon: 'calendar_today' },
];

// Sort options
export const sortOptions = [
    { value: 'date-asc', label: 'Date: Earliest First', icon: 'arrow_upward' },
    { value: 'date-desc', label: 'Date: Latest First', icon: 'arrow_downward' },
    { value: 'price-asc', label: 'Price: Low to High', icon: 'trending_up' },
    { value: 'price-desc', label: 'Price: High to Low', icon: 'trending_down' },
    { value: 'popularity', label: 'Most Popular', icon: 'local_fire_department' },
    { value: 'rating', label: 'Highest Rated', icon: 'star' },
];


export default mockEvents;