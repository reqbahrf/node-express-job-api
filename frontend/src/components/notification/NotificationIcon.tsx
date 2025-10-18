import { RiNotificationFill } from '@remixicon/react';
import { useState } from 'react';
import NotificationDropdown from './NotificationDropdown';
const NotificationIcon = () => {
  const [showNotification, setShowNotification] = useState(false);

  const handleNotificationClick = () => {
    setShowNotification((prev) => !prev);
  };
  return (
    <div className='relative'>
      <button onClick={handleNotificationClick} className='py-2'>
        <RiNotificationFill className='text-black dark:text-white' />
      </button>
      {showNotification && <NotificationDropdown />}
    </div>
  );
};

export default NotificationIcon;
