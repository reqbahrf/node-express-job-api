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

type ModalState = {
  type: 'add' | 'update' | 'delete' | null;
  Job: JobInfo | null;
} | null;

const Dashboard = () => {
  const [jobs, setJobs] = useState<JobInfo[]>([]);
  const [modal, setModal] = useState<ModalState>({ type: null, Job: null });
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
  const handleDeleteJobs = () => {
    setModal({ type: null, Job: null });
    fetchJobs();
  };

  const handleUpdateJobs = () => {
    setModal({ type: null, Job: null });
    fetchJobs();
  };

  const handleCloseUpdateJobModal = () => {
    setModal({ type: null, Job: null });
  };

  const handleCloseDeleteJobModal = () => {
    setModal({ type: null, Job: null });
  };
  useEffect(() => {
    fetchJobs();
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
              onClick={() => setModal({ type: 'add', Job: null })}
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
                      setModal({ type: 'update', Job: job });
                    }}
                    onDelete={() => {
                      setModal({ type: 'delete', Job: job });
                    }}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      {modal?.type === 'add' && (
        <AddJobModal
          onClose={() => {
            setModal(null);
            fetchJobs();
          }}
        />
      )}
      {modal?.type === 'update' && modal?.Job && (
        <UpdateJobModal
          jobID={modal.Job._id}
          company={modal.Job.company}
          position={modal.Job.position}
          status={modal.Job.status}
          onUpdate={handleUpdateJobs}
          onClose={handleCloseUpdateJobModal}
        />
      )}
      {modal?.type === 'delete' && modal?.Job && (
        <DeleteJobModal
          jobID={modal?.Job._id}
          company={modal?.Job.company}
          position={modal?.Job.position}
          status={modal?.Job.status}
          onDelete={handleDeleteJobs}
          onClose={handleCloseDeleteJobModal}
        />
      )}
    </>
  );
};

export default Dashboard;
