import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Loading from '../components/Loading';
import AppLayout from '../layout/AppLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { ROLES } from '@/constant/roles';
import { withLayout } from '../utils/withLayout';

import EmployerDashboardView from '../pages/employer/DashboardView';
const EmployerCompanyForm = lazy(
  () => import('../features/employer/components/CompanyInfoForm'),
);
const Account = lazy(() => import('../pages/Account'));

const EmployerRouter = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route
          path='dashboard'
          element={
            <ProtectedRoute allowedRoles={[ROLES.EMPLOYER]}>
              {withLayout(AppLayout, <EmployerDashboardView />)}
            </ProtectedRoute>
          }
        />
        <Route
          path='company-form'
          element={
            <ProtectedRoute allowedRoles={[ROLES.EMPLOYER]}>
              {withLayout(AppLayout, <EmployerCompanyForm />)}
            </ProtectedRoute>
          }
        />
        <Route
          path='account'
          element={
            <ProtectedRoute allowedRoles={[ROLES.EMPLOYER]}>
              {withLayout(AppLayout, <Account />)}
            </ProtectedRoute>
          }
        />
        <Route path='*' element={<Navigate to='dashboard' replace />} />
      </Routes>
    </Suspense>
  );
};

export default EmployerRouter;
