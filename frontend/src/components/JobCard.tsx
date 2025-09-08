import React from 'react';

export interface JobInfo {
  _id: string;
  company: string;
  position: string;
  status: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  onUpdate: () => void;
  onDelete: () => void;
}
const JobCard = ({
  company,
  position,
  status,
  createdAt,
  updatedAt,
  onUpdate,
  onDelete,
}: JobInfo) => {
  return (
    <div className='bg-white rounded-lg shadow-md p-6 grid md:grid-cols-[2fr_2fr_auto] grid-cols-1 gap-4'>
      <div>
        <h2 className='text-xl font-bold mb-2 border-b'>{position}</h2>
        <p className='text-gray-600 mb-2'>{company}</p>
      </div>
      <div>
        <p className='text-gray-600 mb-2'>
          Status:{' '}
          <span
            className={`text-white p-1 rounded-2xl ${
              status === 'pending'
                ? 'bg-gray-500'
                : status === 'interview'
                ? 'bg-blue-700'
                : 'bg-red-500'
            }`}
          >
            {status}
          </span>
        </p>
        <p className='text-gray-600 mb-2'>
          Created: {new Date(createdAt).toLocaleString()}
        </p>
        <p className='text-gray-600 mb-2'>
          Updated: {new Date(updatedAt).toLocaleString()}
        </p>
      </div>
      <div className='flex flex-col gap-2 justify-center mx-4'>
        <button
          onClick={onUpdate}
          className='bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600'
        >
          Update
        </button>
        <button
          onClick={onDelete}
          className='bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600'
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default JobCard;
