import { RootState } from '../app/store';
import type { GetThunkAPI } from '@reduxjs/toolkit';
const getAccessToken = (thunkAPI: GetThunkAPI<never>) => {
  const state = thunkAPI.getState() as RootState;
  return state.auth.accessToken;
};

export default getAccessToken;
