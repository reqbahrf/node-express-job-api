import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import MainModal from './MainModal';
import { useLoading } from '../../hooks/useLoading';

const AddJobModal = (props: { onClose: () => void }) => {
  const { accessToken } = useAuth();
  const addLoading = useLoading();
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addLoading.withLoading(async () => {
      await axios.post('/api/v1/jobs', formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      props.onClose();
    });
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
          disabled={addLoading.loading}
          className='bg-blue-500 text-white px-4 py-2 rounded'
        >
          {addLoading.loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </MainModal>
  );
};

export default AddJobModal;
