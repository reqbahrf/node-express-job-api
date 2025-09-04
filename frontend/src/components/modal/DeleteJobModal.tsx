import React from 'react';
import MainModal from './MainModal';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
interface DeleteJobModalProps {
  jobID: string;
  company: string;
  status: string;
  position: string;
  onDelete: () => void;
  onClose: () => void;
}
const DeleteJobModal = (props: DeleteJobModalProps) => {
  const { jobID, company, status, position, onDelete, onClose } = props;
  const { accessToken } = useAuth();
  const handleDelete = async (JobId: string) => {
    try {
      await axios.delete(`/api/v1/jobs/${JobId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      onDelete();
    } catch (error) {
      console.log(error);
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
            className='bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600'
          >
            Delete
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
