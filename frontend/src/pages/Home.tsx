import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

const Home = () => {
  return (
    <div className='min-h-screen flex flex-col bg-white'>
      <Header />
      <div className='flex-1 flex flex-col md:flex-row items-center justify-center p-8 gap-8'>
        <div className='text-lg text-gray-600 max-w-2xl md:h-[25vh] flex items-center'>
          <div className='flex flex-col'>
            <h1 className='text-4xl font-bold text-gray-900 text-center'>
              Welcome to Job API
            </h1>
            <p className='text-lg text-gray-600 text-center'>
              a web application that allows you to search for jobs and connect
              with potential employers.
            </p>
          </div>
        </div>

        <div className='flex flex-col justify-center space-y-4 w-full max-w-xs md:h-[25vh]'>
          <Link
            to='/login'
            className='w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-center'
          >
            Login
          </Link>
          <Link
            to='/register'
            className='w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-blue-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-center'
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
