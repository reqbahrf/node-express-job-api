import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
axios.defaults.withCredentials = true;

interface Credentials {
  email: string;
  password: string;
}

interface RegisterCredential extends Credentials {
  name: string;
}

interface ResponseAuthData {
  username: string;
  accessToken: string;
}

const login = createAsyncThunk(
  'auth/login',
  async (credentials: Credentials, thunkAPI) => {
    try {
      const { data } = await axios.post<ResponseAuthData>(
        '/api/v1/auth/login',
        credentials
      );
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Login failed'
      );
    }
  }
);

const logout = createAsyncThunk('auth/logout', async () => {
  await axios.post('/api/v1/auth/logout');
  return null;
});

const register = createAsyncThunk(
  'auth/register',
  async (credentials: RegisterCredential, thunkAPI) => {
    try {
      const { data } = await axios.post<ResponseAuthData>(
        '/api/v1/auth/register',
        credentials
      );
      return data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || 'Register failed'
      );
    }
  }
);
const refreshToken = createAsyncThunk('auth/refreshToken', async () => {
  const { data } = await axios.get<ResponseAuthData>(
    '/api/v1/auth/refresh-token'
  );
  return data;
});

export { login, logout, register, refreshToken };
