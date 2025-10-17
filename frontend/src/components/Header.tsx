import { memo } from 'react';
import ActiveAccount from './account/ActiveAccount';
import { useAppSelector } from '../app/store';
import DarkModeToggle from './DarkModeToggle';
import NotificationIcon from './notification/NotificationIcon';
const Header = () => {
  const { accessToken, user, role } = useAppSelector((state) => state.auth);
  return (
    <div className='fixed top-0 z-50 flex h-auto min-h-[70px] w-full items-center justify-between px-4 py-2 md:px-8'>
      <h1 className='text-4xl font-bold text-black dark:text-white'>Job API</h1>
      <div
        className={`h-full w-auto ${
          accessToken && 'min-w-[150px]'
        } flex items-center gap-2`}
      >
        <DarkModeToggle />
        {accessToken && (
          <>
            <NotificationIcon />
            <ActiveAccount user={user || 'Guest'} role={role || 'Guest'} />
          </>
        )}
      </div>
    </div>
  );
};

export default memo(Header);
