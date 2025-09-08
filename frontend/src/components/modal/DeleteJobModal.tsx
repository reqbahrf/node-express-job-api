import React from 'react';
import MainModal from './MainModal';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useLoading } from '../../hooks/useLoading';
interface DeleteJobModalProps {
  jobID: string;
  company: string;
  status: string;
  position: string;
  onDelete: () => void;
  onClose: () => void;
}
const DeleteJobModal = (props: DeleteJobModalProps) => {
  const deleteLoading = useLoading();
  const { jobID, company, status, position, onDelete, onClose } = props;
  const { accessToken } = useAuth();
  const handleDelete = (JobId: string) => {
    deleteLoading.withLoading(async () => {
      await axios.delete(`/api/v1/jobs/${JobId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      onDelete();
    });
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
            disabled={deleteLoading.loading}
            className='bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600'
          >
            {deleteLoading.loading ? 'Deleting...' : 'Delete'}
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
