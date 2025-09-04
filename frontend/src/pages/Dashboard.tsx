import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import AddJobModal from '../components/modal/AddJobModal';
import JobCard, { JobInfo } from '../components/JobCard';
import UpdateJobModal from '../components/modal/UpdateJobModal';
import DeleteJobModal from '../components/modal/DeleteJobModal';

interface JobRes {
  jobs: JobInfo[];
  count: number;
}
const Dashboard = () => {
  const [jobs, setJobs] = useState<JobInfo[]>([]);
  const [openAddJobModal, setOpenAddJobModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobInfo | null>(null);
  const [openUpdateJobModal, setOpenUpdateJobModal] = useState(false);
  const [openDeleteJobModal, setOpenDeleteJobModal] = useState(false);
  const { accessToken } = useAuth();
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
  useEffect(() => {
    if (accessToken) fetchJobs();
  }, [accessToken]);

  return (
    <>
      <Header />
      <div className=' bg-amber-50 min-h-screen flex justify-center'>
        <div className='md:w-1/2 w-full h-[80vh] mt-[100px] sm:mx-[20px]'>
          <div className='flex justify-between'>
            <h1 className='md:text-4xl text-2xl mx-4 font-bold text-gray-900'>
              Jobs
            </h1>
            <button
              className='bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600'
              onClick={() => setOpenAddJobModal(true)}
            >
              Add Job
            </button>
          </div>
          <div className='w-full h-full mt-4 sm:mx-[20px] bg-white rounded-lg shadow-lg overflow-y-scroll'>
            <div className='flex flex-col gap-4 p-4'>
              {jobs.length === 0 ? (
                <p className='text-center text-gray-600'>No jobs found</p>
              ) : (
                jobs.map((job) => (
                  <JobCard
                    key={job._id}
                    {...job}
                    onUpdate={() => {
                      setSelectedJob(job);
                      setOpenUpdateJobModal(true);
                    }}
                    onDelete={() => {
                      setSelectedJob(job);
                      setOpenDeleteJobModal(true);
                    }}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      {openAddJobModal && (
        <AddJobModal
          onClose={() => {
            setOpenAddJobModal(false);
            fetchJobs();
          }}
        />
      )}
      {selectedJob && openUpdateJobModal && (
        <UpdateJobModal
          jobID={selectedJob._id}
          company={selectedJob.company}
          position={selectedJob.position}
          status={selectedJob.status}
          onUpdate={() => {
            setSelectedJob(null);
            setOpenUpdateJobModal(false);
            fetchJobs();
          }}
          onClose={() => {
            setSelectedJob(null);
            setOpenUpdateJobModal(false);
          }}
        />
      )}
      {selectedJob && openDeleteJobModal && (
        <DeleteJobModal
          jobID={selectedJob._id}
          company={selectedJob.company}
          position={selectedJob.position}
          status={selectedJob.status}
          onDelete={() => {
            setSelectedJob(null);
            setOpenDeleteJobModal(false);
            fetchJobs();
          }}
          onClose={() => {
            setSelectedJob(null);
            setOpenDeleteJobModal(false);
          }}
        />
      )}
    </>
  );
};

export default Dashboard;
