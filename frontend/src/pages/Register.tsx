import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthFormContainer from '../layout/AuthFormLayout';
import { useNavigate } from 'react-router-dom';
import authAPI from '../features/auth/authAPI';
import { useAppDispatch, useAppSelector } from '../app/store';
import Header from '../components/Header';
import Input from '../components/Input';
import navigateToDashboard from '../utils/navigateToDashboard';
import Modal from '@/components/Modal';

const Register = () => {
  const dispatch = useAppDispatch();
  const role = useAppSelector((state) => state.auth.role);
  const navigate = useNavigate();
  const { registerError } = useAppSelector((state) => state.auth);
  const [formData, setformData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'applicant',
  });

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setformData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRoleToggle = (role: 'applicant' | 'employer') => {
    setformData({
      ...formData,
      role,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };

  const submitForm = async () => {
    const resultAction = await dispatch(authAPI.register(formData));
    setShowConfirmModal(false);
    if (authAPI.register.fulfilled.match(resultAction)) {
      navigate(navigateToDashboard(role || ''));
    }
  };
  return (
    <>
      <Header />
      <AuthFormContainer title='Register'>
        <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
          <div className='-space-y-px rounded-md'>
            <div>
              <label htmlFor='name' className='sr-only'>
                Full Name
              </label>
              <Input
                id='name'
                name='name'
                type='text'
                required
                styleType='custom'
                className='relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm'
                placeholder='Full Name'
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor='email' className='sr-only'>
                Email address
              </label>
              <Input
                id='email'
                name='email'
                type='email'
                required
                styleType='custom'
                className='relative block w-full appearance-none rounded-none border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm'
                placeholder='Email address'
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor='password' className='sr-only'>
                Password
              </label>
              <Input
                id='password'
                name='password'
                type='password'
                required
                styleType='custom'
                className='relative block w-full appearance-none rounded-none border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm'
                placeholder='Password'
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor='confirmPassword' className='sr-only'>
                Confirm Password
              </label>
              <Input
                id='confirmPassword'
                name='confirmPassword'
                type='password'
                required
                styleType='custom'
                className='relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm'
                placeholder='Confirm Password'
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
            <h2 className='my-4 text-center text-lg font-bold text-gray-900 dark:text-white'>
              Role
            </h2>
            <div className='flex justify-center gap-4 pb-4'>
              <button
                type='button'
                onClick={() => handleRoleToggle('applicant')}
                className={`rounded px-4 py-2 ${
                  formData.role === 'applicant'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                Applicant
              </button>
              <button
                type='button'
                onClick={() => handleRoleToggle('employer')}
                className={`rounded px-4 py-2 ${
                  formData.role === 'employer'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                Employer
              </button>
            </div>
          </div>
          <div>
            <button
              type='submit'
              className='group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none'
            >
              Create Account
            </button>
          </div>
          {registerError && (
            <div className='mt-2 text-sm text-red-600'>{registerError}</div>
          )}
          <div className='text-center text-sm text-black dark:text-white'>
            Already have an account?{' '}
            <Link
              to='/login'
              className='font-medium text-blue-600 hover:text-blue-500'
            >
              Sign in
            </Link>
          </div>
        </form>
      </AuthFormContainer>
      {showConfirmModal && (
        <Modal
          title='Confirm Submission'
          headerColor='bg-blue-500'
          onClose={() => setShowConfirmModal(false)}
        >
          <div>
            <p className='p-4 text-center text-lg text-black dark:text-white'>
              Are you sure you want to register this account with a role of{' '}
              <span className='font-bold'>{formData.role}</span>?
            </p>
            <div className='flex justify-center gap-4'>
              <button
                type='button'
                onClick={() => setShowConfirmModal(false)}
                className='text-black dark:text-white'
              >
                Cancel
              </button>
              <button
                type='button'
                onClick={() => submitForm()}
                className='rounded bg-blue-600 px-4 py-2 text-white'
              >
                Submit
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default Register;
