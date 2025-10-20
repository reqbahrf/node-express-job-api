import { createSlice } from '@reduxjs/toolkit';
import { companyAPI } from './companyAPI';

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

export interface CompanyState {
  company: CompanyInfo | null;
  isRegistered: boolean;
}

const initialState: CompanyState = {
  company: null,
  isRegistered: false,
};

const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(companyAPI.getCompanyInfo.fulfilled, (state, action) => {
      state.company = action.payload.company;
      state.isRegistered = action.payload.isRegistered;
    });
    builder.addCase(companyAPI.getCompanyInfo.rejected, (state) => {
      state.company = null;
      state.isRegistered = false;
    });
    builder.addCase(companyAPI.registerCompany.fulfilled, (state, action) => {
      state.company = action.payload.company;
      state.isRegistered = action.payload.isRegistered;
    });
    builder.addCase(companyAPI.registerCompany.rejected, (state) => {
      state.company = null;
      state.isRegistered = false;
    });
  },
});

export default companySlice.reducer;
