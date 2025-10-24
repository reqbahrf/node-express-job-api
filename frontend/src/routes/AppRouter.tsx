import React, {
  lazy,
  Suspense,
  ComponentType,
  ReactNode,
  useEffect,
} from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/store';
import authAPI from '../features/auth/authAPI';
const Home = lazy(() => import('../pages/Home'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const ApplicantDashboardView = lazy(
  () => import('../pages/applicant/DashboardView'),
);
const AdminDashboardView = lazy(() => import('../pages/admin/DashboardView'));
const CompanyView = lazy(() => import('../pages/admin/CompanyView'));
const EmployerDashboardView = lazy(
  () => import('../pages/employer/DashboardView'),
);
const EmployerCompanyForm = lazy(
  () => import('../features/employer/components/CompanyInfoForm'),
);
const Account = lazy(() => import('../pages/Account'));
import Loading from '../components/Loading';
import AppLayout from '../layout/AppLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { ROLES } from '@/constant/roles';
import navigateToDashboard from '@/utils/navigateToDashboard';

const AppRouter = () => {
  const { accessToken, role } = useAppSelector((state) => state.auth);
  const globalLoading = useAppSelector((state) => state.loading.globalLoading);
  const dispatch = useAppDispatch();

  const withLayout = (
    Layout: ComponentType<{ children: ReactNode }>,
    page: ReactNode,
  ) => {
    if (globalLoading) return <Loading />;
    if (!accessToken) return <Navigate to='/login' />;
    return <Layout>{page}</Layout>;
  };

  useEffect(() => {
    dispatch(authAPI.refreshToken());
  }, []);
  if (globalLoading) {
    return <Loading />;
  }

  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route
          path='/login'
          element={
            <Suspense fallback={<Loading />}>
              {!accessToken ? (
                <Login />
              ) : (
                <Navigate to={navigateToDashboard(role || '')} replace />
              )}
            </Suspense>
          }
        />
        <Route
          path='/register'
          element={
            <Suspense fallback={<Loading />}>
              {!accessToken ? (
                <Register />
              ) : (
                <Navigate to={navigateToDashboard(role || '')} />
              )}
            </Suspense>
          }
        />
        <Route
          path='/applicant/dashboard'
          element={
            <ProtectedRoute allowedRoles={[ROLES.APPLICANT]}>
              {withLayout(AppLayout, <ApplicantDashboardView />)}
            </ProtectedRoute>
          }
        />
        <Route
          path='/employer/company-form'
          element={
            <ProtectedRoute allowedRoles={[ROLES.EMPLOYER]}>
              {withLayout(AppLayout, <EmployerCompanyForm />)}
            </ProtectedRoute>
          }
        />
        <Route
          path='/employer/dashboard'
          element={
            <ProtectedRoute allowedRoles={[ROLES.EMPLOYER]}>
              {withLayout(AppLayout, <EmployerDashboardView />)}
            </ProtectedRoute>
          }
        />
        <Route
          path='/admin/dashboard'
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              {withLayout(AppLayout, <AdminDashboardView />)}
            </ProtectedRoute>
          }
        />
        <Route
          path='/admin/companies'
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              {withLayout(AppLayout, <CompanyView />)}
            </ProtectedRoute>
          }
        />

        <Route
          path='/account'
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.APPLICANT]}>
              {withLayout(AppLayout, <Account />)}
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

export default AppRouter;
