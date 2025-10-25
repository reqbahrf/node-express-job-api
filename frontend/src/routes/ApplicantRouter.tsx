import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Loading from '../components/Loading';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { ROLES } from '@/constant/roles';
import { LayoutProvider } from '@/context/LayoutContext';

import ApplicantDashboardView from '../pages/applicant/DashboardView';
const Account = lazy(() => import('../pages/Account'));

const ApplicantRouter = () => {
  return (
    <Suspense fallback={<Loading />}>
      <LayoutProvider>
        <Routes>
          <Route
            path='dashboard'
            element={
              <ProtectedRoute allowedRoles={[ROLES.APPLICANT]}>
                <ApplicantDashboardView />
              </ProtectedRoute>
            }
          />
          <Route
            path='account'
            element={
              <ProtectedRoute allowedRoles={[ROLES.APPLICANT]}>
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

export default ApplicantRouter;
