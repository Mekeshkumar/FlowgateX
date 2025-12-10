/**
 * Gemini AI Service for FlowGateX Chat Assistant
 * Uses Google's Gemini API for intelligent responses
 */

const GEMINI_API_KEY = 'AIzaSyD8YlNVHhSR1ouupTQ9OTZ48otM6ebFfrY';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

/**
 * Generate a system prompt based on user role
 */
const getSystemPrompt = (role, userName) => {
    const baseContext = `You are FlowBot, an AI assistant for FlowGateX - a modern event management platform with IoT-enabled access control, real-time analytics, and smart ticketing.

Key Platform Features:
- QR code-based event entry with IoT gates
- Real-time crowd monitoring and analytics
- Secure payment processing (Razorpay, UPI, Cards)
- Event discovery and booking system
- Organizer dashboard for event management

Be helpful, concise, and friendly. Use emojis occasionally. Keep responses under 150 words unless more detail is needed.`;

    switch (role) {
        case 'admin':
            return `${baseContext}

You are speaking with ${userName || 'an Admin'}. They have ADMIN privileges and can:
- Manage all users and organizers
- Approve/reject events
- View platform-wide analytics
- Configure system settings
- Access audit logs
- Manage IoT devices

Help them with platform administration, user management, system monitoring, and generating reports. Be professional and provide actionable insights.`;

        case 'organizer':
            return `${baseContext}

You are speaking with ${userName || 'an Organizer'}. They can:
- Create and manage events
- Set up ticket types and pricing
- View attendee lists and check-ins
- Access sales and revenue analytics
- Configure IoT gates for their events
- Send communications to attendees

Help them maximize event success, improve ticket sales, manage attendees, and use analytics effectively. Provide marketing tips when relevant.`;

        default:
            return `${baseContext}

You are speaking with ${userName || 'a User'}. They can:
- Browse and discover events
- Book tickets and make payments
- View their bookings and tickets
- Get QR codes for event entry
- Save favorite events
- Leave reviews

Help them find events, manage bookings, understand the platform, and resolve any issues. Be warm and welcoming.`;
    }
};

/**
 * Send a message to Gemini API and get a response
 */
export const sendMessageToGemini = async (message, role = 'user', userName = '', conversationHistory = []) => {
    try {
        const systemPrompt = getSystemPrompt(role, userName);

        // Build conversation context
        const contents = [
            {
                role: 'user',
                parts: [{ text: systemPrompt }]
            },
            {
                role: 'model',
                parts: [{ text: 'Understood! I am FlowBot, ready to assist with FlowGateX. How can I help you today?' }]
            }
        ];

        // Add conversation history (last 10 messages for context)
        const recentHistory = conversationHistory.slice(-10);
        recentHistory.forEach(msg => {
            contents.push({
                role: msg.type === 'user' ? 'user' : 'model',
                parts: [{ text: msg.text }]
            });
        });

        // Add current message
        contents.push({
            role: 'user',
            parts: [{ text: message }]
        });

        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents,
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 500,
                },
                safetySettings: [
                    {
                        category: 'HARM_CATEGORY_HARASSMENT',
                        threshold: 'BLOCK_MEDIUM_AND_ABOVE'
                    },
                    {
                        category: 'HARM_CATEGORY_HATE_SPEECH',
                        threshold: 'BLOCK_MEDIUM_AND_ABOVE'
                    },
                    {
                        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
                        threshold: 'BLOCK_MEDIUM_AND_ABOVE'
                    },
                    {
                        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
                        threshold: 'BLOCK_MEDIUM_AND_ABOVE'
                    }
                ]
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Failed to get response from AI');
        }

        const data = await response.json();

        // Extract the response text
        const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!responseText) {
            throw new Error('No response generated');
        }

        return {
            success: true,
            message: responseText.trim()
        };

    } catch (error) {
        // Return a fallback response
        return {
            success: false,
            message: getFallbackResponse(message, role),
            error: error.message
        };
    }
};

/**
 * Fallback responses when API fails
 */
const getFallbackResponse = (input, role) => {
    const lowerInput = input.toLowerCase();

    // Common responses
    if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('hey')) {
        return "Hey there! 👋 I'm having a bit of trouble connecting right now, but I'm still here to help! What would you like to know?";
    }

    if (lowerInput.includes('help')) {
        return "I'd love to help! While I'm having connection issues, you can: 1) Browse events on the Events page, 2) Check your bookings in the Dashboard, 3) Contact support at support@flowgatex.com";
    }

    if (lowerInput.includes('event')) {
        return "For event-related queries, please visit our Events page to browse and book. If you need specific help, contact support@flowgatex.com 📧";
    }

    if (lowerInput.includes('booking') || lowerInput.includes('ticket')) {
        return "You can view your bookings in the Dashboard → My Bookings section. Your QR codes for entry are available there too! 🎫";
    }

    // Role-specific fallbacks
    if (role === 'admin') {
        return "I'm experiencing connection issues. For urgent admin matters, please check the Admin Dashboard directly or contact the tech team.";
    }

    if (role === 'organizer') {
        return "Connection issues on my end! For event management, head to your Organizer Dashboard. For urgent support: support@flowgatex.com";
    }

    return "I'm having trouble connecting to my brain right now 🤖 Please try again in a moment, or contact support@flowgatex.com for immediate assistance!";
};

export default sendMessageToGemini;
