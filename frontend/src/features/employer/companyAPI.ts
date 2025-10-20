import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import type { NavigateFunction } from 'react-router-dom';
import { setLoading } from '../loading/loadingSlice';
import { CompanyState } from './companySlice';
import { toast } from 'react-hot-toast';

interface GetCompanyInfoPayload {
  companyId: string;
  accessToken: string;
  navigate: NavigateFunction;
}

export const companyAPI = {
  registerCompany: createAsyncThunk(
    'company/registerCompany',
    async ({
      formData,
      accessToken,
    }: {
      formData: FormData;
      accessToken: string;
    }) => {
      const { data } = await toast.promise(
        axios.post<CompanyState>('/api/v1/company/register-company', formData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'multipart/form-data',
          },
        }),
        {
          loading: 'Submitting company info...',
          success: 'Company registered successfully!',
          error: (err) =>
            err.response?.data?.msg || 'Failed to submit company info',
        },
      );
      return data;
    },
  ),
  getCompanyInfo: createAsyncThunk(
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
  ),
};
