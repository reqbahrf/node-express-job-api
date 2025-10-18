import { useEffect, useState } from 'react';
import { useAppSelector } from '../../app/store';
import useSocket from '../../hooks/useSocket';
import { useAppDispatch } from '../../app/store';
import { setActiveView } from '@/features/ui/uiSlice';
import { adminAPI } from '@/features/admin/adminAPI';
type statResponse = {
  applicantUserCount: number;
};
const AdminView = () => {
  const dispatch = useAppDispatch();
  const { accessToken } = useAppSelector((state) => state.auth);
  const { userid, user, role } = useAppSelector((state) => state.auth);
  const { userCount } = useSocket(userid || '', role || '');
  const [stats, setStats] = useState<statResponse>({ applicantUserCount: 0 });

  useEffect(() => {
    const controller = new AbortController();
    dispatch(setActiveView('Dashboard'));
    adminAPI
      .getAdminDashboardStats(accessToken, controller.signal)
      .then(setStats)
      .catch((error) => {
        console.error('Failed to fetch stats: ' + error);
      });
    return () => {
      controller.abort();
    };
  }, []);
  return (
    <>
      <h1 className='text-4xl font-bold'>Welcome back, {user}</h1>
      <div className='mt-8 flex w-full flex-col gap-4 p-4 sm:flex-row'>
        <div className='w-full rounded bg-gray-200 p-6 dark:bg-gray-700'>
          <p className='mb-2 text-2xl font-bold'>
            Total Online Users
            {userCount !== 0 && (
              <span className='mx-1 inline-block h-[10px] w-[10px] rounded-full bg-green-500'></span>
            )}
          </p>
          <p className='ps-4 text-xl font-bold'>{userCount}</p>
        </div>
        <div className='w-full rounded bg-gray-200 p-6 dark:bg-gray-700'>
          <p className='mb-2 text-2xl font-bold'>Total Applicants</p>
          <p className='ps-4 text-xl font-bold'>{stats.applicantUserCount}</p>
        </div>
      </div>
      <h2 className='mt-8 text-2xl font-bold'>Recent Activity</h2>
    </>
  );
};

export default AdminView;
