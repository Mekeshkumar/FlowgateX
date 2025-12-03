import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@features/auth/store/authSlice';
import eventsReducer from '@features/events/store/eventsSlice';
import bookingReducer from '@features/booking/store/bookingSlice';
import analyticsReducer from '@features/analytics/store/analyticsSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        events: eventsReducer,
        booking: bookingReducer,
        analytics: analyticsReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['auth/setUser'],
            },
        }),
    devTools: import.meta.env.DEV,
});

export default store;
