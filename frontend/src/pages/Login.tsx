import React, { useState } from 'react';
import AuthFormContainer from '../components/AuthFormContainer';
import { Link, useNavigate } from 'react-router-dom';
import authAPI from '../features/auth/authAPI';
import { useAppDispatch } from '../app/store';

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [formData, setformData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setformData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const resultAction = await dispatch(authAPI.login(formData));
    if (authAPI.login.fulfilled.match(resultAction)) {
      navigate('/dashboard');
    }
  };

  return (
    <AuthFormContainer title='Login'>
      <form
        className='mt-8 space-y-6'
        onSubmit={handleSubmit}
      >
        <div className='rounded-md shadow-sm -space-y-px'>
          <div>
            <label
              htmlFor='email'
              className='sr-only'
            >
              Email address
            </label>
            <input
              id='email'
              name='email'
              type='email'
              required
              className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm'
              placeholder='Email address'
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <label
              htmlFor='password'
              className='sr-only'
            >
              Password
            </label>
            <input
              id='password'
              name='password'
              type='password'
              required
              className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm'
              placeholder='Password'
              value={formData.password}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className='flex items-center justify-between'>
          <div className='flex items-center'>
            <input
              id='remember-me'
              name='remember-me'
              type='checkbox'
              className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
            />
            <label
              htmlFor='remember-me'
              className='ml-2 block text-sm text-gray-900'
            >
              Remember me
            </label>
          </div>

          <div className='text-sm'>
            <a
              href='#'
              className='font-medium text-blue-600 hover:text-blue-500'
            >
              Forgot your password?
            </a>
          </div>
        </div>

        <div>
          <button
            type='submit'
            className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
          >
            Sign in
          </button>
        </div>

        <div className='text-sm text-center'>
          Don't have an account?{' '}
          <Link
            to='/register'
            className='font-medium text-blue-600 hover:text-blue-500'
          >
            Sign up
          </Link>
        </div>
      </form>
    </AuthFormContainer>
  );
};

export default Login;
