import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { JobRes } from './jobSlice';
import { JobInfo } from '../../components/JobCard';
import { RootState } from '../../app/store';
interface FromData {
  company: string;
  position: string;
  status?: string;
}

const getAccessToken = (thunkAPI: any) => {
  const state = thunkAPI.getState() as RootState;
  return state.auth.accessToken;
};

const jobAPI = {
  fetchJob: createAsyncThunk('get/jobs', async (_, thunkAPI) => {
    try {
      const { data } = await axios.get<JobRes>('/api/v1/jobs', {
        headers: {
          Authorization: `Bearer ${getAccessToken(thunkAPI)}`,
        },
      });
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Fetch jobs failed'
      );
    }
  }),
  createNewJob: createAsyncThunk(
    'post/job',
    async (formData: FromData, thunkAPI) => {
      try {
        const { data } = await axios.post<{ job: JobInfo }>(
          '/api/v1/jobs',
          formData,
          {
            headers: {
              Authorization: `Bearer ${getAccessToken(thunkAPI)}`,
            },
          }
        );
        return data.job;
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message || 'Create job failed'
        );
      }
    }
  ),
  updateJob: createAsyncThunk(
    'update/job',
    async (
      { formData, jobID }: { formData: FromData; jobID: string },
      thunkAPI
    ) => {
      try {
        await axios.patch(`/api/v1/jobs/${jobID}`, formData, {
          headers: {
            Authorization: `Bearer ${getAccessToken(thunkAPI)}`,
          },
        });
        return { ...formData, jobID };
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message || 'Update job failed'
        );
      }
    }
  ),
  deleleJob: createAsyncThunk('delete/job', async (jobID: string, thunkAPI) => {
    try {
      await axios.delete(`/api/v1/jobs/${jobID}`, {
        headers: {
          Authorization: `Bearer ${getAccessToken(thunkAPI)}`,
        },
      });
      return jobID;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Delete job failed'
      );
    }
  }),
};
export default jobAPI;
