import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { eventsService } from '@services/api/eventsService';

const initialState = {
    events: [],
    featuredEvents: [],
    currentEvent: null,
    categories: [],
    isLoading: false,
    error: null,
    pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
    },
    filters: {
        category: '',
        dateRange: null,
        priceRange: null,
        location: '',
        search: '',
    },
};

export const fetchEvents = createAsyncThunk(
    'events/fetchAll',
    async (params, { rejectWithValue }) => {
        try {
            return await eventsService.getAll(params);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchEventById = createAsyncThunk(
    'events/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            return await eventsService.getById(id);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchFeaturedEvents = createAsyncThunk(
    'events/fetchFeatured',
    async (_, { rejectWithValue }) => {
        try {
            return await eventsService.getFeatured();
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchCategories = createAsyncThunk(
    'events/fetchCategories',
    async (_, { rejectWithValue }) => {
        try {
            return await eventsService.getCategories();
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const createEvent = createAsyncThunk(
    'events/create',
    async (eventData, { rejectWithValue }) => {
        try {
            return await eventsService.create(eventData);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateEvent = createAsyncThunk(
    'events/update',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            return await eventsService.update(id, data);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteEvent = createAsyncThunk(
    'events/delete',
    async (id, { rejectWithValue }) => {
        try {
            await eventsService.delete(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const eventsSlice = createSlice({
    name: 'events',
    initialState,
    reducers: {
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearFilters: (state) => {
            state.filters = initialState.filters;
        },
        clearCurrentEvent: (state) => {
            state.currentEvent = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch all events
            .addCase(fetchEvents.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchEvents.fulfilled, (state, action) => {
                state.isLoading = false;
                state.events = action.payload.events || action.payload;
                if (action.payload.pagination) {
                    state.pagination = action.payload.pagination;
                }
            })
            .addCase(fetchEvents.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Fetch event by ID
            .addCase(fetchEventById.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchEventById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentEvent = action.payload;
            })
            .addCase(fetchEventById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Fetch featured events
            .addCase(fetchFeaturedEvents.fulfilled, (state, action) => {
                state.featuredEvents = action.payload;
            })
            // Fetch categories
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.categories = action.payload;
            })
            // Create event
            .addCase(createEvent.fulfilled, (state, action) => {
                state.events.unshift(action.payload);
            })
            // Update event
            .addCase(updateEvent.fulfilled, (state, action) => {
                const index = state.events.findIndex((e) => e.id === action.payload.id);
                if (index !== -1) {
                    state.events[index] = action.payload;
                }
                if (state.currentEvent?.id === action.payload.id) {
                    state.currentEvent = action.payload;
                }
            })
            // Delete event
            .addCase(deleteEvent.fulfilled, (state, action) => {
                state.events = state.events.filter((e) => e.id !== action.payload);
            });
    },
});

export const { setFilters, clearFilters, clearCurrentEvent, clearError } = eventsSlice.actions;
export default eventsSlice.reducer;
