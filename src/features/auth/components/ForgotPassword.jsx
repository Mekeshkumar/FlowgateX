import { useState } from 'react';
import { Icon, InputField, Button, EMAIL_REGEX } from './AuthComponents';

const ForgotPassword = ({ setCurrentView, addToast }) => {
    const [forgotData, setForgotData] = useState({ email: '', otp: '', newPassword: '', confirmPassword: '' });
    const [forgotStep, setForgotStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        if (errors[id]) {
            setErrors((prev) => { const newErrors = { ...prev }; delete newErrors[id]; return newErrors; });
        }
        setForgotData((prev) => ({ ...prev, [id]: value }));
    };

    const handleForgotSendOtp = () => {
        if (!EMAIL_REGEX.test(forgotData.email)) {
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
    };

    const handleForgotResetSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            addToast('Password reset successfully!', 'success');
            setCurrentView('login');
            setForgotStep(1);
        }, 1500);
    };

    return (
        <div className="auth-view">
            <button onClick={() => { setCurrentView('login'); setForgotStep(1); }} className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] mb-8 transition-colors">
                <Icon name="arrow_back" size={20} />
                <span>Back to Login</span>
            </button>

            <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-2 mb-3">
                    <Icon name="auto_awesome" className="text-[var(--accent)]" size={32} />
                    <h2 className="text-3xl font-display font-bold">FlowGate<span className="text-[var(--accent)]">X</span></h2>
                </div>
            </div>

            <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2">Reset Password</h3>
                <p className="text-[var(--text-muted)]">{forgotStep === 1 ? 'Enter your email to receive a verification code.' : 'Create your new password.'}</p>
            </div>

            <form className="space-y-5">
                {forgotStep === 1 && (
                    <div className="space-y-5 auth-view">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">Email Address</label>
                            <InputField icon="mail" type="email" id="email" value={forgotData.email} onChange={handleInputChange} placeholder="you@example.com" error={errors.forgotEmail} />
                        </div>
                        <Button type="button" onClick={handleForgotSendOtp} loading={isLoading}>Send Verification Code</Button>
                    </div>
                )}

                {forgotStep === 2 && (
                    <div className="space-y-5 auth-view">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">Verification Code</label>
                            <div className="flex gap-3">
                                <input type="text" id="otp" value={forgotData.otp} onChange={handleInputChange} placeholder="Enter 6-digit code" maxLength={6} className="flex-1 bg-[var(--input-bg)] px-4 py-3.5 rounded-xl border-2 border-[var(--border-primary)] focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--primary-100)] focus:outline-none text-[var(--text-primary)]" />
                                <button type="button" onClick={() => setResendTimer(30)} disabled={resendTimer > 0} className="px-4 bg-[var(--bg-tertiary)] border-2 border-[var(--border-primary)] rounded-xl text-[var(--text-muted)] hover:bg-[var(--bg-hover)] disabled:opacity-50 transition-all">
                                    {resendTimer > 0 ? `${resendTimer}s` : 'Resend'}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">New Password</label>
                            <InputField icon="lock" id="newPassword" value={forgotData.newPassword} onChange={handleInputChange} placeholder="••••••••" error={errors.forgotNew} showPasswordToggle showPassword={showPassword} onTogglePassword={() => setShowPassword(!showPassword)} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">Confirm New Password</label>
                            <InputField icon="lock" id="confirmPassword" value={forgotData.confirmPassword} onChange={handleInputChange} placeholder="••••••••" error={errors.forgotConfirm} />
                        </div>
                        <Button type="submit" onClick={handleForgotResetSubmit} loading={isLoading}>Reset Password</Button>
                    </div>
                )}
            </form>
        </div>
    );
};

export default ForgotPassword;