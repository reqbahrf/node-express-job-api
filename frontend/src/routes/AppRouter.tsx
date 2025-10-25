import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/store';
import authAPI from '../features/auth/authAPI';
import Loading from '../components/Loading';
import navigateToDashboard from '@/utils/navigateToDashboard';

// Import the new role-specific routers
const AdminRouter = lazy(() => import('./AdminRouter'));
const EmployerRouter = lazy(() => import('./EmployerRouter'));
const ApplicantRouter = lazy(() => import('./ApplicantRouter'));

const Home = lazy(() => import('../pages/Home'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));

const AppRouter = () => {
  const { accessToken, role } = useAppSelector((state) => state.auth);
  const globalLoading = useAppSelector((state) => state.loading.globalLoading);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(authAPI.refreshToken());
  }, []);

  if (globalLoading) {
    return <Loading />;
  }

  return (
    <>
      <Routes>
        {/* Public Routes */}
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

        {/* Role-specific Routers */}
        <Route path='/admin/*' element={<AdminRouter />} />
        <Route path='/employer/*' element={<EmployerRouter />} />
        <Route path='/applicant/*' element={<ApplicantRouter />} />

        {/* Catch-all for unauthenticated users trying to access protected routes directly */}
        {accessToken ? null : (
          <Route path='/*' element={<Navigate to='/login' replace />} />
        )}
      </Routes>
    </>
  );
};

export default AppRouter;
