Folder structure:
├── frontend/
├── .gitignore
├── declaration.d.ts
├── eslint.config.js
├── index.html
├── package.json
├── vite.config.js
├── dist/
├── node_modules/
├── public/
│ ├── vite.svg
├── src/
│ ├── App.css
│ ├── App.tsx
│ ├── main.tsx
│ ├── app/
│ │ ├── store.ts
│ ├── assets/
│ │ ├── avatar-default-icon.png
│ │ ├── react.svg
│ ├── components/
│ │ ├── AuthFormContainer.tsx
│ │ ├── DashboardContent.tsx
│ │ ├── Header.tsx
│ │ ├── JobCard.tsx
│ │ ├── Loading.tsx
│ │ ├── dashboardContent/
│ │ │ ├── AdminView.tsx
│ │ │ ├── JobsView.tsx
│ │ ├── modal/
│ │ │ ├── AddJobModal.tsx
│ │ │ ├── DeleteJobModal.tsx
│ │ │ ├── MainModal.tsx
│ │ │ ├── UpdateJobModal.tsx
│ ├── context/
│ ├── features/
│ │ ├── auth/
│ │ │ ├── authAPI.ts
│ │ │ ├── authSlice.ts
│ │ ├── job/
│ │ │ ├── jobAPI.ts
│ │ │ ├── jobSlice.ts
│ │ ├── loading/
│ │ │ ├── loadingSlice.ts
│ ├── hooks/
│ │ ├── useSocket.tsx
│ ├── pages/
│ │ ├── Dashboard.tsx
│ │ ├── Home.tsx
│ │ ├── Login.tsx
│ │ ├── Register.tsx

Concatenated content:

---/---

--.gitignore--

# Logs

logs
_.log
npm-debug.log_
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
\*.local

# Editor directories and files

.vscode/_
!.vscode/extensions.json
.idea
.DS_Store
_.suo
_.ntvs_
_.njsproj
_.sln
\*.sw?

--declaration.d.ts--

declare module '\*.png' {
const value: string;
export default value;
}

declare module '\*.jpg' {
const value: string;
export default value;
}

declare module '\*.jpeg' {
const value: string;
export default value;
}

--eslint.config.js--

import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
globalIgnores(['dist']),
{
files: ['**/*.{js,jsx}'],
extends: [
js.configs.recommended,
reactHooks.configs['recommended-latest'],
reactRefresh.configs.vite,
],
languageOptions: {
ecmaVersion: 2020,
globals: globals.browser,
parserOptions: {
ecmaVersion: 'latest',
ecmaFeatures: { jsx: true },
sourceType: 'module',
},
},
rules: {
'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
},
},
])

--index.html--

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <!-- <link
      rel="icon"
      type="image/svg+xml"
      href="/vite.svg"
    /> -->
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0"
    />
    <title>Job API</title>
  </head>
  <body>
    <div id="root"></div>
    <script
      type="module"
      src="/src/main.tsx"
    ></script>
  </body>
</html>

--package.json--

{
"name": "frontend",
"private": true,
"version": "0.0.0",
"type": "module",
"scripts": {
"dev": "vite",
"build": "vite build",
"lint": "eslint .",
"preview": "vite preview"
},
"dependencies": {
"@reduxjs/toolkit": "^2.9.0",
"@tailwindcss/vite": "^4.1.12",
"axios": "^1.11.0",
"react": "^19.1.1",
"react-dom": "^19.1.1",
"react-redux": "^9.2.0",
"react-router-dom": "^7.8.2",
"socket.io-client": "^4.8.1",
"tailwindcss": "^4.1.12"
},
"devDependencies": {
"@eslint/js": "^9.33.0",
"@types/react": "^19.1.10",
"@types/react-dom": "^19.1.7",
"@vitejs/plugin-react": "^5.0.0",
"eslint": "^9.33.0",
"eslint-plugin-react-hooks": "^5.2.0",
"eslint-plugin-react-refresh": "^0.4.20",
"globals": "^16.3.0",
"vite": "^7.1.2"
}
}

--vite.config.js--

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';

const **filename = fileURLToPath(import.meta.url);
const **dirname = dirname(\_\_filename);

// https://vite.dev/config/
export default defineConfig({
plugins: [react(), tailwindcss()],
server: {
proxy: {
'/api': {
target: 'http://localhost:3000',
changeOrigin: true,
secure: false,
},
},
},
build: {
outDir: '../frontend/dist',
emptyOutDir: true,
},
resolve: {
alias: {
'@': path.resolve(\_\_dirname, './src'),
},
},
});

---dist/---

---node_modules/---

---public/---

--vite.svg--

<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--logos" width="31.88" height="32" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 257"><defs><linearGradient id="IconifyId1813088fe1fbc01fb466" x1="-.828%" x2="57.636%" y1="7.652%" y2="78.411%"><stop offset="0%" stop-color="#41D1FF"></stop><stop offset="100%" stop-color="#BD34FE"></stop></linearGradient><linearGradient id="IconifyId1813088fe1fbc01fb467" x1="43.376%" x2="50.316%" y1="2.242%" y2="89.03%"><stop offset="0%" stop-color="#FFEA83"></stop><stop offset="8.333%" stop-color="#FFDD35"></stop><stop offset="100%" stop-color="#FFA800"></stop></linearGradient></defs><path fill="url(#IconifyId1813088fe1fbc01fb466)" d="M255.153 37.938L134.897 252.976c-2.483 4.44-8.862 4.466-11.382.048L.875 37.958c-2.746-4.814 1.371-10.646 6.827-9.67l120.385 21.517a6.537 6.537 0 0 0 2.322-.004l117.867-21.483c5.438-.991 9.574 4.796 6.877 9.62Z"></path><path fill="url(#IconifyId1813088fe1fbc01fb467)" d="M185.432.063L96.44 17.501a3.268 3.268 0 0 0-2.634 3.014l-5.474 92.456a3.268 3.268 0 0 0 3.997 3.378l24.777-5.718c2.318-.535 4.413 1.507 3.936 3.838l-7.361 36.047c-.495 2.426 1.782 4.5 4.151 3.78l15.304-4.649c2.372-.72 4.652 1.36 4.15 3.788l-11.698 56.621c-.732 3.542 3.979 5.473 5.943 2.437l1.313-2.028l72.516-144.72c1.215-2.423-.88-5.186-3.54-4.672l-25.505 4.922c-2.396.462-4.435-1.77-3.759-4.114l16.646-57.705c.677-2.35-1.37-4.583-3.769-4.113Z"></path></svg>

---src/---

--App.css--

@import "tailwindcss"

--App.tsx--

import React, { useEffect, Suspense, lazy } from 'react';
import {
BrowserRouter as Router,
Routes,
Route,
Navigate,
useLocation,
} from 'react-router-dom';
import './App.css';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { useAppDispatch, useAppSelector } from './app/store';
import authAPI from './features/auth/authAPI';
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
import Loading from './components/Loading';

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
<Provider store={store}>
<AppContent />
</Provider>
</Router>
);
};

const AppContent = () => {
const { accessToken } = useAppSelector((state) => state.auth);
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

--main.tsx--

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const root = document.getElementById('root') as HTMLElement;
createRoot(root).render(
<React.StrictMode>
<App />
</React.StrictMode>
);

---src\app/---

--store.ts--

import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import loadingReducer from '../features/loading/loadingSlice';
import jobReducer from '../features/job/jobSlice';

export const store = configureStore({
reducer: {
auth: authReducer,
loading: loadingReducer,
job: jobReducer,
},
});

export type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

---src\assets/---

--react.svg--

<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--logos" width="35.93" height="32" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 228"><path fill="#00D8FF" d="M210.483 73.824a171.49 171.49 0 0 0-8.24-2.597c.465-1.9.893-3.777 1.273-5.621c6.238-30.281 2.16-54.676-11.769-62.708c-13.355-7.7-35.196.329-57.254 19.526a171.23 171.23 0 0 0-6.375 5.848a155.866 155.866 0 0 0-4.241-3.917C100.759 3.829 77.587-4.822 63.673 3.233C50.33 10.957 46.379 33.89 51.995 62.588a170.974 170.974 0 0 0 1.892 8.48c-3.28.932-6.445 1.924-9.474 2.98C17.309 83.498 0 98.307 0 113.668c0 15.865 18.582 31.778 46.812 41.427a145.52 145.52 0 0 0 6.921 2.165a167.467 167.467 0 0 0-2.01 9.138c-5.354 28.2-1.173 50.591 12.134 58.266c13.744 7.926 36.812-.22 59.273-19.855a145.567 145.567 0 0 0 5.342-4.923a168.064 168.064 0 0 0 6.92 6.314c21.758 18.722 43.246 26.282 56.54 18.586c13.731-7.949 18.194-32.003 12.4-61.268a145.016 145.016 0 0 0-1.535-6.842c1.62-.48 3.21-.974 4.76-1.488c29.348-9.723 48.443-25.443 48.443-41.52c0-15.417-17.868-30.326-45.517-39.844Zm-6.365 70.984c-1.4.463-2.836.91-4.3 1.345c-3.24-10.257-7.612-21.163-12.963-32.432c5.106-11 9.31-21.767 12.459-31.957c2.619.758 5.16 1.557 7.61 2.4c23.69 8.156 38.14 20.213 38.14 29.504c0 9.896-15.606 22.743-40.946 31.14Zm-10.514 20.834c2.562 12.94 2.927 24.64 1.23 33.787c-1.524 8.219-4.59 13.698-8.382 15.893c-8.067 4.67-25.32-1.4-43.927-17.412a156.726 156.726 0 0 1-6.437-5.87c7.214-7.889 14.423-17.06 21.459-27.246c12.376-1.098 24.068-2.894 34.671-5.345a134.17 134.17 0 0 1 1.386 6.193ZM87.276 214.515c-7.882 2.783-14.16 2.863-17.955.675c-8.075-4.657-11.432-22.636-6.853-46.752a156.923 156.923 0 0 1 1.869-8.499c10.486 2.32 22.093 3.988 34.498 4.994c7.084 9.967 14.501 19.128 21.976 27.15a134.668 134.668 0 0 1-4.877 4.492c-9.933 8.682-19.886 14.842-28.658 17.94ZM50.35 144.747c-12.483-4.267-22.792-9.812-29.858-15.863c-6.35-5.437-9.555-10.836-9.555-15.216c0-9.322 13.897-21.212 37.076-29.293c2.813-.98 5.757-1.905 8.812-2.773c3.204 10.42 7.406 21.315 12.477 32.332c-5.137 11.18-9.399 22.249-12.634 32.792a134.718 134.718 0 0 1-6.318-1.979Zm12.378-84.26c-4.811-24.587-1.616-43.134 6.425-47.789c8.564-4.958 27.502 2.111 47.463 19.835a144.318 144.318 0 0 1 3.841 3.545c-7.438 7.987-14.787 17.08-21.808 26.988c-12.04 1.116-23.565 2.908-34.161 5.309a160.342 160.342 0 0 1-1.76-7.887Zm110.427 27.268a347.8 347.8 0 0 0-7.785-12.803c8.168 1.033 15.994 2.404 23.343 4.08c-2.206 7.072-4.956 14.465-8.193 22.045a381.151 381.151 0 0 0-7.365-13.322Zm-45.032-43.861c5.044 5.465 10.096 11.566 15.065 18.186a322.04 322.04 0 0 0-30.257-.006c4.974-6.559 10.069-12.652 15.192-18.18ZM82.802 87.83a323.167 323.167 0 0 0-7.227 13.238c-3.184-7.553-5.909-14.98-8.134-22.152c7.304-1.634 15.093-2.97 23.209-3.984a321.524 321.524 0 0 0-7.848 12.897Zm8.081 65.352c-8.385-.936-16.291-2.203-23.593-3.793c2.26-7.3 5.045-14.885 8.298-22.6a321.187 321.187 0 0 0 7.257 13.246c2.594 4.48 5.28 8.868 8.038 13.147Zm37.542 31.03c-5.184-5.592-10.354-11.779-15.403-18.433c4.902.192 9.899.29 14.978.29c5.218 0 10.376-.117 15.453-.343c-4.985 6.774-10.018 12.97-15.028 18.486Zm52.198-57.817c3.422 7.8 6.306 15.345 8.596 22.52c-7.422 1.694-15.436 3.058-23.88 4.071a382.417 382.417 0 0 0 7.859-13.026a347.403 347.403 0 0 0 7.425-13.565Zm-16.898 8.101a358.557 358.557 0 0 1-12.281 19.815a329.4 329.4 0 0 1-23.444.823c-7.967 0-15.716-.248-23.178-.732a310.202 310.202 0 0 1-12.513-19.846h.001a307.41 307.41 0 0 1-10.923-20.627a310.278 310.278 0 0 1 10.89-20.637l-.001.001a307.318 307.318 0 0 1 12.413-19.761c7.613-.576 15.42-.876 23.31-.876H128c7.926 0 15.743.303 23.354.883a329.357 329.357 0 0 1 12.335 19.695a358.489 358.489 0 0 1 11.036 20.54a329.472 329.472 0 0 1-11 20.722Zm22.56-122.124c8.572 4.944 11.906 24.881 6.52 51.026c-.344 1.668-.73 3.367-1.15 5.09c-10.622-2.452-22.155-4.275-34.23-5.408c-7.034-10.017-14.323-19.124-21.64-27.008a160.789 160.789 0 0 1 5.888-5.4c18.9-16.447 36.564-22.941 44.612-18.3ZM128 90.808c12.625 0 22.86 10.235 22.86 22.86s-10.235 22.86-22.86 22.86s-22.86-10.235-22.86-22.86s10.235-22.86 22.86-22.86Z"></path></svg>

---src\components/---

--AuthFormContainer.tsx--

import React, { ReactNode } from 'react';

interface AuthFormContainerProps {
children: ReactNode;
title?: string;
}

const AuthFormContainer: React.FC<AuthFormContainerProps> = ({
children,
title,
}) => {
return (
<div className='min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8'>
<div className='max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md'>
{title && (
<div className='text-center'>
<h2 className='mt-6 text-3xl font-extrabold text-gray-900'>
{title}
</h2>
</div>
)}
<div className='mt-8 space-y-6'>{children}</div>
</div>
</div>
);
};

export default AuthFormContainer;

--DashboardContent.tsx--

import React from 'react';
type DashboardContentProps = {
children: React.ReactNode;
};

const DashboardContent = ({ children }: DashboardContentProps) => {
return <div>{children}</div>;
};

export default DashboardContent;

--Header.tsx--

import React, { useState, memo } from 'react';
import authAPI from '../features/auth/authAPI';
import defaultAvatar from '../assets/avatar-default-icon.png';
import { useAppSelector } from '../app/store';
import { useAppDispatch } from '../app/store';

const Header = () => {
const [toggle, setToggle] = useState(false);
const { accessToken, user, role } = useAppSelector((state) => state.auth);
const formattedRole = role
? role?.charAt(0).toUpperCase() + role?.slice(1)
: '';
const dispatch = useAppDispatch();
return (
<div className='bg-sky-500 w-full h-auto min-h-[70px] flex items-center justify-between px-3 py-2 fixed top-0 z-50'>
<h1 className='text-4xl font-bold text-white'>Job API</h1>
{accessToken && (
<div className='h-full w-auto min-w-[150px] flex items-center'>
<div className='relative'>
<button className='md:h-[60px] md:w-[60px] h-[40px] w-[40px] border border-amber-50 rounded-full shadow-lg overflow-hidden'>
<img
                src={defaultAvatar}
                alt='default avatar'
                className='w-full h-full object-cover'
              />
</button>
{toggle && (
<div className='absolute -right-24 top-full w-40 mt-4 py-2 bg-white rounded-md shadow-lg'>
<button className='w-full block px-4 py-2 hover:bg-gray-200'>
Account
</button>
<button
className='w-full block px-4 py-2 hover:bg-gray-200 text-red-500'
onClick={() => dispatch(authAPI.logout())} >
Logout
</button>
</div>
)}
</div>
<div className='flex-col justify-center'>
<button
type='button'
className='text-2xl font-bold text-black ps-2'
onClick={() => setToggle(!toggle)} >
{user}
</button>
<div className='text-center text-black ps-2'>{formattedRole}</div>
</div>
</div>
)}
</div>
);
};

export default memo(Header);

--JobCard.tsx--

import React, { memo } from 'react';

export interface JobInfo {
\_id: string;
company: string;
position: string;
status: string;
createdBy: string;
createdAt: string;
updatedAt: string;
\_\_v: number;
}

export interface JobCardProps extends JobInfo {
onUpdate: (Job: JobInfo) => void;
onDelete: (Job: JobInfo) => void;
}
const JobCard = ({
\_id,
company,
position,
status,
createdBy,
createdAt,
updatedAt,
**v,
onUpdate,
onDelete,
}: JobCardProps) => {
const jobInfo = {
\_id,
company,
position,
status,
createdBy,
createdAt,
updatedAt,
**v,
};
return (
<div className='bg-white rounded-lg shadow-md p-6 grid md:grid-cols-[2fr_2fr_auto] grid-cols-1 gap-4'>
<div>
<h2 className='text-xl font-bold mb-2 border-b'>{position}</h2>
<p className='text-gray-600 mb-2'>{company}</p>
</div>
<div>
<p className='text-gray-600 mb-2'>
Status:{' '}
<span
className={`text-white p-1 rounded-2xl ${
              status === 'pending'
                ? 'bg-gray-500'
                : status === 'interview'
                ? 'bg-blue-700'
                : 'bg-red-500'
            }`} >
{status}
</span>
</p>
<p className='text-gray-600 mb-2'>
Created: {new Date(createdAt).toLocaleString()}
</p>
<p className='text-gray-600 mb-2'>
Updated: {new Date(updatedAt).toLocaleString()}
</p>
</div>
<div className='flex flex-col gap-2 justify-center mx-4'>
<button
onClick={() => onUpdate(jobInfo)}
className='bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600' >
Update
</button>
<button
onClick={() => onDelete(jobInfo)}
className='bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600' >
Delete
</button>
</div>
</div>
);
};

export default memo(JobCard);

--Loading.tsx--

import React from 'react';

const Loading = () => {
return (
<div className='flex justify-center items-center h-screen bg-white'>
<div className='animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500'></div>
</div>
);
};

export default Loading;

---src\components\dashboardContent/---

--AdminView.tsx--

import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../app/store';
import useSocket from '../../hooks/useSocket';
import axios from 'axios';

type statResponse = {
applicantUserCount: number;
};
const AdminView = () => {
const { accessToken } = useAppSelector((state) => state.auth);
const { userid, user, role } = useAppSelector((state) => state.auth);
const { userCount } = useSocket(userid || '', role || '');
const [stats, setStats] = useState<statResponse>({ applicantUserCount: 0 });

useEffect(() => {
const controller = new AbortController();
const fetchStats = async () => {
try {
const response = await axios.get<statResponse>(
'/api/v1/admin/dashboard',
{
signal: controller.signal,
headers: {
Authorization: `Bearer ${accessToken}`,
},
}
);
setStats(response.data);
} catch (error) {
console.error('Error fetching stats:', error);
}
};
fetchStats();
return () => {
controller.abort();
};
}, []);
return (
<div className=' bg-white min-h-screen flex justify-center'>
<div className='md:w-1/2 w-full h-[80vh] mt-[100px] sm:mx-[20px]'>
Welcome back Admin {user}
<p>
Online Users:&nbsp;
<span className='bg-green-500 h-[10px] w-[10px] rounded-full inline-block mr-1'></span>
{userCount}/{stats.applicantUserCount}
</p>
</div>
</div>
);
};

export default AdminView;

--JobsView.tsx--

import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
const AddJobModal = lazy(() => import('../modal/AddJobModal'));
import JobCard, { JobInfo } from '../JobCard';
const UpdateJobModal = lazy(() => import('../modal/UpdateJobModal'));
const DeleteJobModal = lazy(() => import('../modal/DeleteJobModal'));
import { useAppDispatch, useAppSelector } from '../../app/store';
import jobAPI from '../../features/job/jobAPI';
import Loading from '../Loading';
import useSocket from '../../hooks/useSocket';
type ModalState =
| {
type: 'add' | 'update' | 'delete' | null;
Job: JobInfo | null;
}
| { type: null; Job: null };

const JobsView = () => {
const dispatch = useAppDispatch();
const jobs = useAppSelector((state) => state.job.jobs);
const { userid, role } = useAppSelector((state) => state.auth);
const { isConnected, userCount } = useSocket(userid || '', role || '');
const [modal, setModal] = useState<ModalState>({ type: null, Job: null });
const handleUpdateJobs = useCallback((job: JobInfo) => {
setModal({ type: 'update', Job: job });
}, []);

const handleDeleteJob = useCallback((Job: JobInfo) => {
setModal({ type: 'delete', Job: Job });
}, []);

const handleAfterModalActionJobs = useCallback(() => {
setModal({ type: null, Job: null });
}, []);

useEffect(() => {
dispatch(jobAPI.fetchJob());
}, [dispatch]);
return (
<>
{' '}
<div className=' bg-white min-h-screen flex justify-center'>
<div className='md:w-1/2 w-full h-[80vh] mt-[100px] sm:mx-[20px]'>
<div className='flex justify-between'>
<h1 className='md:text-4xl text-2xl mx-4 font-bold text-gray-900'>
Jobs
</h1>
<button
className='bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600'
onClick={() => setModal({ type: 'add', Job: null })} >
Add Job
</button>
</div>
<div className='w-full h-full mt-4 sm:mx-[20px] bg-white rounded-lg shadow-lg overflow-y-scroll'>
<div className='flex flex-col gap-4 p-4'>
{jobs.length === 0 ? (
<p className='text-center text-gray-600'>No jobs found</p>
) : (
jobs.map((job) => (
<JobCard
key={job.\_id}
{...job}
onUpdate={handleUpdateJobs}
onDelete={handleDeleteJob}
/>
))
)}
</div>
</div>
</div>
</div>
<Suspense fallback={<Loading />}>
{modal?.type === 'add' && (
<AddJobModal onClose={handleAfterModalActionJobs} />
)}
{modal?.type === 'update' && modal?.Job && (
<UpdateJobModal
jobID={modal.Job.\_id}
company={modal.Job.company}
position={modal.Job.position}
status={modal.Job.status || ''}
onClose={handleAfterModalActionJobs}
/>
)}
{modal?.type === 'delete' && modal?.Job && (
<DeleteJobModal
jobID={modal?.Job.\_id}
company={modal?.Job.company}
position={modal?.Job.position}
status={modal?.Job.status || ''}
onClose={handleAfterModalActionJobs}
/>
)}
</Suspense>
</>
);
};

export default JobsView;

---src\components\modal/---

--AddJobModal.tsx--

import React, { useState } from 'react';
import MainModal from './MainModal';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { setLoading } from '../../features/loading/loadingSlice';
import jobAPI from '../../features/job/jobAPI';
const AddJobModal = (props: { onClose: () => void }) => {
const dispatch = useAppDispatch();
const isLoading = useAppSelector(
(state) => state.loading.loadingState?.addJob?.loading
);
const [formData, setFromData] = useState({
company: '',
position: '',
});
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
setFromData((prev) => ({
...prev,
[e.target.name]: e.target.value,
}));
};

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
e.preventDefault();
const dispatchPayload = { key: 'addJob', loading: true };
dispatch(setLoading(dispatchPayload));

    try {
      await dispatch(jobAPI.createNewJob(formData)).unwrap();
      props.onClose();
    } catch (err) {
      console.error('Failed to add job:', err);
    } finally {
      dispatch(setLoading({ ...dispatchPayload, loading: false }));
    }

};
return (
<MainModal
      title='Add Job'
      headerColor='bg-sky-500'
      onClose={props.onClose}
    >
<form onSubmit={handleSubmit}>
<input
          type='text'
          name='company'
          id='company'
          placeholder='Company'
          className='w-full p-2 mb-4 border border-gray-300 rounded'
          value={formData.company}
          onChange={handleChange}
        />
<input
          type='text'
          name='position'
          id='position'
          placeholder='Position'
          className='w-full p-2 mb-4 border border-gray-300 rounded'
          value={formData.position}
          onChange={handleChange}
        />
<button
          type='submit'
          disabled={isLoading}
          className='bg-blue-500 text-white px-4 py-2 rounded'
        >
{isLoading ? 'Submitting...' : 'Submit'}
</button>
</form>
</MainModal>
);
};

export default AddJobModal;

--DeleteJobModal.tsx--

import React from 'react';
import MainModal from './MainModal';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { setLoading } from '../../features/loading/loadingSlice';
import jobAPI from '../../features/job/jobAPI';
interface DeleteJobModalProps {
jobID: string;
company: string;
status: string;
position: string;
onClose: () => void;
}
const DeleteJobModal = (props: DeleteJobModalProps) => {
const dispatch = useAppDispatch();
const { jobID, company, status, position, onClose } = props;
const isLoading = useAppSelector(
(state) => state.loading.loadingState?.deleteJob?.loading
);
const handleDelete = async (JobId: string) => {
const dispatchPayload = { key: 'deleteJob', loading: true };
dispatch(setLoading(dispatchPayload));
try {
await dispatch(jobAPI.deleleJob(JobId));
onClose();
} catch (error) {
console.log(error);
} finally {
dispatch(setLoading({ ...dispatchPayload, loading: false }));
}
};
return (
<MainModal
      title='Delete Job'
      headerColor='bg-red-500'
      onClose={onClose}
    >
<div>
<p>
Are you sure you want to delete this job for{' '}
<span className='font-bold'>{company}</span> -{' '}
<span className='font-bold'>{position}</span> with a current status{' '}
<span className='font-bold'>{status}</span>?
</p>
<div className='flex justify-end gap-2'>
<button
onClick={() => handleDelete(jobID)}
disabled={isLoading}
className='bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600' >
{isLoading ? 'Deleting...' : 'Delete'}
</button>
<button
            onClick={onClose}
            className='bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600'
          >
Cancel
</button>
</div>
</div>
</MainModal>
);
};

export default DeleteJobModal;

--MainModal.tsx--

import React, { ReactNode } from 'react';

interface ModalProps {
children: ReactNode;
title: string;
headerColor: string;
onClose: () => void;
}
const MainModal = (props: ModalProps) => {
const { children, title, headerColor, onClose } = props;
return (
<div
      tabIndex={-1}
      role='dialog'
      className='fixed inset-0 z-50 flex items-center justify-center overflow-y-auto'
      aria-labelledby='modal-title'
      aria-modal='true'
    >
<div className='modal-overlay absolute inset-0 bg-gray-900 opacity-50' />
<div className='modal-container bg-white md:w-1/3 w-full mx-auto rounded-2xl shadow-lg z-50 pb-4'>
<div
className={`flex justify-between items-center p-4 ${headerColor} rounded-t-2xl`} >
<h2 className='text-lg font-bold text-white'>{title}</h2>
<button
            onClick={onClose}
            className='modal-close font-extrabold text-gray-600 hover:text-gray-900 '
          >
x
</button>
</div>
<div className='modal-body p-4 '>{children}</div>
</div>
</div>
);
};

export default MainModal;

--UpdateJobModal.tsx--

import React, { useState } from 'react';
import MainModal from './MainModal';
import axios from 'axios';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { setLoading } from '../../features/loading/loadingSlice';
import jobAPI from '../../features/job/jobAPI';

interface UpdateJobModalProps {
jobID: string;
company: string;
status: string;
position: string;
onClose: () => void;
}

const UpdateJobModal = (props: UpdateJobModalProps) => {
const { jobID, company, status, position } = props;
const isLoading = useAppSelector(
(state) => state.loading.loadingState?.updateJob?.loading
);
const dispatch = useAppDispatch();
const [formData, setFromData] = useState({
company,
position,
status,
});
const handleChange = (
e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
) => {
setFromData((prev) => ({
...prev,
[e.target.name]: e.target.value,
}));
};

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
e.preventDefault();
const dispatchPayload = { key: 'updateJob', loading: true };
dispatch(setLoading(dispatchPayload));

    try {
      await dispatch(jobAPI.updateJob({ jobID, formData })).unwrap();
      props.onClose();
    } catch (err) {
      console.error('Failed to update job:', err);
    } finally {
      dispatch(setLoading({ ...dispatchPayload, loading: false }));
    }

};
return (
<MainModal
      title='Update Job'
      headerColor='bg-sky-500'
      onClose={props.onClose}
    >
<form onSubmit={handleSubmit}>
<input
          type='text'
          name='company'
          id='company'
          value={formData.company}
          onChange={handleChange}
          placeholder='Company'
          className='w-full p-2 mb-4 border border-gray-300 rounded'
        />
<input
          type='text'
          name='position'
          id='position'
          value={formData.position}
          onChange={handleChange}
          placeholder='Position'
          className='w-full p-2 mb-4 border border-gray-300 rounded'
        />
<select
          name='status'
          id='status'
          value={formData.status}
          onChange={handleChange}
          className='w-full p-2 mb-4 border border-gray-300 rounded'
        >
<option value='pending'>Pending</option>
<option value='interview'>Interview</option>
<option value='declined'>declined</option>
</select>
<button
          type='submit'
          disabled={isLoading}
          className='bg-blue-400 text-white px-4 py-2 rounded'
        >
{isLoading ? 'Updating...' : 'Update'}
</button>
</form>
</MainModal>
);
};

export default UpdateJobModal;

---src\context/---

---src\features/---

---src\features\auth/---

--authAPI.ts--

import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
axios.defaults.withCredentials = true;
import { setLoading } from '../loading/loadingSlice';

interface Credentials {
email: string;
password: string;
}

interface RegisterCredential extends Credentials {
name: string;
}

interface ResponseAuthData {
userid: string;
username: string;
role: string;
accessToken: string;
}

const authAPI = {
login: createAsyncThunk(
'auth/login',
async (credentials: Credentials, thunkAPI) => {
try {
const dispatchPayload = { key: 'login', loading: true, isGlobal: true };
thunkAPI.dispatch(setLoading(dispatchPayload));
const { data } = await axios.post<ResponseAuthData>(
'/api/v1/auth/login',
credentials
);
thunkAPI.dispatch(setLoading({ ...dispatchPayload, loading: false }));
return data;
} catch (error) {
return thunkAPI.rejectWithValue(
error.response?.data?.message || 'Login failed'
);
}
}
),
logout: createAsyncThunk('auth/logout', async (_, thunkAPI) => {
try {
const dispatchPayload = { key: 'logout', loading: true, isGlobal: true };
thunkAPI.dispatch(setLoading(dispatchPayload));
await axios.post('/api/v1/auth/logout');
thunkAPI.dispatch(setLoading({ ...dispatchPayload, loading: false }));
return null;
} catch (error) {
return thunkAPI.rejectWithValue(
error.response?.data?.message || 'Logout failed'
);
}
}),
register: createAsyncThunk(
'auth/register',
async (credentials: RegisterCredential, thunkAPI) => {
try {
const dispatchPayload = {
key: 'register',
loading: true,
isGlobal: true,
};
thunkAPI.dispatch(setLoading(dispatchPayload));
const { data } = await axios.post<ResponseAuthData>(
'/api/v1/auth/register',
credentials
);
thunkAPI.dispatch(setLoading({ ...dispatchPayload, loading: false }));
return data;
} catch (err: any) {
return thunkAPI.rejectWithValue(
err.response?.data?.message || 'Register failed'
);
}
}
),
refreshToken: createAsyncThunk('auth/refreshToken', async (_, thunkAPI) => {
const dispatchPayload = {
key: 'refreshToken',
loading: true,
isGlobal: true,
};
try {
thunkAPI.dispatch(setLoading(dispatchPayload));
const { data } = await axios.get<ResponseAuthData>(
'/api/v1/auth/refresh-token'
);
thunkAPI.dispatch(setLoading({ ...dispatchPayload, loading: false }));
return data;
} catch (error) {
return thunkAPI.rejectWithValue(
error.response?.data?.message || 'Refresh token failed'
);
} finally {
thunkAPI.dispatch(setLoading({ ...dispatchPayload, loading: false }));
}
}),
};

export default authAPI;

--authSlice.ts--

import { createSlice } from '@reduxjs/toolkit';
import authAPI from './authAPI';

interface AuthState {
userid: string | null;
user: string | null;
role: string | null;
accessToken: string;
isLoading: boolean;
error: string | null;
registerError: string | null;
}

const initialState: AuthState = {
userid: null,
user: null,
role: null,
accessToken: '',
isLoading: false,
registerError: null,
error: null,
};

const authSlice = createSlice({
name: 'auth',
initialState,
reducers: {},
extraReducers: (builder) => {
builder
.addCase(authAPI.login.pending, (state) => {
state.isLoading = true;
state.error = null;
})
.addCase(authAPI.login.fulfilled, (state, action) => {
state.isLoading = false;
state.userid = action.payload.userid;
state.user = action.payload.username;
state.role = action.payload.role;
state.accessToken = action.payload.accessToken;
})
.addCase(authAPI.login.rejected, (state, action) => {
state.isLoading = false;
state.error = action.payload as string;
})

      // Logout
      .addCase(authAPI.logout.fulfilled, (state) => {
        state.user = null;
        state.accessToken = '';
      })

      // Register
      .addCase(authAPI.register.pending, (state) => {
        state.isLoading = true;
        state.registerError = null;
      })
      .addCase(authAPI.register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userid = action.payload.userid;
        state.user = action.payload.username;
        state.role = action.payload.role;
        state.accessToken = action.payload.accessToken;
      })
      .addCase(authAPI.register.rejected, (state, action) => {
        state.isLoading = false;
        state.registerError = action.payload as string;
      })

      // Refresh token
      .addCase(authAPI.refreshToken.fulfilled, (state, action) => {
        state.userid = action.payload.userid;
        state.user = action.payload.username;
        state.role = action.payload.role;
        state.accessToken = action.payload.accessToken;
      });

},
});

export default authSlice.reducer;

---src\features\job/---

--jobAPI.ts--

import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { JobRes } from './jobSlice';
import { JobInfo } from '../../components/JobCard';
import { RootState } from '../../app/store';
interface FromData {
company: string;
position: string;
status?: string;
}

const getAccessToken = (thunkAPI: any) => {
const state = thunkAPI.getState() as RootState;
return state.auth.accessToken;
};

const jobAPI = {
fetchJob: createAsyncThunk('get/jobs', async (\_, thunkAPI) => {
try {
const { data } = await axios.get<JobRes>('/api/v1/jobs', {
headers: {
Authorization: `Bearer ${getAccessToken(thunkAPI)}`,
},
});
return data;
} catch (error) {
return thunkAPI.rejectWithValue(
error.response?.data?.message || 'Fetch jobs failed'
);
}
}),
createNewJob: createAsyncThunk(
'post/job',
async (formData: FromData, thunkAPI) => {
try {
const { data } = await axios.post<{ job: JobInfo }>(
'/api/v1/jobs',
formData,
{
headers: {
Authorization: `Bearer ${getAccessToken(thunkAPI)}`,
},
}
);
return data.job;
} catch (error) {
return thunkAPI.rejectWithValue(
error.response?.data?.message || 'Create job failed'
);
}
}
),
updateJob: createAsyncThunk(
'update/job',
async (
{ formData, jobID }: { formData: FromData; jobID: string },
thunkAPI
) => {
try {
await axios.patch(`/api/v1/jobs/${jobID}`, formData, {
headers: {
Authorization: `Bearer ${getAccessToken(thunkAPI)}`,
},
});
return { ...formData, jobID };
} catch (error) {
return thunkAPI.rejectWithValue(
error.response?.data?.message || 'Update job failed'
);
}
}
),
deleleJob: createAsyncThunk('delete/job', async (jobID: string, thunkAPI) => {
try {
await axios.delete(`/api/v1/jobs/${jobID}`, {
headers: {
Authorization: `Bearer ${getAccessToken(thunkAPI)}`,
},
});
return jobID;
} catch (error) {
return thunkAPI.rejectWithValue(
error.response?.data?.message || 'Delete job failed'
);
}
}),
};
export default jobAPI;

--jobSlice.ts--

import { createSlice } from '@reduxjs/toolkit';
import reducer from '../loading/loadingSlice';
import { JobInfo } from '../../components/JobCard';
import jobAPI from './jobAPI';

export interface JobRes {
jobs: JobInfo[];
count: number;
}

const initialState: JobRes = {
jobs: [],
count: 0,
};

const jobSlice = createSlice({
name: 'job',
initialState,
reducers: {},
extraReducers: (builder) => {
builder.addCase(jobAPI.fetchJob.fulfilled, (state, action) => {
state.jobs = action.payload.jobs;
state.count = action.payload.count;
});
builder.addCase(jobAPI.createNewJob.fulfilled, (state, action) => {
state.jobs.push(action.payload);
});
builder.addCase(jobAPI.updateJob.fulfilled, (state, action) => {
const { jobID, company, position, status } = action.payload;
const index = state.jobs.findIndex((job) => job.\_id === jobID);
if (index !== -1) {
state.jobs[index] = {
...state.jobs[index],
company,
position,
status: status || '',
};
}
});
builder.addCase(jobAPI.deleleJob.fulfilled, (state, action) => {
const jobID = action.payload;
state.jobs = state.jobs.filter((job) => job.\_id !== jobID);
});
},
});

export default jobSlice.reducer;

---src\features\loading/---

--loadingSlice.ts--

import { createSlice } from '@reduxjs/toolkit';

interface LoadingState {
loadingState: {
[key: string]: {
loading: boolean;
isGlobal: boolean;
};
};
globalLoading: boolean;
}

const initialState: LoadingState = {
loadingState: {},
globalLoading: false,
};

const loadingSlice = createSlice({
name: 'loading',
initialState,
reducers: {
setLoading: (
state,
action: { payload: { key: string; loading: boolean; isGlobal?: boolean } }
) => {
const { key, loading, isGlobal = false } = action.payload;

      state.loadingState[key] = { loading, isGlobal };
      if (isGlobal) {
        state.globalLoading = Object.values(state.loadingState).some(
          (isLoading) => isLoading.isGlobal && isLoading.loading
        );
      }
    },
    clearAllLoading: (state) => {
      state.loadingState = {};
      state.globalLoading = false;
    },

},
});

export default loadingSlice.reducer;
export const { setLoading, clearAllLoading } = loadingSlice.actions;

---src\hooks/---

--useSocket.tsx--

import { useEffect, useState, useRef } from 'react';
import io, { Socket } from 'socket.io-client';

const useSocket = (userid: string, role: string) => {
const [isConnected, setIsConnected] = useState(false);
const [userCount, setUserCount] = useState(0);
const socketRef = useRef<Socket | null>(null);
useEffect(() => {
const socket = io('http://localhost:3000');
socketRef.current = socket;
socket.on('connect', () => {
if (userid && role !== 'admin') {
socket.emit('join', userid);
setIsConnected(true);
}
});
socket.on('disconnect', () => {
if (role !== 'admin') {
setIsConnected(false);
}
});
socket.on('rt-user-count', (count) => {
setUserCount(count);
});

    return () => {
      socketRef.current?.close();
      socketRef.current = null;
    };

}, [userid]);

return {
socket: socketRef.current,
isConnected,
userCount,
};
};

export default useSocket;

---src\pages/---

--Dashboard.tsx--

import React, { lazy, Suspense } from 'react';
import Header from '../components/Header';
import DashboardContent from '../components/DashboardContent';
import Loading from '../components/Loading';
const AdminView = lazy(
() => import('../components/dashboardContent/AdminView')
);
const JobsView = lazy(() => import('../components/dashboardContent/JobsView'));
import { useAppSelector } from '../app/store';
const Dashboard = () => {
const { role } = useAppSelector((state) => state.auth);
return (
<>
<Header />
{/_ Dashboard content _/}
<DashboardContent>
<Suspense fallback={<Loading />}>
{role === 'admin' ? <AdminView /> : <JobsView />}
</Suspense>
</DashboardContent>
</>
);
};

export default Dashboard;

--Home.tsx--

import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

const Home = () => {
return (
<div className='min-h-screen flex flex-col bg-white'>
<Header />
<div className='flex-1 flex flex-col md:flex-row items-center justify-center p-8 gap-8'>
<div className='text-lg text-gray-600 max-w-2xl md:h-[25vh] flex items-center'>
<div className='flex flex-col'>
<h1 className='text-4xl font-bold text-gray-900 text-center'>
Welcome to Job API
</h1>
<p className='text-lg text-gray-600 text-center'>
A web application that allows you to record and manage your job
applications.
</p>
</div>
</div>

        <div className='flex flex-col justify-center space-y-4 w-full max-w-xs md:h-[25vh]'>
          <Link
            to='/login'
            className='w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-center'
          >
            Login
          </Link>
          <Link
            to='/register'
            className='w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-blue-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-center'
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>

);
};

export default Home;

--Login.tsx--

import React, { useState } from 'react';
import AuthFormContainer from '../components/AuthFormContainer';
import { Link, useNavigate } from 'react-router-dom';
import authAPI from '../features/auth/authAPI';
import { useAppDispatch } from '../app/store';
import Header from '../components/Header';

const Login = () => {
const dispatch = useAppDispatch();
const navigate = useNavigate();
const [formData, setformData] = useState({
email: '',
password: '',
});

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
setformData({
...formData,
[e.target.name]: e.target.value,
});
};

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
e.preventDefault();
const resultAction = await dispatch(authAPI.login(formData));
if (authAPI.login.fulfilled.match(resultAction)) {
navigate('/dashboard');
}
};

return (
<>
<Header />
<AuthFormContainer title='Login'>
<form
          className='mt-8 space-y-6'
          onSubmit={handleSubmit}
        >
<div className='rounded-md shadow-sm -space-y-px'>
<div>
<label
                htmlFor='email'
                className='sr-only'
              >
Email address
</label>
<input
                id='email'
                name='email'
                type='email'
                required
                className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm'
                placeholder='Email address'
                value={formData.email}
                onChange={handleChange}
              />
</div>
<div>
<label
                htmlFor='password'
                className='sr-only'
              >
Password
</label>
<input
                id='password'
                name='password'
                type='password'
                required
                className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm'
                placeholder='Password'
                value={formData.password}
                onChange={handleChange}
              />
</div>
</div>

          <div className='flex items-center justify-between'>
            <div className='flex items-center'>
              <input
                id='remember-me'
                name='remember-me'
                type='checkbox'
                className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
              />
              <label
                htmlFor='remember-me'
                className='ml-2 block text-sm text-gray-900'
              >
                Remember me
              </label>
            </div>

            <div className='text-sm'>
              <a
                href='#'
                className='font-medium text-blue-600 hover:text-blue-500'
              >
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              type='submit'
              className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            >
              Sign in
            </button>
          </div>

          <div className='text-sm text-center'>
            Don't have an account?{' '}
            <Link
              to='/register'
              className='font-medium text-blue-600 hover:text-blue-500'
            >
              Sign up
            </Link>
          </div>
        </form>
      </AuthFormContainer>
    </>

);
};

export default Login;

--Register.tsx--

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthFormContainer from '../components/AuthFormContainer';
import { useNavigate } from 'react-router-dom';
import authAPI from '../features/auth/authAPI';
import { useAppDispatch, useAppSelector } from '../app/store';
import Header from '../components/Header';

const Register = () => {
const dispatch = useAppDispatch();
const navigate = useNavigate();
const { registerError } = useAppSelector((state) => state.auth);
const [formData, setformData] = useState({
name: '',
email: '',
password: '',
confirmPassword: '',
});

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
setformData({
...formData,
[e.target.name]: e.target.value,
});
};

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
e.preventDefault();
const resultAction = await dispatch(authAPI.register(formData));
if (authAPI.register.fulfilled.match(resultAction)) {
navigate('/dashboard');
}
};

return (
<>
<Header />
<AuthFormContainer title='Register'>
<form
          className='mt-8 space-y-6'
          onSubmit={handleSubmit}
        >
<div className='rounded-md shadow-sm -space-y-px'>
<div>
<label
                htmlFor='name'
                className='sr-only'
              >
Full Name
</label>
<input
                id='name'
                name='name'
                type='text'
                required
                className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm'
                placeholder='Full Name'
                value={formData.name}
                onChange={handleChange}
              />
</div>
<div>
<label
                htmlFor='email'
                className='sr-only'
              >
Email address
</label>
<input
                id='email'
                name='email'
                type='email'
                required
                className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm'
                placeholder='Email address'
                value={formData.email}
                onChange={handleChange}
              />
</div>
<div>
<label
                htmlFor='password'
                className='sr-only'
              >
Password
</label>
<input
                id='password'
                name='password'
                type='password'
                required
                className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm'
                placeholder='Password'
                value={formData.password}
                onChange={handleChange}
              />
</div>
<div>
<label
                htmlFor='confirmPassword'
                className='sr-only'
              >
Confirm Password
</label>
<input
                id='confirmPassword'
                name='confirmPassword'
                type='password'
                required
                className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm'
                placeholder='Confirm Password'
                value={formData.confirmPassword}
                onChange={handleChange}
              />
</div>
</div>

          <div>
            <button
              type='submit'
              className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            >
              Create Account
            </button>
          </div>
          {registerError && (
            <div className='mt-2 text-sm text-red-600'>{registerError}</div>
          )}
          <div className='text-sm text-center'>
            Already have an account?{' '}
            <Link
              to='/login'
              className='font-medium text-blue-600 hover:text-blue-500'
            >
              Sign in
            </Link>
          </div>
        </form>
      </AuthFormContainer>
    </>

);
};

export default Register;
