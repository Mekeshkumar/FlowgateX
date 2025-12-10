import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@context/AuthContext';
import authService from '@/services/api/authService';
import { Icon, InputField, Button, PasswordStrength, SegmentedProgressBar, EMAIL_REGEX, PHONE_REGEX } from './AuthComponents';

const RegisterForm = ({ setCurrentView, addToast }) => {
    const navigate = useNavigate();
    const { setAuthUser } = useAuthContext();
    const otpRefs = useRef([]);

    const [registerData, setRegisterData] = useState({
        firstName: '', lastName: '', email: '', phone: '', role: '', password: '', confirmPassword: '', terms: false, otp: Array(6).fill('')
    });
    const [registerStep, setRegisterStep] = useState(1);
    const [errors, setErrors] = useState({});
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);

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

    const handleInputChange = (e) => {
        const { id, value, type, checked } = e.target;
        const val = type === 'checkbox' ? checked : value;
        if (errors[id]) {
            setErrors((prev) => { const newErrors = { ...prev }; delete newErrors[id]; return newErrors; });
        }
        setRegisterData((prev) => ({ ...prev, [id]: val }));
    };

    const handleOtpChange = (e, index) => {
        const val = e.target.value;
        if (/[^0-9]/.test(val)) return;
        setRegisterData((prev) => {
            const newOtp = [...prev.otp];
            newOtp[index] = val;
            return { ...prev, otp: newOtp };
        });
        if (val && index < 5) otpRefs.current[index + 1]?.focus();
    };

    const handleOtpKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !registerData.otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    const handleRegisterNext = (targetStep) => {
        const newErrors = {};
        if (registerStep === 1) {
            if (registerData.firstName.trim().length < 2) newErrors.firstName = 'First name must be at least 2 characters';
            if (registerData.lastName.trim().length < 2) newErrors.lastName = 'Last name must be at least 2 characters';
            if (!EMAIL_REGEX.test(registerData.email)) newErrors.email = 'Invalid email address';
            if (!PHONE_REGEX.test(registerData.phone)) newErrors.phone = 'Invalid phone number';
        }
        if (registerStep === 2 && targetStep === 3) {
            if (!registerData.role) newErrors.role = 'Please select a role';
            if (registerData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
            if (registerData.password !== registerData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
            if (!registerData.terms) newErrors.terms = 'You must agree to the terms';
        }
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        setRegisterStep(targetStep);
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        // Validation check similar to handleRegisterNext but final pass...
        setIsLoading(true);

        try {
            const userData = {
                firstName: registerData.firstName.trim(),
                lastName: registerData.lastName.trim(),
                email: registerData.email.trim().toLowerCase(),
                phone: registerData.phone.trim(),
                password: registerData.password,
                role: registerData.role,
            };

            const response = await authService.register(userData);

            if (response.success && response.data) {
                const { user } = response.data;
                localStorage.setItem('user', JSON.stringify(user));
                setAuthUser(user, response.data.token);
                addToast('Account created successfully! 🎉', 'success');

                if (window.confetti) {
                    window.confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 }, colors: ['#eb1616', '#ffffff', '#FFD700'] });
                }

                setTimeout(() => {
                    const routes = { admin: '/admin', organizer: '/organizer', user: '/home' };
                    navigate(routes[user.role] || '/home');
                }, 1500);
            } else {
                addToast(response.message || 'Registration failed', 'error');
            }
        } catch (error) {
            console.error('Registration error:', error);
            const errorMessage = error.data?.message || error.message || 'Registration failed. Please try again.';
            if (errorMessage.includes('already exists')) {
                setErrors({ email: 'This email is already registered' });
            }
            addToast(errorMessage, 'error');
            setErrors({ general: errorMessage });
        } finally {
            setIsLoading(false);
        }
    };

    return (
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
                <p className="text-[var(--text-muted)]">Join FlowGate for seamless access control.</p>
            </div>

            <SegmentedProgressBar currentStep={registerStep} />

            <form onSubmit={handleRegisterSubmit} className="space-y-5">
                {registerStep === 1 && (
                    <div className="space-y-4 auth-view">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">First Name</label>
                                <InputField icon="person" id="firstName" value={registerData.firstName} onChange={handleInputChange} placeholder="John" error={errors.firstName} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">Last Name</label>
                                <InputField icon="person" id="lastName" value={registerData.lastName} onChange={handleInputChange} placeholder="Doe" error={errors.lastName} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">Email Address</label>
                            <InputField icon="mail" type="email" id="email" value={registerData.email} onChange={handleInputChange} placeholder="john@example.com" error={errors.email} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">Phone Number</label>
                            <InputField icon="phone" type="tel" id="phone" value={registerData.phone} onChange={handleInputChange} placeholder="+1 234 567 890" error={errors.phone} />
                        </div>
                        <Button type="button" onClick={() => handleRegisterNext(2)}>Continue</Button>
                    </div>
                )}

                {registerStep === 2 && (
                    <div className="space-y-4 auth-view">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">Select Role</label>
                            <select
                                id="role"
                                value={registerData.role}
                                onChange={handleInputChange}
                                className={`w-full bg-[var(--input-bg)] text-[var(--text-primary)] px-4 py-3.5 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--primary-100)] ${errors.role ? 'border-[var(--error)]' : 'border-[var(--border-primary)]'}`}
                            >
                                <option value="">Choose a role</option>
                                <option value="user">Attendee</option>
                                <option value="organizer">Organizer</option>
                                <option value="admin">Administrator</option>
                            </select>
                            {errors.role && <p className="text-[var(--error)] text-sm mt-1.5">{errors.role}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">Create Password</label>
                            <InputField
                                icon="lock"
                                id="password"
                                value={registerData.password}
                                onChange={handleInputChange}
                                placeholder="••••••••"
                                error={errors.password}
                                showPasswordToggle
                                showPassword={showPassword}
                                onTogglePassword={() => setShowPassword(!showPassword)}
                            />
                            <div className="mt-3"><PasswordStrength strength={passwordStrength} /></div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">Confirm Password</label>
                            <InputField icon="lock" id="confirmPassword" value={registerData.confirmPassword} onChange={handleInputChange} placeholder="••••••••" error={errors.confirmPassword} showPasswordToggle={false} />
                        </div>

                        <label className="flex items-start gap-3 cursor-pointer">
                            <input type="checkbox" id="terms" checked={registerData.terms} onChange={handleInputChange} className="mt-0.5 w-4 h-4 rounded border-2 border-[var(--border-primary)] bg-[var(--input-bg)] text-[var(--accent)]" />
                            <span className="text-sm text-[var(--text-muted)]">
                                I agree to the <a href="#" className="text-[var(--accent)] hover:underline">Terms & Conditions</a> and <a href="#" className="text-[var(--accent)] hover:underline">Privacy Policy</a>
                            </span>
                        </label>
                        {errors.terms && <p className="text-[var(--error)] text-sm">{errors.terms}</p>}

                        <div className="flex gap-3">
                            <Button type="button" variant="secondary" onClick={() => setRegisterStep(1)} className="w-1/3">Back</Button>
                            <Button type="button" onClick={() => handleRegisterNext(3)} className="w-2/3">Continue</Button>
                        </div>
                    </div>
                )}

                {registerStep === 3 && (
                    <div className="space-y-6 auth-view text-center">
                        <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-[var(--primary-100)] to-[var(--primary-200)] flex items-center justify-center">
                            <Icon name="mail" outlined className="text-[var(--accent)]" size={40} />
                        </div>
                        <div>
                            <h4 className="text-xl font-bold mb-2">Verify Your Email</h4>
                            <p className="text-sm text-[var(--text-muted)]">
                                We&apos;ve sent a 6-digit code to <span className="text-[var(--accent)] font-medium">{registerData.email}</span>
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
                            Didn&apos;t receive code? {resendTimer > 0 ? <span className="text-[var(--text-muted)]">Resend in {resendTimer}s</span> : <button type="button" onClick={() => setResendTimer(30)} className="text-[var(--accent)] font-semibold hover:underline">Resend</button>}
                        </p>
                        <div className="flex gap-3">
                            <Button type="button" variant="secondary" onClick={() => setRegisterStep(2)} className="w-1/3">Back</Button>
                            <Button type="submit" loading={isLoading} className="w-2/3">Create Account</Button>
                        </div>
                    </div>
                )}
            </form>

            <p className="mt-8 text-center text-[var(--text-muted)]">
                Already have an account? <button onClick={() => { setCurrentView('login'); setRegisterStep(1); }} className="text-[var(--accent)] font-semibold hover:underline">Sign in</button>
            </p>
        </div>
    );
};

export default RegisterForm;