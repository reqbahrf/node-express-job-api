import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
const AddJobModal = lazy(() => import('../modal/AddJobModal'));
import JobCard, { JobInfo } from '../JobCard';
const UpdateJobModal = lazy(() => import('../modal/UpdateJobModal'));
const DeleteJobModal = lazy(() => import('../modal/DeleteJobModal'));
import { useAppDispatch, useAppSelector } from '../../app/store';
import jobAPI from '../../features/job/jobAPI';
import Loading from '../Loading';
import useSocket from '../../hooks/useSocket';
type ModalState =
  | {
      type: 'add' | 'update' | 'delete' | null;
      Job: JobInfo | null;
    }
  | { type: null; Job: null };

const JobsView = () => {
  const dispatch = useAppDispatch();
  const jobs = useAppSelector((state) => state.job.jobs);
  const { userid, role } = useAppSelector((state) => state.auth);
  const { isConnected, userCount } = useSocket(userid || '', role || '');
  const [modal, setModal] = useState<ModalState>({ type: null, Job: null });
  const handleUpdateJobs = useCallback((job: JobInfo) => {
    setModal({ type: 'update', Job: job });
  }, []);

  const handleDeleteJob = useCallback((Job: JobInfo) => {
    setModal({ type: 'delete', Job: Job });
  }, []);

  const handleAfterModalActionJobs = useCallback(() => {
    setModal({ type: null, Job: null });
  }, []);

  useEffect(() => {
    dispatch(jobAPI.fetchJob());
  }, [dispatch]);
  return (
    <>
      {' '}
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
      <Suspense fallback={<Loading />}>
        {modal?.type === 'add' && (
          <AddJobModal onClose={handleAfterModalActionJobs} />
        )}
        {modal?.type === 'update' && modal?.Job && (
          <UpdateJobModal
            jobID={modal.Job._id}
            company={modal.Job.company}
            position={modal.Job.position}
            status={modal.Job.status || ''}
            onClose={handleAfterModalActionJobs}
          />
        )}
        {modal?.type === 'delete' && modal?.Job && (
          <DeleteJobModal
            jobID={modal?.Job._id}
            company={modal?.Job.company}
            position={modal?.Job.position}
            status={modal?.Job.status || ''}
            onClose={handleAfterModalActionJobs}
          />
        )}
      </Suspense>
    </>
  );
};

export default JobsView;
