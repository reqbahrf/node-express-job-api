import axios from 'axios';
import getAccessToken from '@/utils/getAccessToken';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const adminAPI = {
  getAdminDashboardStats: createAsyncThunk(
    'admin/getDashboardStats',
    async (_, thunkAPI) => {
      const response = await axios.get('/api/v1/admin/dashboard', {
        headers: {
          Authorization: `Bearer ${getAccessToken(thunkAPI)}`,
        },
        signal: thunkAPI.signal,
      });
      return response.data;
    },
  ),
};
