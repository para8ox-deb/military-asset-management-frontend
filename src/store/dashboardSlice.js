import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchDashboardMetrics = createAsyncThunk(
  'dashboard/fetchMetrics',
  async (filters, { rejectWithValue }) => {
    try {
      const response = await axios.get('/dashboard/metrics', { params: filters });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    metrics: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardMetrics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardMetrics.fulfilled, (state, action) => {
        state.loading = false;
        state.metrics = action.payload;
      })
      .addCase(fetchDashboardMetrics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default dashboardSlice.reducer;
