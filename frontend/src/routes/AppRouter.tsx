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
const JobsView = lazy(() => import('../pages/applicant/JobsView'));
const AdminView = lazy(() => import('../pages/admin/AdminView'));
const Account = lazy(() => import('../pages/Account'));
import Loading from '../components/Loading';
import AppLayout from '../layout/AppLayout';

const AppRouter = () => {
  const { accessToken, role } = useAppSelector((state) => state.auth);
  const globalLoading = useAppSelector((state) => state.loading.globalLoading);
  const dispatch = useAppDispatch();

  const withLayout = (
    Layout: ComponentType<{ children: ReactNode }>,
    page: ReactNode
  ) => {
    return (
      <Layout>
        <Suspense fallback={<Loading />}>
          {accessToken ? page : <Navigate to='/login' />}
        </Suspense>
      </Layout>
    );
  };

  const navigateToDashboard = () => {
    return role === 'admin' ? '/admin/dashboard' : '/user/dashboard';
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
        <Route
          path='/'
          element={<Home />}
        />
        <Route
          path='/login'
          element={
            <Suspense fallback={<Loading />}>
              {!accessToken ? (
                <Login />
              ) : (
                <Navigate to={navigateToDashboard()} />
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
                <Navigate to={navigateToDashboard()} />
              )}
            </Suspense>
          }
        />
        <Route
          path='/user/dashboard'
          element={withLayout(AppLayout, <JobsView />)}
        />
        <Route
          path='/admin/dashboard'
          element={withLayout(AppLayout, <AdminView />)}
        />
        <Route
          path='/account'
          element={withLayout(AppLayout, <Account />)}
        />
      </Routes>
    </>
  );
};

export default AppRouter;
