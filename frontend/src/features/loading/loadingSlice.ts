import { createSlice } from '@reduxjs/toolkit';

interface LoadingState {
  loadingState: {
    [key: string]: {
      loading: boolean;
      isGlobal: boolean;
    };
  };
  globalLoading: boolean;
}

const initialState: LoadingState = {
  loadingState: {},
  globalLoading: false,
};

const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    setLoading: (
      state,
      action: { payload: { key: string; loading: boolean; isGlobal?: boolean } }
    ) => {
      const { key, loading, isGlobal = false } = action.payload;

      state.loadingState[key] = { loading, isGlobal };
      if (isGlobal) {
        state.globalLoading = Object.values(state.loadingState).some(
          (isLoading) => isLoading.isGlobal && isLoading.loading
        );
      }
    },
    clearAllLoading: (state) => {
      state.loadingState = {};
      state.globalLoading = false;
    },
  },
});

export default loadingSlice.reducer;
export const { setLoading, clearAllLoading } = loadingSlice.actions;
