import React, { useState } from 'react';
import MainModal from './MainModal';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { setLoading } from '../../features/loading/loadingSlice';
import jobAPI from '../../features/job/jobAPI';
const AddJobModal = (props: { onClose: () => void }) => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(
    (state) => state.loading.loadingState?.addJob?.loading
  );
  const [formData, setFromData] = useState({
    company: '',
    position: '',
    status: '',
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFromData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(setLoading({ key: 'addJob', loading: true }));
    dispatch(jobAPI.createNewJob(formData));
    dispatch(setLoading({ key: 'addJob', loading: false }));
    props.onClose();
  };
  return (
    <MainModal
      title='Add Job'
      headerColor='bg-sky-500'
      onClose={props.onClose}
    >
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          name='company'
          id='company'
          placeholder='Company'
          className='w-full p-2 mb-4 border border-gray-300 rounded'
          value={formData.company}
          onChange={handleChange}
        />
        <input
          type='text'
          name='position'
          id='position'
          placeholder='Position'
          className='w-full p-2 mb-4 border border-gray-300 rounded'
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
    </MainModal>
  );
};

export default AddJobModal;
