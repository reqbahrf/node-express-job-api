import { useAppDispatch, useAppSelector } from '@/app/store';
import { setActiveView } from '@/features/ui/uiSlice';
import { useEffect } from 'react';
import { companyAPI } from '@/features/employer/companyAPI';
import { useNavigate } from 'react-router-dom';

const DashboardView = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, userid, accessToken } = useAppSelector((state) => state.auth);
  useEffect(() => {
    dispatch(setActiveView('Dashboard'));
    if (userid && accessToken) {
      dispatch(
        companyAPI.getCompanyInfo({
          companyId: userid!,
          accessToken,
          navigate,
        }),
      );
    }
  }, []);
  return (
    <>
      <h1 className='text-4xl font-bold'>Welcome back, {user}</h1>

      <div className='mt-8 flex w-full flex-col gap-4 p-4 sm:flex-row'>
        <div className='w-full rounded bg-gray-200 p-6 dark:bg-gray-700'>
          <p className='mb-2 text-2xl font-bold'>Total Job Postings</p>
          <p className='ps-4 text-xl font-bold'>0</p>
        </div>

        <div className='w-full rounded bg-gray-200 p-6 dark:bg-gray-700'>
          <p className='mb-2 text-2xl font-bold'>Total Applicants</p>
          <p className='ps-4 text-xl font-bold'>0</p>
        </div>
      </div>

      <h2 className='mt-8 text-2xl font-bold'>Recent Activity</h2>
      <p className='mt-4 text-lg text-gray-600 dark:text-gray-300'>
        Coming soon: applicant tracking and job post insights.
      </p>
    </>
  );
};

export default DashboardView;
