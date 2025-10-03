import React, { lazy, Suspense } from 'react';
import Header from '../components/Header';
import DashboardContent from '../components/DashboardContent';
import Loading from '../components/Loading';
const AdminView = lazy(
  () => import('../components/dashboardContent/AdminView')
);
const JobsView = lazy(() => import('../components/dashboardContent/JobsView'));
import { useAppSelector } from '../app/store';
const Dashboard = () => {
  const { role } = useAppSelector((state) => state.auth);
  return (
    <>
      <Header />
      {/* Dashboard content */}
      <DashboardContent>
        <Suspense fallback={<Loading />}>
          {role === 'admin' ? <AdminView /> : <JobsView />}
        </Suspense>
      </DashboardContent>
    </>
  );
};

export default Dashboard;
