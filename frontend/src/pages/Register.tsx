import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthFormContainer from '../components/AuthFormContainer';
import { useNavigate } from 'react-router-dom';
import { register } from '../features/auth/authAPI';
import { useAppDispatch } from '../app/store';

const Register = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
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
    const resultAction = await dispatch(register(formData));
    if (register.fulfilled.match(resultAction)) {
      navigate('/dashboard');
    }
  };

  return (
    <AuthFormContainer title='Register'>
      <form
        className='mt-8 space-y-6'
        onSubmit={handleSubmit}
      >
        <div className='rounded-md shadow-sm -space-y-px'>
          <div>
            <label
              htmlFor='name'
              className='sr-only'
            >
              Full Name
            </label>
            <input
              id='name'
              name='name'
              type='text'
              required
              className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm'
              placeholder='Full Name'
              value={formData.name}
              onChange={handleChange}
            />
          </div>
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
              className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm'
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
              className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm'
              placeholder='Password'
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div>
            <label
              htmlFor='confirmPassword'
              className='sr-only'
            >
              Confirm Password
            </label>
            <input
              id='confirmPassword'
              name='confirmPassword'
              type='password'
              required
              className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm'
              placeholder='Confirm Password'
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <button
            type='submit'
            className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
          >
            Create Account
          </button>
        </div>
        <div className='text-sm text-center'>
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
  );
};

export default Register;
