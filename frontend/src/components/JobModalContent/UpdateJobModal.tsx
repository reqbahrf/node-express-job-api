import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { setLoading } from '../../features/loading/loadingSlice';
import jobAPI from '../../features/job/jobAPI';
import toast from 'react-hot-toast';
interface UpdateJobModalProps {
  jobID: string;
  companyName: string;
  status: string;
  position: string;
  onClose?: () => void;
}

const UpdateJobModal = (props: UpdateJobModalProps) => {
  const { jobID, companyName, status, position } = props;
  const isLoading = useAppSelector(
    (state) => state.loading.loadingState?.updateJob?.loading,
  );
  const dispatch = useAppDispatch();
  const [formData, setFromData] = useState({
    companyName,
    position,
    status,
  });
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFromData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const dispatchPayload = { key: 'updateJob', loading: true };
    dispatch(setLoading(dispatchPayload));

    try {
      await dispatch(jobAPI.updateJob({ jobID, formData })).unwrap();
      props?.onClose?.();
      toast.success('Job updated successfully');
    } catch (err) {
      toast.error(`Failed to update job: ${err}`);
    } finally {
      dispatch(setLoading({ ...dispatchPayload, loading: false }));
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <input
        type='text'
        name='companyName'
        id='companyName'
        value={formData.companyName}
        onChange={handleChange}
        placeholder='Company'
        className='mb-4 w-full rounded border border-gray-300 p-2'
      />
      <input
        type='text'
        name='position'
        id='position'
        value={formData.position}
        onChange={handleChange}
        placeholder='Position'
        className='mb-4 w-full rounded border border-gray-300 p-2'
      />
      <select
        name='status'
        id='status'
        value={formData.status}
        onChange={handleChange}
        className='mb-4 w-full rounded border border-gray-300 bg-white p-2 text-black dark:bg-gray-800 dark:text-white'
      >
        <option value='pending'>Pending</option>
        <option value='interview'>Interview</option>
        <option value='declined'>declined</option>
      </select>
      <button
        type='submit'
        disabled={isLoading}
        className='rounded bg-blue-400 px-4 py-2 text-white'
      >
        {isLoading ? 'Updating...' : 'Update'}
      </button>
    </form>
  );
};

export default UpdateJobModal;
