import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// Request interceptor - add auth token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(import.meta.env.VITE_AUTH_TOKEN_KEY);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - handle errors
apiClient.interceptors.response.use(
    (response) => response.data,
    (error) => {
        const { response } = error;

        if (response) {
            // Handle specific status codes
            switch (response.status) {
                case 401:
                    // Unauthorized - clear token and redirect to login
                    localStorage.removeItem(import.meta.env.VITE_AUTH_TOKEN_KEY);
                    window.location.href = '/login';
                    break;
                case 403:
                    // Forbidden
                    console.error('Access forbidden');
                    break;
                case 404:
                    // Not found
                    console.error('Resource not found');
                    break;
                case 500:
                    // Server error
                    console.error('Server error');
                    break;
                default:
                    break;
            }

            return Promise.reject({
                message: response.data?.message || 'An error occurred',
                status: response.status,
                data: response.data,
            });
        }

        // Network error
        return Promise.reject({
            message: 'Network error. Please check your connection.',
            status: null,
        });
    }
);

export default apiClient;
