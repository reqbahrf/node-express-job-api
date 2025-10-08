import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { setLoading } from '../../features/loading/loadingSlice';
import jobAPI from '../../features/job/jobAPI';
const AddJobModal = (props: { onClose?: () => void }) => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(
    (state) => state.loading.loadingState?.addJob?.loading
  );
  const [formData, setFromData] = useState({
    company: '',
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
    } catch (err) {
      console.error('Failed to add job:', err);
    } finally {
      dispatch(setLoading({ ...dispatchPayload, loading: false }));
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <input
        type='text'
        name='company'
        id='company'
        placeholder='Company'
        className='w-full p-2 mb-4 border dark:border-gray-700 dark:text-white rounded'
        value={formData.company}
        onChange={handleChange}
      />
      <input
        type='text'
        name='position'
        id='position'
        placeholder='Position'
        className='w-full p-2 mb-4 border dark:border-gray-700 dark:text-white rounded'
        value={formData.position}
        onChange={handleChange}
      />
      <button
        type='submit'
        disabled={isLoading}
        className='bg-blue-500 text-white px-4 py-2 rounded'
      >
        {isLoading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
};

export default AddJobModal;
