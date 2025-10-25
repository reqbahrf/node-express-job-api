import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Loading from '../components/Loading';
import AppLayout from '../layout/AppLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { ROLES } from '@/constant/roles';
import { withLayout } from '../utils/withLayout';

import AdminDashboardView from '../pages/admin/DashboardView';
import CompanyView from '../pages/admin/CompanyView';
const Account = lazy(() => import('../pages/Account'));

const AdminRouter = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route
          path='dashboard'
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              {withLayout(AppLayout, <AdminDashboardView />)}
            </ProtectedRoute>
          }
        />
        <Route
          path='companies'
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              {withLayout(AppLayout, <CompanyView />)}
            </ProtectedRoute>
          }
        />
        <Route
          path='account'
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              {withLayout(AppLayout, <Account />)}
            </ProtectedRoute>
          }
        />
        <Route path='*' element={<Navigate to='dashboard' replace />} />
      </Routes>
    </Suspense>
  );
};

export default AdminRouter;
