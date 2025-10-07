import React from 'react';
import { useAppDispatch } from '../app/store';
import { setActiveView } from '../features/ui/uiSlice';
import { RiArrowLeftLine } from '@remixicon/react';
const Account = () => {
  const dispatch = useAppDispatch();
  return (
    <>
      <div className='flex justify-between'>
        Account
        <button
          className='dark:text-white text-black px-3 py-1 rounded-md inline-flex items-center gap-1'
          onClick={() => dispatch(setActiveView('dashboard'))}
        >
          <RiArrowLeftLine />
          Back
        </button>
      </div>
    </>
  );
};

export default Account;
