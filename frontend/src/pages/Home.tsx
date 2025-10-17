import { Link } from 'react-router-dom';
import Header from '../components/Header';

const Home = () => {
  return (
    <div className='flex min-h-screen flex-col bg-white dark:bg-gray-900'>
      <Header />
      <div className='flex flex-1 flex-col items-center justify-center gap-8 p-8 md:flex-row'>
        <div className='flex max-w-2xl items-center text-lg text-gray-600 md:h-[25vh] dark:text-white'>
          <div className='flex flex-col'>
            <h1 className='text-center text-4xl font-bold text-gray-900 dark:text-white'>
              Welcome to Job API
            </h1>
            <p className='text-center text-lg text-gray-600 dark:text-white'>
              A web application that allows you to record and manage your job
              applications.
            </p>
          </div>
        </div>

        <div className='flex w-full max-w-xs flex-col justify-center space-y-4 md:h-[25vh]'>
          <Link
            to='/login'
            className='w-full rounded-md border border-transparent bg-blue-600 px-4 py-2 text-center text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none'
          >
            Login
          </Link>
          <Link
            to='/register'
            className='w-full rounded-md border border-transparent bg-white px-4 py-2 text-center text-sm font-medium text-blue-600 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none'
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
