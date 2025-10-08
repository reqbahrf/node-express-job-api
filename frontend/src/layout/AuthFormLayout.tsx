import React, { ReactNode } from 'react';

interface AuthFormLayoutProps {
  children: ReactNode;
  title?: string;
}

const AuthFormLayout: React.FC<AuthFormLayoutProps> = ({ children, title }) => {
  return (
    <div className='min-h-screen flex items-center justify-center bg-white dark:bg-gray-700 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8 dark:bg-gray-800 p-8 rounded-lg shadow-md'>
        {title && (
          <div className='text-center'>
            <h2 className='mt-6 text-3xl font-extrabold text-gray-900 dark:text-white'>
              {title}
            </h2>
          </div>
        )}
        <div className='mt-8 space-y-6'>{children}</div>
      </div>
    </div>
  );
};

export default AuthFormLayout;
