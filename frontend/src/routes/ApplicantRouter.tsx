import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Loading from '../components/Loading';
import AppLayout from '../layout/AppLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { ROLES } from '@/constant/roles';
import { withLayout } from '../utils/withLayout'; // Added import

import ApplicantDashboardView from '../pages/applicant/DashboardView';
const Account = lazy(() => import('../pages/Account'));

const ApplicantRouter = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route
          path='dashboard'
          element={
            <ProtectedRoute allowedRoles={[ROLES.APPLICANT]}>
              {withLayout(AppLayout, <ApplicantDashboardView />)}
            </ProtectedRoute>
          }
        />
        <Route
          path='account'
          element={
            <ProtectedRoute allowedRoles={[ROLES.APPLICANT]}>
              {withLayout(AppLayout, <Account />)}
            </ProtectedRoute>
          }
        />
        <Route path='*' element={<Navigate to='dashboard' replace />} />
      </Routes>
    </Suspense>
  );
};

export default ApplicantRouter;
