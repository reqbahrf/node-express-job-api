import { useAppDispatch, useAppSelector } from '@/app/store';
import { setActiveView } from '@/features/ui/uiSlice';
import { useEffect } from 'react';
import useEmployerOnboardingGuard from '../../hooks/useEmployerOnboardingGuard';
import Loading from '../../components/Loading';

const DashboardView = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const isChecking = useEmployerOnboardingGuard();

  useEffect(() => {
    dispatch(setActiveView(isChecking ? '' : 'Dashboard'));
  }, [isChecking]);

  if (isChecking) {
    return <Loading />;
  }
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
