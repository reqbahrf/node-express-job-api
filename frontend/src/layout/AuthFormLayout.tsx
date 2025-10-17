import React, { ReactNode } from 'react';

interface AuthFormLayoutProps {
  children: ReactNode;
  title?: string;
}

const AuthFormLayout: React.FC<AuthFormLayoutProps> = ({ children, title }) => {
  return (
    <div className='flex min-h-screen items-center justify-center bg-white px-4 py-12 sm:px-6 lg:px-8 dark:bg-gray-900'>
      <div className='w-full max-w-md space-y-8 rounded-lg p-8 shadow-md dark:bg-gray-800'>
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
