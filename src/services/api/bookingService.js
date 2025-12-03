import apiClient from './apiClient';

export const bookingService = {
    create: async (bookingData) => {
        return apiClient.post('/bookings', bookingData);
    },

    getById: async (id) => {
        return apiClient.get(`/bookings/${id}`);
    },

    getUserBookings: async (params = {}) => {
        return apiClient.get('/bookings/user', { params });
    },

    getEventBookings: async (eventId, params = {}) => {
        return apiClient.get(`/bookings/event/${eventId}`, { params });
    },

    cancel: async (id) => {
        return apiClient.post(`/bookings/${id}/cancel`);
    },

    confirmPayment: async (id, paymentData) => {
        return apiClient.post(`/bookings/${id}/confirm-payment`, paymentData);
    },

    getTicket: async (id) => {
        return apiClient.get(`/bookings/${id}/ticket`);
    },

    checkIn: async (bookingId, checkInData) => {
        return apiClient.post(`/bookings/${bookingId}/check-in`, checkInData);
    },

    validateQR: async (qrCode) => {
        return apiClient.post('/bookings/validate-qr', { qrCode });
    },

    resendTicket: async (id) => {
        return apiClient.post(`/bookings/${id}/resend-ticket`);
    },
};

export default bookingService;
