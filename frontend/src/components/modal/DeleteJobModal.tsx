import React from 'react';
import MainModal from './MainModal';
import axios from 'axios';
import { useAppDispatch, useAppSelector } from '../../app/store';
import {
  setLoading,
  clearAllLoading,
} from '../../features/loading/loadingSlice';
interface DeleteJobModalProps {
  jobID: string;
  company: string;
  status: string;
  position: string;
  onDelete: () => void;
  onClose: () => void;
}
const DeleteJobModal = (props: DeleteJobModalProps) => {
  const dispatch = useAppDispatch();
  const { jobID, company, status, position, onDelete, onClose } = props;
  const { accessToken } = useAppSelector((state) => state.auth);
  const isLoading = useAppSelector(
    (state) => state.loading.loadingState.deleteJob
  );
  const handleDelete = async (JobId: string) => {
    const dispatchPayload = { key: 'deleteJob', loading: true };
    dispatch(setLoading(dispatchPayload));
    await axios.delete(`/api/v1/jobs/${JobId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    dispatch(setLoading({ ...dispatchPayload, loading: false }));
    onDelete();
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
            disabled={isLoading.loading}
            className='bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600'
          >
            {isLoading.loading ? 'Deleting...' : 'Delete'}
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
