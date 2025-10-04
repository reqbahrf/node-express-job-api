import React from 'react';
import { useAppSelector } from '../../app/store';
import useSocket from '../../hooks/useSocket';
const AdminView = () => {
  const { userid, user, role } = useAppSelector((state) => state.auth);
  const { isConnected, userCount } = useSocket(userid || '', role || '');
  return (
    <div className=' bg-white min-h-screen flex justify-center'>
      <div className='md:w-1/2 w-full h-[80vh] mt-[100px] sm:mx-[20px]'>
        Welcome back Admin {user}
        <p>Connected: {isConnected ? 'Connected' : 'Disconnected'}</p>
        <p>Online Users: {userCount}</p>
      </div>
    </div>
  );
};

export default AdminView;
