import { memo } from 'react';
import ActiveAccount from './account/ActiveAccount';
import { useAppSelector } from '../app/store';
import DarkModeToggle from './DarkModeToggle';
const Header = () => {
  const { accessToken, user, role } = useAppSelector((state) => state.auth);
  return (
    <div className='bg-sky-500 w-full h-auto min-h-[70px] flex items-center justify-between px-3 py-2 fixed top-0 z-50'>
      <h1 className='text-4xl font-bold text-white'>Job API</h1>
      <div
        className={`h-full w-auto ${
          accessToken && 'min-w-[150px]'
        } flex items-center gap-2`}
      >
        <DarkModeToggle />
        {accessToken && (
          <ActiveAccount
            user={user || 'Guest'}
            role={role || 'Guest'}
          />
        )}
      </div>
    </div>
  );
};

export default memo(Header);
