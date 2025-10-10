import { useAppDispatch, useAppSelector } from '@/app/store';
import { setActiveView } from '@/features/ui/uiSlice';
import authAPI from '@/features/auth/authAPI';
import { RiCircleFill } from '@remixicon/react';
import { useNavigate } from 'react-router-dom';

interface AccountDropDownProps {
  setToggleDropdown: (value: boolean) => void;
}
const AccountDropDown = ({ setToggleDropdown }: AccountDropDownProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const activeView = useAppSelector((state) => state.ui.activeView);

  const handleToggleAccount = () => {
    if (activeView === 'account') return;
    navigate('/account');
    dispatch(setActiveView('account'));
    setToggleDropdown(false);
  };
  return (
    <>
      <div className='absolute right-[-20] top-[110%] w-40 mt-4 py-2 bg-white dark:bg-gray-800 rounded-md shadow-lg'>
        <button
          className='w-full block px-4 py-2 hover:bg-gray-200 text-black dark:text-white dark:hover:bg-gray-600'
          onClick={handleToggleAccount}
        >
          {activeView === 'account' ? (
            <span className='inline-block'>
              <RiCircleFill
                size={10}
                className='text-green-500'
              />
            </span>
          ) : (
            ''
          )}
          &nbsp;Account
        </button>
        <button
          className='w-full block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600 text-red-500'
          onClick={() => dispatch(authAPI.logout())}
        >
          Logout
        </button>
      </div>
    </>
  );
};

export default AccountDropDown;
