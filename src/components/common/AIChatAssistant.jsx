import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@hooks/useAuth';
import { sendMessageToGemini } from '@services/api/geminiService';

const AIChatAssistant = () => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Role-based configuration
    const roleConfig = useMemo(() => {
        switch (user?.role) {
            case 'admin':
                return {
                    greeting: `Hello ${user?.name || 'Admin'}! 👋 I'm your Admin Assistant. I can help you with platform management, user oversight, analytics, and system configurations.`,
                    avatar: 'admin_panel_settings',
                    title: 'Admin Assistant',
                    subtitle: 'Platform Management',
                    color: 'from-red-500 to-rose-600',
                    quickReplies: [
                        'View platform stats',
                        'Manage users',
                        'Review pending events',
                        'System health check',
                        'Export reports',
                    ],
                };
            case 'organizer':
                return {
                    greeting: `Hi ${user?.name || 'Organizer'}! 👋 I'm your Event Assistant. I can help you create events, manage attendees, track sales, and optimize your event performance.`,
                    avatar: 'event_note',
                    title: 'Organizer Assistant',
                    subtitle: 'Event Management',
                    color: 'from-purple-500 to-violet-600',
                    quickReplies: [
                        'Create new event',
                        'View ticket sales',
                        'Check attendee list',
                        'Marketing tips',
                        'Revenue analytics',
                    ],
                };
            default:
                return {
                    greeting: `Hello${user?.name ? ` ${user.name}` : ''}! 👋 I'm FlowBot, your event assistant. I can help you discover events, manage bookings, and answer any questions.`,
                    avatar: 'smart_toy',
                    title: 'FlowBot',
                    subtitle: 'Your Event Assistant',
                    color: 'from-[var(--brand-primary)] to-[var(--brand-primary-dark)]',
                    quickReplies: [
                        'Find events near me',
                        'View my bookings',
                        'Get recommendations',
                        'Payment help',
                        'Contact support',
                    ],
                };
        }
    }, [user?.role, user?.name]);

    // Initialize with greeting message
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([
                {
                    id: 1,
                    type: 'bot',
                    text: roleConfig.greeting,
                    timestamp: new Date(),
                },
            ]);
        }
    }, [isOpen, messages.length, roleConfig.greeting]);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    useEffect(() => {
        if (isOpen && !isMinimized && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen, isMinimized]);

    const handleSendMessage = useCallback(async (text = inputValue) => {
        if (!text.trim()) return;

        const userMessage = {
            id: Date.now(),
            type: 'user',
            text: text.trim(),
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);

        try {
            // Use Gemini AI for response
            const response = await sendMessageToGemini(
                text.trim(),
                user?.role || 'user',
                user?.name || '',
                messages // Pass conversation history for context
            );

            const botResponse = {
                id: Date.now() + 1,
                type: 'bot',
                text: response.message,
                timestamp: new Date(),
                isAI: response.success, // Mark if it's a real AI response
            };
            setMessages((prev) => [...prev, botResponse]);
        } catch {
            // Fallback response on error
            const botResponse = {
                id: Date.now() + 1,
                type: 'bot',
                text: "I'm having trouble connecting right now. Please try again in a moment! 🤖",
                timestamp: new Date(),
                isAI: false,
            };
            setMessages((prev) => [...prev, botResponse]);
        } finally {
            setIsTyping(false);
        }
    }, [inputValue, messages, user?.role, user?.name]);

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const clearChat = () => {
        setMessages([
            {
                id: Date.now(),
                type: 'bot',
                text: roleConfig.greeting,
                timestamp: new Date(),
            },
        ]);
    };

    return (
        <>
            {/* Floating Chat Button */}
            <button
                onClick={() => {
                    setIsOpen(!isOpen);
                    setIsMinimized(false);
                }}
                className={`
          fixed bottom-6 right-6 z-50 group
          w-14 h-14 rounded-2xl shadow-2xl
          flex items-center justify-center
          transition-all duration-300 ease-out
          hover:scale-110 hover:shadow-[0_8px_30px_rgba(235,22,22,0.4)]
          ${isOpen
                        ? 'bg-[var(--bg-secondary)] border border-[var(--border-primary)] rotate-0'
                        : `bg-gradient-to-br ${roleConfig.color} animate-pulse hover:animate-none`
                    }
        `}
                aria-label={isOpen ? 'Close chat' : 'Open AI Assistant'}
            >
                {/* Notification dot when closed */}
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[var(--bg-primary)] animate-bounce" />
                )}

                <span className={`material-icons-outlined text-2xl transition-transform duration-300 ${isOpen ? 'rotate-180 text-[var(--text-primary)]' : 'text-white'}`}>
                    {isOpen ? 'close' : 'auto_awesome'}
                </span>

                {/* Ripple effect when closed */}
                {!isOpen && (
                    <>
                        <span className="absolute inset-0 rounded-2xl bg-white/20 animate-ping opacity-75" style={{ animationDuration: '2s' }} />
                    </>
                )}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div
                    className={`
            fixed bottom-24 right-6 z-50
            w-[380px] max-w-[calc(100vw-3rem)]
            bg-[var(--bg-card)] rounded-3xl
            border border-[var(--border-primary)]
            shadow-2xl shadow-black/20
            overflow-hidden
            transition-all duration-300 ease-out
            ${isMinimized ? 'h-16' : 'h-[520px]'}
          `}
                    style={{
                        animation: 'slideUp 0.3s ease-out',
                    }}
                >
                    <style>{`
            @keyframes slideUp {
              from { opacity: 0; transform: translateY(20px) scale(0.95); }
              to { opacity: 1; transform: translateY(0) scale(1); }
            }
          `}</style>

                    {/* Header */}
                    <div
                        className={`bg-gradient-to-r ${roleConfig.color} px-4 py-3 cursor-pointer`}
                        onClick={() => setIsMinimized(!isMinimized)}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                    <span className="material-icons-outlined text-white text-xl">{roleConfig.avatar}</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-sm">{roleConfig.title}</h3>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                                        <p className="text-[11px] text-white/80">{roleConfig.subtitle}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-1">
                                <button
                                    onClick={(e) => { e.stopPropagation(); clearChat(); }}
                                    className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                                    title="Clear chat"
                                >
                                    <span className="material-icons-outlined text-white/70 text-lg">refresh</span>
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }}
                                    className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                                    title={isMinimized ? 'Expand' : 'Minimize'}
                                >
                                    <span className="material-icons-outlined text-white/70 text-lg">
                                        {isMinimized ? 'expand_less' : 'expand_more'}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Chat Content - Hidden when minimized */}
                    {!isMinimized && (
                        <>
                            {/* Messages Area */}
                            <div className="h-[340px] overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[var(--bg-secondary)]/30">
                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        {message.type === 'bot' && (
                                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[var(--brand-primary)]/20 to-[var(--brand-primary)]/5 flex items-center justify-center mr-2 shrink-0">
                                                <span className="material-icons-outlined text-[var(--brand-primary)] text-sm">{roleConfig.avatar}</span>
                                            </div>
                                        )}
                                        <div
                                            className={`
                        max-w-[75%] rounded-2xl px-4 py-2.5
                        ${message.type === 'user'
                                                    ? 'bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-primary-dark)] text-white rounded-br-md'
                                                    : 'bg-[var(--bg-card)] border border-[var(--border-primary)] text-[var(--text-primary)] rounded-bl-md'
                                                }
                      `}
                                        >
                                            <p className="text-sm leading-relaxed">{message.text}</p>
                                            <p className={`text-[10px] mt-1 ${message.type === 'user' ? 'text-white/60' : 'text-[var(--text-muted)]'}`}>
                                                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                ))}

                                {/* Typing Indicator */}
                                {isTyping && (
                                    <div className="flex justify-start">
                                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[var(--brand-primary)]/20 to-[var(--brand-primary)]/5 flex items-center justify-center mr-2 shrink-0">
                                            <span className="material-icons-outlined text-[var(--brand-primary)] text-sm">{roleConfig.avatar}</span>
                                        </div>
                                        <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl rounded-bl-md px-4 py-3">
                                            <div className="flex gap-1.5">
                                                <span className="w-2 h-2 bg-[var(--brand-primary)] rounded-full animate-bounce" />
                                                <span className="w-2 h-2 bg-[var(--brand-primary)] rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                                                <span className="w-2 h-2 bg-[var(--brand-primary)] rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div ref={messagesEndRef} />
                            </div>

                            {/* Quick Replies */}
                            <div className="px-4 py-2 border-t border-[var(--border-primary)] bg-[var(--bg-card)]">
                                <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
                                    {roleConfig.quickReplies.map((reply) => (
                                        <button
                                            key={reply}
                                            onClick={() => handleSendMessage(reply)}
                                            className="flex-shrink-0 px-3 py-1.5 text-xs font-medium bg-[var(--bg-secondary)] text-[var(--text-secondary)] rounded-full border border-[var(--border-primary)] hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] transition-all"
                                        >
                                            {reply}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Input Area */}
                            <div className="p-3 border-t border-[var(--border-primary)] bg-[var(--bg-card)]">
                                <div className="flex items-center gap-2">
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Ask me anything..."
                                        className="flex-1 px-4 py-2.5 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary)]/20 transition-all"
                                    />
                                    <button
                                        onClick={() => handleSendMessage()}
                                        disabled={!inputValue.trim()}
                                        className="w-10 h-10 bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-primary-dark)] text-white rounded-xl flex items-center justify-center hover:shadow-lg hover:shadow-[var(--brand-primary)]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                                    >
                                        <span className="material-icons-outlined text-lg">send</span>
                                    </button>
                                </div>
                                <p className="text-[10px] text-[var(--text-muted)] text-center mt-2">
                                    Powered by FlowGateX AI • {user?.role ? `${user.role.charAt(0).toUpperCase() + user.role.slice(1)} Mode` : 'Guest Mode'}
                                </p>
                            </div>
                        </>
                    )}
                </div>
            )}
        </>
    );
};

export default AIChatAssistant;
