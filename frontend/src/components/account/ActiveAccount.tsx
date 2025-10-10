import defaultAvatar from '../../assets/avatar-default-icon.png';
import AccountDropDown from './AccountDropDown';
import { useState } from 'react';
type ActiveAccountProps = {
  user: string;
  role: string;
};

const ActiveAccount = ({ user, role }: ActiveAccountProps) => {
  const [toggleDropdown, setToggleDropdown] = useState(false);
  const formattedRole = role
    ? role?.charAt(0).toUpperCase() + role?.slice(1)
    : '';
  return (
    <>
      <div className='relative'>
        <div className='md:h-[40px] md:w-[40px] h-[30px] w-[30px] border border-amber-50 rounded-full shadow-lg overflow-hidden'>
          <img
            src={defaultAvatar}
            alt='default avatar'
            className='w-full h-full object-cover'
          />
        </div>
        {toggleDropdown && (
          <AccountDropDown setToggleDropdown={setToggleDropdown} />
        )}
      </div>
      <div className='flex-col justify-center'>
        <button
          type='button'
          className='text-2xl font-bold text-black ps-2'
          onClick={() => setToggleDropdown(!toggleDropdown)}
        >
          {user}
        </button>
        <div className='text-center text-black ps-2'>{formattedRole}</div>
      </div>
    </>
  );
};

export default ActiveAccount;
