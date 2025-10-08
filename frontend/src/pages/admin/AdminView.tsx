import { useEffect, useState } from 'react';
import { useAppSelector } from '../../app/store';
import useSocket from '../../hooks/useSocket';
import axios from 'axios';

type statResponse = {
  applicantUserCount: number;
};
const AdminView = () => {
  const { accessToken } = useAppSelector((state) => state.auth);
  const { userid, user, role } = useAppSelector((state) => state.auth);
  const { userCount } = useSocket(userid || '', role || '');
  const [stats, setStats] = useState<statResponse>({ applicantUserCount: 0 });

  useEffect(() => {
    const controller = new AbortController();
    const fetchStats = async () => {
      try {
        const response = await axios.get<statResponse>(
          '/api/v1/admin/dashboard',
          {
            signal: controller.signal,
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
    return () => {
      controller.abort();
    };
  }, []);
  return (
    <>
      Welcome back Admin {user}
      <p>
        Online Users:&nbsp;
        <span className='bg-green-500 h-[10px] w-[10px] rounded-full inline-block mr-1'></span>
        {userCount}/{stats.applicantUserCount}
      </p>
    </>
  );
};

export default AdminView;
