import defaultAvatar from '../../assets/avatar-default-icon.png';
import AccountDropDown from './AccountDropDown';
import { useState } from 'react';
type ActiveAccountProps = {
  user: string;
  role: string;
};

const ActiveAccount = ({ user, role }: ActiveAccountProps) => {
  const [toggleDropdown, setToggleDropdown] = useState(false);
  return (
    <>
      <div
        className='relative'
        onClick={() => setToggleDropdown(!toggleDropdown)}
      >
        <div className='h-[30px] w-[30px] overflow-hidden rounded-full border border-amber-50 shadow-lg md:h-[40px] md:w-[40px]'>
          <img
            src={defaultAvatar}
            alt='default avatar'
            className='h-full w-full object-cover'
          />
        </div>
        {toggleDropdown && (
          <AccountDropDown
            setToggleDropdown={setToggleDropdown}
            user={user}
            role={role}
          />
        )}
      </div>
    </>
  );
};

export default ActiveAccount;
