import React, { useState } from 'react';
import axios from 'axios';
import MainModal from './MainModal';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { setLoading } from '../../features/loading/loadingSlice';
const AddJobModal = (props: { onSubmit: () => void; onClose: () => void }) => {
  const dispatch = useAppDispatch();
  const { accessToken } = useAppSelector((state) => state.auth);
  const isLoading = useAppSelector(
    (state) => state.loading.loadingState.addJob
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
    dispatch(setLoading({ key: 'addJob', loading: true }));
    await axios.post('/api/v1/jobs', formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    dispatch(setLoading({ key: 'addJob', loading: false }));
    props.onSubmit();
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
          disabled={isLoading.loading}
          className='bg-blue-500 text-white px-4 py-2 rounded'
        >
          {isLoading.loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </MainModal>
  );
};

export default AddJobModal;
