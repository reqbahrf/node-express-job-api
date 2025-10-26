import { useEffect } from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import './App.css';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { Toaster } from 'react-hot-toast';
import AppRouter from './routes/AppRouter';
import { ModalProvider } from './context/ModalContext';

const titles: Record<string, string> = {
  '/': 'Landing Page',
  '/login': 'Login',
  '/register': 'Register',
  '/user/dashboard': 'Dashboard',
  '/admin/dashboard': 'Admin Dashboard',
  '/account': 'Account',
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
      <Provider store={store}>
        <TitleManager />
        <ModalProvider>
          <AppRouter />
        </ModalProvider>
        <Toaster />
      </Provider>
    </Router>
  );
};

export default App;
