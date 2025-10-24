import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type viewType = 'Dashboard' | 'Account' | 'Login' | 'Register' | 'Companies';

interface UIstate {
  activeView: viewType;
}
const initialState: UIstate = {
  activeView: 'Dashboard',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setActiveView: (state, action: PayloadAction<viewType>) => {
      state.activeView = action.payload;
    },
  },
});

export const { setActiveView } = uiSlice.actions;
export default uiSlice.reducer;
