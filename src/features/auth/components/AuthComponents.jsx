import React from 'react';
import Icon from '@components/common/Icon';
import Toast from '@components/common/Toast';

export { Icon, Toast };

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_REGEX = /^\+?[\d\s-]{10,}$/;

export const InputField = ({
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

export const Button = ({ children, variant = 'primary', disabled, loading, className = '', ...props }) => {
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

export const SocialButton = ({ provider, icon, onClick }) => (
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

export const PasswordStrength = ({ strength }) => {
    const strengthConfig = {
        0: { width: '0%', color: 'bg-[var(--border-primary)]', text: 'Enter a password', textColor: 'text-[var(--text-muted)]' },
        1: { width: '25%', color: 'bg-[var(--error)]', text: 'Weak', textColor: 'text-[var(--error)]' },
        2: { width: '50%', color: 'bg-[var(--warning)]', text: 'Fair', textColor: 'text-[var(--warning)]' },
        3: { width: '75%', color: 'bg-[var(--info)]', text: 'Good', textColor: 'text-[var(--info)]' },
        4: { width: '100%', color: 'bg-[var(--success)]', text: 'Strong', textColor: 'text-[var(--success)]' },
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

export const SegmentedProgressBar = ({ currentStep, totalSteps = 3 }) => {
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
                        className={`text-xs font-medium transition-colors duration-300 ${i + 1 <= currentStep ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'}`}
                    >
                        {i === 0 ? 'Info' : i === 1 ? 'Security' : 'Verify'}
                    </span>
                ))}
            </div>
        </div>
    );
};