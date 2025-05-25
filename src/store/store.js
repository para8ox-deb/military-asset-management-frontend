import { configureStore } from '@reduxjs/toolkit';
import authSlice from './authSlice';
import dashboardSlice from './dashboardSlice';

export default configureStore({
  reducer: {
    auth: authSlice,
    dashboard: dashboardSlice,
  },
});
