import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Loading from '../components/Loading';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { ROLES } from '@/constant/roles';
import { LayoutProvider } from '../context/LayoutContext';
import EmployerDashboardView from '../pages/employer/DashboardView';
const EmployerCompanyForm = lazy(
  () => import('../features/employer/components/CompanyInfoForm'),
);
const Account = lazy(() => import('../pages/Account'));

const EmployerRouter = () => {
  return (
    <Suspense fallback={<Loading />}>
      <LayoutProvider>
        <Routes>
          <Route
            path='dashboard'
            element={
              <ProtectedRoute allowedRoles={[ROLES.EMPLOYER]}>
                <EmployerDashboardView />
              </ProtectedRoute>
            }
          />
          <Route
            path='company-form'
            element={
              <ProtectedRoute allowedRoles={[ROLES.EMPLOYER]}>
                <EmployerCompanyForm />
              </ProtectedRoute>
            }
          />
          <Route
            path='account'
            element={
              <ProtectedRoute allowedRoles={[ROLES.EMPLOYER]}>
                <Account />
              </ProtectedRoute>
            }
          />
          <Route path='*' element={<Navigate to='dashboard' replace />} />
        </Routes>
      </LayoutProvider>
    </Suspense>
  );
};

export default EmployerRouter;
