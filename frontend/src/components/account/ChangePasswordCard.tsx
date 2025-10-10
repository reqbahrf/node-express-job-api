import { useAppSelector } from '@/app/store';
import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Input from '../Input';
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
    <div className='w-full mx-auto mb-4'>
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
              value={changePass.currentPassword}
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
              value={changePass.newPassword}
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
              value={changePass.confirmPassword}
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

export default ChangePasswordCard;
