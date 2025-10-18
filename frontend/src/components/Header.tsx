import { memo } from 'react';
import ActiveAccount from './account/ActiveAccount';
import { useAppSelector } from '../app/store';
import DarkModeToggle from './DarkModeToggle';
import NotificationIcon from './notification/NotificationIcon';
import NavigationTab from './NavigationTab';
const Header = () => {
  const { accessToken, user, role } = useAppSelector((state) => state.auth);
  return (
    <>
      <header className='fixed top-0 z-50 flex h-auto min-h-[70px] w-full items-center justify-between py-2 ps-4 md:px-8'>
        <h1 className='text-4xl font-bold text-black dark:text-white'>
          Job API
        </h1>
        <div
          className={`h-full w-auto ${
            accessToken && 'min-w-[100px]'
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
      </header>
    </>
  );
};

export default memo(Header);
