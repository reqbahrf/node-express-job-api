import React, { lazy, Suspense } from 'react';
import Header from '../components/Header';
import DashboardContent from '../components/DashboardContent';
import Loading from '../components/Loading';
import Account from '../components/Account';
const AdminView = lazy(
  () => import('../components/dashboardContent/AdminView')
);
const JobsView = lazy(() => import('../components/dashboardContent/JobsView'));
import { useAppSelector } from '../app/store';
const Dashboard = () => {
  const { role } = useAppSelector((state) => state.auth);
  const { activeView } = useAppSelector((state) => state.ui);
  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return role === 'admin' ? <AdminView /> : <JobsView />;
      case 'account':
        return <Account />;
      default:
        return role === 'admin' ? <AdminView /> : <JobsView />;
    }
  };
  return (
    <>
      <Header />
      {/* Dashboard content */}
      <DashboardContent>
        <div className=' bg-white min-h-screen flex justify-center'>
          <div className='md:w-1/2 w-full h-[80vh] mt-[100px] sm:mx-[20px]'>
            <Suspense fallback={<Loading />}>{renderContent()}</Suspense>
          </div>
        </div>
      </DashboardContent>
    </>
  );
};

export default Dashboard;
