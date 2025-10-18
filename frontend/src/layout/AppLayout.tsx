import { ReactNode, Suspense } from 'react';
import Header from '@/components/Header';
import Loading from '@/components/Loading';
import NavigationTab from '@/components/NavigationTab';
const AppLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Header />
      <NavigationTab />
      <div className='flex min-h-screen justify-center overflow-x-hidden overflow-y-scroll bg-white pt-10 dark:bg-gray-900'>
        <div className='mt-[100px] w-full overflow-hidden sm:mx-[20px] md:w-[60%] dark:text-white'>
          <Suspense fallback={<Loading />}>{children}</Suspense>
        </div>
      </div>
    </>
  );
};

export default AppLayout;
