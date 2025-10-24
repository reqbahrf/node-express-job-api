import React from 'react';
import { CompanyInfo } from '../../types/company';

interface CompanyCardProps {
  company: CompanyInfo;
}

const CompanyCard: React.FC<CompanyCardProps> = ({ company }) => {
  return (
    <div className='mb-6 grid grid-cols-1 gap-4 rounded-lg bg-white p-6 shadow-md md:grid-cols-[2fr_3fr] dark:bg-gray-900'>
      <div>
        <h2 className='mb-2 border-b text-xl font-bold dark:text-white'>
          {company.companyName}
        </h2>
        {company.logoUrl && (
          <div className='mt-4'>
            <img
              src={company.logoUrl}
              alt={`${company.companyName} logo`}
              className='h-32 w-32 rounded-md border border-gray-200 object-contain p-2'
            />
          </div>
        )}
      </div>
      <div className='grid grid-cols-1 gap-4 text-gray-600 md:grid-cols-2 dark:text-white'>
        <p>
          <span className='font-semibold'>CEO:</span> {company.ceoName}
        </p>
        <p>
          <span className='font-semibold'>Industry:</span> {company.industry}
        </p>
        <p>
          <span className='font-semibold'>Address:</span> {company.address}
        </p>
        <p>
          <span className='font-semibold'>Website:</span>{' '}
          <a
            href={company.website}
            target='_blank'
            rel='noopener noreferrer'
            className='text-blue-600 hover:underline'
          >
            {company.website}
          </a>
        </p>
        <p>
          <span className='font-semibold'>Contact:</span> {company.contactEmail}{' '}
          | {company.contactPhone}
        </p>
        <p>
          <span className='font-semibold'>Status:</span>{' '}
          <span className='text-white p-1 rounded-2xl bg-green-600'>
            {company.status}
          </span>
        </p>
      </div>
    </div>
  );
};

export default CompanyCard;
