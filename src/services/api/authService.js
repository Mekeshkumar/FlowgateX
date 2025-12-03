import apiClient from './apiClient';

export const authService = {
    login: async (credentials) => {
        return apiClient.post('/auth/login', credentials);
    },

    register: async (userData) => {
        return apiClient.post('/auth/register', userData);
    },

    logout: async () => {
        return apiClient.post('/auth/logout');
    },

    getCurrentUser: async () => {
        return apiClient.get('/auth/me');
    },

    forgotPassword: async (email) => {
        return apiClient.post('/auth/forgot-password', { email });
    },

    resetPassword: async (token, newPassword) => {
        return apiClient.post('/auth/reset-password', { token, newPassword });
    },

    changePassword: async (currentPassword, newPassword) => {
        return apiClient.post('/auth/change-password', { currentPassword, newPassword });
    },

    updateProfile: async (profileData) => {
        return apiClient.put('/auth/profile', profileData);
    },

    verifyEmail: async (token) => {
        return apiClient.post('/auth/verify-email', { token });
    },

    resendVerification: async () => {
        return apiClient.post('/auth/resend-verification');
    },
};

export default authService;
