import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    dashboardData: null,
    eventAnalytics: null,
    revenueData: null,
    attendeeStats: null,
    isLoading: false,
    error: null,
};

const analyticsSlice = createSlice({
    name: 'analytics',
    initialState,
    reducers: {
        setDashboardData: (state, action) => {
            state.dashboardData = action.payload;
        },
        setEventAnalytics: (state, action) => {
            state.eventAnalytics = action.payload;
        },
        setRevenueData: (state, action) => {
            state.revenueData = action.payload;
        },
        setAttendeeStats: (state, action) => {
            state.attendeeStats = action.payload;
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        clearAnalytics: () => {
            return initialState;
        },
    },
});

export const {
    setDashboardData,
    setEventAnalytics,
    setRevenueData,
    setAttendeeStats,
    setLoading,
    setError,
    clearAnalytics,
} = analyticsSlice.actions;

export default analyticsSlice.reducer;
