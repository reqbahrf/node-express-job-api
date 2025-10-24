import axios from 'axios';
import getAccessToken from '@/utils/getAccessToken';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const adminAPI = {
  getAdminDashboardStats: createAsyncThunk(
    'admin/getDashboardStats',
    async (signal: AbortSignal, thunkAPI) => {
      const response = await axios.get('/api/v1/admin/dashboard', {
        headers: {
          Authorization: `Bearer ${getAccessToken(thunkAPI)}`,
        },
        signal,
      });
      return response.data;
    },
  ),
};
