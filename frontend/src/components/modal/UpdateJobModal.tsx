import React, { useState } from 'react';
import MainModal from './MainModal';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

interface UpdateJobModalProps {
  jobID: string;
  company: string;
  status: string;
  position: string;
  onUpdate: () => void;
  onClose: () => void;
}

const UpdateJobModal = (props: UpdateJobModalProps) => {
  const { jobID, company, status, position } = props;
  const { accessToken } = useAuth();
  const [formData, setFromData] = useState({
    company,
    position,
    status,
  });
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFromData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.patch(`/api/v1/jobs/${jobID}`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      props.onClose();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <MainModal
      title='Update Job'
      headerColor='bg-sky-500'
      onClose={props.onClose}
    >
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          name='company'
          id='company'
          value={formData.company}
          onChange={handleChange}
          placeholder='Company'
          className='w-full p-2 mb-4 border border-gray-300 rounded'
        />
        <input
          type='text'
          name='position'
          id='position'
          value={formData.position}
          onChange={handleChange}
          placeholder='Position'
          className='w-full p-2 mb-4 border border-gray-300 rounded'
        />
        <select
          name='status'
          id='status'
          value={formData.status}
          onChange={handleChange}
          className='w-full p-2 mb-4 border border-gray-300 rounded'
        >
          <option value='pending'>Pending</option>
          <option value='interview'>Interview</option>
          <option value='rejected'>Rejected</option>
        </select>
        <button
          type='submit'
          className='bg-blue-400 text-white px-4 py-2 rounded'
        >
          Update
        </button>
      </form>
    </MainModal>
  );
};

export default UpdateJobModal;
