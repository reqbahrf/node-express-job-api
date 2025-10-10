import NotificationCard from './NotificationCard';
const NotificationDropdown = () => {
  return (
    <>
      <div className='absolute top-[120%] right-0 sm:w-[30vw] h-[50vh] bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50'>
        <div className='flex justify-between align-baseline px-4 pt-2'>
          <h2 className='text-lg font-bold  dark:text-white'>Notifications</h2>
          <button className='dark:text-white text-sm hover:text-blue-500'>
            Mark as read
          </button>
        </div>
        <hr className='border-gray-200 dark:border-gray-700' />
        <div className='flex flex-col items-center gap-2 p-4'>
          <NotificationCard
            status='read'
            title='Notification'
            message='You have a new notification'
            timeAgo='1 hour ago'
          />
        </div>
      </div>
    </>
  );
};

export default NotificationDropdown;
