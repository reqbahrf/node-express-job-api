import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../app/store';
import { RiArrowLeftLine } from '@remixicon/react';
const Account = () => {
  const navigate = useNavigate();
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
  };
  return (
    <>
      <div className='flex justify-between'>
        Account
        <button
          className='dark:text-white text-black px-3 py-1 rounded-md inline-flex items-center gap-1'
          onClick={handleNavigate}
        >
          <RiArrowLeftLine />
          Back
        </button>
      </div>
    </>
  );
};

export default Account;
