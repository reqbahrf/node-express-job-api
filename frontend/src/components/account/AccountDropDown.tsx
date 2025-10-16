import { useAppDispatch, useAppSelector } from '@/app/store';
import { setActiveView } from '@/features/ui/uiSlice';
import authAPI from '@/features/auth/authAPI';
import { RiCircleFill } from '@remixicon/react';
import { useNavigate } from 'react-router-dom';
import { useMemo } from 'react';

interface AccountDropDownProps {
  setToggleDropdown: (value: boolean) => void;
  user: string;
  role: string;
}
const AccountDropDown = ({
  setToggleDropdown,
  user,
  role,
}: AccountDropDownProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const activeView = useAppSelector((state) => state.ui.activeView);

  const formattedRole = useMemo(
    () => (role ? role?.charAt(0).toUpperCase() + role?.slice(1) : ''),
    [role],
  );

  const handleToggleAccount = () => {
    if (activeView === 'account') return;
    navigate('/account');
    dispatch(setActiveView('account'));
    setToggleDropdown(false);
  };
  return (
    <>
      <div className='absolute top-[110%] right-[0] mt-4 w-60 rounded-md bg-white py-2 shadow-lg dark:bg-gray-800'>
        <div className='mb-4 flex-col justify-center'>
          <div className='text-dark ps-2 text-center dark:text-white'>
            {formattedRole}
          </div>
          <div className='text-dark ps-2 text-center text-2xl font-bold dark:text-white'>
            {user}
          </div>
        </div>
        <hr className='border-gray-200 dark:border-gray-600' />
        <button
          className='block w-full px-4 py-2 text-black hover:bg-gray-200 dark:text-white dark:hover:bg-gray-600'
          onClick={handleToggleAccount}
        >
          {activeView === 'account' ? (
            <span className='inline-block'>
              <RiCircleFill size={10} className='text-green-500' />
            </span>
          ) : (
            ''
          )}
          &nbsp;Account
        </button>
        <button
          className='block w-full px-4 py-2 text-red-500 hover:bg-gray-200 dark:hover:bg-gray-600'
          onClick={() => dispatch(authAPI.logout())}
        >
          Logout
        </button>
      </div>
    </>
  );
};

export default AccountDropDown;
