import { useState, useEffect } from 'react';
import AuthFormContainer from '../layout/AuthFormLayout';
import { Link, useNavigate } from 'react-router-dom';
import authAPI from '../features/auth/authAPI';
import { useAppDispatch } from '../app/store';
import Header from '../components/Header';
import navigateToDashboard from '../utils/navigateToDashboard';
import toast from 'react-hot-toast';
import { setActiveView } from '@/features/ui/uiSlice';

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(setActiveView('Login'));
  }, []);
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
      const role = resultAction.payload.role;
      navigate(navigateToDashboard(role));
    } else if (authAPI.login.rejected.match(resultAction)) {
      const error = (resultAction.payload as string) || 'Something went wrong';
      toast.error('Login failed: ' + error);
    }
  };

  return (
    <>
      <Header />
      <AuthFormContainer title='Login'>
        <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
          <div className='space-y-px rounded-md shadow-sm'>
            <div>
              <label htmlFor='email' className='sr-only'>
                Email address
              </label>
              <input
                id='email'
                name='email'
                type='email'
                required
                className='relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm dark:border-gray-600 dark:text-white dark:placeholder-gray-400'
                placeholder='Email address'
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor='password' className='sr-only'>
                Password
              </label>
              <input
                id='password'
                name='password'
                type='password'
                required
                className='relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm dark:border-gray-600 dark:text-white dark:placeholder-gray-400'
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
                className='h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
              />
              <label
                htmlFor='remember-me'
                className='ml-2 block text-sm text-gray-900 dark:text-white'
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
              className='group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none'
            >
              Sign in
            </button>
          </div>

          <div className='text-center text-sm dark:text-white'>
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
    </>
  );
};

export default Login;
