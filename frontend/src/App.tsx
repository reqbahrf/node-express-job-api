import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import './App.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

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
  if (loading) return <p>Loading...</p>;
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
          element={<Login />}
        />
        <Route
          path='/register'
          element={<Register />}
        />
        <Route
          path='/dashboard'
          element={accessToken ? <Dashboard /> : <Navigate to='/login' />}
        />
      </Routes>
    </>
  );
};

export default App;
