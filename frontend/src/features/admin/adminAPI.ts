import axios from 'axios';

export const adminAPI = {
  getAdminDashboardStats: async (accessToken: string, signal: AbortSignal) => {
    const response = await axios.get('/api/v1/admin/dashboard', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      signal,
    });
    return response.data;
  },
};
