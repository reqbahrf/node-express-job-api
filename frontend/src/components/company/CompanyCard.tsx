import React from 'react';
import { CompanyInfo } from '../../types/company';

import {
  RiMapPin2Line,
  RiGlobalLine,
  RiMailLine,
  RiPhoneLine,
} from '@remixicon/react';

interface CompanyCardProps {
  company: CompanyInfo;
}

const CompanyCard: React.FC<CompanyCardProps> = ({ company }) => {
  return (
    <div className='w-full rounded-lg bg-white p-6 shadow-md transition-shadow duration-300 hover:shadow-lg dark:bg-gray-800'>
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
            <div className='flex flex-row gap-1'>
              <div className='flex items-center text-sm'>
                <RiMapPin2Line
                  className='mr-3 flex-shrink-0 text-gray-500 dark:text-gray-400'
                  size={20}
                />
                <span>{company.address}</span>
              </div>

              <div className='flex items-center'>
                <RiMailLine
                  className='mr-3 flex-shrink-0 text-gray-500 dark:text-gray-400'
                  size={20}
                />
                <span className='truncate'>{company.contactEmail}</span>
              </div>
              <div className='flex items-center text-sm'>
                <RiPhoneLine
                  className='mr-3 flex-shrink-0 text-gray-500 dark:text-gray-400'
                  size={20}
                />
                <span>{company.contactPhone}</span>
              </div>
              <div className='flex items-center text-sm'>
                <RiGlobalLine
                  className='mr-3 flex-shrink-0 text-gray-500 dark:text-gray-400'
                  size={20}
                />
                <a
                  href={company.website}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='truncate text-blue-600 hover:underline dark:text-blue-400'
                >
                  {company.website}
                </a>
              </div>
            </div>
          </div>
        </div>
        <span
          className={`mt-4 self-start rounded-full px-4 py-1 text-sm font-bold tracking-wide uppercase sm:mt-0 ${
            company.status === 'approved'
              ? 'bg-green-600 text-white'
              : 'bg-gray-600 text-white'
          }`}
        >
          {company.status}
        </span>
      </div>
      <hr className='my-4 border-t border-gray-200 dark:border-gray-700' />
    </div>
  );
};

export default CompanyCard;
