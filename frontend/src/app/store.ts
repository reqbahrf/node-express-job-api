import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import loadingReducer from '../features/loading/loadingSlice';
import jobReducer from '../features/job/jobSlice';
import uiReducer from '../features/ui/uiSlice';
import companyReducer from '../features/employer/companySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    loading: loadingReducer,
    job: jobReducer,
    ui: uiReducer,
    company: companyReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
