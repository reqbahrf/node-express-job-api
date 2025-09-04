import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import JobCard, { JobInfo } from '../components/JobCard';

interface JobRes {
  jobs: JobInfo[];
  count: number;
}
const Dashboard = () => {
  const [jobs, setJobs] = useState<JobInfo[]>([]);
  const { accessToken } = useAuth();
  console.log(jobs);
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await axios.get<JobRes>('/api/v1/jobs', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setJobs(data.jobs);
      } catch (error) {
        console.log(error);
      }
    };
    if (accessToken) fetchJobs();
  }, [accessToken]);

  return (
    <>
      <Header />
      <div className=' bg-amber-50 min-h-screen flex justify-center'>
        <div className='md:w-1/2 w-full h-[80vh] mt-[100px] sm:mx-[20px]'>
          <h1 className='md:text-4xl text-2xl font-bold text-gray-900'>Jobs</h1>
          <div className='w-full h-full mt-4 sm:mx-[20px] bg-white rounded-lg shadow-lg overflow-y-scroll'>
            <div className='flex flex-col gap-4 p-4'>
              {jobs.length === 0 ? (
                <p className='text-center text-gray-600'>No jobs found</p>
              ) : (
                jobs.map((job) => (
                  <JobCard
                    key={job._id}
                    {...job}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
