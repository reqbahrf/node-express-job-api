const Loading = () => {
  return (
    <div className='flex h-screen items-center justify-center bg-white dark:bg-gray-950'>
      <div className='h-32 w-32 animate-spin rounded-full border-t-2 border-b-2 border-blue-500'></div>
    </div>
  );
};

export default Loading;
