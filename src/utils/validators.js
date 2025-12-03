// Email validation
export const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

// Phone validation
export const isValidPhone = (phone) => {
    const regex = /^\+?[\d\s-]{10,}$/;
    return regex.test(phone);
};

// Password strength checker
export const getPasswordStrength = (password) => {
    let strength = 0;

    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 2) return { level: 'weak', color: 'red' };
    if (strength <= 4) return { level: 'medium', color: 'yellow' };
    return { level: 'strong', color: 'green' };
};

// URL validation
export const isValidUrl = (url) => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

// Credit card validation (Luhn algorithm)
export const isValidCreditCard = (number) => {
    const digits = number.replace(/\D/g, '');
    if (digits.length < 13 || digits.length > 19) return false;

    let sum = 0;
    let isEven = false;

    for (let i = digits.length - 1; i >= 0; i--) {
        let digit = parseInt(digits[i], 10);

        if (isEven) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }

        sum += digit;
        isEven = !isEven;
    }

    return sum % 10 === 0;
};

// Required field validation
export const isRequired = (value) => {
    if (typeof value === 'string') return value.trim().length > 0;
    return value !== null && value !== undefined;
};

// Min length validation
export const minLength = (value, min) => {
    return value.length >= min;
};

// Max length validation
export const maxLength = (value, max) => {
    return value.length <= max;
};
