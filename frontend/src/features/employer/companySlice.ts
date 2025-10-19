import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { setLoading } from '../loading/loadingSlice';
import type { NavigateFunction } from 'react-router-dom';
interface CompanyInfo {
  _id?: string;
  employer: string;
  companyName: string;
  ceoName: string;
  industry: string;
  address: string;
  website: string;
  contactEmail: string;
  contactPhone: string;
  logoUrl: string;
  registrationDocs: string[];
  status: 'pending' | 'approved' | 'rejected';
  createdAt?: Date;
  updatedAt?: Date;
}

interface CompanyState {
  company: CompanyInfo | null;
  isRegistered: boolean;
}

const initialState: CompanyState = {
  company: null,
  isRegistered: false,
};

interface GetCompanyInfoPayload {
  companyId: string;
  accessToken: string;
  navigate: NavigateFunction;
}

const getCompanyInfo = createAsyncThunk(
  'company/getCompanyInfo',
  async (
    { companyId, accessToken, navigate }: GetCompanyInfoPayload,
    thunkAPI,
  ) => {
    const dispatchPayload = {
      key: 'getCompanyInfo',
      loading: true,
      isGlobal: false,
    };
    try {
      thunkAPI.dispatch(setLoading(dispatchPayload));
      const { data } = await axios.get<CompanyState>(
        `/api/v1/company/get-company/${companyId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      return data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        navigate('/employer/company-form');
        thunkAPI.rejectWithValue(
          error.response?.data?.msg || 'Company not found',
        );
      }
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to get company info',
      );
    } finally {
      thunkAPI.dispatch(setLoading({ ...dispatchPayload, loading: false }));
    }
  },
);

const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCompanyInfo.fulfilled, (state, action) => {
      state.company = action.payload.company;
      state.isRegistered = action.payload.isRegistered;
    });
    builder.addCase(getCompanyInfo.rejected, (state) => {
      state.company = null;
      state.isRegistered = false;
    });
  },
});

export { getCompanyInfo };

export default companySlice.reducer;
