import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { bookingService } from '@services/api/bookingService';

const initialState = {
    bookings: [],
    currentBooking: null,
    isLoading: false,
    error: null,
    checkoutSession: null,
};

export const fetchUserBookings = createAsyncThunk(
    'booking/fetchUserBookings',
    async (params, { rejectWithValue }) => {
        try {
            return await bookingService.getUserBookings(params);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchBookingById = createAsyncThunk(
    'booking/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            return await bookingService.getById(id);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const createBooking = createAsyncThunk(
    'booking/create',
    async (bookingData, { rejectWithValue }) => {
        try {
            return await bookingService.create(bookingData);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const cancelBooking = createAsyncThunk(
    'booking/cancel',
    async (id, { rejectWithValue }) => {
        try {
            return await bookingService.cancel(id);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const confirmPayment = createAsyncThunk(
    'booking/confirmPayment',
    async ({ id, paymentData }, { rejectWithValue }) => {
        try {
            return await bookingService.confirmPayment(id, paymentData);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const bookingSlice = createSlice({
    name: 'booking',
    initialState,
    reducers: {
        setCheckoutSession: (state, action) => {
            state.checkoutSession = action.payload;
        },
        clearCheckoutSession: (state) => {
            state.checkoutSession = null;
        },
        clearCurrentBooking: (state) => {
            state.currentBooking = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch user bookings
            .addCase(fetchUserBookings.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchUserBookings.fulfilled, (state, action) => {
                state.isLoading = false;
                state.bookings = action.payload;
            })
            .addCase(fetchUserBookings.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Fetch booking by ID
            .addCase(fetchBookingById.fulfilled, (state, action) => {
                state.currentBooking = action.payload;
            })
            // Create booking
            .addCase(createBooking.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createBooking.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentBooking = action.payload;
                state.bookings.unshift(action.payload);
            })
            .addCase(createBooking.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Cancel booking
            .addCase(cancelBooking.fulfilled, (state, action) => {
                const index = state.bookings.findIndex((b) => b.id === action.payload.id);
                if (index !== -1) {
                    state.bookings[index] = action.payload;
                }
            })
            // Confirm payment
            .addCase(confirmPayment.fulfilled, (state, action) => {
                const index = state.bookings.findIndex((b) => b.id === action.payload.id);
                if (index !== -1) {
                    state.bookings[index] = action.payload;
                }
                state.currentBooking = action.payload;
            });
    },
});

export const { setCheckoutSession, clearCheckoutSession, clearCurrentBooking, clearError } = bookingSlice.actions;
export default bookingSlice.reducer;
