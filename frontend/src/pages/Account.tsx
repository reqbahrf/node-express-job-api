import { useNavigate } from 'react-router-dom';
import { Suspense } from 'react';
import { useAppSelector, useAppDispatch } from '../app/store';
import { RiArrowLeftLine } from '@remixicon/react';
import { setActiveView } from '@/features/ui/uiSlice';
import Loading from '../components/Loading';
import AccountInfoCard from '../components/account/AccountInfoCard';
import ChangePasswordCard from '../components/account/ChangePasswordCard';

const Account = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { role } = useAppSelector((state) => state.auth);
  const handleNavigate = () => {
    switch (role) {
      case 'admin':
        navigate('/admin/dashboard');
        break;
      case 'applicant':
        navigate('/user/dashboard');
        break;
    }
    dispatch(setActiveView('dashboard'));
  };
  return (
    <>
      <div className='flex justify-between'>
        <h1 className='text-2xl font-bold'>Account</h1>
        <button
          className='dark:text-white text-black px-3 py-1 rounded-md inline-flex items-center gap-1'
          onClick={handleNavigate}
        >
          <RiArrowLeftLine />
          Back
        </button>
      </div>
      <hr />
      <AccountInfoCard />
      <ChangePasswordCard />
    </>
  );
};

export default Account;
