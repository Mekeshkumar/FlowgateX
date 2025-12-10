import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@context/AuthContext';
import authService from '@/services/api/authService';
import { Icon, InputField, Button, SocialButton, EMAIL_REGEX } from './AuthComponents';

const LoginForm = ({ setCurrentView, addToast }) => {
    const navigate = useNavigate();
    const { setAuthUser } = useAuthContext();

    const [loginData, setLoginData] = useState({ identifier: '', password: '', rememberMe: false });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e) => {
        const { id, value, type, checked } = e.target;
        const val = type === 'checkbox' ? checked : value;

        if (errors[id]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[id];
                return newErrors;
            });
        }
        setLoginData((prev) => ({ ...prev, [id]: val }));
    };

    const handleSocialLogin = useCallback((provider) => {
        addToast(`Connecting to ${provider}... `, 'success');
    }, [addToast]);

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        const email = (loginData.identifier || '').trim().toLowerCase();
        const password = (loginData.password || '').trim();

        // Validation
        if (!email || !EMAIL_REGEX.test(email)) {
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
            'admin@flowgatex.com': { password: 'admin@123', user: { id: 'test-admin-001', firstName: 'Admin', lastName: 'User', email: 'admin@flowgatex.com', role: 'admin', avatar: null, name: 'Admin User' } },
            'organizer@flowgatex.com': { password: 'organizer@123', user: { id: 'test-organizer-001', firstName: 'Organizer', lastName: 'User', email: 'organizer@flowgatex.com', role: 'organizer', avatar: null, name: 'Organizer User' } },
            'user@flowgatex.com': { password: 'user@123', user: { id: 'test-user-001', firstName: 'Test', lastName: 'User', email: 'user@flowgatex.com', role: 'user', avatar: null, name: 'Test User' } },
            'mekesh.engineer@gmail.com': {
                passwords: {
                    'admin@123': { id: 'mekesh-admin-001', firstName: 'Mekesh', lastName: 'Kumar', email: 'mekesh.engineer@gmail.com', role: 'admin', avatar: null, name: 'Mekesh Kumar' },
                    'organizer@123': { id: 'mekesh-organizer-001', firstName: 'Mekesh', lastName: 'Kumar', email: 'mekesh.engineer@gmail.com', role: 'organizer', avatar: null, name: 'Mekesh Kumar' },
                    'user@123': { id: 'mekesh-user-001', firstName: 'Mekesh', lastName: 'Kumar', email: 'mekesh.engineer@gmail.com', role: 'user', avatar: null, name: 'Mekesh Kumar' },
                }
            }
        };

        const testAccount = testAccounts[email];

        // Handle Test Account Logic
        if (testAccount) {
            let matchedUser = null;
            if (testAccount.passwords) {
                matchedUser = testAccount.passwords[password];
            } else if (testAccount.password === password) {
                matchedUser = testAccount.user;
            }

            if (matchedUser) {
                const token = 'test-token-' + matchedUser.role;
                setAuthUser(matchedUser, token);
                addToast(`Welcome back, ${matchedUser.firstName}! (${matchedUser.role})`, 'success');

                if (window.confetti) {
                    window.confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#eb1616', '#ffffff', '#FFD700'] });
                }

                const routes = { admin: '/admin/dashboard', organizer: '/organizer/dashboard', user: '/dashboard' };
                setTimeout(() => {
                    navigate(routes[matchedUser.role] || '/dashboard');
                    setIsLoading(false);
                }, 1000);
                return;
            }
        }

        try {
            // Call API
            const response = await authService.login({ email, password });

            if (response.success && response.data) {
                const { user } = response.data;
                localStorage.setItem('user', JSON.stringify(user));
                setAuthUser(user, response.data.token);
                addToast(`Welcome back, ${user.firstName}!`, 'success');

                if (window.confetti) {
                    window.confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#eb1616', '#ffffff', '#FFD700'] });
                }

                setTimeout(() => {
                    const routes = { admin: '/admin', organizer: '/organizer', user: '/home' };
                    navigate(routes[user.role] || '/home');
                }, 1500);
            } else {
                addToast(response.message || 'Login failed', 'error');
            }
        } catch (error) {
            console.error('Login error:', error);
            const errorMessage = error.data?.message || error.message || 'Login failed. Please try again.';
            addToast(errorMessage, 'error');
            setErrors({ general: errorMessage });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-view">
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
                <p className="text-[var(--text-muted)]">Please enter your details to sign in.</p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">Email Address</label>
                    <InputField
                        icon="mail"
                        type="email"
                        id="identifier"
                        value={loginData.identifier}
                        onChange={handleInputChange}
                        placeholder="you@example.com"
                        error={errors.identifier}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">Password</label>
                    <InputField
                        icon="lock"
                        id="password"
                        value={loginData.password}
                        onChange={handleInputChange}
                        placeholder="••••••••"
                        error={errors.password}
                        showPasswordToggle
                        showPassword={showPassword}
                        onTogglePassword={() => setShowPassword(prev => !prev)}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2.5 cursor-pointer group">
                        <input
                            type="checkbox"
                            id="rememberMe"
                            checked={loginData.rememberMe}
                            onChange={handleInputChange}
                            className="w-4 h-4 rounded border-2 border-[var(--border-primary)] bg-[var(--input-bg)] checked:bg-[var(--accent)] checked:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-0 transition-colors cursor-pointer"
                            style={{ accentColor: 'var(--accent)' }}
                        />
                        <span className="text-sm text-[var(--text-muted)] group-hover:text-[var(--text-secondary)] transition-colors">Remember me</span>
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

            <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[var(--border-primary)]" />
                </div>
                <div className="relative flex justify-center">
                    <span className="bg-[var(--bg-surface)] px-4 text-sm text-[var(--text-muted)]">Or continue with</span>
                </div>
            </div>

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
    );
};

export default LoginForm;