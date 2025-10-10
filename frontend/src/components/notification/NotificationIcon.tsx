import { RiNotificationLine } from '@remixicon/react';
import { useState } from 'react';
import NotificationDropdown from './NotificationDropdown';
const NotificationIcon = () => {
  const [showNotification, setShowNotification] = useState(false);

  const handleNotificationClick = () => {
    setShowNotification((prev) => !prev);
  };
  return (
    <div className='relative'>
      <button
        onClick={handleNotificationClick}
        className='p-2 rounded-full bg-gray-200 dark:bg-gray-700'
      >
        <RiNotificationLine className='text-black dark:text-white hover:text-blue-500' />
      </button>
      {showNotification && <NotificationDropdown />}
    </div>
  );
};

export default NotificationIcon;
