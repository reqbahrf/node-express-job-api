import { ReactNode, Suspense } from 'react';
import Header from '@/components/Header';
import Loading from '@/components/Loading';
const AppLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Header />
      <div className=' bg-white dark:bg-gray-700 min-h-screen flex justify-center overflow-x-hidden overflow-y-scroll'>
        <div className='md:w-[60%] w-full mt-[100px] sm:mx-[20px] dark:text-white overflow-hidden'>
          <Suspense fallback={<Loading />}>{children}</Suspense>
        </div>
      </div>
    </>
  );
};

export default AppLayout;
