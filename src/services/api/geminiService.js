import config from '../../config';

/**
 * Gemini AI Service for FlowGateX Chat Assistant
 * Uses Google's Gemini 1.5 Flash for high-speed, intelligent responses.
 */

const API_KEY = config.ai.apiKey;
const MODEL_NAME = config.ai.model;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent`;

/**
 * Generate a context-aware system prompt based on user role
 */
const getSystemPrompt = (role, userName) => {
    const baseContext = `You are FlowBot, the intelligent assistant for FlowGateX.
    
    Platform Context:
    - IoT-enabled access control & QR entry
    - Real-time crowd analytics
    - Secure ticketing (Razorpay/Stripe)
    
    Your Personality:
    - Helpful, concise, and professional yet friendly.
    - Use emojis sparingly to lighten the tone.
    - Keep answers short (max 3 sentences) unless asked for details.`;

    const roleSpecifics = {
        admin: `
            User: Admin (${userName || 'System Admin'})
            Capabilities: User management, system config, analytics oversight, IoT device control.
            Goal: assist with platform administration and operational efficiency.`,

        organizer: `
            User: Organizer (${userName || 'Event Host'})
            Capabilities: Event creation, ticket management, revenue tracking, attendee check-in.
            Goal: Help maximize ticket sales and streamline event logistics.`,

        user: `
            User: Attendee (${userName || 'Guest'})
            Capabilities: Browsing events, booking tickets, viewing QR codes.
            Goal: Help find events and resolve booking issues.`
    };

    return `${baseContext}\n${roleSpecifics[role] || roleSpecifics.user}`;
};

/**
 * Send a message to Gemini API
 * @param {string} message - User's input text
 * @param {string} role - User's role (admin/organizer/user)
 * @param {string} userName - User's display name
 * @param {Array} conversationHistory - Previous messages for context
 */
export const sendMessageToGemini = async (message, role = 'user', userName = '', conversationHistory = []) => {
    if (!API_KEY) {
        console.error('Gemini API Key is missing');
        return { success: false, message: "I'm not fully configured yet. Please check my API key." };
    }

    try {
        const systemPrompt = getSystemPrompt(role, userName);

        // Format history for Gemini API
        // Note: Gemini uses 'user' and 'model' roles.
        const historyParts = conversationHistory.slice(-6).map(msg => ({
            role: msg.type === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }]
        }));

        const payload = {
            contents: [
                {
                    role: 'user',
                    parts: [{ text: systemPrompt }]
                },
                {
                    role: 'model',
                    parts: [{ text: "Understood. I am ready to assist as FlowBot." }]
                },
                ...historyParts,
                {
                    role: 'user',
                    parts: [{ text: message }]
                }
            ],
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 250,
            }
        };

        const response = await fetch(`${GEMINI_API_URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error?.message || 'API Request Failed');
        }

        const data = await response.json();
        const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!aiResponse) throw new Error('Empty response from AI');

        return {
            success: true,
            message: aiResponse.trim()
        };

    } catch (error) {
        console.error('Gemini AI Error:', error);
        return {
            success: false,
            message: getFallbackResponse(message),
            error: error.message
        };
    }
};

/**
 * Offline fallback logic
 */
const getFallbackResponse = (input) => {
    const text = input.toLowerCase();
    if (text.includes('ticket') || text.includes('book')) return "You can manage bookings in your Dashboard. 🎫";
    if (text.includes('event')) return "Check out the Events page for upcoming activities! 🎉";
    if (text.includes('support')) return "Contact us at support@flowgatex.com 📧";
    return "I'm having trouble connecting to the cloud right now. Please try again in a moment. 🤖";
};

export default sendMessageToGemini;