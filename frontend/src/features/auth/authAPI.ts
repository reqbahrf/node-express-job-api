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
  email: string;
  username: string;
  role: string;
  accessToken: string;
}

const authAPI = {
  login: createAsyncThunk(
    'auth/login',
    async (credentials: Credentials, thunkAPI) => {
      const dispatchPayload = { key: 'login', loading: true, isGlobal: true };
      try {
        thunkAPI.dispatch(setLoading(dispatchPayload));
        const { data } = await axios.post<ResponseAuthData>(
          '/api/v1/auth/login',
          credentials,
          {
            signal: thunkAPI.signal,
          },
        );

        return data;
      } catch (error: any) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.msg || 'Login failed',
        );
      } finally {
        thunkAPI.dispatch(setLoading({ ...dispatchPayload, loading: false }));
      }
    },
  ),
  logout: createAsyncThunk('auth/logout', async (_, thunkAPI) => {
    const dispatchPayload = { key: 'logout', loading: true, isGlobal: true };
    try {
      thunkAPI.dispatch(setLoading(dispatchPayload));
      await axios.post(
        '/api/v1/auth/logout',
        {},
        {
          signal: thunkAPI.signal,
        },
      );
      thunkAPI.dispatch(setLoading({ ...dispatchPayload, loading: false }));
      return null;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.msg || 'Logout failed',
      );
    } finally {
      thunkAPI.dispatch(setLoading({ ...dispatchPayload, loading: false }));
    }
  }),
  register: createAsyncThunk(
    'auth/register',
    async (credentials: RegisterCredential, thunkAPI) => {
      const dispatchPayload = {
        key: 'register',
        loading: true,
        isGlobal: true,
      };
      try {
        thunkAPI.dispatch(setLoading(dispatchPayload));
        const { data } = await axios.post<ResponseAuthData>(
          '/api/v1/auth/register',
          credentials,
          {
            signal: thunkAPI.signal,
          },
        );
        return data;
      } catch (err: any) {
        return thunkAPI.rejectWithValue(
          err.response?.data?.message || 'Register failed',
        );
      } finally {
        thunkAPI.dispatch(setLoading({ ...dispatchPayload, loading: false }));
      }
    },
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
        '/api/v1/auth/refresh-token',
        {
          signal: thunkAPI.signal,
        },
      );
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Refresh token failed',
      );
    } finally {
      thunkAPI.dispatch(setLoading({ ...dispatchPayload, loading: false }));
    }
  }),
};

export default authAPI;
