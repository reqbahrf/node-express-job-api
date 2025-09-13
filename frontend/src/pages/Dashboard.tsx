import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import AddJobModal from '../components/modal/AddJobModal';
import JobCard, { JobInfo } from '../components/JobCard';
import UpdateJobModal from '../components/modal/UpdateJobModal';
import DeleteJobModal from '../components/modal/DeleteJobModal';
import { useAppDispatch, useAppSelector } from '../app/store';
import jobAPI from '../features/job/jobAPI';

interface JobRes {
  jobs: JobInfo[];
  count: number;
}

type ModalState = {
  type: 'add' | 'update' | 'delete' | null;
  Job: JobInfo | null;
} | null;

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const jobs = useAppSelector((state) => state.job.jobs);
  const [modal, setModal] = useState<ModalState>({ type: null, Job: null });
  const handleUpdateJobs = useCallback((job: JobInfo) => {
    setModal({ type: 'update', Job: job });
  }, []);

  const handleDeleteJob = useCallback((Job: JobInfo) => {
    setModal({ type: 'delete', Job: Job });
  }, []);

  const handleAfterDeleteJobs = () => {
    setModal({ type: null, Job: null });
    dispatch(jobAPI.fetchJob());
  };

  const handleAfterUpdateJobs = () => {
    setModal({ type: null, Job: null });
    dispatch(jobAPI.fetchJob());
  };

  const handleCloseUpdateJobModal = () => {
    setModal({ type: null, Job: null });
  };

  const handleCloseDeleteJobModal = () => {
    setModal({ type: null, Job: null });
  };

  useEffect(() => {
    dispatch(jobAPI.fetchJob());
  }, []);
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
                    onUpdate={handleUpdateJobs}
                    onDelete={handleDeleteJob}
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
          }}
        />
      )}
      {modal?.type === 'update' && modal?.Job && (
        <UpdateJobModal
          jobID={modal.Job._id}
          company={modal.Job.company}
          position={modal.Job.position}
          status={modal.Job.status || ''}
          onUpdate={handleAfterUpdateJobs}
          onClose={handleCloseUpdateJobModal}
        />
      )}
      {modal?.type === 'delete' && modal?.Job && (
        <DeleteJobModal
          jobID={modal?.Job._id}
          company={modal?.Job.company}
          position={modal?.Job.position}
          status={modal?.Job.status || ''}
          onDelete={handleAfterDeleteJobs}
          onClose={handleCloseDeleteJobModal}
        />
      )}
    </>
  );
};

export default Dashboard;
