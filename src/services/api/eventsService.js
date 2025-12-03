import apiClient from './apiClient';

export const eventsService = {
    getAll: async (params = {}) => {
        return apiClient.get('/events', { params });
    },

    getById: async (id) => {
        return apiClient.get(`/events/${id}`);
    },

    create: async (eventData) => {
        return apiClient.post('/events', eventData);
    },

    update: async (id, eventData) => {
        return apiClient.put(`/events/${id}`, eventData);
    },

    delete: async (id) => {
        return apiClient.delete(`/events/${id}`);
    },

    search: async (query, filters = {}) => {
        return apiClient.get('/events/search', { params: { q: query, ...filters } });
    },

    getByOrganizer: async (organizerId) => {
        return apiClient.get(`/events/organizer/${organizerId}`);
    },

    getCategories: async () => {
        return apiClient.get('/events/categories');
    },

    getFeatured: async () => {
        return apiClient.get('/events/featured');
    },

    getUpcoming: async (limit = 10) => {
        return apiClient.get('/events/upcoming', { params: { limit } });
    },

    getAttendees: async (eventId) => {
        return apiClient.get(`/events/${eventId}/attendees`);
    },

    uploadImage: async (eventId, formData) => {
        return apiClient.post(`/events/${eventId}/image`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
};

export default eventsService;
