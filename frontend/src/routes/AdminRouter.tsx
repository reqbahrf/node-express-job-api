import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Loading from '../components/Loading';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { ROLES } from '@/constant/roles';
import { LayoutProvider } from '../context/LayoutContext';

import AdminDashboardView from '../pages/admin/DashboardView';
import CompanyView from '../pages/admin/CompanyView';
const Account = lazy(() => import('../pages/Account'));

const AdminRouter = () => {
  return (
    <Suspense fallback={<Loading />}>
      <LayoutProvider>
        <Routes>
          <Route
            path='dashboard'
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <AdminDashboardView />
              </ProtectedRoute>
            }
          />
          <Route
            path='companies'
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <CompanyView />
              </ProtectedRoute>
            }
          />
          <Route
            path='account'
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
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

export default AdminRouter;
