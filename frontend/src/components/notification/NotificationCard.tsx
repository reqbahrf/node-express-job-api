interface NotificationCardProps {
  status: 'read' | 'unread';
  title: string;
  message: string;
  timeAgo: string;
}

const NotificationCard = ({
  status,
  title,
  message,
  timeAgo,
}: NotificationCardProps) => {
  const statusClass =
    status === 'read'
      ? 'bg-gray-100 dark:bg-gray-800'
      : 'bg-white dark:bg-gray-700';
  const textClass =
    status === 'read'
      ? 'text-gray-600 dark:text-white'
      : 'text-black dark:text-white';
  const agoTextClass = status === 'read' ? 'text-gray-600' : 'text-blue-500';
  return (
    <div
      className={` dark:bg-gray-900 p-4 rounded-md shadow-md w-full ${statusClass} hover:bg-gray-200 dark:hover:bg-gray-600`}
    >
      <h2 className={`text-xl font-bold ${textClass}`}>{title}</h2>
      <div className='flex justify-between'>
        <p className={`text-sm ${textClass}`}>{message}</p>
        <span className={`text-sm ${agoTextClass}`}>{timeAgo}</span>
      </div>
    </div>
  );
};

export default NotificationCard;
