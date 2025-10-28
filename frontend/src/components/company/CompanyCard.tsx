import React from 'react';
import type { CompanyInfo } from '@/../../libs/company';
import CompanyModalBody from './CompanyModalBody';

import { useModalContext } from '@/context/ModalContext';

interface CompanyCardProps {
  company: CompanyInfo;
}

const CompanyCard: React.FC<CompanyCardProps> = ({ company }) => {
  const { openModal } = useModalContext();

  return (
    <div
      className='group w-full overflow-hidden rounded-lg bg-white p-6 shadow-md transition-shadow duration-300 hover:cursor-pointer hover:bg-gray-100 hover:shadow-lg dark:bg-gray-800 dark:hover:bg-gray-600 dark:hover:shadow-lg'
      onClick={() =>
        openModal(
          <CompanyModalBody company={company} />,
          'md',
          company.companyName,
        )
      }
    >
      <div className='flex flex-col items-start justify-between sm:flex-row sm:items-center'>
        <div className='flex items-center'>
          <img
            src={company.logoUrl}
            alt={`${company.companyName} logo`}
            className='h-20 w-20 flex-shrink-0 rounded-full border border-gray-200 object-contain'
          />
          <div className='ml-4'>
            <h2 className='text-2xl font-extrabold text-gray-900 dark:text-white'>
              {company.companyName}
            </h2>
            <p className='text-sm text-gray-500 dark:text-gray-400'>
              CEO: {company.ceoName}
            </p>
            <p className='text-sm text-gray-500 dark:text-gray-400'>
              Industry: {company.industry}
            </p>
          </div>
        </div>
        <div className='flex flex-col self-start'>
          <span
            className={`mt-4 self-start rounded-full px-4 py-1 text-sm font-bold tracking-wide uppercase sm:mt-0 ${
              company.status === 'approved'
                ? 'bg-green-600 text-white'
                : 'bg-gray-700 text-white'
            } `}
          >
            {company.status}
          </span>
        </div>
      </div>
      <hr className='my-4 border-t border-gray-200 dark:border-gray-700' />
    </div>
  );
};

export default CompanyCard;
