import { useState, useEffect, useCallback, lazy } from 'react';
import MainJobModal from '../../components/JobModal/MainJobModal';
const AddJobModal = lazy(() => import('../../components/JobModal/AddJobModal'));
import JobCard, { JobInfo } from '../../components/JobCard';
const UpdateJobModal = lazy(
  () => import('../../components/JobModal/UpdateJobModal')
);
const DeleteJobModal = lazy(
  () => import('../../components/JobModal/DeleteJobModal')
);
import { useAppDispatch, useAppSelector } from '../../app/store';
import jobAPI from '../../features/job/jobAPI';
import useSocket from '../../hooks/useSocket';
import { RiAddLine } from '@remixicon/react';
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
  useSocket(userid || '', role || '');
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
      <div className='flex justify-between'>
        <h1 className='md:text-4xl text-2xl mx-4 font-bold text-gray-900 dark:text-white'>
          Jobs
        </h1>
        <button
          className='bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600'
          onClick={() => setModal({ type: 'add', Job: null })}
        >
          <RiAddLine />
        </button>
      </div>
      <div className='h-[90%] mt-4 sm:mx-[20px] bg-white dark:bg-gray-800 rounded-lg shadow-lg'>
        <div className='flex flex-col gap-y-4 p-4'>
          {jobs.length === 0 ? (
            <p className='text-center text-gray-600 dark:text-white'>
              No jobs found
            </p>
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
      {modal?.type === 'add' && (
        <MainJobModal
          title='Add Job'
          headerColor='bg-blue-500'
          onClose={handleAfterModalActionJobs}
        >
          <AddJobModal />
        </MainJobModal>
      )}
      {modal?.type === 'update' && modal?.Job && (
        <MainJobModal
          title='Update Job'
          headerColor='bg-blue-500'
          onClose={handleAfterModalActionJobs}
        >
          <UpdateJobModal
            jobID={modal.Job._id}
            company={modal.Job.company}
            position={modal.Job.position}
            status={modal.Job.status || ''}
          />
        </MainJobModal>
      )}
      {modal?.type === 'delete' && modal?.Job && (
        <MainJobModal
          title='Delete Job'
          headerColor='bg-red-500'
          onClose={handleAfterModalActionJobs}
        >
          <DeleteJobModal
            jobID={modal?.Job._id}
            company={modal?.Job.company}
            position={modal?.Job.position}
            status={modal?.Job.status || ''}
          />
        </MainJobModal>
      )}
    </>
  );
};

export default JobsView;
