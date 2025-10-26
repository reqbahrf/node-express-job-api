import React, { useState } from 'react';
import { CompanyInfo } from '../../types/company';
import { companyAPI } from '@/features/company/companyAPI';
import {
  RiMapPin2Line,
  RiGlobalLine,
  RiMailLine,
  RiPhoneLine,
} from '@remixicon/react';

import { useAppDispatch } from '@/app/store';

interface CompanyModalBodyProps {
  company: CompanyInfo;
}

const CompanyModalBody: React.FC<CompanyModalBodyProps> = ({ company }) => {
  const dispatch = useAppDispatch();
  const {
    _id,
    companyName,
    ceoName,
    industry,
    address,
    contactEmail,
    contactPhone,
    website,
    logoUrl,
    status,
  } = company;

  const [updateCompanyStatus, setUpdateCompanyStatus] = useState(status);

  const handleOnCompanyStatusChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setUpdateCompanyStatus(e.target.value as CompanyInfo['status']);
  };

  const statusColor =
    status === 'approved'
      ? 'bg-green-100 text-green-800 border-green-300'
      : 'bg-gray-100 text-gray-700 border-gray-300';

  const handleUpdateCompanyStatus = async () => {
    if (!_id) return;
    await dispatch(
      companyAPI.updateCompanyStatus({
        companyId: _id,
        status: updateCompanyStatus,
      }),
    ).unwrap();
  };

  function Info({
    icon,
    label,
    value,
  }: {
    icon?: React.ReactNode;
    label: string;
    value: string | React.ReactNode;
  }) {
    return (
      <p className='flex items-start gap-2'>
        {icon && (
          <span className='mt-1 text-gray-500 dark:text-gray-400'>{icon}</span>
        )}
        <span className='font-medium text-gray-900 dark:text-gray-100'>
          {label}:
        </span>
        <span className='ml-1 text-gray-700 dark:text-gray-300'>{value}</span>
      </p>
    );
  }

  return (
    <div className='max-h-full min-h-full rounded-2xl border border-gray-200 bg-white/60 p-6 shadow-sm backdrop-blur-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800/60'>
      <div className='flex flex-col items-center gap-4 md:flex-row md:items-start'>
        {logoUrl && (
          <div className='flex-shrink-0'>
            <img
              src={logoUrl}
              alt={`${companyName} logo`}
              className='h-20 w-20 rounded-xl border border-gray-300 object-cover shadow-sm dark:border-gray-600'
            />
          </div>
        )}

        <div className='flex flex-col'>
          <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
            {companyName}
          </h2>
          <p className='text-sm text-gray-500 dark:text-gray-400'>
            {industry} Industry
          </p>
          <span
            className={`mt-2 inline-block rounded-full border px-3 py-1 text-center text-xs font-semibold ${statusColor}`}
          >
            {status.toUpperCase()}
          </span>
        </div>
      </div>

      <div className='mt-6 grid grid-cols-1 gap-3 text-gray-700 sm:grid-cols-2 dark:text-gray-300'>
        <Info label='CEO' value={ceoName} />
        <Info icon={<RiMapPin2Line />} label='Address' value={address} />
        <Info icon={<RiMailLine />} label='Email' value={contactEmail} />
        <Info icon={<RiPhoneLine />} label='Phone' value={contactPhone} />
        <Info
          icon={<RiGlobalLine />}
          label='Website'
          value={
            <a
              href={website}
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-600 hover:underline dark:text-blue-400'
            >
              {website}
            </a>
          }
        />
      </div>
      <div className='flex flex-col gap-4 md:flex-row'>
        <select
          value={updateCompanyStatus}
          onChange={handleOnCompanyStatusChange}
          className='mt-4 w-full rounded-md border border-gray-300 bg-white p-2 text-black dark:border-gray-600 dark:bg-gray-800 dark:text-white'
        >
          <option value='pending'>Pending</option>
          <option value='approved'>Approved</option>
          <option value='rejected'>Rejected</option>
        </select>
        <button
          className='mt-4 w-full rounded-md bg-blue-600 p-2 text-white md:w-50'
          onClick={handleUpdateCompanyStatus}
        >
          Update Status
        </button>
      </div>
    </div>
  );
};

export default CompanyModalBody;
