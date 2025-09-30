import React, { useState, memo } from 'react';
import authAPI from '../features/auth/authAPI';
import defaultAvatar from '../assets/avatar-default-icon.png';
import { useAppSelector } from '../app/store';
import { useAppDispatch } from '../app/store';

const Header = () => {
  const [toggle, setToggle] = useState(false);
  const { accessToken, user, role } = useAppSelector((state) => state.auth);
  const formattedRole = role
    ? role?.charAt(0).toUpperCase() + role?.slice(1)
    : '';
  const dispatch = useAppDispatch();
  return (
    <div className='bg-sky-500 w-full h-auto min-h-[70px] flex items-center justify-between px-3 py-2 fixed top-0 z-50'>
      <h1 className='text-4xl font-bold text-white'>Job API</h1>
      {accessToken && (
        <div className='h-full w-auto min-w-[150px] flex items-center'>
          <div className='relative'>
            <button className='md:h-[60px] md:w-[60px] h-[40px] w-[40px] border border-amber-50 rounded-full shadow-lg overflow-hidden'>
              <img
                src={defaultAvatar}
                alt='default avatar'
                className='w-full h-full object-cover'
              />
            </button>
            {toggle && (
              <div className='absolute -right-24 top-full w-40 mt-4 py-2 bg-white rounded-md shadow-lg'>
                <button className='w-full block px-4 py-2 hover:bg-gray-200'>
                  Account
                </button>
                <button
                  className='w-full block px-4 py-2 hover:bg-gray-200 text-red-500'
                  onClick={() => dispatch(authAPI.logout())}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
          <div className='flex-col justify-center'>
            <button
              type='button'
              className='text-2xl font-bold text-black ps-2'
              onClick={() => setToggle(!toggle)}
            >
              {user}
            </button>
            <div className='text-center text-black ps-2'>{formattedRole}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(Header);
