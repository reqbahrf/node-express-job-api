import React from 'react';
import MainModal from './MainModal';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { setLoading } from '../../features/loading/loadingSlice';
import jobAPI from '../../features/job/jobAPI';
interface DeleteJobModalProps {
  jobID: string;
  company: string;
  status: string;
  position: string;
  onClose: () => void;
}
const DeleteJobModal = (props: DeleteJobModalProps) => {
  const dispatch = useAppDispatch();
  const { jobID, company, status, position, onClose } = props;
  const isLoading = useAppSelector(
    (state) => state.loading.loadingState?.deleteJob?.loading
  );
  const handleDelete = async (JobId: string) => {
    const dispatchPayload = { key: 'deleteJob', loading: true };
    dispatch(setLoading(dispatchPayload));
    try {
      await dispatch(jobAPI.deleleJob(JobId));
      onClose();
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(setLoading({ ...dispatchPayload, loading: false }));
    }
  };
  return (
    <MainModal
      title='Delete Job'
      headerColor='bg-red-500'
      onClose={onClose}
    >
      <div>
        <p>
          Are you sure you want to delete this job for{' '}
          <span className='font-bold'>{company}</span> -{' '}
          <span className='font-bold'>{position}</span> with a current status{' '}
          <span className='font-bold'>{status}</span>?
        </p>
        <div className='flex justify-end gap-2'>
          <button
            onClick={() => handleDelete(jobID)}
            disabled={isLoading}
            className='bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600'
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </button>
          <button
            onClick={onClose}
            className='bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600'
          >
            Cancel
          </button>
        </div>
      </div>
    </MainModal>
  );
};

export default DeleteJobModal;
