import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../app/store';
import { RiArrowLeftLine } from '@remixicon/react';
import { setActiveView } from '@/features/ui/uiSlice';
import toast from 'react-hot-toast';
import Input from '../components/Input';
import { useState } from 'react';
import axios from 'axios';
const ChangePasswordCard = () => {
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const [changePass, setChangePass] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChangePass((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const passwordPromise = axios.post(
      '/api/v1/password/change-password',
      changePass,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    await toast.promise(passwordPromise, {
      loading: 'Updating password...',
      success: (response) =>
        response.data.msg || 'Password updated successfully',
      error: (error) => error.response?.data?.message || 'Something went wrong',
    });

    setChangePass({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };
  return (
    <div className='w-full mx-auto mt-4'>
      <h2 className='text-xl font-bold'>Change Password</h2>
      <div className='bg-white dark:bg-gray-800 p-4 rounded-md mt-2'>
        <form
          action=''
          onSubmit={handleSubmit}
        >
          <div className='mb-4'>
            <label
              htmlFor='current-password'
              className='block text-sm font-medium text-gray-700 dark:text-white'
            >
              Current Password
            </label>
            <Input
              type='password'
              name='currentPassword'
              id='currentPassword'
              onChange={handleChange}
            />
          </div>
          <div className='mb-4'>
            <label
              htmlFor='new-password'
              className='block text-sm font-medium text-gray-700 dark:text-white'
            >
              New Password
            </label>
            <Input
              type='password'
              name='newPassword'
              id='newPassword'
              onChange={handleChange}
            />
          </div>
          <div className='mb-4'>
            <label
              htmlFor='confirm-password'
              className='block text-sm font-medium text-gray-700 dark:text-white'
            >
              Confirm Password
            </label>
            <Input
              type='password'
              name='confirmPassword'
              id='confirmPassword'
              onChange={handleChange}
            />
          </div>
          <button
            type='submit'
            className='w-full inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};
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
      <ChangePasswordCard />
    </>
  );
};

export default Account;
