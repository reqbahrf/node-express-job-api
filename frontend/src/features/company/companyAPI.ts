import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { setLoading } from '../loading/loadingSlice';
import { toast } from 'react-hot-toast';
import getAccessToken from '@/utils/getAccessToken';
import type {
  CompanyInfo,
  CompanyState,
  QueryParams,
} from '@/../../libs/company.d';

interface GetCompanyInfoPayload {
  companyId: string;
}

interface UpdateCompanyStatusPayload {
  companyId: string;
  status: CompanyInfo['status'];
}

export const companyAPI = {
  registerCompany: createAsyncThunk(
    'company/registerCompany',
    async (
      {
        formData,
      }: {
        formData: object;
      },
      thunkAPI,
    ) => {
      const { data } = await toast.promise(
        axios.post<CompanyState>('/api/v1/company/register-company', formData, {
          headers: {
            Authorization: `Bearer ${getAccessToken(thunkAPI)}`,
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
    async ({ companyId }: GetCompanyInfoPayload, thunkAPI) => {
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
              Authorization: `Bearer ${getAccessToken(thunkAPI)}`,
            },
          },
        );
        return data;
      } catch (error: any) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message || 'Failed to get company info',
        );
      } finally {
        thunkAPI.dispatch(setLoading({ ...dispatchPayload, loading: false }));
      }
    },
  ),
  updateCompanyStatus: createAsyncThunk(
    'company/updateCompanyStatus',
    async ({ companyId, status }: UpdateCompanyStatusPayload, thunkAPI) => {
      try {
        await toast.promise(
          axios.patch(
            `/api/v1/company/update-status/${companyId}`,
            { status },
            {
              headers: {
                Authorization: `Bearer ${getAccessToken(thunkAPI)}`,
              },
            },
          ),
          {
            loading: 'Updating company status...',
            success: (response) =>
              response.data.msg || 'Company status updated successfully!',
            error: (err) =>
              err.response?.data?.msg || 'Failed to update company status',
          },
        );
        return { companyId, status };
      } catch (error: any) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message || 'Failed to update company status',
        );
      }
    },
  ),
  getCompanies: createAsyncThunk(
    'company/getCompanies',
    async (queryParams: QueryParams, thunkAPI) => {
      const dispatchPayload = {
        key: 'getCompanies',
        loading: true,
        isGlobal: false,
      };
      try {
        thunkAPI.dispatch(setLoading(dispatchPayload));

        const params = new URLSearchParams();
        for (const key in queryParams) {
          if (
            queryParams[key as keyof QueryParams] !== undefined &&
            queryParams[key as keyof QueryParams] !== ''
          ) {
            params.append(key, queryParams[key as keyof QueryParams] as string);
          }
        }

        const url = `/api/v1/company/get-companies?${params.toString()}`;

        const { data } = await axios.get<{ companies: CompanyInfo[] }>(url, {
          headers: {
            Authorization: `Bearer ${getAccessToken(thunkAPI)}`,
          },
          signal: thunkAPI.signal,
        });
        return data.companies;
      } catch (error: any) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message || 'Failed to fetch companies',
        );
      } finally {
        thunkAPI.dispatch(setLoading({ ...dispatchPayload, loading: false }));
      }
    },
  ),
};
