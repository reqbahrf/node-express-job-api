import { createSlice } from '@reduxjs/toolkit';
import { JobInfo } from '../../components/JobCard';
import jobAPI from './jobAPI';

export interface JobRes {
  jobs: JobInfo[];
  count: number;
}

const initialState: JobRes = {
  jobs: [],
  count: 0,
};

const jobSlice = createSlice({
  name: 'job',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(jobAPI.fetchJob.fulfilled, (state, action) => {
      state.jobs = action.payload.jobs;
      state.count = action.payload.count;
    });
    builder.addCase(jobAPI.createNewJob.fulfilled, (state, action) => {
      state.jobs.push(action.payload);
    });
    builder.addCase(jobAPI.updateJob.fulfilled, (state, action) => {
      const { jobID, company, position, status } = action.payload;
      const index = state.jobs.findIndex((job) => job._id === jobID);
      if (index !== -1) {
        state.jobs[index] = {
          ...state.jobs[index],
          company,
          position,
          status: status || '',
        };
      }
    });
    builder.addCase(jobAPI.deleleJob.fulfilled, (state, action) => {
      const jobID = action.payload;
      state.jobs = state.jobs.filter((job) => job._id !== jobID);
    });
  },
});

export default jobSlice.reducer;
