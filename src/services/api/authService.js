import apiClient from './apiClient';

export const authService = {
    login: async (credentials) => {
        try {
            const response = await apiClient.post('/auth/login', credentials);

            // Store token in localStorage
            if (response.data?.token) {
                localStorage.setItem(
                    import.meta.env.VITE_AUTH_TOKEN_KEY || 'flowgatex_auth_token',
                    response.data.token
                );
            }

            return response;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    register: async (userData) => {
        try {
            const response = await apiClient.post('/auth/register', userData);

            // Store token in localStorage after successful registration
            if (response.data?.token) {
                localStorage.setItem(
                    import.meta.env.VITE_AUTH_TOKEN_KEY || 'flowgatex_auth_token',
                    response.data.token
                );
            }

            return response;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    },

    logout: async () => {
        try {
            await apiClient.post('/auth/logout');
            // Clear token from localStorage
            localStorage.removeItem(import.meta.env.VITE_AUTH_TOKEN_KEY || 'flowgatex_auth_token');
        } catch (error) {
            console.error('Logout error:', error);
            // Clear token even if request fails
            localStorage.removeItem(import.meta.env.VITE_AUTH_TOKEN_KEY || 'flowgatex_auth_token');
            throw error;
        }
    },

    getCurrentUser: async () => {
        try {
            return await apiClient.get('/auth/me');
        } catch (error) {
            console.error('Get current user error:', error);
            throw error;
        }
    },

    forgotPassword: async (email) => {
        try {
            return await apiClient.post('/auth/forgot-password', { email });
        } catch (error) {
            console.error('Forgot password error:', error);
            throw error;
        }
    },

    resetPassword: async (token, newPassword) => {
        try {
            return await apiClient.post('/auth/reset-password', { token, newPassword });
        } catch (error) {
            console.error('Reset password error:', error);
            throw error;
        }
    },

    changePassword: async (currentPassword, newPassword) => {
        try {
            return await apiClient.post('/auth/change-password', { currentPassword, newPassword });
        } catch (error) {
            console.error('Change password error:', error);
            throw error;
        }
    },

    updateProfile: async (profileData) => {
        try {
            return await apiClient.put('/auth/profile', profileData);
        } catch (error) {
            console.error('Update profile error:', error);
            throw error;
        }
    },

    verifyEmail: async (token) => {
        try {
            return await apiClient.post('/auth/verify-email', { token });
        } catch (error) {
            console.error('Verify email error:', error);
            throw error;
        }
    },

    resendVerification: async () => {
        try {
            return await apiClient.post('/auth/resend-verification');
        } catch (error) {
            console.error('Resend verification error:', error);
            throw error;
        }
    },
};

export default authService;
