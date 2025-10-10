import { useAppSelector } from '@/app/store';
import defaultAvatar from '@/assets/avatar-default-icon.png';
const AccountInfoCard = () => {
  const { user, email } = useAppSelector((state) => state.auth);
  return (
    <div className='w-full mx-auto mb-4'>
      <div className='flex sm:flex-row flex-col bg-white dark:bg-gray-800 p-4 rounded-md mt-2 min-h-[30vh] px-8'>
        <div className='flex justify-center sm:justify-start mb-4 sm:mb-0 sm:mr-6'>
          <div className='border-2 dark:border-white border-black  rounded-full w-[200px] h-[200px] text-center overflow-hidden'>
            <img
              src={defaultAvatar}
              className='w-full h-full object-cover'
              alt='user profile'
              loading='lazy'
            />
          </div>
        </div>
        <div className='flex justify-center lg:ms-20'>
          <div className='flex flex-col items-center sm:justify-center w-full mb-8'>
            <div className='flex'>
              <span className='text-4xl'>{user}</span>
            </div>
            <div className='flex'>
              <span className='text-md font-mono'>{email}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountInfoCard;
