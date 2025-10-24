import { memo } from 'react';

export interface JobInfo {
  _id: string;
  company: string;
  position: string;
  status: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface JobCardProps extends JobInfo {
  onUpdate: (Job: JobInfo) => void;
  onDelete: (Job: JobInfo) => void;
}
const JobCard: React.FC<JobCardProps> = ({
  _id,
  company,
  position,
  status,
  createdBy,
  createdAt,
  updatedAt,
  __v,
  onUpdate,
  onDelete,
}) => {
  const jobInfo = {
    _id,
    company,
    position,
    status,
    createdBy,
    createdAt,
    updatedAt,
    __v,
  };
  return (
    <div className='grid grid-cols-1 gap-4 rounded-lg bg-white p-6 shadow-md md:grid-cols-[2fr_2fr_auto] dark:bg-gray-900'>
      <div>
        <h2 className='mb-2 border-b text-xl font-bold'>{position}</h2>
        <p className='mb-2 text-gray-600 dark:text-white'>{company}</p>
      </div>
      <div>
        <p className='mb-2 text-gray-600 dark:text-white'>
          Status:{' '}
          <span
            className={`rounded-2xl p-1 text-white ${
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
        <p className='mb-2 text-gray-600'>
          Created: {new Date(createdAt).toLocaleString()}
        </p>
        <p className='mb-2 text-gray-600'>
          Updated: {new Date(updatedAt).toLocaleString()}
        </p>
      </div>
      <div className='flex flex-col justify-center gap-2'>
        <button
          onClick={() => onUpdate(jobInfo)}
          className='rounded-md bg-blue-500 px-3 py-1 text-white hover:bg-blue-600'
        >
          Update
        </button>
        <button
          onClick={() => onDelete(jobInfo)}
          className='rounded-md bg-red-500 px-3 py-1 text-white hover:bg-red-600'
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default memo(JobCard);
