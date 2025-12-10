import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@context/AuthContext';
import authService from '@/services/api/authService';
import '@styles/index.css';
import '@styles/Auth.css';

// ===========================
// CONSTANTS & REGEX
// ===========================
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[\d\s-]{10,}$/;

// ===========================
// MATERIAL ICON COMPONENT (Using Google Material Icons CDN)
// ===========================
const Icon = ({ name, outlined = false, className = '', size = 20 }) => (
    <span
        className={`${outlined ? 'material-icons-outlined' : 'material-icons'} ${className}`}
        style={{ fontSize: size }}
    >
        {name}
    </span>
);

// ===========================
// TOAST COMPONENT
// ===========================
const Toast = ({ message, type }) => (
    <div
        className={`toast flex items-center gap-3 px-5 py-4 rounded-xl ${type === 'success'
            ? 'bg-gradient-to-r from-green-500 to-emerald-600'
            : 'bg-gradient-to-r from-red-500 to-rose-600'
            } text-white shadow-2xl`}
    >
        <Icon name={type === 'success' ? 'check_circle' : 'error'} outlined />
        <span className="font-medium">{message}</span>
    </div>
);

// ===========================
// INPUT COMPONENT
// ===========================
const InputField = ({
    icon,
    type = 'text',
    id,
    value,
    onChange,
    placeholder,
    error,
    showPasswordToggle,
    showPassword,
    onTogglePassword,
}) => (
    <div className="space-y-1.5">
        <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] transition-colors group-focus-within:text-[var(--accent)]">
                <Icon name={icon} outlined size={20} />
            </div>
            <input
                type={showPasswordToggle ? (showPassword ? 'text' : 'password') : type}
                id={id}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`
                    w-full bg-[var(--input-bg)] text-[var(--text-primary)] 
                    pl-12 ${showPasswordToggle ? 'pr-12' : 'pr-4'} py-3.5
                    rounded-xl border-2 transition-all duration-200
                    placeholder:text-[var(--text-muted)]
                    focus:outline-none focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--primary-100)]
                    hover:border-[var(--border-hover)]
                    ${error ? 'border-[var(--error)] focus:border-[var(--error)] focus:ring-[var(--error-light)]' : 'border-[var(--border-primary)]'}
                `}
            />
            {showPasswordToggle && (
                <button
                    type="button"
                    onClick={onTogglePassword}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                >
                    <Icon name={showPassword ? 'visibility_off' : 'visibility'} outlined size={20} />
                </button>
            )}
        </div>
        {error && (
            <p className="text-[var(--error)] text-sm flex items-center gap-1.5 pl-1">
                <Icon name="error" outlined size={16} />
                {error}
            </p>
        )}
    </div>
);

// ===========================
// BUTTON COMPONENT
// ===========================
const Button = ({ children, variant = 'primary', disabled, loading, className = '', ...props }) => {
    const baseStyles = `
        w-full font-semibold py-3.5 px-6 rounded-xl
        flex items-center justify-center gap-2
        transition-all duration-300 transform
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        focus:outline-none focus:ring-4
    `;

    const variants = {
        primary: `
            bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)]
            text-white shadow-lg shadow-[var(--primary)]/25
            hover:shadow-xl hover:shadow-[var(--primary)]/30 hover:-translate-y-0.5
            focus:ring-[var(--primary-200)]
            active:translate-y-0
        `,
        secondary: `
            bg-[var(--bg-tertiary)] text-[var(--text-primary)]
            border-2 border-[var(--border-primary)]
            hover:bg-[var(--bg-hover)] hover:border-[var(--border-hover)]
            focus:ring-[var(--primary-100)]
        `,
        ghost: `
            bg-transparent text-[var(--text-muted)]
            hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]
            focus:ring-[var(--primary-100)]
        `,
    };

    return (
        <button
            disabled={disabled || loading}
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {loading ? (
                <>
                    <Icon name="sync" className="animate-spin" size={20} />
                    <span>Processing...</span>
                </>
            ) : (
                children
            )}
        </button>
    );
};

// ===========================
// SOCIAL LOGIN BUTTON
// ===========================
const SocialButton = ({ provider, icon, onClick }) => (
    <button
        type="button"
        onClick={() => onClick(provider)}
        className="
            flex-1 flex items-center justify-center gap-2.5 py-3 px-4
            bg-[var(--bg-tertiary)] border-2 border-[var(--border-primary)]
            rounded-xl text-[var(--text-primary)] font-medium
            transition-all duration-200
            hover:bg-[var(--bg-hover)] hover:border-[var(--border-hover)] hover:-translate-y-0.5
            focus:outline-none focus:ring-4 focus:ring-[var(--primary-100)]
        "
    >
        <img src={icon} alt={provider} className="w-5 h-5" />
        <span className="text-sm">{provider}</span>
    </button>
);

// ===========================
// PASSWORD STRENGTH INDICATOR
// ===========================
const PasswordStrength = ({ strength }) => {
    const strengthConfig = {
        0: {
            width: '0%',
            color: 'bg-[var(--border-primary)]',
            text: 'Enter a password',
            textColor: 'text-[var(--text-muted)]',
        },
        1: { width: '25%', color: 'bg-[var(--error)]', text: 'Weak', textColor: 'text-[var(--error)]' },
        2: {
            width: '50%',
            color: 'bg-[var(--warning)]',
            text: 'Fair',
            textColor: 'text-[var(--warning)]',
        },
        3: { width: '75%', color: 'bg-[var(--info)]', text: 'Good', textColor: 'text-[var(--info)]' },
        4: {
            width: '100%',
            color: 'bg-[var(--success)]',
            text: 'Strong',
            textColor: 'text-[var(--success)]',
        },
    };

    const config = strengthConfig[strength] || strengthConfig[0];

    return (
        <div className="space-y-1.5">
            <div className="h-1.5 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                <div
                    className={`h-full ${config.color} transition-all duration-500 ease-out rounded-full`}
                    style={{ width: config.width }}
                />
            </div>
            <p className={`text-xs font-medium ${config.textColor}`}>{config.text}</p>
        </div>
    );
};

// ===========================
// SEGMENTED PROGRESS BAR
// ===========================
const SegmentedProgressBar = ({ currentStep, totalSteps = 3 }) => {
    const percentage = Math.round((currentStep / totalSteps) * 100);
    const isComplete = currentStep >= totalSteps;

    return (
        <div className="mb-8">
            <div className="flex items-center gap-x-1.5">
                {Array.from({ length: totalSteps }).map((_, i) => (
                    <div
                        key={i}
                        className={`
                            w-full h-2.5 rounded-sm flex flex-col justify-center overflow-hidden 
                            text-xs text-white text-center whitespace-nowrap 
                            transition-all duration-500 ease-out
                            ${i + 1 <= currentStep
                                ? 'bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] shadow-sm shadow-[var(--primary)]/30'
                                : 'bg-[var(--border-primary)]'
                            }
                        `}
                        role="progressbar"
                        aria-valuenow={i + 1 <= currentStep ? 100 : 0}
                        aria-valuemin={0}
                        aria-valuemax={100}
                    />
                ))}
                <div className="ml-2 shrink-0">
                    {isComplete ? (
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white shadow-lg shadow-[var(--primary)]/30">
                            <Icon name="check" size={14} />
                        </span>
                    ) : (
                        <span className="text-sm font-semibold text-[var(--text-secondary)] min-w-[40px] text-right">
                            {percentage}%
                        </span>
                    )}
                </div>
            </div>
            <div className="flex justify-between mt-2 px-0.5">
                {Array.from({ length: totalSteps }).map((_, i) => (
                    <span
                        key={i}
                        className={`text-xs font-medium transition-colors duration-300 ${i + 1 <= currentStep ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'
                            }`}
                    >
                        {i === 0 ? 'Info' : i === 1 ? 'Security' : 'Verify'}
                    </span>
                ))}
            </div>
        </div>
    );
};

// ===========================
// MAIN AUTH COMPONENT
// ===========================
const Auth = ({ initialView = 'login' }) => {
    const navigate = useNavigate();
    const { setAuthUser } = useAuthContext();

    // UI & Theme State
    const [theme, setTheme] = useState('dark');
    const [currentView, setCurrentView] = useState(initialView);
    const [isLoading, setIsLoading] = useState(false);
    const [toasts, setToasts] = useState([]);

    // Form Data
    const [loginData, setLoginData] = useState({ identifier: '', password: '', rememberMe: false });
    const [registerData, setRegisterData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: '',
        password: '',
        confirmPassword: '',
        terms: false,
        otp: Array(6).fill(''),
    });
    const [forgotData, setForgotData] = useState({
        email: '',
        otp: '',
        newPassword: '',
        confirmPassword: '',
    });

    // Flow Control
    const [registerStep, setRegisterStep] = useState(1);
    const [forgotStep, setForgotStep] = useState(1);
    const [resendTimer, setResendTimer] = useState(0);

    // Validation & UI State
    const [errors, setErrors] = useState({});
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [showPassword, setShowPassword] = useState({ login: false, reg: false, forgot: false });

    // Carousel
    const [carouselIndex, setCarouselIndex] = useState(0);
    const [fadeText, setFadeText] = useState(true);

    // Refs
    const otpRefs = useRef([]);

    // Constants
    const messages = [
        {
            title: 'Seamless',
            highlight: 'Entry',
            desc: 'Managing thousands of entries per minute with AI precision.',
        },
        {
            title: 'Professional',
            highlight: 'Events',
            desc: 'Smart, secure, and streamlined access for VIPs and staff.',
        },
        {
            title: 'Real-time',
            highlight: 'Analytics',
            desc: 'Monitor crowd flow and security data instantly.',
        },
        {
            title: 'Intelligent',
            highlight: 'Security',
            desc: 'Automated threat detection and live capacity management.',
        },
        {
            title: 'Global',
            highlight: 'Scale',
            desc: 'Synchronize multi-venue events across time zones effortlessly.',
        },
    ];

    // Use memoized regex patterns
    const emailRegex = useMemo(() => EMAIL_REGEX, []);
    const phoneRegex = useMemo(() => PHONE_REGEX, []);

    // ===========================
    // EFFECTS
    // ===========================
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        setTheme(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setFadeText(false);
            setTimeout(() => {
                setCarouselIndex((prev) => (prev + 1) % messages.length);
                setFadeText(true);
            }, 400);
        }, 5000);
        return () => clearInterval(interval);
    }, [messages.length]);

    useEffect(() => {
        if (resendTimer > 0) {
            const interval = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
            return () => clearInterval(interval);
        }
    }, [resendTimer]);

    useEffect(() => {
        const val = registerData.password;
        let strength = 0;
        if (val.length >= 8) strength++;
        if (/[A-Z]/.test(val)) strength++;
        if (/[0-9]/.test(val)) strength++;
        if (/[^A-Za-z0-9]/.test(val)) strength++;
        setPasswordStrength(val.length === 0 ? 0 : strength);
    }, [registerData.password]);

    // ===========================
    // HANDLERS
    // ===========================
    const toggleTheme = useCallback(() => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    }, [theme]);

    const addToast = useCallback((message, type = 'success') => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
    }, []);

    const handleInputChange = useCallback(
        (e, formType) => {
            const { id, value, type, checked } = e.target;
            const val = type === 'checkbox' ? checked : value;

            if (errors[id]) {
                setErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors[id];
                    return newErrors;
                });
            }

            const setters = {
                login: setLoginData,
                register: setRegisterData,
                forgot: setForgotData,
            };

            setters[formType]?.((prev) => ({ ...prev, [id]: val }));
        },
        [errors]
    );

    const handleOtpChange = useCallback((e, index) => {
        const val = e.target.value;
        if (/[^0-9]/.test(val)) return;

        setRegisterData((prev) => {
            const newOtp = [...prev.otp];
            newOtp[index] = val;
            return { ...prev, otp: newOtp };
        });

        if (val && index < 5) otpRefs.current[index + 1]?.focus();
    }, []);

    const handleOtpKeyDown = useCallback(
        (e, index) => {
            if (e.key === 'Backspace' && !registerData.otp[index] && index > 0) {
                otpRefs.current[index - 1]?.focus();
            }
        },
        [registerData.otp]
    );

    const handleSocialLogin = useCallback(
        (provider) => {
            addToast(`Connecting to ${provider}... `, 'success');
        },
        [addToast]
    );

    const handleRegisterNext = useCallback(
        (targetStep) => {
            const newErrors = {};

            if (registerStep === 1) {
                if (registerData.firstName.trim().length < 2) newErrors.firstName = 'First name must be at least 2 characters';
                if (registerData.lastName.trim().length < 2) newErrors.lastName = 'Last name must be at least 2 characters';
                if (!emailRegex.test(registerData.email)) newErrors.email = 'Invalid email address';
                if (!phoneRegex.test(registerData.phone)) newErrors.phone = 'Invalid phone number';
            }

            if (registerStep === 2 && targetStep === 3) {
                if (!registerData.role) newErrors.role = 'Please select a role';
                if (registerData.password.length < 8)
                    newErrors.password = 'Password must be at least 8 characters';
                if (registerData.password !== registerData.confirmPassword)
                    newErrors.confirmPassword = 'Passwords do not match';
                if (!registerData.terms) newErrors.terms = 'You must agree to the terms';
            }

            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
                return;
            }

            setRegisterStep(targetStep);
        },
        [registerStep, registerData, emailRegex, phoneRegex]
    );

    const handleLoginSubmit = useCallback(
        async (e) => {
            e.preventDefault();
            setErrors({});

            const email = (loginData.identifier || '').trim().toLowerCase();
            const password = (loginData.password || '').trim();

            // Validation
            if (!email || !emailRegex.test(email)) {
                setErrors({ identifier: 'Please enter a valid email address.' });
                return;
            }

            if (!password || password.length < 8) {
                setErrors({ password: 'Password must be at least 8 characters.' });
                return;
            }

            setIsLoading(true);

            // ===========================
            // TEST ACCOUNTS FOR DEVELOPMENT
            // ===========================
            const testAccounts = {
                'admin@flowgatex.com': {
                    password: 'admin@123',
                    user: {
                        id: 'test-admin-001',
                        firstName: 'Admin',
                        lastName: 'User',
                        email: 'admin@flowgatex.com',
                        role: 'admin',
                        avatar: null,
                        name: 'Admin User',
                    },
                },
                'organizer@flowgatex.com': {
                    password: 'organizer@123',
                    user: {
                        id: 'test-organizer-001',
                        firstName: 'Organizer',
                        lastName: 'User',
                        email: 'organizer@flowgatex.com',
                        role: 'organizer',
                        avatar: null,
                        name: 'Organizer User',
                    },
                },
                'user@flowgatex.com': {
                    password: 'user@123',
                    user: {
                        id: 'test-user-001',
                        firstName: 'Test',
                        lastName: 'User',
                        email: 'user@flowgatex.com',
                        role: 'user',
                        avatar: null,
                        name: 'Test User',
                    },
                },
                // Mekesh's test accounts
                'mekesh.engineer@gmail.com': {
                    passwords: {
                        'admin@123': {
                            id: 'mekesh-admin-001',
                            firstName: 'Mekesh',
                            lastName: 'Kumar',
                            email: 'mekesh.engineer@gmail.com',
                            role: 'admin',
                            avatar: null,
                            name: 'Mekesh Kumar',
                        },
                        'organizer@123': {
                            id: 'mekesh-organizer-001',
                            firstName: 'Mekesh',
                            lastName: 'Kumar',
                            email: 'mekesh.engineer@gmail.com',
                            role: 'organizer',
                            avatar: null,
                            name: 'Mekesh Kumar',
                        },
                        'user@123': {
                            id: 'mekesh-user-001',
                            firstName: 'Mekesh',
                            lastName: 'Kumar',
                            email: 'mekesh.engineer@gmail.com',
                            role: 'user',
                            avatar: null,
                            name: 'Mekesh Kumar',
                        },
                    },
                },
            };

            // Check for test accounts first
            const testAccount = testAccounts[email];
            if (testAccount) {
                // Handle multi-password account (mekesh.engineer@gmail.com)
                if (testAccount.passwords) {
                    const matchedUser = testAccount.passwords[password];
                    if (matchedUser) {
                        const token = 'test-token-' + matchedUser.role;

                        // Use AuthContext to properly set the user
                        setAuthUser(matchedUser, token);

                        addToast(`Welcome back, ${matchedUser.firstName}! (${matchedUser.role})`, 'success');

                        if (window.confetti) {
                            window.confetti({
                                particleCount: 150,
                                spread: 70,
                                origin: { y: 0.6 },
                                colors: ['#eb1616', '#ffffff', '#FFD700'],
                            });
                        }

                        const routes = {
                            admin: '/admin/dashboard',
                            organizer: '/organizer/dashboard',
                            user: '/dashboard',
                        };

                        setTimeout(() => {
                            navigate(routes[matchedUser.role] || '/dashboard');
                            setIsLoading(false);
                        }, 1000);
                        return;
                    }
                }
                // Handle single password accounts
                else if (testAccount.password === password) {
                    const token = 'test-token-' + testAccount.user.role;

                    // Use AuthContext to properly set the user
                    setAuthUser(testAccount.user, token);

                    addToast(`Welcome back, ${testAccount.user.firstName}!`, 'success');

                    if (window.confetti) {
                        window.confetti({
                            particleCount: 150,
                            spread: 70,
                            origin: { y: 0.6 },
                            colors: ['#eb1616', '#ffffff', '#FFD700'],
                        });
                    }

                    const routes = {
                        admin: '/admin/dashboard',
                        organizer: '/organizer/dashboard',
                        user: '/dashboard',
                    };

                    setTimeout(() => {
                        navigate(routes[testAccount.user.role] || '/dashboard');
                        setIsLoading(false);
                    }, 1000);
                    return;
                }
            }

            try {
                // Call MongoDB backend API
                const response = await authService.login({ email, password });

                if (response.success && response.data) {
                    const { user } = response.data;

                    // Store token (already done in authService)
                    // Store user data
                    localStorage.setItem('user', JSON.stringify(user));
                    setAuthUser(user, response.data.token);

                    addToast(`Welcome back, ${user.firstName}!`, 'success');

                    // Confetti effect
                    if (window.confetti) {
                        window.confetti({
                            particleCount: 150,
                            spread: 70,
                            origin: { y: 0.6 },
                            colors: ['#eb1616', '#ffffff', '#FFD700'],
                        });
                    }

                    // Navigate based on role
                    setTimeout(() => {
                        const routes = {
                            admin: '/admin',
                            organizer: '/organizer',
                            user: '/home',
                        };
                        navigate(routes[user.role] || '/home');
                    }, 1500);
                } else {
                    addToast(response.message || 'Login failed', 'error');
                }
            } catch (error) {
                console.error('Login error:', error);
                const errorMessage =
                    error.data?.message || error.message || 'Login failed. Please try again.';
                addToast(errorMessage, 'error');
                setErrors({ general: errorMessage });
            } finally {
                setIsLoading(false);
            }
        },
        [loginData, addToast, navigate, emailRegex, setAuthUser]
    );

    const handleRegisterSubmit = useCallback(
        async (e) => {
            e.preventDefault();

            // Final validation
            const newErrors = {};

            if (!registerData.firstName || registerData.firstName.trim().length < 2) {
                newErrors.firstName = 'First name must be at least 2 characters';
            }

            if (!registerData.lastName || registerData.lastName.trim().length < 2) {
                newErrors.lastName = 'Last name must be at least 2 characters';
            }

            if (!emailRegex.test(registerData.email)) {
                newErrors.email = 'Invalid email address';
            }

            if (!phoneRegex.test(registerData.phone)) {
                newErrors.phone = 'Invalid phone number';
            }

            if (!registerData.role) {
                newErrors.role = 'Please select a role';
            }

            if (registerData.password.length < 8) {
                newErrors.password = 'Password must be at least 8 characters';
            }

            if (registerData.password !== registerData.confirmPassword) {
                newErrors.confirmPassword = 'Passwords do not match';
            }

            if (!registerData.terms) {
                newErrors.terms = 'You must agree to the terms';
            }

            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
                return;
            }

            setIsLoading(true);

            try {
                // Prepare registration data
                const userData = {
                    firstName: registerData.firstName.trim(),
                    lastName: registerData.lastName.trim(),
                    email: registerData.email.trim().toLowerCase(),
                    phone: registerData.phone.trim(),
                    password: registerData.password,
                    role: registerData.role,
                };

                // Call MongoDB backend API
                const response = await authService.register(userData);

                if (response.success && response.data) {
                    const { user } = response.data;

                    // Store user data
                    localStorage.setItem('user', JSON.stringify(user));
                    setAuthUser(user, response.data.token);

                    addToast('Account created successfully! 🎉', 'success');

                    // Confetti effect
                    if (window.confetti) {
                        window.confetti({
                            particleCount: 200,
                            spread: 100,
                            origin: { y: 0.6 },
                            colors: ['#eb1616', '#ffffff', '#FFD700'],
                        });
                    }

                    // Navigate based on role
                    setTimeout(() => {
                        const routes = {
                            admin: '/admin',
                            organizer: '/organizer',
                            user: '/home',
                        };
                        navigate(routes[user.role] || '/home');
                    }, 1500);
                } else {
                    addToast(response.message || 'Registration failed', 'error');
                }
            } catch (error) {
                console.error('Registration error:', error);
                const errorMessage =
                    error.data?.message || error.message || 'Registration failed. Please try again.';

                // Handle specific error scenarios
                if (errorMessage.includes('already exists')) {
                    setErrors({ email: 'This email is already registered' });
                }

                addToast(errorMessage, 'error');
                setErrors({ general: errorMessage });
            } finally {
                setIsLoading(false);
            }
        },
        [registerData, addToast, navigate, emailRegex, phoneRegex, setAuthUser]
    );

    const handleForgotSendOtp = useCallback(() => {
        if (!emailRegex.test(forgotData.email)) {
            setErrors({ forgotEmail: 'Please enter a valid email address.' });
            return;
        }
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setForgotStep(2);
            setResendTimer(30);
            addToast('Verification code sent! ', 'success');
        }, 1000);
    }, [forgotData.email, addToast, emailRegex]);

    const handleForgotResetSubmit = useCallback(
        (e) => {
            e.preventDefault();
            setIsLoading(true);
            setTimeout(() => {
                setIsLoading(false);
                addToast('Password reset successfully!', 'success');
                setCurrentView('login');
                setForgotStep(1);
            }, 1500);
        },
        [addToast]
    );

    // ===========================
    // RENDER
    // ===========================
    return (
        <>
            {/* Toast Container */}
            <div className="fixed top-6 right-6 z-[var(--z-toast)] flex flex-col gap-3 pointer-events-none">
                {toasts.map((toast) => (
                    <Toast key={toast.id} {...toast} />
                ))}
            </div>

            <main className="flex min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans">
                {/* Left Section - Hero */}
                <section className="hidden lg:flex lg:w-1/2 relative bg-black overflow-hidden">
                    {/* Video Background */}
                    <div className="absolute inset-0">
                        <video
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="w-full h-full object-cover opacity-50"
                        >
                            <source src="src/assets/Video/Authen.mp4" type="video/mp4" />
                        </video>
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />
                        <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/10 to-transparent" />
                    </div>

                    {/* Logo */}
                    <div className="absolute top-8 left-8 z-20 flex items-center gap-3">
                        <div className="relative">
                            <div className="absolute inset-0 bg-[var(--primary)] blur-xl opacity-50 animate-pulse" />
                            <Icon name="auto_awesome" className="relative text-[var(--accent)]" size={40} />
                        </div>
                        <span className="text-3xl font-display font-bold tracking-wider text-white">
                            FlowGate<span className="text-[var(--accent)]">X</span>
                        </span>
                    </div>

                    {/* Carousel Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-12 z-10">
                        <div
                            className={`transition-all duration-500 ${fadeText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                        >
                            <h1 className="text-5xl font-display font-bold mb-4 text-white">
                                {messages[carouselIndex].title}{' '}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]">
                                    {messages[carouselIndex].highlight}
                                </span>
                            </h1>
                            <p className="text-xl text-gray-300 max-w-md">{messages[carouselIndex].desc}</p>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-10 h-1 bg-white/20 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] rounded-full transition-all ease-linear"
                                style={{
                                    width: fadeText ? '100%' : '0%',
                                    transitionDuration: fadeText ? '4600ms' : '0ms',
                                }}
                            />
                        </div>

                        {/* Dots */}
                        <div className="flex gap-2 mt-6">
                            {messages.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => {
                                        setFadeText(false);
                                        setTimeout(() => {
                                            setCarouselIndex(i);
                                            setFadeText(true);
                                        }, 400);
                                    }}
                                    className={`w-2 h-2 rounded-full transition-all duration-300 ${i === carouselIndex ? 'w-8 bg-[var(--accent)]' : 'bg-white/40 hover:bg-white/60'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-[var(--primary)]/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-[var(--accent)]/10 rounded-full blur-2xl" />
                </section>

                {/* Right Section - Forms */}
                <section className="w-full lg:w-1/2 flex items-center justify-center p-8 relative bg-[var(--bg-surface)]">
                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="absolute top-6 right-6 p-3 rounded-xl bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-all duration-200"
                        aria-label="Toggle theme"
                    >
                        <Icon name={theme === 'dark' ? 'light_mode' : 'dark_mode'} outlined size={20} />
                    </button>

                    <div className="w-full max-w-md">
                        {/* ===== LOGIN VIEW ===== */}
                        {currentView === 'login' && (
                            <div className="auth-view">
                                {/* Header */}
                                <div className="text-center mb-10">
                                    <div className="flex items-center justify-center gap-2 mb-3">
                                        <Icon name="auto_awesome" className="text-[var(--accent)]" size={32} />
                                        <h2 className="text-3xl font-display font-bold">
                                            FlowGate<span className="text-[var(--accent)]">X</span>
                                        </h2>
                                    </div>
                                    <p className="text-[var(--text-muted)]">Intelligent Access Control</p>
                                </div>

                                <div className="mb-8">
                                    <h3 className="text-2xl font-bold mb-2">Welcome back</h3>
                                    <p className="text-[var(--text-muted)]">Please enter your details to sign in. </p>
                                </div>

                                <form onSubmit={handleLoginSubmit} className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">
                                            Email Address
                                        </label>
                                        <InputField
                                            icon="mail"
                                            type="email"
                                            id="identifier"
                                            value={loginData.identifier}
                                            onChange={(e) => handleInputChange(e, 'login')}
                                            placeholder="you@example.com"
                                            error={errors.identifier}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">
                                            Password
                                        </label>
                                        <InputField
                                            icon="lock"
                                            id="password"
                                            value={loginData.password}
                                            onChange={(e) => handleInputChange(e, 'login')}
                                            placeholder="••••••••"
                                            error={errors.password}
                                            showPasswordToggle
                                            showPassword={showPassword.login}
                                            onTogglePassword={() => setShowPassword((p) => ({ ...p, login: !p.login }))}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <label className="flex items-center gap-2.5 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                id="rememberMe"
                                                checked={loginData.rememberMe}
                                                onChange={(e) => handleInputChange(e, 'login')}
                                                className="w-4 h-4 rounded border-2 border-[var(--border-primary)] bg-[var(--input-bg)] checked:bg-[var(--accent)] checked:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-0 transition-colors cursor-pointer"
                                                style={{
                                                    accentColor: 'var(--accent)',
                                                    colorScheme: theme === 'dark' ? 'dark' : 'light',
                                                }}
                                            />
                                            <span className="text-sm text-[var(--text-muted)] group-hover:text-[var(--text-secondary)] transition-colors">
                                                Remember me
                                            </span>
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => setCurrentView('forgot')}
                                            className="text-sm text-[var(--accent)] hover:text-[var(--primary-hover)] font-medium transition-colors"
                                        >
                                            Forgot password?
                                        </button>
                                    </div>

                                    <Button type="submit" loading={isLoading}>
                                        <Icon name="shield" outlined size={20} />
                                        Sign In
                                    </Button>
                                </form>

                                {/* Divider */}
                                <div className="relative my-8">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-[var(--border-primary)]" />
                                    </div>
                                    <div className="relative flex justify-center">
                                        <span className="bg-[var(--bg-surface)] px-4 text-sm text-[var(--text-muted)]">
                                            Or continue with
                                        </span>
                                    </div>
                                </div>

                                {/* Social Login */}
                                <div className="flex gap-4">
                                    <SocialButton
                                        provider="Google"
                                        icon="https://www.svgrepo.com/show/475656/google-color.svg"
                                        onClick={handleSocialLogin}
                                    />
                                    <SocialButton
                                        provider="GitHub"
                                        icon="https://www.svgrepo.com/show/512317/github-142.svg"
                                        onClick={handleSocialLogin}
                                    />
                                </div>

                                <p className="mt-8 text-center text-[var(--text-muted)]">
                                    Don&apos;t have an account?{' '}
                                    <button
                                        onClick={() => setCurrentView('register')}
                                        className="text-[var(--accent)] font-semibold hover:underline"
                                    >
                                        Sign up
                                    </button>
                                </p>
                            </div>
                        )}

                        {/* ===== REGISTER VIEW ===== */}
                        {currentView === 'register' && (
                            <div className="auth-view">
                                <div className="text-center mb-6">
                                    <div className="flex items-center justify-center gap-2 mb-3">
                                        <Icon name="auto_awesome" className="text-[var(--accent)]" size={32} />
                                        <h2 className="text-3xl font-display font-bold">
                                            FlowGate<span className="text-[var(--accent)]">X</span>
                                        </h2>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h3 className="text-2xl font-bold mb-2">Create Account</h3>
                                    <p className="text-[var(--text-muted)]">
                                        Join FlowGate for seamless access control.{' '}
                                    </p>
                                </div>

                                <SegmentedProgressBar currentStep={registerStep} />

                                <form onSubmit={handleRegisterSubmit} className="space-y-5">
                                    {/* Step 1: Personal Info */}
                                    {registerStep === 1 && (
                                        <div className="space-y-4 auth-view">
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">
                                                        First Name
                                                    </label>
                                                    <InputField
                                                        icon="person"
                                                        id="firstName"
                                                        value={registerData.firstName}
                                                        onChange={(e) => handleInputChange(e, 'register')}
                                                        placeholder="John"
                                                        error={errors.firstName}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">
                                                        Last Name
                                                    </label>
                                                    <InputField
                                                        icon="person"
                                                        id="lastName"
                                                        value={registerData.lastName}
                                                        onChange={(e) => handleInputChange(e, 'register')}
                                                        placeholder="Doe"
                                                        error={errors.lastName}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">
                                                    Email Address
                                                </label>
                                                <InputField
                                                    icon="mail"
                                                    type="email"
                                                    id="email"
                                                    value={registerData.email}
                                                    onChange={(e) => handleInputChange(e, 'register')}
                                                    placeholder="john@example.com"
                                                    error={errors.email}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">
                                                    Phone Number
                                                </label>
                                                <InputField
                                                    icon="phone"
                                                    type="tel"
                                                    id="phone"
                                                    value={registerData.phone}
                                                    onChange={(e) => handleInputChange(e, 'register')}
                                                    placeholder="+1 234 567 890"
                                                    error={errors.phone}
                                                />
                                            </div>
                                            <Button type="button" onClick={() => handleRegisterNext(2)}>
                                                Continue
                                            </Button>
                                        </div>
                                    )}

                                    {/* Step 2: Security */}
                                    {registerStep === 2 && (
                                        <div className="space-y-4 auth-view">
                                            <div>
                                                <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">
                                                    Select Role
                                                </label>
                                                <select
                                                    id="role"
                                                    value={registerData.role}
                                                    onChange={(e) => handleInputChange(e, 'register')}
                                                    className={`
                                                        w-full bg-[var(--input-bg)] text-[var(--text-primary)] px-4 py-3.5
                                                        rounded-xl border-2 transition-all duration-200
                                                        focus:outline-none focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--primary-100)]
                                                        ${errors.role ? 'border-[var(--error)]' : 'border-[var(--border-primary)]'}
                                                    `}
                                                >
                                                    <option value="">Choose a role</option>
                                                    <option value="user">Attendee</option>
                                                    <option value="organizer">Organizer</option>
                                                    <option value="admin">Administrator</option>
                                                </select>
                                                {errors.role && (
                                                    <p className="text-[var(--error)] text-sm mt-1.5">{errors.role}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">
                                                    Create Password
                                                </label>
                                                <InputField
                                                    icon="lock"
                                                    id="password"
                                                    value={registerData.password}
                                                    onChange={(e) => handleInputChange(e, 'register')}
                                                    placeholder="••••••••"
                                                    error={errors.password}
                                                    showPasswordToggle
                                                    showPassword={showPassword.reg}
                                                    onTogglePassword={() => setShowPassword((p) => ({ ...p, reg: !p.reg }))}
                                                />
                                                <div className="mt-3">
                                                    <PasswordStrength strength={passwordStrength} />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">
                                                    Confirm Password
                                                </label>
                                                <InputField
                                                    icon="lock"
                                                    id="confirmPassword"
                                                    value={registerData.confirmPassword}
                                                    onChange={(e) => handleInputChange(e, 'register')}
                                                    placeholder="••••••••"
                                                    error={errors.confirmPassword}
                                                    showPasswordToggle={false}
                                                />
                                            </div>

                                            <label className="flex items-start gap-3 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    id="terms"
                                                    checked={registerData.terms}
                                                    onChange={(e) => handleInputChange(e, 'register')}
                                                    className="mt-0.5 w-4 h-4 rounded border-2 border-[var(--border-primary)] bg-[var(--input-bg)] text-[var(--accent)]"
                                                />
                                                <span className="text-sm text-[var(--text-muted)]">
                                                    I agree to the{' '}
                                                    <a href="#" className="text-[var(--accent)] hover:underline">
                                                        Terms & Conditions
                                                    </a>{' '}
                                                    and{' '}
                                                    <a href="#" className="text-[var(--accent)] hover:underline">
                                                        Privacy Policy
                                                    </a>
                                                </span>
                                            </label>
                                            {errors.terms && (
                                                <p className="text-[var(--error)] text-sm">{errors.terms}</p>
                                            )}

                                            <div className="flex gap-3">
                                                <Button
                                                    type="button"
                                                    variant="secondary"
                                                    onClick={() => setRegisterStep(1)}
                                                    className="w-1/3"
                                                >
                                                    Back
                                                </Button>
                                                <Button
                                                    type="button"
                                                    onClick={() => handleRegisterNext(3)}
                                                    className="w-2/3"
                                                >
                                                    Continue
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Step 3: OTP Verification */}
                                    {registerStep === 3 && (
                                        <div className="space-y-6 auth-view text-center">
                                            <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-[var(--primary-100)] to-[var(--primary-200)] flex items-center justify-center">
                                                <Icon name="mail" outlined className="text-[var(--accent)]" size={40} />
                                            </div>

                                            <div>
                                                <h4 className="text-xl font-bold mb-2">Verify Your Email</h4>
                                                <p className="text-sm text-[var(--text-muted)]">
                                                    We&apos;ve sent a 6-digit code to{' '}
                                                    <span className="text-[var(--accent)] font-medium">
                                                        {registerData.email}
                                                    </span>
                                                </p>
                                            </div>

                                            <div className="flex gap-2 justify-center">
                                                {registerData.otp.map((digit, index) => (
                                                    <input
                                                        key={index}
                                                        ref={(el) => (otpRefs.current[index] = el)}
                                                        type="text"
                                                        inputMode="numeric"
                                                        maxLength={1}
                                                        value={digit}
                                                        onChange={(e) => handleOtpChange(e, index)}
                                                        onKeyDown={(e) => handleOtpKeyDown(e, index)}
                                                        className="otp-input w-12 h-14 text-center text-xl font-bold bg-[var(--input-bg)] border-2 border-[var(--border-primary)] rounded-xl focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--primary-100)] focus:outline-none transition-all"
                                                    />
                                                ))}
                                            </div>

                                            <p className="text-sm text-[var(--text-muted)]">
                                                Didn&apos;t receive code?{' '}
                                                {resendTimer > 0 ? (
                                                    <span className="text-[var(--text-muted)]">Resend in {resendTimer}s</span>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={() => setResendTimer(30)}
                                                        className="text-[var(--accent)] font-semibold hover:underline"
                                                    >
                                                        Resend
                                                    </button>
                                                )}
                                            </p>

                                            <div className="flex gap-3">
                                                <Button
                                                    type="button"
                                                    variant="secondary"
                                                    onClick={() => setRegisterStep(2)}
                                                    className="w-1/3"
                                                >
                                                    Back
                                                </Button>
                                                <Button type="submit" loading={isLoading} className="w-2/3">
                                                    Create Account
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </form>

                                <p className="mt-8 text-center text-[var(--text-muted)]">
                                    Already have an account?{' '}
                                    <button
                                        onClick={() => {
                                            setCurrentView('login');
                                            setRegisterStep(1);
                                        }}
                                        className="text-[var(--accent)] font-semibold hover:underline"
                                    >
                                        Sign in
                                    </button>
                                </p>
                            </div>
                        )}

                        {/* ===== FORGOT PASSWORD VIEW ===== */}
                        {currentView === 'forgot' && (
                            <div className="auth-view">
                                <button
                                    onClick={() => {
                                        setCurrentView('login');
                                        setForgotStep(1);
                                    }}
                                    className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] mb-8 transition-colors"
                                >
                                    <Icon name="arrow_back" size={20} />
                                    <span>Back to Login</span>
                                </button>

                                <div className="text-center mb-6">
                                    <div className="flex items-center justify-center gap-2 mb-3">
                                        <Icon name="auto_awesome" className="text-[var(--accent)]" size={32} />
                                        <h2 className="text-3xl font-display font-bold">
                                            FlowGate<span className="text-[var(--accent)]">X</span>
                                        </h2>
                                    </div>
                                </div>

                                <div className="mb-8">
                                    <h3 className="text-2xl font-bold mb-2">Reset Password</h3>
                                    <p className="text-[var(--text-muted)]">
                                        {forgotStep === 1
                                            ? 'Enter your email to receive a verification code.'
                                            : 'Create your new password. '}
                                    </p>
                                </div>

                                <form className="space-y-5">
                                    {forgotStep === 1 && (
                                        <div className="space-y-5 auth-view">
                                            <div>
                                                <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">
                                                    Email Address
                                                </label>
                                                <InputField
                                                    icon="mail"
                                                    type="email"
                                                    id="email"
                                                    value={forgotData.email}
                                                    onChange={(e) => handleInputChange(e, 'forgot')}
                                                    placeholder="you@example.com"
                                                    error={errors.forgotEmail}
                                                />
                                            </div>
                                            <Button type="button" onClick={handleForgotSendOtp} loading={isLoading}>
                                                Send Verification Code
                                            </Button>
                                        </div>
                                    )}

                                    {forgotStep === 2 && (
                                        <div className="space-y-5 auth-view">
                                            <div>
                                                <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">
                                                    Verification Code
                                                </label>
                                                <div className="flex gap-3">
                                                    <input
                                                        type="text"
                                                        id="otp"
                                                        value={forgotData.otp}
                                                        onChange={(e) => handleInputChange(e, 'forgot')}
                                                        placeholder="Enter 6-digit code"
                                                        maxLength={6}
                                                        className="flex-1 bg-[var(--input-bg)] px-4 py-3.5 rounded-xl border-2 border-[var(--border-primary)] focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--primary-100)] focus:outline-none text-[var(--text-primary)]"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setResendTimer(30)}
                                                        disabled={resendTimer > 0}
                                                        className="px-4 bg-[var(--bg-tertiary)] border-2 border-[var(--border-primary)] rounded-xl text-[var(--text-muted)] hover:bg-[var(--bg-hover)] disabled:opacity-50 transition-all"
                                                    >
                                                        {resendTimer > 0 ? `${resendTimer}s` : 'Resend'}
                                                    </button>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">
                                                    New Password
                                                </label>
                                                <InputField
                                                    icon="lock"
                                                    id="newPassword"
                                                    value={forgotData.newPassword}
                                                    onChange={(e) => handleInputChange(e, 'forgot')}
                                                    placeholder="••••••••"
                                                    error={errors.forgotNew}
                                                    showPasswordToggle
                                                    showPassword={showPassword.forgot}
                                                    onTogglePassword={() =>
                                                        setShowPassword((p) => ({ ...p, forgot: !p.forgot }))
                                                    }
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">
                                                    Confirm New Password
                                                </label>
                                                <InputField
                                                    icon="lock"
                                                    id="confirmPassword"
                                                    value={forgotData.confirmPassword}
                                                    onChange={(e) => handleInputChange(e, 'forgot')}
                                                    placeholder="••••••••"
                                                    error={errors.forgotConfirm}
                                                />
                                            </div>

                                            <Button type="submit" onClick={handleForgotResetSubmit} loading={isLoading}>
                                                Reset Password
                                            </Button>
                                        </div>
                                    )}
                                </form>
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </>
    );
};

export default Auth;
