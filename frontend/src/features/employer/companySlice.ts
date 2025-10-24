import { createSlice } from '@reduxjs/toolkit';
import { companyAPI } from '../company/companyAPI';
import type { CompanyState } from '../../types/company';

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
