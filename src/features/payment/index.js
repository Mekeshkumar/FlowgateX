// Payment Feature - Payment processing utilities
export const paymentConfig = {
    stripeKey: import.meta.env.VITE_STRIPE_PUBLIC_KEY,
    razorpayKey: import.meta.env.VITE_RAZORPAY_KEY_ID,
};

export const paymentMethods = {
    CARD: 'card',
    UPI: 'upi',
    NET_BANKING: 'net_banking',
    WALLET: 'wallet',
};

export const paymentStatus = {
    PENDING: 'pending',
    PROCESSING: 'processing',
    COMPLETED: 'completed',
    FAILED: 'failed',
    REFUNDED: 'refunded',
};

export const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
    }).format(amount);
};
