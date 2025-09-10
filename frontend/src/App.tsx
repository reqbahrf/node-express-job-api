import React, { useEffect, Suspense, lazy } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import './App.css';
import { AuthProvider, useAuth } from './context/AuthContext';
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Loading = lazy(() => import('./components/Loading'));

const titles = {
  '/': 'Landing Page',
  '/login': 'Login',
  '/register': 'Register',
  '/dashboard': 'Dashboard',
};

const TitleManager = () => {
  const location = useLocation();
  useEffect(() => {
    document.title = titles[location.pathname] || 'Job API';
  }, [location]);

  return null;
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

const AppContent = () => {
  const { accessToken, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <TitleManager />
      <Routes>
        <Route
          path='/'
          element={<Home />}
        />
        <Route
          path='/login'
          element={
            <Suspense fallback={<Loading />}>
              {!accessToken ? <Login /> : <Navigate to='/dashboard' />}
            </Suspense>
          }
        />
        <Route
          path='/register'
          element={
            <Suspense fallback={<Loading />}>
              {!accessToken ? <Register /> : <Navigate to='/dashboard' />}
            </Suspense>
          }
        />
        <Route
          path='/dashboard'
          element={
            <Suspense fallback={<Loading />}>
              {accessToken ? <Dashboard /> : <Navigate to='/login' />}
            </Suspense>
          }
        />
      </Routes>
    </>
  );
};

export default App;
