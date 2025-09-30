import { createSlice } from '@reduxjs/toolkit';
import authAPI from './authAPI';

interface AuthState {
  user: string | null;
  role: string | null;
  accessToken: string;
  isLoading: boolean;
  error: string | null;
  registerError: string | null;
}

const initialState: AuthState = {
  user: null,
  role: null,
  accessToken: '',
  isLoading: false,
  registerError: null,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(authAPI.login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(authAPI.login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.username;
        state.role = action.payload.role;
        state.accessToken = action.payload.accessToken;
      })
      .addCase(authAPI.login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Logout
      .addCase(authAPI.logout.fulfilled, (state) => {
        state.user = null;
        state.accessToken = '';
      })

      // Register
      .addCase(authAPI.register.pending, (state) => {
        state.isLoading = true;
        state.registerError = null;
      })
      .addCase(authAPI.register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.username;
        state.role = action.payload.role;
        state.accessToken = action.payload.accessToken;
      })
      .addCase(authAPI.register.rejected, (state, action) => {
        state.isLoading = false;
        state.registerError = action.payload as string;
      })

      // Refresh token
      .addCase(authAPI.refreshToken.fulfilled, (state, action) => {
        state.user = action.payload.username;
        state.role = action.payload.role;
        state.accessToken = action.payload.accessToken;
      });
  },
});

export default authSlice.reducer;
