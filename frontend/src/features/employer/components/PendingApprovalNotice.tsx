import { useEffect } from 'react';
import { useAppDispatch } from '@/app/store';
import { setActiveView } from '@/features/ui/uiSlice';

const PendingApprovalNotice = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setActiveView(''));
  }, []);
  return (
    <div className='mx-auto my-auto max-w-3xl p-6'>
      <div className='rounded-lg bg-white p-6 shadow-md md:p-8 dark:bg-gray-800'>
        <div className='mb-8 text-center'>
          <h1 className='text-3xl font-bold text-gray-800 dark:text-white'>
            Pending Approval
          </h1>
          <p className='mt-2 text-gray-600 dark:text-gray-300'>
            Your company registration is pending approval. Please wait for the
            approval process to complete.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PendingApprovalNotice;
