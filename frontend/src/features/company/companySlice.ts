import { createSlice } from '@reduxjs/toolkit';
import type { CompanyInfo } from '@/types/company';
import { companyAPI } from './companyAPI';

interface CompanyState {
  companies: CompanyInfo[];
  loading: boolean;
  error: string | null;
}

const initialState: CompanyState = {
  companies: [],
  loading: false,
  error: null,
};

const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(companyAPI.getCompanies.pending, (state) => {
        state.loading = true;
      })
      .addCase(companyAPI.getCompanies.fulfilled, (state, action) => {
        state.loading = false;
        state.companies = action.payload;
      })
      .addCase(companyAPI.getCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(companyAPI.updateCompanyStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(companyAPI.updateCompanyStatus.fulfilled, (state, action) => {
        state.loading = false;
        const { companyId, status } = action.payload;
        const index = state.companies.findIndex(
          (company) => company._id === companyId,
        );
        if (index !== -1) {
          state.companies[index] = {
            ...state.companies[index],
            status,
          };
        }
      })
      .addCase(companyAPI.updateCompanyStatus.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default companySlice.reducer;
