import React from 'react';
import { useAppDispatch } from '../app/store';
import { setActiveView } from '../features/ui/uiSlice';
const Account = () => {
  const dispatch = useAppDispatch();
  return (
    <>
      <div className='flex justify-between'>
        Account
        <button
          className='bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600'
          onClick={() => dispatch(setActiveView('dashboard'))}
        >
          Back
        </button>
      </div>
    </>
  );
};

export default Account;
