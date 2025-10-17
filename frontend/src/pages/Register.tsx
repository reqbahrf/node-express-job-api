import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthFormContainer from '../layout/AuthFormLayout';
import { useNavigate } from 'react-router-dom';
import authAPI from '../features/auth/authAPI';
import { useAppDispatch, useAppSelector } from '../app/store';
import Header from '../components/Header';
import Input from '../components/Input';
import navigateToDashboard from '../utils/navigateToDashboard';

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
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setformData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const resultAction = await dispatch(authAPI.register(formData));
    if (authAPI.register.fulfilled.match(resultAction)) {
      navigate(navigateToDashboard(role || ''));
    }
  };

  return (
    <>
      <Header />
      <AuthFormContainer title='Register'>
        <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
          <div className='-space-y-px rounded-md shadow-sm'>
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
    </>
  );
};

export default Register;
