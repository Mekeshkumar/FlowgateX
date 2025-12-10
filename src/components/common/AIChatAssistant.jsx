import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@hooks/useAuth';
import { sendMessageToGemini } from '@services/api/geminiService';

const AIChatAssistant = () => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Role-based configuration
    const roleConfig = useMemo(() => {
        const baseConfig = {
            admin: {
                title: 'Admin Assistant',
                subtitle: 'Platform Management',
                greeting: `Hello ${user?.name || 'Admin'}! 👋 I can help with analytics and user oversight.`,
                color: 'from-red-500 to-rose-600',
            },
            organizer: {
                title: 'Organizer Assistant',
                subtitle: 'Event Management',
                greeting: `Hi ${user?.name || 'Organizer'}! 👋 Need help with your events or ticket sales?`,
                color: 'from-purple-500 to-violet-600',
            },
            user: {
                title: 'FlowBot',
                subtitle: 'Your Event Assistant',
                greeting: `Hello${user?.name ? ` ${user.name}` : ''}! 👋 How can I help you discover events today?`,
                color: 'from-[var(--brand-primary)] to-[var(--brand-primary-dark)]',
            }
        };
        return baseConfig[user?.role] || baseConfig.user;
    }, [user?.role, user?.name]);

    // Initialize greeting
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([{
                id: 'init',
                type: 'bot',
                text: roleConfig.greeting,
                timestamp: new Date(),
            }]);
        }
    }, [isOpen, messages.length, roleConfig.greeting]);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    // Focus input on open
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const handleSendMessage = useCallback(async (e) => {
        e?.preventDefault();
        if (!inputValue.trim()) return;

        const currentText = inputValue.trim();
        setInputValue('');

        // Add User Message
        setMessages((prev) => [...prev, {
            id: Date.now(),
            type: 'user',
            text: currentText,
            timestamp: new Date(),
        }]);

        setIsTyping(true);

        try {
            const response = await sendMessageToGemini(
                currentText,
                user?.role || 'user',
                user?.name || '',
                messages
            );

            setMessages((prev) => [...prev, {
                id: Date.now() + 1,
                type: 'bot',
                text: response.message,
                timestamp: new Date(),
                isAI: response.success,
            }]);
        } catch (error) {
            setMessages((prev) => [...prev, {
                id: Date.now() + 1,
                type: 'bot',
                text: "I'm having trouble connecting. Please try again later.",
                timestamp: new Date(),
                isAI: false,
            }]);
        } finally {
            setIsTyping(false);
        }
    }, [inputValue, messages, user?.role, user?.name]);

    return (
        <>
            {/* Original Floating Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    fixed bottom-6 right-6 z-50 group
                    w-14 h-14 rounded-2xl shadow-2xl
                    flex items-center justify-center
                    transition-all duration-300 ease-out
                    hover:scale-110 hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)]
                    ${isOpen
                        ? 'bg-[var(--bg-secondary)] border border-[var(--border-primary)] rotate-0'
                        : `bg-gradient-to-br ${roleConfig.color} animate-pulse hover:animate-none`
                    }
                `}
                aria-label={isOpen ? 'Close chat' : 'Open AI Assistant'}
            >
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[var(--bg-primary)] animate-bounce" />
                )}
                <span className={`material-icons-outlined text-2xl transition-transform duration-300 ${isOpen ? 'rotate-180 text-[var(--text-primary)]' : 'text-white'}`}>
                    {isOpen ? 'close' : 'auto_awesome'}
                </span>
            </button>

            {/* Chat Container - Adapted from provided UI */}
            {isOpen && (
                <div
                    className="fixed bottom-24 right-6 z-50 w-[90vw] sm:w-[440px] max-h-[634px] h-[70vh] bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border-primary)] shadow-2xl flex flex-col"
                    style={{ animation: 'slideUp 0.3s ease-out' }}
                >
                    <style>{`
                        @keyframes slideUp {
                            from { opacity: 0; transform: translateY(20px) scale(0.95); }
                            to { opacity: 1; transform: translateY(0) scale(1); }
                        }
                    `}</style>

                    {/* Heading */}
                    <div className="flex flex-col space-y-1.5 pb-6 border-b border-[var(--border-primary)] mb-4">
                        <h2 className="font-semibold text-lg tracking-tight text-[var(--text-primary)]">{roleConfig.title}</h2>
                        <p className="text-sm text-[var(--text-secondary)] leading-3">{roleConfig.subtitle}</p>
                    </div>

                    {/* Chat Messages Container */}
                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        {messages.map((msg) => (
                            <div key={msg.id} className="flex gap-3 my-4 text-sm flex-1">
                                <span className="relative flex shrink-0 overflow-hidden rounded-full w-8 h-8">
                                    <div className={`rounded-full border p-1 flex items-center justify-center w-full h-full ${msg.type === 'bot' ? 'bg-[var(--bg-tertiary)] border-[var(--border-primary)]' : 'bg-[var(--brand-primary)] border-transparent'}`}>
                                        {msg.type === 'bot' ? (
                                            // AI Icon
                                            <svg stroke="none" fill="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="text-[var(--text-primary)] w-4 h-4" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"></path>
                                            </svg>
                                        ) : (
                                            // User Icon
                                            <svg stroke="none" fill="white" strokeWidth="0" viewBox="0 0 16 16" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z"></path>
                                            </svg>
                                        )}
                                    </div>
                                </span>
                                <div className="leading-relaxed">
                                    <span className="block font-bold text-[var(--text-primary)] mb-1">
                                        {msg.type === 'bot' ? 'AI' : 'You'}
                                    </span>
                                    <p className="text-[var(--text-secondary)]">{msg.text}</p>
                                </div>
                            </div>
                        ))}

                        {/* Typing Indicator */}
                        {isTyping && (
                            <div className="flex gap-3 my-4 text-sm flex-1">
                                <span className="relative flex shrink-0 overflow-hidden rounded-full w-8 h-8">
                                    <div className="rounded-full bg-[var(--bg-tertiary)] border border-[var(--border-primary)] p-1 flex items-center justify-center w-full h-full">
                                        <div className="flex gap-0.5">
                                            <span className="w-1 h-1 bg-[var(--text-muted)] rounded-full animate-bounce" />
                                            <span className="w-1 h-1 bg-[var(--text-muted)] rounded-full animate-bounce delay-75" />
                                            <span className="w-1 h-1 bg-[var(--text-muted)] rounded-full animate-bounce delay-150" />
                                        </div>
                                    </div>
                                </span>
                                <p className="text-[var(--text-muted)] text-xs mt-2">Thinking...</p>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="pt-4 mt-auto">
                        <form className="flex items-center justify-center w-full space-x-2" onSubmit={handleSendMessage}>
                            <input
                                ref={inputRef}
                                className="flex h-10 w-full rounded-md border border-[var(--border-primary)] bg-[var(--bg-secondary)] px-3 py-2 text-sm placeholder:text-[var(--text-muted)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/50 focus:border-[var(--brand-primary)] disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                                placeholder="Type your message..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                disabled={isTyping}
                            />
                            <button
                                type="submit"
                                disabled={!inputValue.trim() || isTyping}
                                className="inline-flex items-center justify-center rounded-md text-sm font-medium text-white disabled:pointer-events-none disabled:opacity-50 bg-[var(--text-primary)] hover:bg-[var(--text-primary)]/90 h-10 px-4 py-2 transition-colors"
                            >
                                Send
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default AIChatAssistant;