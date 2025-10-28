import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { companyAPI } from '@/features/company/companyAPI';
import CompanyCard from '../../components/company/CompanyCard';
import type { QueryParams } from '@/../../libs/company';
import { setActiveView } from '@/features/ui/uiSlice';
import Loading from '@/components/Loading';
import Input from '@/components/Input';

const CompanyView = () => {
  const dispatch = useAppDispatch();
  const { companies } = useAppSelector((state) => state.companies);
  const [queryParams, setQueryParams] = useState<QueryParams>({});
  const getCompanies = useAppSelector(
    (state) => state.loading.loadingState.getCompanies,
  );

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setQueryParams((prev) => {
      if (name === 'status' && value === 'all') {
        const newParams = { ...prev };
        delete newParams.status;
        return newParams;
      }
      return { ...prev, [name]: value };
    });
  };

  useEffect(() => {
    dispatch(setActiveView('Companies'));
    dispatch(companyAPI.getCompanies(queryParams));
  }, [queryParams]);

  return (
    <div className='p-4'>
      <div className='mb-4 flex space-x-4'>
        <Input
          type='text'
          name='company'
          placeholder='Filter by company name'
          value={queryParams.company || ''}
          onChange={handleFilterChange}
          className='w-1/3'
        />
        <select
          name='status'
          value={queryParams.status || 'all'}
          onChange={handleFilterChange}
          className='w-1/3 rounded-md border border-gray-300 bg-white p-2 text-black dark:border-gray-600 dark:bg-gray-800 dark:text-white'
        >
          <option value='all'>All Statuses</option>
          <option value='approved'>Approved</option>
          <option value='pending'>Pending</option>
          <option value='rejected'>Rejected</option>
        </select>
        <select
          name='sortby'
          value={queryParams.sortby || 'latest'}
          onChange={handleFilterChange}
          className='w-1/3 rounded-md border border-gray-300 bg-white p-2 text-black dark:border-gray-600 dark:bg-gray-800 dark:text-white'
        >
          <option value='latest'>Latest</option>
          <option value='oldest'>Oldest</option>
        </select>
      </div>
      {getCompanies?.loading ? (
        <Loading />
      ) : companies.length > 0 ? (
        companies.map((company) => (
          <CompanyCard key={company._id} company={company} />
        ))
      ) : (
        <p className='mt-4 text-center text-gray-500'>No companies found</p>
      )}
    </div>
  );
};

export default CompanyView;
