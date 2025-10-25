import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { setLoading } from '../../features/loading/loadingSlice';
import toast from 'react-hot-toast';
import jobAPI from '../../features/job/jobAPI';
const AddJobModal = (props: { onClose?: () => void }) => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(
    (state) => state.loading.loadingState?.addJob?.loading,
  );
  const [formData, setFromData] = useState({
    companyName: '',
    position: '',
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFromData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const dispatchPayload = { key: 'addJob', loading: true };
    dispatch(setLoading(dispatchPayload));

    try {
      await dispatch(jobAPI.createNewJob(formData)).unwrap();
      props?.onClose?.();
      toast.success('Job added successfully');
    } catch (err) {
      toast.error(`Failed to add job: ${err}`);
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
        placeholder='Company'
        className='mb-4 w-full rounded border p-2 dark:border-gray-700 dark:text-white'
        value={formData.companyName}
        onChange={handleChange}
      />
      <input
        type='text'
        name='position'
        id='position'
        placeholder='Position'
        className='mb-4 w-full rounded border p-2 dark:border-gray-700 dark:text-white'
        value={formData.position}
        onChange={handleChange}
      />
      <button
        type='submit'
        disabled={isLoading}
        className='rounded bg-blue-500 px-4 py-2 text-white'
      >
        {isLoading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
};

export default AddJobModal;
