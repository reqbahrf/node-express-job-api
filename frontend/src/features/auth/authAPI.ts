import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
axios.defaults.withCredentials = true;
import { setLoading } from '../loading/loadingSlice';

interface Credentials {
  email: string;
  password: string;
}

interface RegisterCredential extends Credentials {
  name: string;
}

interface ResponseAuthData {
  userid: string;
  username: string;
  role: string;
  accessToken: string;
}

const authAPI = {
  login: createAsyncThunk(
    'auth/login',
    async (credentials: Credentials, thunkAPI) => {
      try {
        const dispatchPayload = { key: 'login', loading: true, isGlobal: true };
        thunkAPI.dispatch(setLoading(dispatchPayload));
        const { data } = await axios.post<ResponseAuthData>(
          '/api/v1/auth/login',
          credentials
        );
        thunkAPI.dispatch(setLoading({ ...dispatchPayload, loading: false }));
        return data;
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message || 'Login failed'
        );
      }
    }
  ),
  logout: createAsyncThunk('auth/logout', async (_, thunkAPI) => {
    try {
      const dispatchPayload = { key: 'logout', loading: true, isGlobal: true };
      thunkAPI.dispatch(setLoading(dispatchPayload));
      await axios.post('/api/v1/auth/logout');
      thunkAPI.dispatch(setLoading({ ...dispatchPayload, loading: false }));
      return null;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Logout failed'
      );
    }
  }),
  register: createAsyncThunk(
    'auth/register',
    async (credentials: RegisterCredential, thunkAPI) => {
      try {
        const dispatchPayload = {
          key: 'register',
          loading: true,
          isGlobal: true,
        };
        thunkAPI.dispatch(setLoading(dispatchPayload));
        const { data } = await axios.post<ResponseAuthData>(
          '/api/v1/auth/register',
          credentials
        );
        thunkAPI.dispatch(setLoading({ ...dispatchPayload, loading: false }));
        return data;
      } catch (err: any) {
        return thunkAPI.rejectWithValue(
          err.response?.data?.message || 'Register failed'
        );
      }
    }
  ),
  refreshToken: createAsyncThunk('auth/refreshToken', async (_, thunkAPI) => {
    const dispatchPayload = {
      key: 'refreshToken',
      loading: true,
      isGlobal: true,
    };
    try {
      thunkAPI.dispatch(setLoading(dispatchPayload));
      const { data } = await axios.get<ResponseAuthData>(
        '/api/v1/auth/refresh-token'
      );
      thunkAPI.dispatch(setLoading({ ...dispatchPayload, loading: false }));
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Refresh token failed'
      );
    } finally {
      thunkAPI.dispatch(setLoading({ ...dispatchPayload, loading: false }));
    }
  }),
};

export default authAPI;
