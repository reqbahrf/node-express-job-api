This file is a merged representation of a subset of the codebase, containing specifically included files, combined into a single document by Repomix.
The content has been processed where line numbers have been added.

# File Summary

## Purpose
This file contains a packed representation of a subset of the repository's contents that is considered the most important context.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Only files matching these patterns are included: frontend, backend, .gitignore, package.json
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Line numbers have been added to the beginning of each line
- Files are sorted by Git change count (files with more changes are at the bottom)

# Directory Structure
```
.gitignore
backend/.gitignore
backend/app.ts
backend/controllers/adminDashboard.ts
backend/controllers/auth.ts
backend/controllers/job.ts
backend/controllers/password.ts
backend/db/connect.ts
backend/errors/bad-request.ts
backend/errors/custom-api.ts
backend/errors/error.d.ts
backend/errors/index.ts
backend/errors/not-found.ts
backend/errors/unauthenticated.ts
backend/middleware/adminUser.ts
backend/middleware/authenticated.ts
backend/middleware/error-handler.ts
backend/middleware/expressSanitizer.ts
backend/middleware/not-found.ts
backend/models/Job.ts
backend/models/User.ts
backend/routes/adminDashboard.ts
backend/routes/auth.ts
backend/routes/jobs.ts
backend/routes/password.ts
backend/server.ts
backend/service/getApplicantUserCount.ts
backend/socket/index.ts
backend/tsconfig.json
backend/types/express.d.ts
backend/utils/auth.ts
frontend/.gitignore
frontend/eslint.config.js
frontend/index.html
frontend/package.json
frontend/public/vite.svg
frontend/README.md
frontend/src/App.css
frontend/src/App.tsx
frontend/src/app/store.ts
frontend/src/assets/avatar-default-icon.png
frontend/src/assets/react.svg
frontend/src/components/account/AccountDropDown.tsx
frontend/src/components/account/AccountInfoCard.tsx
frontend/src/components/account/ActiveAccount.tsx
frontend/src/components/account/ChangePasswordCard.tsx
frontend/src/components/auth/ProtectedRoute.tsx
frontend/src/components/DarkModeToggle.tsx
frontend/src/components/Header.tsx
frontend/src/components/Input.tsx
frontend/src/components/JobCard.tsx
frontend/src/components/JobModal/AddJobModal.tsx
frontend/src/components/JobModal/DeleteJobModal.tsx
frontend/src/components/JobModal/MainJobModal.tsx
frontend/src/components/JobModal/UpdateJobModal.tsx
frontend/src/components/Loading.tsx
frontend/src/components/notification/NotificationCard.tsx
frontend/src/components/notification/NotificationDropdown.tsx
frontend/src/components/notification/NotificationIcon.tsx
frontend/src/constant/roles.ts
frontend/src/features/auth/authAPI.ts
frontend/src/features/auth/authSlice.ts
frontend/src/features/job/jobAPI.ts
frontend/src/features/job/jobSlice.ts
frontend/src/features/loading/loadingSlice.ts
frontend/src/features/ui/uiSlice.ts
frontend/src/hooks/useSocket.tsx
frontend/src/layout/AppLayout.tsx
frontend/src/layout/AuthFormLayout.tsx
frontend/src/main.tsx
frontend/src/pages/Account.tsx
frontend/src/pages/admin/AdminView.tsx
frontend/src/pages/applicant/JobsView.tsx
frontend/src/pages/Home.tsx
frontend/src/pages/Login.tsx
frontend/src/pages/Register.tsx
frontend/src/routes/AppRouter.tsx
frontend/src/types/declaration.d.ts
frontend/src/utils/navigateToDashboard.ts
frontend/tailwind.config.js
frontend/tsconfig.json
frontend/vite.config.js
package.json
```

# Files

## File: backend/controllers/adminDashboard.ts
```typescript
 1: import { Request, Response } from 'express';
 2: import getApplicantUserCount from '../service/getApplicantUserCount.js';
 3: const getDashboardStats = async (req: Request, res: Response) => {
 4:   const applicantUserCount = await getApplicantUserCount();
 5:   const stats = {
 6:     applicantUserCount,
 7:   };
 8:   res.status(200).json(stats);
 9: };
10: 
11: export { getDashboardStats };
```

## File: backend/controllers/password.ts
```typescript
 1: import { UnauthenticatedError, BadRequestError } from '../errors/index.js';
 2: import User from '../models/User.js';
 3: import { StatusCodes } from 'http-status-codes';
 4: import { Request, Response } from 'express';
 5: const changePassword = async (req: Request, res: Response) => {
 6:   if (!req?.user) {
 7:     throw new UnauthenticatedError('Authentication invalid');
 8:   }
 9:   const { newPassword, currentPassword, confirmPassword } = req.body;
10:   if (!newPassword || !currentPassword || !confirmPassword) {
11:     throw new BadRequestError('Please provide the password');
12:   }
13:   if (newPassword !== confirmPassword) {
14:     throw new BadRequestError('Passwords do not match');
15:   }
16:   const user = await User.findOne({ _id: req.user.userId });
17:   if (!user) throw new UnauthenticatedError('Authentication invalid');
18:   const isMatch = await user.comparePassword(currentPassword);
19:   if (!isMatch) throw new UnauthenticatedError('Invalide credentials');
20:   user.password = newPassword;
21:   await user.save();
22:   res.status(StatusCodes.OK).json({
23:     msg: 'Password changed successfully',
24:   });
25: };
26: export { changePassword };
```

## File: backend/errors/error.d.ts
```typescript
1: export interface CustomError {
2:   statusCode?: number;
3:   message: string;
4:   name: string;
5:   code?: number; // e.g. 11000 for duplicate key
6:   keyValue?: Record<string, unknown>;
7:   errors?: Record<string, { message: string }>;
8:   value?: unknown;
9: }
```

## File: backend/middleware/adminUser.ts
```typescript
 1: import { Request, Response, NextFunction } from 'express';
 2: import { UnauthenticatedError } from '../errors/index.js';
 3: const adminUser = (req: Request, res: Response, next: NextFunction) => {
 4:   const role = req.user?.role;
 5:   if (role !== 'admin') {
 6:     throw new UnauthenticatedError('Authentication invalid');
 7:   }
 8:   next();
 9: };
10: 
11: export default adminUser;
```

## File: backend/middleware/error-handler.ts
```typescript
 1: import { StatusCodes } from 'http-status-codes';
 2: import { Request, Response, NextFunction } from 'express';
 3: import { CustomError } from '../errors/index.js';
 4: const errorHandlerMiddleware = (
 5:   err: CustomError,
 6:   req: Request,
 7:   res: Response,
 8:   next: NextFunction
 9: ) => {
10:   let customError = {
11:     errCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
12:     errMsg: err.message || 'Something went wrong, please try again later',
13:   };
14:   if (err.name === 'ValidationError') {
15:     customError.errCode = StatusCodes.BAD_REQUEST;
16:     customError.errMsg = Object.values(err.errors || {})
17:       .map((error) => error.message)
18:       .join(',');
19:   }
20:   if (err.name === 'CastError') {
21:     customError.errMsg = `No item found with id: ${err.value}`;
22:     customError.errCode = StatusCodes.NOT_FOUND;
23:   }
24:   if (err.code === 11000 && err.keyValue) {
25:     customError.errCode = StatusCodes.BAD_REQUEST;
26:     customError.errMsg = `Duplicate value entered for ${Object.keys(
27:       err.keyValue
28:     )} field, please choose another value`;
29:   }
30:   // res.status(customError.errCode).json({ err });
31:   res.status(customError.errCode).json({ msg: customError.errMsg });
32: };
33: 
34: export default errorHandlerMiddleware;
```

## File: backend/middleware/expressSanitizer.ts
```typescript
 1: import sanitizeHtml from 'sanitize-html';
 2: import { Request, Response, NextFunction } from 'express';
 3: 
 4: type value = string | object | Array<any> | null;
 5: 
 6: const expressSanitizer = (options = {}) => {
 7:   const defaultOptions = {
 8:     allowedTags: [],
 9:     allowedAttributes: {},
10:   };
11:   const finalOptions = { ...defaultOptions, ...options };
12: 
13:   function deepSanitize(value: value): value {
14:     if (typeof value !== 'object' || value === null) {
15:       return typeof value === 'string'
16:         ? sanitizeHtml(value, finalOptions)
17:         : value;
18:     }
19: 
20:     if (Array.isArray(value)) {
21:       return value.length > 0 ? value.map(deepSanitize) : value;
22:     }
23: 
24:     const sanitizedObj: { [key: string]: value } = {};
25:     const objectValue = value as Record<string, any>;
26:     for (const key in objectValue) {
27:       if (objectValue.hasOwnProperty(key)) {
28:         sanitizedObj[key] = deepSanitize(objectValue[key]);
29:       }
30:     }
31:     return sanitizedObj;
32:   }
33: 
34:   return async (req: Request, res: Response, next: NextFunction) => {
35:     try {
36:       if (req.body && Object.keys(req.body).length > 0) {
37:         req.body = deepSanitize(req.body);
38:       }
39:       if (req.query && Object.keys(req.query).length > 0) {
40:         const sanitizedQuery = deepSanitize(req.query);
41:         Object.assign(req.query, sanitizedQuery);
42:       }
43:       next();
44:     } catch (error) {
45:       next(error);
46:     }
47:   };
48: };
49: 
50: export default expressSanitizer;
```

## File: backend/middleware/not-found.ts
```typescript
1: import { Request, Response } from 'express';
2: const notFoundMiddleware = (req: Request, res: Response) =>
3:   res.status(404).send('Route does not exist');
4: 
5: export default notFoundMiddleware;
```

## File: backend/models/Job.ts
```typescript
 1: import mongoose from 'mongoose';
 2: const JobSchema = new mongoose.Schema(
 3:   {
 4:     company: {
 5:       type: String,
 6:       required: [true, 'Please provide company name'],
 7:       maxLength: 50,
 8:     },
 9:     position: {
10:       type: String,
11:       required: [true, 'Please provide position'],
12:       maxLength: 100,
13:     },
14:     status: {
15:       type: String,
16:       enum: ['pending', 'interview', 'declined'],
17:       default: 'pending',
18:     },
19:     createdBy: {
20:       type: mongoose.Types.ObjectId,
21:       ref: 'User',
22:       required: [true, 'Please provide user'],
23:     },
24:   },
25:   { timestamps: true }
26: );
27: 
28: export default mongoose.model('Job', JobSchema);
```

## File: backend/routes/adminDashboard.ts
```typescript
1: import express from 'express';
2: import { getDashboardStats } from '../controllers/adminDashboard.js';
3: const router = express.Router();
4: 
5: router.get('/dashboard', getDashboardStats);
6: 
7: export default router;
```

## File: backend/routes/auth.ts
```typescript
 1: import { login, logout, register, refreshToken } from '../controllers/auth.js';
 2: import express from 'express';
 3: const router = express.Router();
 4: 
 5: router.post('/login', login);
 6: router.post('/register', register);
 7: router.get('/refresh-token', refreshToken);
 8: router.post('/logout', logout);
 9: 
10: export default router;
```

## File: backend/routes/jobs.ts
```typescript
 1: import {
 2:   getAllJobs,
 3:   getJob,
 4:   createJob,
 5:   updateJob,
 6:   deleteJob,
 7: } from '../controllers/job.js';
 8: 
 9: import express from 'express';
10: const router = express.Router();
11: 
12: router.route('/').get(getAllJobs).post(createJob);
13: router.route('/:id').get(getJob).patch(updateJob).delete(deleteJob);
14: 
15: export default router;
```

## File: backend/routes/password.ts
```typescript
1: import { changePassword } from '../controllers/password.js';
2: import express from 'express';
3: const router = express.Router();
4: router.post('/change-password', changePassword);
5: export default router;
```

## File: backend/server.ts
```typescript
 1: import { createServer } from 'http';
 2: import app from './app.js';
 3: import connectDB from './db/connect.js';
 4: import { initSocket } from './socket/index.js';
 5: 
 6: const server = createServer(app);
 7: initSocket(server);
 8: 
 9: const port = process.env.PORT || 3000;
10: 
11: const start = async () => {
12:   try {
13:     const secret = process.env.MONGO_URI;
14:     if (!secret) throw new Error('Mongo URI not found');
15:     await connectDB(secret);
16:     server.listen(port, () =>
17:       console.log(`Server is listening on port ${port}...`)
18:     );
19:   } catch (error) {
20:     console.log(error);
21:   }
22: };
23: 
24: start();
```

## File: backend/service/getApplicantUserCount.ts
```typescript
1: import User from '../models/User.js';
2: 
3: const getApplicantUserCount = async () => {
4:   const count = await User.countDocuments({ role: 'applicant' });
5:   return count;
6: };
7: 
8: export default getApplicantUserCount;
```

## File: backend/socket/index.ts
```typescript
 1: import { Server as NodeServer } from 'node:http';
 2: import { Server } from 'socket.io';
 3: 
 4: const onlineUsers = new Map();
 5: let io: Server;
 6: 
 7: const initSocket = (server: NodeServer) => {
 8:   io = new Server(server, {
 9:     cors: {
10:       origin: 'http://localhost:5173',
11:       credentials: true,
12:     },
13:   });
14: 
15:   io.on('connection', (socket) => {
16:     socket.on('join', (userid) => {
17:       onlineUsers.set(userid, socket.id);
18:       io.emit('rt-user-count', onlineUsers.size);
19:     });
20:     socket.on('disconnect', () => {
21:       for (let [userId, socketId] of onlineUsers.entries()) {
22:         if (socketId === socket.id) {
23:           onlineUsers.delete(userId);
24:           break;
25:         }
26:       }
27:       io.emit('rt-user-count', onlineUsers.size);
28:     });
29:     socket.on('leave', (userid) => {
30:       onlineUsers.delete(userid);
31:       io.emit('rt-user-count', onlineUsers.size);
32:     });
33:   });
34: };
35: 
36: export { initSocket, io };
```

## File: backend/utils/auth.ts
```typescript
 1: const setTokenCookie = (res: any, refreshToken: string) => {
 2:   res.cookie('resToken', refreshToken, {
 3:     httpOnly: true,
 4:     secure: process.env.NODE_ENV === 'production',
 5:     sameSite: 'strict',
 6:     maxAge: 24 * 60 * 60 * 1000,
 7:   });
 8: };
 9: 
10: export default setTokenCookie;
```

## File: frontend/.gitignore
```
 1: # Logs
 2: logs
 3: *.log
 4: npm-debug.log*
 5: yarn-debug.log*
 6: yarn-error.log*
 7: pnpm-debug.log*
 8: lerna-debug.log*
 9: 
10: node_modules
11: dist
12: dist-ssr
13: *.local
14: 
15: # Editor directories and files
16: .vscode/*
17: !.vscode/extensions.json
18: .idea
19: .DS_Store
20: *.suo
21: *.ntvs*
22: *.njsproj
23: *.sln
24: *.sw?
```

## File: frontend/eslint.config.js
```javascript
 1: import js from '@eslint/js'
 2: import globals from 'globals'
 3: import reactHooks from 'eslint-plugin-react-hooks'
 4: import reactRefresh from 'eslint-plugin-react-refresh'
 5: import { defineConfig, globalIgnores } from 'eslint/config'
 6: 
 7: export default defineConfig([
 8:   globalIgnores(['dist']),
 9:   {
10:     files: ['**/*.{js,jsx}'],
11:     extends: [
12:       js.configs.recommended,
13:       reactHooks.configs['recommended-latest'],
14:       reactRefresh.configs.vite,
15:     ],
16:     languageOptions: {
17:       ecmaVersion: 2020,
18:       globals: globals.browser,
19:       parserOptions: {
20:         ecmaVersion: 'latest',
21:         ecmaFeatures: { jsx: true },
22:         sourceType: 'module',
23:       },
24:     },
25:     rules: {
26:       'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
27:     },
28:   },
29: ])
```

## File: frontend/public/vite.svg
```
1: <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--logos" width="31.88" height="32" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 257"><defs><linearGradient id="IconifyId1813088fe1fbc01fb466" x1="-.828%" x2="57.636%" y1="7.652%" y2="78.411%"><stop offset="0%" stop-color="#41D1FF"></stop><stop offset="100%" stop-color="#BD34FE"></stop></linearGradient><linearGradient id="IconifyId1813088fe1fbc01fb467" x1="43.376%" x2="50.316%" y1="2.242%" y2="89.03%"><stop offset="0%" stop-color="#FFEA83"></stop><stop offset="8.333%" stop-color="#FFDD35"></stop><stop offset="100%" stop-color="#FFA800"></stop></linearGradient></defs><path fill="url(#IconifyId1813088fe1fbc01fb466)" d="M255.153 37.938L134.897 252.976c-2.483 4.44-8.862 4.466-11.382.048L.875 37.958c-2.746-4.814 1.371-10.646 6.827-9.67l120.385 21.517a6.537 6.537 0 0 0 2.322-.004l117.867-21.483c5.438-.991 9.574 4.796 6.877 9.62Z"></path><path fill="url(#IconifyId1813088fe1fbc01fb467)" d="M185.432.063L96.44 17.501a3.268 3.268 0 0 0-2.634 3.014l-5.474 92.456a3.268 3.268 0 0 0 3.997 3.378l24.777-5.718c2.318-.535 4.413 1.507 3.936 3.838l-7.361 36.047c-.495 2.426 1.782 4.5 4.151 3.78l15.304-4.649c2.372-.72 4.652 1.36 4.15 3.788l-11.698 56.621c-.732 3.542 3.979 5.473 5.943 2.437l1.313-2.028l72.516-144.72c1.215-2.423-.88-5.186-3.54-4.672l-25.505 4.922c-2.396.462-4.435-1.77-3.759-4.114l16.646-57.705c.677-2.35-1.37-4.583-3.769-4.113Z"></path></svg>
```

## File: frontend/README.md
```markdown
 1: # React + Vite
 2: 
 3: This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.
 4: 
 5: Currently, two official plugins are available:
 6: 
 7: - [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
 8: - [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
 9: 
10: ## Expanding the ESLint configuration
11: 
12: If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
```

## File: frontend/src/assets/react.svg
```
1: <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--logos" width="35.93" height="32" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 228"><path fill="#00D8FF" d="M210.483 73.824a171.49 171.49 0 0 0-8.24-2.597c.465-1.9.893-3.777 1.273-5.621c6.238-30.281 2.16-54.676-11.769-62.708c-13.355-7.7-35.196.329-57.254 19.526a171.23 171.23 0 0 0-6.375 5.848a155.866 155.866 0 0 0-4.241-3.917C100.759 3.829 77.587-4.822 63.673 3.233C50.33 10.957 46.379 33.89 51.995 62.588a170.974 170.974 0 0 0 1.892 8.48c-3.28.932-6.445 1.924-9.474 2.98C17.309 83.498 0 98.307 0 113.668c0 15.865 18.582 31.778 46.812 41.427a145.52 145.52 0 0 0 6.921 2.165a167.467 167.467 0 0 0-2.01 9.138c-5.354 28.2-1.173 50.591 12.134 58.266c13.744 7.926 36.812-.22 59.273-19.855a145.567 145.567 0 0 0 5.342-4.923a168.064 168.064 0 0 0 6.92 6.314c21.758 18.722 43.246 26.282 56.54 18.586c13.731-7.949 18.194-32.003 12.4-61.268a145.016 145.016 0 0 0-1.535-6.842c1.62-.48 3.21-.974 4.76-1.488c29.348-9.723 48.443-25.443 48.443-41.52c0-15.417-17.868-30.326-45.517-39.844Zm-6.365 70.984c-1.4.463-2.836.91-4.3 1.345c-3.24-10.257-7.612-21.163-12.963-32.432c5.106-11 9.31-21.767 12.459-31.957c2.619.758 5.16 1.557 7.61 2.4c23.69 8.156 38.14 20.213 38.14 29.504c0 9.896-15.606 22.743-40.946 31.14Zm-10.514 20.834c2.562 12.94 2.927 24.64 1.23 33.787c-1.524 8.219-4.59 13.698-8.382 15.893c-8.067 4.67-25.32-1.4-43.927-17.412a156.726 156.726 0 0 1-6.437-5.87c7.214-7.889 14.423-17.06 21.459-27.246c12.376-1.098 24.068-2.894 34.671-5.345a134.17 134.17 0 0 1 1.386 6.193ZM87.276 214.515c-7.882 2.783-14.16 2.863-17.955.675c-8.075-4.657-11.432-22.636-6.853-46.752a156.923 156.923 0 0 1 1.869-8.499c10.486 2.32 22.093 3.988 34.498 4.994c7.084 9.967 14.501 19.128 21.976 27.15a134.668 134.668 0 0 1-4.877 4.492c-9.933 8.682-19.886 14.842-28.658 17.94ZM50.35 144.747c-12.483-4.267-22.792-9.812-29.858-15.863c-6.35-5.437-9.555-10.836-9.555-15.216c0-9.322 13.897-21.212 37.076-29.293c2.813-.98 5.757-1.905 8.812-2.773c3.204 10.42 7.406 21.315 12.477 32.332c-5.137 11.18-9.399 22.249-12.634 32.792a134.718 134.718 0 0 1-6.318-1.979Zm12.378-84.26c-4.811-24.587-1.616-43.134 6.425-47.789c8.564-4.958 27.502 2.111 47.463 19.835a144.318 144.318 0 0 1 3.841 3.545c-7.438 7.987-14.787 17.08-21.808 26.988c-12.04 1.116-23.565 2.908-34.161 5.309a160.342 160.342 0 0 1-1.76-7.887Zm110.427 27.268a347.8 347.8 0 0 0-7.785-12.803c8.168 1.033 15.994 2.404 23.343 4.08c-2.206 7.072-4.956 14.465-8.193 22.045a381.151 381.151 0 0 0-7.365-13.322Zm-45.032-43.861c5.044 5.465 10.096 11.566 15.065 18.186a322.04 322.04 0 0 0-30.257-.006c4.974-6.559 10.069-12.652 15.192-18.18ZM82.802 87.83a323.167 323.167 0 0 0-7.227 13.238c-3.184-7.553-5.909-14.98-8.134-22.152c7.304-1.634 15.093-2.97 23.209-3.984a321.524 321.524 0 0 0-7.848 12.897Zm8.081 65.352c-8.385-.936-16.291-2.203-23.593-3.793c2.26-7.3 5.045-14.885 8.298-22.6a321.187 321.187 0 0 0 7.257 13.246c2.594 4.48 5.28 8.868 8.038 13.147Zm37.542 31.03c-5.184-5.592-10.354-11.779-15.403-18.433c4.902.192 9.899.29 14.978.29c5.218 0 10.376-.117 15.453-.343c-4.985 6.774-10.018 12.97-15.028 18.486Zm52.198-57.817c3.422 7.8 6.306 15.345 8.596 22.52c-7.422 1.694-15.436 3.058-23.88 4.071a382.417 382.417 0 0 0 7.859-13.026a347.403 347.403 0 0 0 7.425-13.565Zm-16.898 8.101a358.557 358.557 0 0 1-12.281 19.815a329.4 329.4 0 0 1-23.444.823c-7.967 0-15.716-.248-23.178-.732a310.202 310.202 0 0 1-12.513-19.846h.001a307.41 307.41 0 0 1-10.923-20.627a310.278 310.278 0 0 1 10.89-20.637l-.001.001a307.318 307.318 0 0 1 12.413-19.761c7.613-.576 15.42-.876 23.31-.876H128c7.926 0 15.743.303 23.354.883a329.357 329.357 0 0 1 12.335 19.695a358.489 358.489 0 0 1 11.036 20.54a329.472 329.472 0 0 1-11 20.722Zm22.56-122.124c8.572 4.944 11.906 24.881 6.52 51.026c-.344 1.668-.73 3.367-1.15 5.09c-10.622-2.452-22.155-4.275-34.23-5.408c-7.034-10.017-14.323-19.124-21.64-27.008a160.789 160.789 0 0 1 5.888-5.4c18.9-16.447 36.564-22.941 44.612-18.3ZM128 90.808c12.625 0 22.86 10.235 22.86 22.86s-10.235 22.86-22.86 22.86s-22.86-10.235-22.86-22.86s10.235-22.86 22.86-22.86Z"></path></svg>
```

## File: frontend/src/components/account/AccountDropDown.tsx
```typescript
 1: import { useAppDispatch, useAppSelector } from '@/app/store';
 2: import { setActiveView } from '@/features/ui/uiSlice';
 3: import authAPI from '@/features/auth/authAPI';
 4: import { RiCircleFill } from '@remixicon/react';
 5: import { useNavigate } from 'react-router-dom';
 6: 
 7: interface AccountDropDownProps {
 8:   setToggleDropdown: (value: boolean) => void;
 9: }
10: const AccountDropDown = ({ setToggleDropdown }: AccountDropDownProps) => {
11:   const dispatch = useAppDispatch();
12:   const navigate = useNavigate();
13:   const activeView = useAppSelector((state) => state.ui.activeView);
14: 
15:   const handleToggleAccount = () => {
16:     if (activeView === 'account') return;
17:     navigate('/account');
18:     dispatch(setActiveView('account'));
19:     setToggleDropdown(false);
20:   };
21:   return (
22:     <>
23:       <div className='absolute right-[-20] top-[110%] w-40 mt-4 py-2 bg-white dark:bg-gray-800 rounded-md shadow-lg'>
24:         <button
25:           className='w-full block px-4 py-2 hover:bg-gray-200 text-black dark:text-white dark:hover:bg-gray-600'
26:           onClick={handleToggleAccount}
27:         >
28:           {activeView === 'account' ? (
29:             <span className='inline-block'>
30:               <RiCircleFill
31:                 size={10}
32:                 className='text-green-500'
33:               />
34:             </span>
35:           ) : (
36:             ''
37:           )}
38:           &nbsp;Account
39:         </button>
40:         <button
41:           className='w-full block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600 text-red-500'
42:           onClick={() => dispatch(authAPI.logout())}
43:         >
44:           Logout
45:         </button>
46:       </div>
47:     </>
48:   );
49: };
50: 
51: export default AccountDropDown;
```

## File: frontend/src/components/account/AccountInfoCard.tsx
```typescript
 1: import { useAppSelector } from '@/app/store';
 2: import defaultAvatar from '@/assets/avatar-default-icon.png';
 3: const AccountInfoCard = () => {
 4:   const { user, email } = useAppSelector((state) => state.auth);
 5:   return (
 6:     <div className='w-full mx-auto mb-4'>
 7:       <div className='flex sm:flex-row flex-col bg-white dark:bg-gray-800 p-4 rounded-md mt-2 min-h-[30vh] px-8'>
 8:         <div className='flex justify-center sm:justify-start mb-4 sm:mb-0 sm:mr-6'>
 9:           <div className='border-2 dark:border-white border-black  rounded-full w-[200px] h-[200px] text-center overflow-hidden'>
10:             <img
11:               src={defaultAvatar}
12:               className='w-full h-full object-cover'
13:               alt='user profile'
14:               loading='lazy'
15:             />
16:           </div>
17:         </div>
18:         <div className='flex justify-center lg:ms-20'>
19:           <div className='flex flex-col items-center sm:justify-center w-full mb-8'>
20:             <div className='flex'>
21:               <span className='text-4xl'>{user}</span>
22:             </div>
23:             <div className='flex'>
24:               <span className='text-md font-mono'>{email}</span>
25:             </div>
26:           </div>
27:         </div>
28:       </div>
29:     </div>
30:   );
31: };
32: 
33: export default AccountInfoCard;
```

## File: frontend/src/components/account/ActiveAccount.tsx
```typescript
 1: import defaultAvatar from '../../assets/avatar-default-icon.png';
 2: import AccountDropDown from './AccountDropDown';
 3: import { useState } from 'react';
 4: type ActiveAccountProps = {
 5:   user: string;
 6:   role: string;
 7: };
 8: 
 9: const ActiveAccount = ({ user, role }: ActiveAccountProps) => {
10:   const [toggleDropdown, setToggleDropdown] = useState(false);
11:   const formattedRole = role
12:     ? role?.charAt(0).toUpperCase() + role?.slice(1)
13:     : '';
14:   return (
15:     <>
16:       <div className='relative'>
17:         <div className='md:h-[40px] md:w-[40px] h-[30px] w-[30px] border border-amber-50 rounded-full shadow-lg overflow-hidden'>
18:           <img
19:             src={defaultAvatar}
20:             alt='default avatar'
21:             className='w-full h-full object-cover'
22:           />
23:         </div>
24:         {toggleDropdown && (
25:           <AccountDropDown setToggleDropdown={setToggleDropdown} />
26:         )}
27:       </div>
28:       <div className='flex-col justify-center'>
29:         <button
30:           type='button'
31:           className='text-2xl font-bold text-black ps-2'
32:           onClick={() => setToggleDropdown(!toggleDropdown)}
33:         >
34:           {user}
35:         </button>
36:         <div className='text-center text-black ps-2'>{formattedRole}</div>
37:       </div>
38:     </>
39:   );
40: };
41: 
42: export default ActiveAccount;
```

## File: frontend/src/components/account/ChangePasswordCard.tsx
```typescript
  1: import { useAppSelector } from '@/app/store';
  2: import { useState } from 'react';
  3: import axios from 'axios';
  4: import toast from 'react-hot-toast';
  5: import Input from '../Input';
  6: const ChangePasswordCard = () => {
  7:   const accessToken = useAppSelector((state) => state.auth.accessToken);
  8:   const [changePass, setChangePass] = useState({
  9:     currentPassword: '',
 10:     newPassword: '',
 11:     confirmPassword: '',
 12:   });
 13: 
 14:   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
 15:     setChangePass((prev) => ({
 16:       ...prev,
 17:       [e.target.name]: e.target.value,
 18:     }));
 19:   };
 20: 
 21:   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
 22:     e.preventDefault();
 23:     const passwordPromise = axios.post(
 24:       '/api/v1/password/change-password',
 25:       changePass,
 26:       {
 27:         headers: {
 28:           Authorization: `Bearer ${accessToken}`,
 29:         },
 30:       }
 31:     );
 32: 
 33:     await toast.promise(passwordPromise, {
 34:       loading: 'Updating password...',
 35:       success: (response) =>
 36:         response.data.msg || 'Password updated successfully',
 37:       error: (error) => error.response?.data?.message || 'Something went wrong',
 38:     });
 39: 
 40:     setChangePass({
 41:       currentPassword: '',
 42:       newPassword: '',
 43:       confirmPassword: '',
 44:     });
 45:   };
 46:   return (
 47:     <div className='w-full mx-auto mb-4'>
 48:       <h2 className='text-xl font-bold'>Change Password</h2>
 49:       <div className='bg-white dark:bg-gray-800 p-4 rounded-md mt-2'>
 50:         <form
 51:           action=''
 52:           onSubmit={handleSubmit}
 53:         >
 54:           <div className='mb-4'>
 55:             <label
 56:               htmlFor='current-password'
 57:               className='block text-sm font-medium text-gray-700 dark:text-white'
 58:             >
 59:               Current Password
 60:             </label>
 61:             <Input
 62:               type='password'
 63:               name='currentPassword'
 64:               id='currentPassword'
 65:               value={changePass.currentPassword}
 66:               onChange={handleChange}
 67:             />
 68:           </div>
 69:           <div className='mb-4'>
 70:             <label
 71:               htmlFor='new-password'
 72:               className='block text-sm font-medium text-gray-700 dark:text-white'
 73:             >
 74:               New Password
 75:             </label>
 76:             <Input
 77:               type='password'
 78:               name='newPassword'
 79:               id='newPassword'
 80:               value={changePass.newPassword}
 81:               onChange={handleChange}
 82:             />
 83:           </div>
 84:           <div className='mb-4'>
 85:             <label
 86:               htmlFor='confirm-password'
 87:               className='block text-sm font-medium text-gray-700 dark:text-white'
 88:             >
 89:               Confirm Password
 90:             </label>
 91:             <Input
 92:               type='password'
 93:               name='confirmPassword'
 94:               id='confirmPassword'
 95:               value={changePass.confirmPassword}
 96:               onChange={handleChange}
 97:             />
 98:           </div>
 99:           <button
100:             type='submit'
101:             className='w-full inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
102:           >
103:             Change Password
104:           </button>
105:         </form>
106:       </div>
107:     </div>
108:   );
109: };
110: 
111: export default ChangePasswordCard;
```

## File: frontend/src/components/auth/ProtectedRoute.tsx
```typescript
 1: import { useAppSelector } from '@/app/store';
 2: import { Navigate } from 'react-router-dom';
 3: import { ReactNode } from 'react';
 4: interface ProtectedRouteProps {
 5:   children: ReactNode;
 6:   allowedRoles?: string[];
 7: }
 8: 
 9: const ProtectedRoute = ({
10:   children,
11:   allowedRoles = [],
12: }: ProtectedRouteProps) => {
13:   const { accessToken, role } = useAppSelector((state) => state.auth);
14: 
15:   if (!accessToken)
16:     return (
17:       <Navigate
18:         to='/login'
19:         replace
20:       />
21:     );
22: 
23:   if (allowedRoles.length > 0 && (!role || !allowedRoles.includes(role))) {
24:     return (
25:       <Navigate
26:         to='/'
27:         replace
28:       />
29:     );
30:   }
31: 
32:   return children;
33: };
34: 
35: export default ProtectedRoute;
```

## File: frontend/src/components/Input.tsx
```typescript
 1: import React from 'react';
 2: 
 3: type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
 4:   className?: string;
 5: };
 6: const Input = ({ className, ...props }: InputProps) => {
 7:   return (
 8:     <input
 9:       {...props}
10:       className={`p-2 rounded-md border text-black dark:text-white border-gray-300 dark:border-gray-600 ${className} w-full`}
11:     />
12:   );
13: };
14: 
15: export default Input;
```

## File: frontend/src/components/notification/NotificationCard.tsx
```typescript
 1: interface NotificationCardProps {
 2:   status: 'read' | 'unread';
 3:   title: string;
 4:   message: string;
 5:   timeAgo: string;
 6: }
 7: 
 8: const NotificationCard = ({
 9:   status,
10:   title,
11:   message,
12:   timeAgo,
13: }: NotificationCardProps) => {
14:   const statusClass =
15:     status === 'read'
16:       ? 'bg-gray-100 dark:bg-gray-800'
17:       : 'bg-white dark:bg-gray-700';
18:   const textClass =
19:     status === 'read'
20:       ? 'text-gray-600 dark:text-white'
21:       : 'text-black dark:text-white';
22:   const agoTextClass = status === 'read' ? 'text-gray-600' : 'text-blue-500';
23:   return (
24:     <div
25:       className={` dark:bg-gray-900 p-4 rounded-md shadow-md w-full ${statusClass} hover:bg-gray-200 dark:hover:bg-gray-600`}
26:     >
27:       <h2 className={`text-xl font-bold ${textClass}`}>{title}</h2>
28:       <div className='flex justify-between'>
29:         <p className={`text-sm ${textClass}`}>{message}</p>
30:         <span className={`text-sm ${agoTextClass}`}>{timeAgo}</span>
31:       </div>
32:     </div>
33:   );
34: };
35: 
36: export default NotificationCard;
```

## File: frontend/src/components/notification/NotificationDropdown.tsx
```typescript
 1: import NotificationCard from './NotificationCard';
 2: const NotificationDropdown = () => {
 3:   return (
 4:     <>
 5:       <div className='absolute top-[120%] right-0 sm:w-[30vw] h-[50vh] bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50'>
 6:         <div className='flex justify-between align-baseline px-4 pt-2'>
 7:           <h2 className='text-lg font-bold  dark:text-white'>Notifications</h2>
 8:           <button className='dark:text-white text-sm hover:text-blue-500'>
 9:             Mark as read
10:           </button>
11:         </div>
12:         <hr className='border-gray-200 dark:border-gray-700' />
13:         <div className='flex flex-col items-center gap-2 p-4'>
14:           <NotificationCard
15:             status='read'
16:             title='Notification'
17:             message='You have a new notification'
18:             timeAgo='1 hour ago'
19:           />
20:         </div>
21:       </div>
22:     </>
23:   );
24: };
25: 
26: export default NotificationDropdown;
```

## File: frontend/src/components/notification/NotificationIcon.tsx
```typescript
 1: import { RiNotificationLine } from '@remixicon/react';
 2: import { useState } from 'react';
 3: import NotificationDropdown from './NotificationDropdown';
 4: const NotificationIcon = () => {
 5:   const [showNotification, setShowNotification] = useState(false);
 6: 
 7:   const handleNotificationClick = () => {
 8:     setShowNotification((prev) => !prev);
 9:   };
10:   return (
11:     <div className='relative'>
12:       <button
13:         onClick={handleNotificationClick}
14:         className='p-2 rounded-full bg-gray-200 dark:bg-gray-700'
15:       >
16:         <RiNotificationLine className='text-black dark:text-white hover:text-blue-500' />
17:       </button>
18:       {showNotification && <NotificationDropdown />}
19:     </div>
20:   );
21: };
22: 
23: export default NotificationIcon;
```

## File: frontend/src/constant/roles.ts
```typescript
1: export const ROLES = {
2:   ADMIN: 'admin',
3:   APPLICANT: 'applicant',
4: } as const;
5: 
6: export type RoleValue = (typeof ROLES)[keyof typeof ROLES];
```

## File: frontend/src/features/loading/loadingSlice.ts
```typescript
 1: import { createSlice } from '@reduxjs/toolkit';
 2: 
 3: interface LoadingState {
 4:   loadingState: {
 5:     [key: string]: {
 6:       loading: boolean;
 7:       isGlobal: boolean;
 8:     };
 9:   };
10:   globalLoading: boolean;
11: }
12: 
13: const initialState: LoadingState = {
14:   loadingState: {},
15:   globalLoading: false,
16: };
17: 
18: const loadingSlice = createSlice({
19:   name: 'loading',
20:   initialState,
21:   reducers: {
22:     setLoading: (
23:       state,
24:       action: { payload: { key: string; loading: boolean; isGlobal?: boolean } }
25:     ) => {
26:       const { key, loading, isGlobal = false } = action.payload;
27: 
28:       state.loadingState[key] = { loading, isGlobal };
29:       if (isGlobal) {
30:         state.globalLoading = Object.values(state.loadingState).some(
31:           (isLoading) => isLoading.isGlobal && isLoading.loading
32:         );
33:       }
34:     },
35:     clearAllLoading: (state) => {
36:       state.loadingState = {};
37:       state.globalLoading = false;
38:     },
39:   },
40: });
41: 
42: export default loadingSlice.reducer;
43: export const { setLoading, clearAllLoading } = loadingSlice.actions;
```

## File: frontend/src/features/ui/uiSlice.ts
```typescript
 1: import { createSlice, PayloadAction } from '@reduxjs/toolkit';
 2: 
 3: type viewType = 'dashboard' | 'account';
 4: 
 5: interface UIstate {
 6:   activeView: viewType;
 7: }
 8: const initialState: UIstate = {
 9:   activeView: 'dashboard',
10: };
11: 
12: const uiSlice = createSlice({
13:   name: 'ui',
14:   initialState,
15:   reducers: {
16:     setActiveView: (state, action: PayloadAction<viewType>) => {
17:       state.activeView = action.payload;
18:     },
19:   },
20: });
21: 
22: export const { setActiveView } = uiSlice.actions;
23: export default uiSlice.reducer;
```

## File: frontend/src/layout/AuthFormLayout.tsx
```typescript
 1: import React, { ReactNode } from 'react';
 2: 
 3: interface AuthFormLayoutProps {
 4:   children: ReactNode;
 5:   title?: string;
 6: }
 7: 
 8: const AuthFormLayout: React.FC<AuthFormLayoutProps> = ({ children, title }) => {
 9:   return (
10:     <div className='min-h-screen flex items-center justify-center bg-white dark:bg-gray-700 py-12 px-4 sm:px-6 lg:px-8'>
11:       <div className='max-w-md w-full space-y-8 dark:bg-gray-800 p-8 rounded-lg shadow-md'>
12:         {title && (
13:           <div className='text-center'>
14:             <h2 className='mt-6 text-3xl font-extrabold text-gray-900 dark:text-white'>
15:               {title}
16:             </h2>
17:           </div>
18:         )}
19:         <div className='mt-8 space-y-6'>{children}</div>
20:       </div>
21:     </div>
22:   );
23: };
24: 
25: export default AuthFormLayout;
```

## File: frontend/src/main.tsx
```typescript
 1: import React from 'react';
 2: import { createRoot } from 'react-dom/client';
 3: import App from './App';
 4: 
 5: const root = document.getElementById('root') as HTMLElement;
 6: createRoot(root).render(
 7:   <React.StrictMode>
 8:     <App />
 9:   </React.StrictMode>
10: );
```

## File: frontend/src/pages/admin/AdminView.tsx
```typescript
 1: import { useEffect, useState } from 'react';
 2: import { useAppSelector } from '../../app/store';
 3: import useSocket from '../../hooks/useSocket';
 4: import axios from 'axios';
 5: 
 6: type statResponse = {
 7:   applicantUserCount: number;
 8: };
 9: const AdminView = () => {
10:   const { accessToken } = useAppSelector((state) => state.auth);
11:   const { userid, user, role } = useAppSelector((state) => state.auth);
12:   const { userCount } = useSocket(userid || '', role || '');
13:   const [stats, setStats] = useState<statResponse>({ applicantUserCount: 0 });
14: 
15:   useEffect(() => {
16:     const controller = new AbortController();
17:     const fetchStats = async () => {
18:       try {
19:         const response = await axios.get<statResponse>(
20:           '/api/v1/admin/dashboard',
21:           {
22:             signal: controller.signal,
23:             headers: {
24:               Authorization: `Bearer ${accessToken}`,
25:             },
26:           }
27:         );
28:         setStats(response.data);
29:       } catch (error) {
30:         console.error('Error fetching stats:', error);
31:       }
32:     };
33:     fetchStats();
34:     return () => {
35:       controller.abort();
36:     };
37:   }, []);
38:   return (
39:     <>
40:       Welcome back Admin {user}
41:       <p>
42:         Online Users:&nbsp;
43:         <span className='bg-green-500 h-[10px] w-[10px] rounded-full inline-block mr-1'></span>
44:         {userCount}/{stats.applicantUserCount}
45:       </p>
46:     </>
47:   );
48: };
49: 
50: export default AdminView;
```

## File: frontend/src/types/declaration.d.ts
```typescript
 1: declare module '*.png' {
 2:   const value: string;
 3:   export default value;
 4: }
 5: 
 6: declare module '*.jpg' {
 7:   const value: string;
 8:   export default value;
 9: }
10: 
11: declare module '*.jpeg' {
12:   const value: string;
13:   export default value;
14: }
```

## File: frontend/src/utils/navigateToDashboard.ts
```typescript
1: const navigateToDashboard = (role: string) => {
2:   return role === 'admin' ? '/admin/dashboard' : '/user/dashboard';
3: };
4: 
5: export default navigateToDashboard;
```

## File: frontend/tailwind.config.js
```javascript
1: /** @type {import('tailwindcss').Config} */
2: export default {
3:   darkMode: 'class',
4:   content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
5:   theme: {
6:     extend: {},
7:   },
8:   plugins: [],
9: };
```

## File: frontend/tsconfig.json
```json
 1: {
 2:   "compilerOptions": {
 3:     "target": "ES2020",
 4:     "useDefineForClassFields": true,
 5:     "lib": ["ES2020", "DOM", "DOM.Iterable"],
 6:     "module": "ESNext",
 7:     "skipLibCheck": true,
 8:     "moduleResolution": "bundler",
 9:     "allowImportingTsExtensions": true,
10:     "resolveJsonModule": true,
11:     "isolatedModules": true,
12:     "noEmit": true,
13:     "jsx": "react-jsx",
14:     "strict": true,
15:     "noUnusedLocals": true,
16:     "noUnusedParameters": true,
17:     "noFallthroughCasesInSwitch": true,
18:     "baseUrl": ".",
19:     "paths": {
20:       "@/*": ["./src/*"]
21:     },
22:     "esModuleInterop": true,
23:     "forceConsistentCasingInFileNames": true
24:   },
25:   "include": ["src"],
26:   "exclude": ["node_modules", "dist"]
27: }
```

## File: .gitignore
```
1: /structure
2: /node_modules
3: .env
```

## File: backend/.gitignore
```
1: dist
```

## File: backend/controllers/job.ts
```typescript
 1: import Job from '../models/Job.js';
 2: import { StatusCodes } from 'http-status-codes';
 3: import {
 4:   BadRequestError,
 5:   NotFoundError,
 6:   UnauthenticatedError,
 7: } from '../errors/index.js';
 8: import { Request, Response } from 'express';
 9: import { UserPayload } from '../types/express.js';
10: 
11: const getAllJobs = async (req: Request, res: Response) => {
12:   const jobs = await Job.find({ createdBy: req?.user?.userId }).sort(
13:     'createdAt'
14:   );
15:   res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
16: };
17: const getJob = async (req: Request, res: Response) => {
18:   if (!req?.user) {
19:     throw new UnauthenticatedError('Authentication invalid');
20:   }
21:   const {
22:     params: { id: jobId },
23:     user: { userId },
24:   } = req;
25:   const job = await Job.findOne({ _id: jobId, createdBy: userId });
26:   if (!job) {
27:     throw new NotFoundError(`Job not found with an ${jobId} id`);
28:   }
29:   res.status(StatusCodes.OK).json({ job });
30: };
31: 
32: const createJob = async (req: Request, res: Response) => {
33:   req.body.createdBy = req?.user?.userId;
34:   const job = await Job.create(req.body);
35:   res.status(StatusCodes.CREATED).json({ job });
36: };
37: 
38: const updateJob = async (req: Request, res: Response) => {
39:   if (!req?.user) {
40:     throw new UnauthenticatedError('Authentication invalid');
41:   }
42:   const {
43:     body: { company, position },
44:     params: { id: jobId },
45:     user: { userId },
46:   } = req;
47:   if (!company || !position) {
48:     throw new BadRequestError('Please provide company and position');
49:   }
50: 
51:   const job = await Job.findOneAndUpdate(
52:     { _id: jobId, createdBy: userId },
53:     req.body,
54:     {
55:       new: true,
56:       runValidators: true,
57:     }
58:   );
59:   if (!job) {
60:     throw new NotFoundError(`Job not found with an ${jobId} id`);
61:   }
62:   res.status(StatusCodes.OK).json({ job });
63: };
64: 
65: const deleteJob = async (req: Request, res: Response) => {
66:   if (!req?.user) {
67:     throw new UnauthenticatedError('Authentication invalid');
68:   }
69:   const {
70:     params: { id: jobId },
71:     user: { userId },
72:   } = req;
73:   const job = await Job.findOneAndDelete({ _id: jobId, createdBy: userId });
74:   if (!job) {
75:     throw new NotFoundError(`Job not found with an ${jobId} id`);
76:   }
77:   res.status(StatusCodes.OK).send();
78: };
79: 
80: export { getAllJobs, getJob, createJob, updateJob, deleteJob };
```

## File: backend/db/connect.ts
```typescript
 1: import mongoose from 'mongoose';
 2: 
 3: const connectDB = (url: string) => {
 4:   const options = {
 5:     maxPoolSize: 10,
 6:     serverSelectionTimeoutMS: 5000,
 7:     socketTimeoutMS: 45000,
 8:     bufferCommands: false,
 9:   };
10: 
11:   return mongoose.connect(url, options);
12: };
13: 
14: export default connectDB;
```

## File: backend/errors/bad-request.ts
```typescript
 1: import { StatusCodes } from 'http-status-codes';
 2: import CustomAPIError from './custom-api.js';
 3: 
 4: class BadRequestError extends CustomAPIError {
 5:   public statusCode: number;
 6:   constructor(message: string) {
 7:     super(message);
 8:     this.statusCode = StatusCodes.BAD_REQUEST;
 9:   }
10: }
11: 
12: export default BadRequestError;
```

## File: backend/errors/custom-api.ts
```typescript
1: export default class CustomAPIError extends Error {
2:   constructor(message: string) {
3:     super(message);
4:   }
5: }
```

## File: backend/errors/index.ts
```typescript
1: import CustomAPIError from './custom-api.js';
2: import UnauthenticatedError from './unauthenticated.js';
3: import NotFoundError from './not-found.js';
4: import BadRequestError from './bad-request.js';
5: import type { CustomError } from './error.d.js';
6: 
7: export { CustomAPIError, UnauthenticatedError, NotFoundError, BadRequestError };
8: export type { CustomError };
```

## File: backend/errors/not-found.ts
```typescript
 1: import { StatusCodes } from 'http-status-codes';
 2: import CustomAPIError from './custom-api.js';
 3: 
 4: class NotFoundError extends CustomAPIError {
 5:   public statusCode: number;
 6:   constructor(message: string) {
 7:     super(message);
 8:     this.statusCode = StatusCodes.NOT_FOUND;
 9:   }
10: }
11: 
12: export default NotFoundError;
```

## File: backend/errors/unauthenticated.ts
```typescript
 1: import { StatusCodes } from 'http-status-codes';
 2: import CustomAPIError from './custom-api.js';
 3: 
 4: class UnauthenticatedError extends CustomAPIError {
 5:   public statusCode: number;
 6:   constructor(message: string) {
 7:     super(message);
 8:     this.statusCode = StatusCodes.UNAUTHORIZED;
 9:   }
10: }
11: 
12: export default UnauthenticatedError;
```

## File: backend/middleware/authenticated.ts
```typescript
 1: import jwt from 'jsonwebtoken';
 2: import { UnauthenticatedError } from '../errors/index.js';
 3: import { Request, Response, NextFunction } from 'express';
 4: import { UserPayload } from '../types/express.js';
 5: 
 6: const auth = async (req: Request, res: Response, next: NextFunction) => {
 7:   const secret = process.env.JWT_ACCESS_SECRET as string;
 8:   const token = req.headers.authorization;
 9:   if (!token || !token.startsWith('Bearer ')) {
10:     throw new UnauthenticatedError('Authentication invalid no token provided');
11:   }
12:   const jwtToken = token.split('Bearer ')[1];
13:   try {
14:     const decode = jwt.verify(jwtToken, secret) as UserPayload;
15:     req.user = {
16:       userId: decode.userId,
17:       username: decode.username,
18:       role: decode.role,
19:     };
20:     next();
21:   } catch (error) {
22:     throw new UnauthenticatedError('Authentication invalid token expired');
23:   }
24: };
25: 
26: export default auth;
```

## File: backend/tsconfig.json
```json
 1: {
 2:   "compilerOptions": {
 3:     "target": "ES2022" /* Specify ECMAScript target version: 'ES3' (default), 'ES5', 'ES2015', 'ES2016', 'ES2017', 'ES2018', 'ES2019', 'ES2020', 'ES2021', 'ES2022', 'ESNext'. */,
 4:     "module": "NodeNext" /* Specify module code generation: 'None', 'CommonJS', 'AMD', 'System', 'UMD', 'ES6', 'ES2015', 'ES2020', 'ES2022', 'ESNext', 'Node16', 'NodeNext'. */,
 5:     "moduleResolution": "nodeNext",
 6:     "rootDir": "./" /* Specify the root directory of input files. Use to control the output directory structure with --outDir. */,
 7:     "outDir": "./dist" /* Redirect output structure to the directory. */,
 8:     "esModuleInterop": true /* Emit additional JavaScript to ease support for importing CommonJS modules. This enables `allowSyntheticDefaultImports` for type compatibility. */,
 9:     "forceConsistentCasingInFileNames": true /* Ensure that casing is consistent across all file paths. */,
10:     "strict": true /* Enable all strict type-checking options. */,
11:     "skipLibCheck": true /* Skip type checking all .d.ts files. */,
12:     "resolveJsonModule": true /* Enable importing .json files */,
13:     "sourceMap": true /* Emit corresponding .map files. */
14:   },
15:   "include": [
16:     "./**/*.ts"
17:   ] /* Specify an array of filenames or patterns to include in the program. */,
18:   "exclude": ["node_modules", "dist"]
19: }
```

## File: backend/types/express.d.ts
```typescript
 1: import { Request } from 'express';
 2: 
 3: interface UserPayload {
 4:   userId: string;
 5:   username: string;
 6:   role: string;
 7: }
 8: 
 9: declare global {
10:   namespace Express {
11:     interface Request {
12:       user?: UserPayload;
13:     }
14:   }
15: }
```

## File: frontend/src/components/JobModal/AddJobModal.tsx
```typescript
 1: import React, { useState } from 'react';
 2: import { useAppDispatch, useAppSelector } from '../../app/store';
 3: import { setLoading } from '../../features/loading/loadingSlice';
 4: import toast from 'react-hot-toast';
 5: import jobAPI from '../../features/job/jobAPI';
 6: const AddJobModal = (props: { onClose?: () => void }) => {
 7:   const dispatch = useAppDispatch();
 8:   const isLoading = useAppSelector(
 9:     (state) => state.loading.loadingState?.addJob?.loading
10:   );
11:   const [formData, setFromData] = useState({
12:     company: '',
13:     position: '',
14:   });
15:   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
16:     setFromData((prev) => ({
17:       ...prev,
18:       [e.target.name]: e.target.value,
19:     }));
20:   };
21: 
22:   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
23:     e.preventDefault();
24:     const dispatchPayload = { key: 'addJob', loading: true };
25:     dispatch(setLoading(dispatchPayload));
26: 
27:     try {
28:       await dispatch(jobAPI.createNewJob(formData)).unwrap();
29:       props?.onClose?.();
30:       toast.success('Job added successfully');
31:     } catch (err) {
32:       toast.error(`Failed to add job: ${err}`);
33:     } finally {
34:       dispatch(setLoading({ ...dispatchPayload, loading: false }));
35:     }
36:   };
37:   return (
38:     <form onSubmit={handleSubmit}>
39:       <input
40:         type='text'
41:         name='company'
42:         id='company'
43:         placeholder='Company'
44:         className='w-full p-2 mb-4 border dark:border-gray-700 dark:text-white rounded'
45:         value={formData.company}
46:         onChange={handleChange}
47:       />
48:       <input
49:         type='text'
50:         name='position'
51:         id='position'
52:         placeholder='Position'
53:         className='w-full p-2 mb-4 border dark:border-gray-700 dark:text-white rounded'
54:         value={formData.position}
55:         onChange={handleChange}
56:       />
57:       <button
58:         type='submit'
59:         disabled={isLoading}
60:         className='bg-blue-500 text-white px-4 py-2 rounded'
61:       >
62:         {isLoading ? 'Submitting...' : 'Submit'}
63:       </button>
64:     </form>
65:   );
66: };
67: 
68: export default AddJobModal;
```

## File: frontend/src/components/JobModal/DeleteJobModal.tsx
```typescript
 1: import { useAppDispatch, useAppSelector } from '../../app/store';
 2: import { setLoading } from '../../features/loading/loadingSlice';
 3: import jobAPI from '../../features/job/jobAPI';
 4: import toast from 'react-hot-toast';
 5: interface DeleteJobModalProps {
 6:   jobID: string;
 7:   company: string;
 8:   status: string;
 9:   position: string;
10:   onClose?: () => void;
11: }
12: const DeleteJobModal = (props: DeleteJobModalProps) => {
13:   const dispatch = useAppDispatch();
14:   const { jobID, company, status, position, onClose } = props;
15:   const isLoading = useAppSelector(
16:     (state) => state.loading.loadingState?.deleteJob?.loading
17:   );
18:   const handleDelete = async (JobId: string) => {
19:     const dispatchPayload = { key: 'deleteJob', loading: true };
20:     dispatch(setLoading(dispatchPayload));
21:     try {
22:       await dispatch(jobAPI.deleleJob(JobId));
23:       toast.success('Job deleted successfully');
24:       onClose?.();
25:     } catch (error) {
26:       toast.error(`Failed to delete job: ${error}`);
27:     } finally {
28:       dispatch(setLoading({ ...dispatchPayload, loading: false }));
29:     }
30:   };
31:   return (
32:     <>
33:       <p>
34:         Are you sure you want to delete this job for{' '}
35:         <span className='font-bold'>{company}</span> -{' '}
36:         <span className='font-bold'>{position}</span> with a current status{' '}
37:         <span className='font-bold'>{status}</span>?
38:       </p>
39:       <div className='flex justify-end gap-2'>
40:         <button
41:           onClick={() => handleDelete(jobID)}
42:           disabled={isLoading}
43:           className='bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600'
44:         >
45:           {isLoading ? 'Deleting...' : 'Delete'}
46:         </button>
47:         <button
48:           onClick={onClose}
49:           className='bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600'
50:         >
51:           Cancel
52:         </button>
53:       </div>
54:     </>
55:   );
56: };
57: 
58: export default DeleteJobModal;
```

## File: frontend/src/components/JobModal/MainJobModal.tsx
```typescript
 1: import { ReactElement, cloneElement, Suspense } from 'react';
 2: import { RiCloseLine } from '@remixicon/react';
 3: interface ModalProps<T = any> {
 4:   children: ReactElement<T>;
 5:   title: string;
 6:   headerColor: string;
 7:   onClose: () => void;
 8: }
 9: const MainJobModal = (props: ModalProps) => {
10:   const { children, title, headerColor, onClose } = props;
11: 
12:   const cloneChildren = cloneElement(children, { onClose });
13:   return (
14:     <div
15:       tabIndex={-1}
16:       role='dialog'
17:       className='fixed inset-0 z-50 flex items-center justify-center overflow-y-auto'
18:       aria-labelledby='modal-title'
19:       aria-modal='true'
20:     >
21:       <div className='modal-overlay absolute inset-0 bg-gray-900 opacity-50' />
22:       <div className='modal-container bg-white dark:bg-gray-800 md:w-1/3 w-full mx-auto rounded-2xl shadow-lg z-50 pb-4'>
23:         <div
24:           className={`flex justify-between items-center p-4 ${headerColor} rounded-t-2xl`}
25:         >
26:           <h2 className='text-lg font-bold text-white dark:text-white'>
27:             {title}
28:           </h2>
29:           <button
30:             onClick={onClose}
31:             className='modal-close font-extrabold text-gray-600 dark:text-white hover:text-gray-900 '
32:           >
33:             <RiCloseLine />
34:           </button>
35:         </div>
36:         <div className='modal-body p-4 '>
37:           {
38:             <Suspense
39:               fallback={
40:                 <div className='text-center'>Retrieving the form...</div>
41:               }
42:             >
43:               {cloneChildren}
44:             </Suspense>
45:           }
46:         </div>
47:       </div>
48:     </div>
49:   );
50: };
51: 
52: export default MainJobModal;
```

## File: frontend/src/features/job/jobAPI.ts
```typescript
 1: import { createAsyncThunk } from '@reduxjs/toolkit';
 2: import axios from 'axios';
 3: import { JobRes } from './jobSlice';
 4: import { JobInfo } from '../../components/JobCard';
 5: import { RootState } from '../../app/store';
 6: interface FromData {
 7:   company: string;
 8:   position: string;
 9:   status?: string;
10: }
11: 
12: const getAccessToken = (thunkAPI: any) => {
13:   const state = thunkAPI.getState() as RootState;
14:   return state.auth.accessToken;
15: };
16: 
17: const jobAPI = {
18:   fetchJob: createAsyncThunk('get/jobs', async (_, thunkAPI) => {
19:     try {
20:       const { data } = await axios.get<JobRes>('/api/v1/jobs', {
21:         headers: {
22:           Authorization: `Bearer ${getAccessToken(thunkAPI)}`,
23:         },
24:       });
25:       return data;
26:     } catch (error) {
27:       return thunkAPI.rejectWithValue(
28:         error.response?.data?.message || 'Fetch jobs failed'
29:       );
30:     }
31:   }),
32:   createNewJob: createAsyncThunk(
33:     'post/job',
34:     async (formData: FromData, thunkAPI) => {
35:       try {
36:         const { data } = await axios.post<{ job: JobInfo }>(
37:           '/api/v1/jobs',
38:           formData,
39:           {
40:             headers: {
41:               Authorization: `Bearer ${getAccessToken(thunkAPI)}`,
42:             },
43:           }
44:         );
45:         return data.job;
46:       } catch (error) {
47:         return thunkAPI.rejectWithValue(
48:           error.response?.data?.message || 'Create job failed'
49:         );
50:       }
51:     }
52:   ),
53:   updateJob: createAsyncThunk(
54:     'update/job',
55:     async (
56:       { formData, jobID }: { formData: FromData; jobID: string },
57:       thunkAPI
58:     ) => {
59:       try {
60:         await axios.patch(`/api/v1/jobs/${jobID}`, formData, {
61:           headers: {
62:             Authorization: `Bearer ${getAccessToken(thunkAPI)}`,
63:           },
64:         });
65:         return { ...formData, jobID };
66:       } catch (error) {
67:         return thunkAPI.rejectWithValue(
68:           error.response?.data?.message || 'Update job failed'
69:         );
70:       }
71:     }
72:   ),
73:   deleleJob: createAsyncThunk('delete/job', async (jobID: string, thunkAPI) => {
74:     try {
75:       await axios.delete(`/api/v1/jobs/${jobID}`, {
76:         headers: {
77:           Authorization: `Bearer ${getAccessToken(thunkAPI)}`,
78:         },
79:       });
80:       return jobID;
81:     } catch (error) {
82:       return thunkAPI.rejectWithValue(
83:         error.response?.data?.message || 'Delete job failed'
84:       );
85:     }
86:   }),
87: };
88: export default jobAPI;
```

## File: frontend/src/hooks/useSocket.tsx
```typescript
 1: import { useEffect, useState, useRef } from 'react';
 2: import io, { Socket } from 'socket.io-client';
 3: 
 4: const useSocket = (userid: string, role: string) => {
 5:   const [isConnected, setIsConnected] = useState(false);
 6:   const [userCount, setUserCount] = useState(0);
 7:   const socketRef = useRef<Socket | null>(null);
 8:   useEffect(() => {
 9:     const socket = io('http://localhost:3000');
10:     socketRef.current = socket;
11:     socket.on('connect', () => {
12:       if (userid && role !== 'admin') {
13:         socket.emit('join', userid);
14:         setIsConnected(true);
15:       }
16:     });
17:     socket.on('disconnect', () => {
18:       if (role !== 'admin') {
19:         setIsConnected(false);
20:       }
21:     });
22:     socket.on('rt-user-count', (count) => {
23:       setUserCount(count);
24:     });
25: 
26:     return () => {
27:       socketRef.current?.close();
28:       socketRef.current = null;
29:     };
30:   }, [userid]);
31: 
32:   return {
33:     socket: socketRef.current,
34:     isConnected,
35:     userCount,
36:   };
37: };
38: 
39: export default useSocket;
```

## File: frontend/index.html
```html
 1: <!DOCTYPE html>
 2: <html lang="en">
 3:   <head>
 4:     <meta charset="UTF-8" />
 5:     <!-- <link
 6:       rel="icon"
 7:       type="image/svg+xml"
 8:       href="/vite.svg"
 9:     /> -->
10:     <meta
11:       name="viewport"
12:       content="width=device-width, initial-scale=1.0"
13:     />
14:     <title>Job API</title>
15:   </head>
16:   <body>
17:     <div id="root"></div>
18:     <script
19:       type="module"
20:       src="/src/main.tsx"
21:     ></script>
22:   </body>
23: </html>
```

## File: frontend/src/App.css
```css
1: @import 'tailwindcss';
2: @custom-variant dark (&:where(.dark, .dark *));
3: 
4: * {
5:   transition: background-color 0.3s, color 0.3s;
6: }
```

## File: frontend/src/components/DarkModeToggle.tsx
```typescript
 1: import { useEffect, useState } from 'react';
 2: 
 3: const DarkModeToggle = () => {
 4:   const [darkMode, setDarkMode] = useState(() => {
 5:     return (
 6:       localStorage.themeIsDark === 'true' ||
 7:       (!('themeIsDark' in localStorage) &&
 8:         window.matchMedia('(prefers-color-scheme: dark)').matches)
 9:     );
10:   });
11:   useEffect(() => {
12:     const root = window.document.documentElement;
13: 
14:     if (darkMode) {
15:       root.classList.add('dark');
16:       localStorage.themeIsDark = 'true';
17:     } else {
18:       root.classList.remove('dark');
19:       localStorage.themeIsDark = 'false';
20:     }
21:   }, [darkMode]);
22: 
23:   return (
24:     <button
25:       onClick={() => setDarkMode((prev) => !prev)}
26:       className='p-2 rounded-full bg-gray-200 dark:bg-gray-700'
27:     >
28:       {darkMode ? '☀️' : '🌙'}
29:     </button>
30:   );
31: };
32: 
33: export default DarkModeToggle;
```

## File: frontend/src/components/JobModal/UpdateJobModal.tsx
```typescript
 1: import React, { useState } from 'react';
 2: import { useAppDispatch, useAppSelector } from '../../app/store';
 3: import { setLoading } from '../../features/loading/loadingSlice';
 4: import jobAPI from '../../features/job/jobAPI';
 5: import toast from 'react-hot-toast';
 6: interface UpdateJobModalProps {
 7:   jobID: string;
 8:   company: string;
 9:   status: string;
10:   position: string;
11:   onClose?: () => void;
12: }
13: 
14: const UpdateJobModal = (props: UpdateJobModalProps) => {
15:   const { jobID, company, status, position } = props;
16:   const isLoading = useAppSelector(
17:     (state) => state.loading.loadingState?.updateJob?.loading
18:   );
19:   const dispatch = useAppDispatch();
20:   const [formData, setFromData] = useState({
21:     company,
22:     position,
23:     status,
24:   });
25:   const handleChange = (
26:     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
27:   ) => {
28:     setFromData((prev) => ({
29:       ...prev,
30:       [e.target.name]: e.target.value,
31:     }));
32:   };
33: 
34:   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
35:     e.preventDefault();
36:     const dispatchPayload = { key: 'updateJob', loading: true };
37:     dispatch(setLoading(dispatchPayload));
38: 
39:     try {
40:       await dispatch(jobAPI.updateJob({ jobID, formData })).unwrap();
41:       props?.onClose?.();
42:       toast.success('Job updated successfully');
43:     } catch (err) {
44:       toast.error(`Failed to update job: ${err}`);
45:     } finally {
46:       dispatch(setLoading({ ...dispatchPayload, loading: false }));
47:     }
48:   };
49:   return (
50:     <form onSubmit={handleSubmit}>
51:       <input
52:         type='text'
53:         name='company'
54:         id='company'
55:         value={formData.company}
56:         onChange={handleChange}
57:         placeholder='Company'
58:         className='w-full p-2 mb-4 border border-gray-300 rounded'
59:       />
60:       <input
61:         type='text'
62:         name='position'
63:         id='position'
64:         value={formData.position}
65:         onChange={handleChange}
66:         placeholder='Position'
67:         className='w-full p-2 mb-4 border border-gray-300 rounded'
68:       />
69:       <select
70:         name='status'
71:         id='status'
72:         value={formData.status}
73:         onChange={handleChange}
74:         className='w-full p-2 mb-4 border bg-white text-black border-gray-300 dark:text-white rounded dark:bg-gray-800'
75:       >
76:         <option value='pending'>Pending</option>
77:         <option value='interview'>Interview</option>
78:         <option value='declined'>declined</option>
79:       </select>
80:       <button
81:         type='submit'
82:         disabled={isLoading}
83:         className='bg-blue-400 text-white px-4 py-2 rounded'
84:       >
85:         {isLoading ? 'Updating...' : 'Update'}
86:       </button>
87:     </form>
88:   );
89: };
90: 
91: export default UpdateJobModal;
```

## File: frontend/src/components/Loading.tsx
```typescript
1: const Loading = () => {
2:   return (
3:     <div className='flex justify-center items-center h-screen bg-white dark:bg-gray-700'>
4:       <div className='animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500'></div>
5:     </div>
6:   );
7: };
8: 
9: export default Loading;
```

## File: frontend/src/features/job/jobSlice.ts
```typescript
 1: import { createSlice } from '@reduxjs/toolkit';
 2: import { JobInfo } from '../../components/JobCard';
 3: import jobAPI from './jobAPI';
 4: 
 5: export interface JobRes {
 6:   jobs: JobInfo[];
 7:   count: number;
 8: }
 9: 
10: const initialState: JobRes = {
11:   jobs: [],
12:   count: 0,
13: };
14: 
15: const jobSlice = createSlice({
16:   name: 'job',
17:   initialState,
18:   reducers: {},
19:   extraReducers: (builder) => {
20:     builder.addCase(jobAPI.fetchJob.fulfilled, (state, action) => {
21:       state.jobs = action.payload.jobs;
22:       state.count = action.payload.count;
23:     });
24:     builder.addCase(jobAPI.createNewJob.fulfilled, (state, action) => {
25:       state.jobs.push(action.payload);
26:     });
27:     builder.addCase(jobAPI.updateJob.fulfilled, (state, action) => {
28:       const { jobID, company, position, status } = action.payload;
29:       const index = state.jobs.findIndex((job) => job._id === jobID);
30:       if (index !== -1) {
31:         state.jobs[index] = {
32:           ...state.jobs[index],
33:           company,
34:           position,
35:           status: status || '',
36:         };
37:       }
38:     });
39:     builder.addCase(jobAPI.deleleJob.fulfilled, (state, action) => {
40:       const jobID = action.payload;
41:       state.jobs = state.jobs.filter((job) => job._id !== jobID);
42:     });
43:   },
44: });
45: 
46: export default jobSlice.reducer;
```

## File: frontend/src/pages/applicant/JobsView.tsx
```typescript
  1: import { useState, useEffect, useCallback, lazy } from 'react';
  2: import MainJobModal from '../../components/JobModal/MainJobModal';
  3: const AddJobModal = lazy(() => import('../../components/JobModal/AddJobModal'));
  4: import JobCard, { JobInfo } from '../../components/JobCard';
  5: const UpdateJobModal = lazy(
  6:   () => import('../../components/JobModal/UpdateJobModal')
  7: );
  8: const DeleteJobModal = lazy(
  9:   () => import('../../components/JobModal/DeleteJobModal')
 10: );
 11: import { useAppDispatch, useAppSelector } from '../../app/store';
 12: import jobAPI from '../../features/job/jobAPI';
 13: import useSocket from '../../hooks/useSocket';
 14: import { RiAddLine } from '@remixicon/react';
 15: type ModalState =
 16:   | {
 17:       type: 'add' | 'update' | 'delete' | null;
 18:       Job: JobInfo | null;
 19:     }
 20:   | { type: null; Job: null };
 21: 
 22: const JobsView = () => {
 23:   const dispatch = useAppDispatch();
 24:   const jobs = useAppSelector((state) => state.job.jobs);
 25:   const { userid, role } = useAppSelector((state) => state.auth);
 26:   useSocket(userid || '', role || '');
 27:   const [modal, setModal] = useState<ModalState>({ type: null, Job: null });
 28:   const handleUpdateJobs = useCallback((job: JobInfo) => {
 29:     setModal({ type: 'update', Job: job });
 30:   }, []);
 31: 
 32:   const handleDeleteJob = useCallback((Job: JobInfo) => {
 33:     setModal({ type: 'delete', Job: Job });
 34:   }, []);
 35: 
 36:   const handleAfterModalActionJobs = useCallback(() => {
 37:     setModal({ type: null, Job: null });
 38:   }, []);
 39: 
 40:   useEffect(() => {
 41:     dispatch(jobAPI.fetchJob());
 42:   }, [dispatch]);
 43:   return (
 44:     <>
 45:       <div className='flex justify-between'>
 46:         <h1 className='md:text-4xl text-2xl mx-4 font-bold text-gray-900 dark:text-white'>
 47:           Jobs
 48:         </h1>
 49:         <button
 50:           className='bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600'
 51:           onClick={() => setModal({ type: 'add', Job: null })}
 52:         >
 53:           <RiAddLine />
 54:         </button>
 55:       </div>
 56:       <div className='h-[90%] mt-4 sm:mx-[20px] bg-white dark:bg-gray-800 rounded-lg shadow-lg'>
 57:         <div className='flex flex-col gap-y-4 p-4'>
 58:           {jobs.length === 0 ? (
 59:             <p className='text-center text-gray-600 dark:text-white'>
 60:               No jobs found
 61:             </p>
 62:           ) : (
 63:             jobs.map((job) => (
 64:               <JobCard
 65:                 key={job._id}
 66:                 {...job}
 67:                 onUpdate={handleUpdateJobs}
 68:                 onDelete={handleDeleteJob}
 69:               />
 70:             ))
 71:           )}
 72:         </div>
 73:       </div>
 74:       {modal?.type === 'add' && (
 75:         <MainJobModal
 76:           title='Add Job'
 77:           headerColor='bg-blue-500'
 78:           onClose={handleAfterModalActionJobs}
 79:         >
 80:           <AddJobModal />
 81:         </MainJobModal>
 82:       )}
 83:       {modal?.type === 'update' && modal?.Job && (
 84:         <MainJobModal
 85:           title='Update Job'
 86:           headerColor='bg-blue-500'
 87:           onClose={handleAfterModalActionJobs}
 88:         >
 89:           <UpdateJobModal
 90:             jobID={modal.Job._id}
 91:             company={modal.Job.company}
 92:             position={modal.Job.position}
 93:             status={modal.Job.status || ''}
 94:           />
 95:         </MainJobModal>
 96:       )}
 97:       {modal?.type === 'delete' && modal?.Job && (
 98:         <MainJobModal
 99:           title='Delete Job'
100:           headerColor='bg-red-500'
101:           onClose={handleAfterModalActionJobs}
102:         >
103:           <DeleteJobModal
104:             jobID={modal?.Job._id}
105:             company={modal?.Job.company}
106:             position={modal?.Job.position}
107:             status={modal?.Job.status || ''}
108:           />
109:         </MainJobModal>
110:       )}
111:     </>
112:   );
113: };
114: 
115: export default JobsView;
```

## File: frontend/src/routes/AppRouter.tsx
```typescript
  1: import React, {
  2:   lazy,
  3:   Suspense,
  4:   ComponentType,
  5:   ReactNode,
  6:   useEffect,
  7: } from 'react';
  8: import { Routes, Route, Navigate } from 'react-router-dom';
  9: import { useAppDispatch, useAppSelector } from '../app/store';
 10: import authAPI from '../features/auth/authAPI';
 11: const Home = lazy(() => import('../pages/Home'));
 12: const Login = lazy(() => import('../pages/Login'));
 13: const Register = lazy(() => import('../pages/Register'));
 14: const JobsView = lazy(() => import('../pages/applicant/JobsView'));
 15: const AdminView = lazy(() => import('../pages/admin/AdminView'));
 16: const Account = lazy(() => import('../pages/Account'));
 17: import Loading from '../components/Loading';
 18: import AppLayout from '../layout/AppLayout';
 19: import navigateToDashboard from '../utils/navigateToDashboard';
 20: import ProtectedRoute from '@/components/auth/ProtectedRoute';
 21: import { ROLES } from '@/constant/roles';
 22: 
 23: const AppRouter = () => {
 24:   const { accessToken, role } = useAppSelector((state) => state.auth);
 25:   const globalLoading = useAppSelector((state) => state.loading.globalLoading);
 26:   const dispatch = useAppDispatch();
 27: 
 28:   const withLayout = (
 29:     Layout: ComponentType<{ children: ReactNode }>,
 30:     page: ReactNode
 31:   ) => {
 32:     if (!accessToken) return <Navigate to='/login' />;
 33:     return <Layout>{page}</Layout>;
 34:   };
 35: 
 36:   useEffect(() => {
 37:     dispatch(authAPI.refreshToken());
 38:   }, []);
 39:   if (globalLoading) {
 40:     return <Loading />;
 41:   }
 42: 
 43:   return (
 44:     <>
 45:       <Routes>
 46:         <Route
 47:           path='/'
 48:           element={<Home />}
 49:         />
 50:         <Route
 51:           path='/login'
 52:           element={
 53:             <Suspense fallback={<Loading />}>
 54:               {!accessToken ? (
 55:                 <Login />
 56:               ) : (
 57:                 <Navigate
 58:                   to={navigateToDashboard(role || '')}
 59:                   replace
 60:                 />
 61:               )}
 62:             </Suspense>
 63:           }
 64:         />
 65:         <Route
 66:           path='/register'
 67:           element={
 68:             <Suspense fallback={<Loading />}>
 69:               {!accessToken ? (
 70:                 <Register />
 71:               ) : (
 72:                 <Navigate to={navigateToDashboard(role || '')} />
 73:               )}
 74:             </Suspense>
 75:           }
 76:         />
 77:         <Route
 78:           path='/user/dashboard'
 79:           element={
 80:             <ProtectedRoute allowedRoles={[ROLES.APPLICANT]}>
 81:               {withLayout(AppLayout, <JobsView />)}
 82:             </ProtectedRoute>
 83:           }
 84:         />
 85:         <Route
 86:           path='/admin/dashboard'
 87:           element={
 88:             <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
 89:               {withLayout(AppLayout, <AdminView />)}
 90:             </ProtectedRoute>
 91:           }
 92:         />
 93:         <Route
 94:           path='/account'
 95:           element={
 96:             <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.APPLICANT]}>
 97:               {withLayout(AppLayout, <Account />)}
 98:             </ProtectedRoute>
 99:           }
100:         />
101:       </Routes>
102:     </>
103:   );
104: };
105: 
106: export default AppRouter;
```

## File: backend/models/User.ts
```typescript
 1: import mongoose, { Document, Schema } from 'mongoose';
 2: import bcrypt from 'bcryptjs';
 3: import jwt from 'jsonwebtoken';
 4: 
 5: interface IUser extends Document {
 6:   name: string;
 7:   email: string;
 8:   password: string;
 9:   role: string;
10:   _generateJWT(secret: string, lifetime: string): string;
11:   generateAccessToken(): string;
12:   generateRefreshToken(): string;
13:   createJWT(): { accessToken: string; refreshToken: string };
14:   comparePassword(userProvidedPassword: string): Promise<boolean>;
15: }
16: const UserSchema = new mongoose.Schema<IUser>({
17:   name: {
18:     type: String,
19:     required: [true, 'Please provide name'],
20:     minLength: [3, 'Name must be at least 3 characters'],
21:     maxLength: [20, 'Name must be less than 20 characters'],
22:   },
23:   email: {
24:     type: String,
25:     required: [true, 'Please provide email'],
26:     match: [
27:       /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
28:       'Please provide valid email',
29:     ],
30:     unique: true,
31:   },
32:   role: {
33:     type: String,
34:     enum: ['applicant', 'admin'],
35:     default: 'applicant',
36:   },
37:   password: {
38:     type: String,
39:     required: [true, 'Please provide password'],
40:     minLength: [8, 'Password must be at least 8 characters'],
41:   },
42: });
43: 
44: UserSchema.pre('save', async function (): Promise<void> {
45:   const isAdmin = process.env.ADMIN_ACCOUNTS?.split(',').includes(this.email);
46:   if (isAdmin) this.role = 'admin';
47:   this.password = await bcrypt.hash(this.password, 10);
48: });
49: 
50: UserSchema.methods._generateJWT = function (
51:   secret: jwt.Secret,
52:   lifetime: jwt.SignOptions['expiresIn']
53: ): string {
54:   return jwt.sign(
55:     {
56:       userId: this._id,
57:       email: this.email,
58:       username: this.name,
59:       role: this.role,
60:     },
61:     secret,
62:     {
63:       expiresIn: lifetime,
64:     }
65:   );
66: };
67: 
68: UserSchema.methods.generateAccessToken = function (): string {
69:   return this._generateJWT(
70:     process.env.JWT_ACCESS_SECRET,
71:     process.env.JWT_ACCESS_LIFETIME
72:   );
73: };
74: 
75: UserSchema.methods.generateRefreshToken = function (): string {
76:   return this._generateJWT(
77:     process.env.JWT_REFRESH_SECRET,
78:     process.env.JWT_REFRESH_LIFETIME
79:   );
80: };
81: 
82: UserSchema.methods.createJWT = function (): {
83:   accessToken: string;
84:   refreshToken: string;
85: } {
86:   return {
87:     accessToken: this.generateAccessToken(),
88:     refreshToken: this.generateRefreshToken(),
89:   };
90: };
91: 
92: UserSchema.methods.comparePassword = async function (
93:   userProvidedPassword: string
94: ): Promise<boolean> {
95:   const isMatch = await bcrypt.compare(userProvidedPassword, this.password);
96:   return isMatch;
97: };
98: export default mongoose.model('User', UserSchema);
```

## File: frontend/src/app/store.ts
```typescript
 1: import { configureStore } from '@reduxjs/toolkit';
 2: import authReducer from '../features/auth/authSlice';
 3: import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
 4: import loadingReducer from '../features/loading/loadingSlice';
 5: import jobReducer from '../features/job/jobSlice';
 6: import uiReducer from '../features/ui/uiSlice';
 7: 
 8: export const store = configureStore({
 9:   reducer: {
10:     auth: authReducer,
11:     loading: loadingReducer,
12:     job: jobReducer,
13:     ui: uiReducer,
14:   },
15: });
16: 
17: export type RootState = ReturnType<typeof store.getState>;
18: type AppDispatch = typeof store.dispatch;
19: 
20: export const useAppDispatch = () => useDispatch<AppDispatch>();
21: export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

## File: frontend/src/layout/AppLayout.tsx
```typescript
 1: import { ReactNode, Suspense } from 'react';
 2: import Header from '@/components/Header';
 3: import Loading from '@/components/Loading';
 4: const AppLayout = ({ children }: { children: ReactNode }) => {
 5:   return (
 6:     <>
 7:       <Header />
 8:       <div className=' bg-white dark:bg-gray-700 min-h-screen flex justify-center overflow-x-hidden overflow-y-scroll'>
 9:         <div className='md:w-[60%] w-full mt-[100px] sm:mx-[20px] dark:text-white overflow-hidden'>
10:           <Suspense fallback={<Loading />}>{children}</Suspense>
11:         </div>
12:       </div>
13:     </>
14:   );
15: };
16: 
17: export default AppLayout;
```

## File: frontend/src/pages/Account.tsx
```typescript
 1: import { useNavigate } from 'react-router-dom';
 2: import { Suspense } from 'react';
 3: import { useAppSelector, useAppDispatch } from '../app/store';
 4: import { RiArrowLeftLine } from '@remixicon/react';
 5: import { setActiveView } from '@/features/ui/uiSlice';
 6: import Loading from '../components/Loading';
 7: import AccountInfoCard from '../components/account/AccountInfoCard';
 8: import ChangePasswordCard from '../components/account/ChangePasswordCard';
 9: 
10: const Account = () => {
11:   const navigate = useNavigate();
12:   const dispatch = useAppDispatch();
13:   const { role } = useAppSelector((state) => state.auth);
14:   const handleNavigate = () => {
15:     switch (role) {
16:       case 'admin':
17:         navigate('/admin/dashboard');
18:         break;
19:       case 'applicant':
20:         navigate('/user/dashboard');
21:         break;
22:     }
23:     dispatch(setActiveView('dashboard'));
24:   };
25:   return (
26:     <>
27:       <div className='flex justify-between'>
28:         <h1 className='text-2xl font-bold'>Account</h1>
29:         <button
30:           className='dark:text-white text-black px-3 py-1 rounded-md inline-flex items-center gap-1'
31:           onClick={handleNavigate}
32:         >
33:           <RiArrowLeftLine />
34:           Back
35:         </button>
36:       </div>
37:       <hr />
38:       <AccountInfoCard />
39:       <ChangePasswordCard />
40:     </>
41:   );
42: };
43: 
44: export default Account;
```

## File: frontend/vite.config.js
```javascript
 1: import { defineConfig } from 'vite';
 2: import react from '@vitejs/plugin-react';
 3: import { fileURLToPath } from 'url';
 4: import { dirname } from 'path';
 5: import path from 'path';
 6: import tailwindcss from '@tailwindcss/vite';
 7: 
 8: const __filename = fileURLToPath(import.meta.url);
 9: const __dirname = dirname(__filename);
10: 
11: // https://vite.dev/config/
12: export default defineConfig({
13:   plugins: [react(), tailwindcss()],
14:   server: {
15:     proxy: {
16:       '/api': {
17:         target: 'http://localhost:3000',
18:         changeOrigin: true,
19:         secure: false,
20:       },
21:     },
22:   },
23:   build: {
24:     outDir: '../frontend/dist',
25:     emptyOutDir: true,
26:   },
27:   resolve: {
28:     alias: {
29:       '@': path.resolve(__dirname, './src'),
30:     },
31:   },
32: });
```

## File: frontend/src/pages/Home.tsx
```typescript
 1: import React from 'react';
 2: import { Link } from 'react-router-dom';
 3: import Header from '../components/Header';
 4: 
 5: const Home = () => {
 6:   return (
 7:     <div className='min-h-screen flex flex-col bg-white dark:bg-gray-600'>
 8:       <Header />
 9:       <div className='flex-1 flex flex-col md:flex-row items-center justify-center p-8 gap-8'>
10:         <div className='text-lg text-gray-600 dark:text-white max-w-2xl md:h-[25vh] flex items-center'>
11:           <div className='flex flex-col'>
12:             <h1 className='text-4xl font-bold text-gray-900 dark:text-white text-center'>
13:               Welcome to Job API
14:             </h1>
15:             <p className='text-lg text-gray-600 dark:text-white text-center'>
16:               A web application that allows you to record and manage your job
17:               applications.
18:             </p>
19:           </div>
20:         </div>
21: 
22:         <div className='flex flex-col justify-center space-y-4 w-full max-w-xs md:h-[25vh]'>
23:           <Link
24:             to='/login'
25:             className='w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-center'
26:           >
27:             Login
28:           </Link>
29:           <Link
30:             to='/register'
31:             className='w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-blue-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-center'
32:           >
33:             Create Account
34:           </Link>
35:         </div>
36:       </div>
37:     </div>
38:   );
39: };
40: 
41: export default Home;
```

## File: backend/app.ts
```typescript
 1: import dotenv from 'dotenv';
 2: dotenv.config();
 3: import express from 'express';
 4: const app = express();
 5: import path from 'path';
 6: import cookieParser from 'cookie-parser';
 7: import { fileURLToPath } from 'url';
 8: 
 9: const __filename = fileURLToPath(import.meta.url);
10: const __dirname = path.dirname(__filename);
11: 
12: //security packages
13: import helmet from 'helmet';
14: import cors from 'cors';
15: import rateLimiter from 'express-rate-limit';
16: // connectDB
17: import connectDB from './db/connect.js';
18: 
19: import adminUser from './middleware/adminUser.js';
20: import authMiddleware from './middleware/authenticated.js';
21: import expressSanitizer from './middleware/expressSanitizer.js';
22: 
23: // routers
24: import authRouter from './routes/auth.js';
25: import jobRouter from './routes/jobs.js';
26: import adminRouter from './routes/adminDashboard.js';
27: import passwordRouter from './routes/password.js';
28: 
29: // error handler
30: import notFoundMiddleware from './middleware/not-found.js';
31: import errorHandlerMiddleware from './middleware/error-handler.js';
32: 
33: // extra packages
34: app.set('trust proxy', 1);
35: // app.use(
36: //   rateLimiter({
37: //     windowMs: 15 * 60 * 1000, // 15 minutes
38: //     max: 100, // limit each IP to 100 requests per windowMs
39: //   })
40: // );
41: app.use(express.json());
42: app.use(cookieParser());
43: app.use(helmet());
44: 
45: // Enable CORS for development
46: app.use(
47:   cors({
48:     origin: 'http://localhost:5173',
49:     credentials: true,
50:   })
51: );
52: 
53: // Serve frontend in production
54: if (process.env.NODE_ENV === 'production') {
55:   // Serve static files from the React app
56:   app.use(express.static(path.join(__dirname, '../frontend/dist')));
57: 
58:   // Handle React routing, return all requests to React's index.html
59:   app.get(/^(?!\/api\/).*/, (req, res) => {
60:     res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
61:   });
62: }
63: 
64: app.use('/api/v1/admin', authMiddleware, adminUser, adminRouter);
65: // API routes
66: app.use('/api/v1/auth', expressSanitizer(), authRouter);
67: app.use('/api/v1/password', authMiddleware, expressSanitizer(), passwordRouter);
68: app.use('/api/v1/jobs', authMiddleware, expressSanitizer(), jobRouter);
69: app.use(/^(?!\/api\/).*/, notFoundMiddleware);
70: 
71: // Error handling
72: app.use(errorHandlerMiddleware);
73: 
74: export default app;
```

## File: backend/controllers/auth.ts
```typescript
 1: import User from '../models/User.js';
 2: import { BadRequestError, UnauthenticatedError } from '../errors/index.js';
 3: import setTokenCookie from '../utils/auth.js';
 4: import { StatusCodes } from 'http-status-codes';
 5: import jwt, { JwtPayload } from 'jsonwebtoken';
 6: import { Request, Response } from 'express';
 7: 
 8: interface UserJwtPayload extends JwtPayload {
 9:   userId: string;
10:   email: string;
11:   username: string;
12:   role: string;
13: }
14: 
15: const login = async (req: Request, res: Response) => {
16:   const { email, password } = req.body;
17:   if (!email || !password)
18:     throw new BadRequestError('Please provide the email and password');
19:   const user = await User.findOne({ email });
20:   if (!user) throw new UnauthenticatedError('Invalid credentials');
21: 
22:   const isMatch = await user.comparePassword(password);
23:   if (!isMatch) throw new UnauthenticatedError('Invalide credentials');
24:   const { accessToken, refreshToken } = user.createJWT();
25:   setTokenCookie(res, refreshToken);
26:   res.status(StatusCodes.OK).json({
27:     userid: user._id,
28:     email: user.email,
29:     username: user.name,
30:     role: user.role,
31:     accessToken,
32:   });
33: };
34: const logout = async (req: Request, res: Response) => {
35:   res.clearCookie('resToken');
36:   res.status(StatusCodes.OK).json({ message: 'User logged out' });
37: };
38: 
39: const register = async (req: Request, res: Response) => {
40:   const user = await User.create(req.body);
41:   const { accessToken, refreshToken } = user.createJWT();
42:   setTokenCookie(res, refreshToken);
43:   res.status(StatusCodes.CREATED).json({
44:     userid: user._id,
45:     email: user.email,
46:     username: user.name,
47:     role: user.role,
48:     accessToken,
49:   });
50: };
51: 
52: const refreshToken = async (req: Request, res: Response) => {
53:   const { resToken } = req.cookies;
54:   console.log(resToken);
55:   if (!resToken) throw new UnauthenticatedError('Authentication invalid');
56:   try {
57:     const secret = process.env.JWT_REFRESH_SECRET;
58:     if (!secret) throw new UnauthenticatedError('Authentication invalid');
59:     const decode = jwt.verify(resToken, secret) as UserJwtPayload;
60:     const user = await User.findOne({ _id: decode.userId });
61:     if (!user) return;
62:     const accessToken = user.generateAccessToken();
63:     res.status(StatusCodes.OK).json({
64:       userid: user._id,
65:       email: user.email,
66:       username: user.name,
67:       role: user.role,
68:       accessToken,
69:     });
70:   } catch (error) {
71:     console.log(error);
72:     throw new UnauthenticatedError('Authentication invalid');
73:   }
74: };
75: export { login, register, logout, refreshToken };
```

## File: frontend/package.json
```json
 1: {
 2:   "name": "frontend",
 3:   "private": true,
 4:   "version": "0.0.0",
 5:   "type": "module",
 6:   "scripts": {
 7:     "dev": "vite",
 8:     "build": "vite build",
 9:     "lint": "eslint .",
10:     "preview": "vite preview"
11:   },
12:   "dependencies": {
13:     "@reduxjs/toolkit": "^2.9.0",
14:     "@remixicon/react": "^4.6.0",
15:     "@tailwindcss/vite": "^4.1.12",
16:     "axios": "^1.11.0",
17:     "react": "^19.1.1",
18:     "react-dom": "^19.1.1",
19:     "react-hot-toast": "^2.6.0",
20:     "react-redux": "^9.2.0",
21:     "react-router-dom": "^7.8.2",
22:     "socket.io-client": "^4.8.1",
23:     "tailwindcss": "^4.1.12"
24:   },
25:   "devDependencies": {
26:     "@eslint/js": "^9.33.0",
27:     "@types/react": "^19.1.10",
28:     "@types/react-dom": "^19.1.7",
29:     "@vitejs/plugin-react": "^5.0.0",
30:     "eslint": "^9.33.0",
31:     "eslint-plugin-react-hooks": "^5.2.0",
32:     "eslint-plugin-react-refresh": "^0.4.20",
33:     "globals": "^16.3.0",
34:     "vite": "^7.1.2"
35:   }
36: }
```

## File: frontend/src/components/JobCard.tsx
```typescript
 1: import React, { memo } from 'react';
 2: 
 3: export interface JobInfo {
 4:   _id: string;
 5:   company: string;
 6:   position: string;
 7:   status: string;
 8:   createdBy: string;
 9:   createdAt: string;
10:   updatedAt: string;
11:   __v: number;
12: }
13: 
14: export interface JobCardProps extends JobInfo {
15:   onUpdate: (Job: JobInfo) => void;
16:   onDelete: (Job: JobInfo) => void;
17: }
18: const JobCard = ({
19:   _id,
20:   company,
21:   position,
22:   status,
23:   createdBy,
24:   createdAt,
25:   updatedAt,
26:   __v,
27:   onUpdate,
28:   onDelete,
29: }: JobCardProps) => {
30:   const jobInfo = {
31:     _id,
32:     company,
33:     position,
34:     status,
35:     createdBy,
36:     createdAt,
37:     updatedAt,
38:     __v,
39:   };
40:   return (
41:     <div className='bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 grid md:grid-cols-[2fr_2fr_auto] grid-cols-1 gap-4'>
42:       <div>
43:         <h2 className='text-xl font-bold mb-2 border-b'>{position}</h2>
44:         <p className='text-gray-600 dark:text-white mb-2'>{company}</p>
45:       </div>
46:       <div>
47:         <p className='text-gray-600 dark:text-white mb-2'>
48:           Status:{' '}
49:           <span
50:             className={`text-white p-1 rounded-2xl ${
51:               status === 'pending'
52:                 ? 'bg-gray-500'
53:                 : status === 'interview'
54:                 ? 'bg-blue-700'
55:                 : 'bg-red-500'
56:             }`}
57:           >
58:             {status}
59:           </span>
60:         </p>
61:         <p className='text-gray-600 mb-2'>
62:           Created: {new Date(createdAt).toLocaleString()}
63:         </p>
64:         <p className='text-gray-600 mb-2'>
65:           Updated: {new Date(updatedAt).toLocaleString()}
66:         </p>
67:       </div>
68:       <div className='flex flex-col gap-2 justify-center'>
69:         <button
70:           onClick={() => onUpdate(jobInfo)}
71:           className='bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600'
72:         >
73:           Update
74:         </button>
75:         <button
76:           onClick={() => onDelete(jobInfo)}
77:           className='bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600'
78:         >
79:           Delete
80:         </button>
81:       </div>
82:     </div>
83:   );
84: };
85: 
86: export default memo(JobCard);
```

## File: frontend/src/features/auth/authSlice.ts
```typescript
 1: import { createSlice } from '@reduxjs/toolkit';
 2: import authAPI from './authAPI';
 3: 
 4: interface AuthState {
 5:   userid: string | null;
 6:   email: string | null;
 7:   user: string | null;
 8:   role: string | null;
 9:   accessToken: string;
10:   isLoading: boolean;
11:   error: string | null;
12:   registerError: string | null;
13: }
14: 
15: const initialState: AuthState = {
16:   userid: null,
17:   email: null,
18:   user: null,
19:   role: null,
20:   accessToken: '',
21:   isLoading: false,
22:   registerError: null,
23:   error: null,
24: };
25: 
26: const authSlice = createSlice({
27:   name: 'auth',
28:   initialState,
29:   reducers: {},
30:   extraReducers: (builder) => {
31:     builder
32:       .addCase(authAPI.login.pending, (state) => {
33:         state.isLoading = true;
34:         state.error = null;
35:       })
36:       .addCase(authAPI.login.fulfilled, (state, action) => {
37:         state.isLoading = false;
38:         state.userid = action.payload.userid;
39:         state.email = action.payload.email;
40:         state.user = action.payload.username;
41:         state.role = action.payload.role;
42:         state.accessToken = action.payload.accessToken;
43:       })
44:       .addCase(authAPI.login.rejected, (state, action) => {
45:         state.isLoading = false;
46:         state.error = action.payload as string;
47:       })
48: 
49:       // Logout
50:       .addCase(authAPI.logout.fulfilled, (state) => {
51:         state.user = null;
52:         state.accessToken = '';
53:       })
54: 
55:       // Register
56:       .addCase(authAPI.register.pending, (state) => {
57:         state.isLoading = true;
58:         state.registerError = null;
59:       })
60:       .addCase(authAPI.register.fulfilled, (state, action) => {
61:         state.isLoading = false;
62:         state.userid = action.payload.userid;
63:         state.email = action.payload.email;
64:         state.user = action.payload.username;
65:         state.role = action.payload.role;
66:         state.accessToken = action.payload.accessToken;
67:       })
68:       .addCase(authAPI.register.rejected, (state, action) => {
69:         state.isLoading = false;
70:         state.registerError = action.payload as string;
71:       })
72: 
73:       // Refresh token
74:       .addCase(authAPI.refreshToken.fulfilled, (state, action) => {
75:         state.userid = action.payload.userid;
76:         state.email = action.payload.email;
77:         state.user = action.payload.username;
78:         state.role = action.payload.role;
79:         state.accessToken = action.payload.accessToken;
80:       });
81:   },
82: });
83: 
84: export default authSlice.reducer;
```

## File: frontend/src/pages/Register.tsx
```typescript
  1: import React, { useState } from 'react';
  2: import { Link } from 'react-router-dom';
  3: import AuthFormContainer from '../layout/AuthFormLayout';
  4: import { useNavigate } from 'react-router-dom';
  5: import authAPI from '../features/auth/authAPI';
  6: import { useAppDispatch, useAppSelector } from '../app/store';
  7: import Header from '../components/Header';
  8: import navigateToDashboard from '../utils/navigateToDashboard';
  9: 
 10: const Register = () => {
 11:   const dispatch = useAppDispatch();
 12:   const role = useAppSelector((state) => state.auth.role);
 13:   const navigate = useNavigate();
 14:   const { registerError } = useAppSelector((state) => state.auth);
 15:   const [formData, setformData] = useState({
 16:     name: '',
 17:     email: '',
 18:     password: '',
 19:     confirmPassword: '',
 20:   });
 21: 
 22:   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
 23:     setformData({
 24:       ...formData,
 25:       [e.target.name]: e.target.value,
 26:     });
 27:   };
 28: 
 29:   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
 30:     e.preventDefault();
 31:     const resultAction = await dispatch(authAPI.register(formData));
 32:     if (authAPI.register.fulfilled.match(resultAction)) {
 33:       navigate(navigateToDashboard(role || ''));
 34:     }
 35:   };
 36: 
 37:   return (
 38:     <>
 39:       <Header />
 40:       <AuthFormContainer title='Register'>
 41:         <form
 42:           className='mt-8 space-y-6'
 43:           onSubmit={handleSubmit}
 44:         >
 45:           <div className='rounded-md shadow-sm -space-y-px'>
 46:             <div>
 47:               <label
 48:                 htmlFor='name'
 49:                 className='sr-only'
 50:               >
 51:                 Full Name
 52:               </label>
 53:               <input
 54:                 id='name'
 55:                 name='name'
 56:                 type='text'
 57:                 required
 58:                 className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm'
 59:                 placeholder='Full Name'
 60:                 value={formData.name}
 61:                 onChange={handleChange}
 62:               />
 63:             </div>
 64:             <div>
 65:               <label
 66:                 htmlFor='email'
 67:                 className='sr-only'
 68:               >
 69:                 Email address
 70:               </label>
 71:               <input
 72:                 id='email'
 73:                 name='email'
 74:                 type='email'
 75:                 required
 76:                 className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm'
 77:                 placeholder='Email address'
 78:                 value={formData.email}
 79:                 onChange={handleChange}
 80:               />
 81:             </div>
 82:             <div>
 83:               <label
 84:                 htmlFor='password'
 85:                 className='sr-only'
 86:               >
 87:                 Password
 88:               </label>
 89:               <input
 90:                 id='password'
 91:                 name='password'
 92:                 type='password'
 93:                 required
 94:                 className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm'
 95:                 placeholder='Password'
 96:                 value={formData.password}
 97:                 onChange={handleChange}
 98:               />
 99:             </div>
100:             <div>
101:               <label
102:                 htmlFor='confirmPassword'
103:                 className='sr-only'
104:               >
105:                 Confirm Password
106:               </label>
107:               <input
108:                 id='confirmPassword'
109:                 name='confirmPassword'
110:                 type='password'
111:                 required
112:                 className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm'
113:                 placeholder='Confirm Password'
114:                 value={formData.confirmPassword}
115:                 onChange={handleChange}
116:               />
117:             </div>
118:           </div>
119: 
120:           <div>
121:             <button
122:               type='submit'
123:               className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
124:             >
125:               Create Account
126:             </button>
127:           </div>
128:           {registerError && (
129:             <div className='mt-2 text-sm text-red-600'>{registerError}</div>
130:           )}
131:           <div className='text-sm text-center'>
132:             Already have an account?{' '}
133:             <Link
134:               to='/login'
135:               className='font-medium text-blue-600 hover:text-blue-500'
136:             >
137:               Sign in
138:             </Link>
139:           </div>
140:         </form>
141:       </AuthFormContainer>
142:     </>
143:   );
144: };
145: 
146: export default Register;
```

## File: frontend/src/features/auth/authAPI.ts
```typescript
  1: import { createAsyncThunk } from '@reduxjs/toolkit';
  2: import axios from 'axios';
  3: axios.defaults.withCredentials = true;
  4: import { setLoading } from '../loading/loadingSlice';
  5: 
  6: interface Credentials {
  7:   email: string;
  8:   password: string;
  9: }
 10: 
 11: interface RegisterCredential extends Credentials {
 12:   name: string;
 13: }
 14: 
 15: interface ResponseAuthData {
 16:   userid: string;
 17:   email: string;
 18:   username: string;
 19:   role: string;
 20:   accessToken: string;
 21: }
 22: 
 23: const authAPI = {
 24:   login: createAsyncThunk(
 25:     'auth/login',
 26:     async (credentials: Credentials, thunkAPI) => {
 27:       try {
 28:         const dispatchPayload = { key: 'login', loading: true, isGlobal: true };
 29:         thunkAPI.dispatch(setLoading(dispatchPayload));
 30:         const { data } = await axios.post<ResponseAuthData>(
 31:           '/api/v1/auth/login',
 32:           credentials
 33:         );
 34:         thunkAPI.dispatch(setLoading({ ...dispatchPayload, loading: false }));
 35:         return data;
 36:       } catch (error: any) {
 37:         return thunkAPI.rejectWithValue(
 38:           error.response?.data?.message || 'Login failed'
 39:         );
 40:       }
 41:     }
 42:   ),
 43:   logout: createAsyncThunk('auth/logout', async (_, thunkAPI) => {
 44:     try {
 45:       const dispatchPayload = { key: 'logout', loading: true, isGlobal: true };
 46:       thunkAPI.dispatch(setLoading(dispatchPayload));
 47:       await axios.post('/api/v1/auth/logout');
 48:       thunkAPI.dispatch(setLoading({ ...dispatchPayload, loading: false }));
 49:       return null;
 50:     } catch (error: any) {
 51:       return thunkAPI.rejectWithValue(
 52:         error.response?.data?.message || 'Logout failed'
 53:       );
 54:     }
 55:   }),
 56:   register: createAsyncThunk(
 57:     'auth/register',
 58:     async (credentials: RegisterCredential, thunkAPI) => {
 59:       try {
 60:         const dispatchPayload = {
 61:           key: 'register',
 62:           loading: true,
 63:           isGlobal: true,
 64:         };
 65:         thunkAPI.dispatch(setLoading(dispatchPayload));
 66:         const { data } = await axios.post<ResponseAuthData>(
 67:           '/api/v1/auth/register',
 68:           credentials
 69:         );
 70:         thunkAPI.dispatch(setLoading({ ...dispatchPayload, loading: false }));
 71:         return data;
 72:       } catch (err: any) {
 73:         return thunkAPI.rejectWithValue(
 74:           err.response?.data?.message || 'Register failed'
 75:         );
 76:       }
 77:     }
 78:   ),
 79:   refreshToken: createAsyncThunk('auth/refreshToken', async (_, thunkAPI) => {
 80:     const dispatchPayload = {
 81:       key: 'refreshToken',
 82:       loading: true,
 83:       isGlobal: true,
 84:     };
 85:     try {
 86:       thunkAPI.dispatch(setLoading(dispatchPayload));
 87:       const { data } = await axios.get<ResponseAuthData>(
 88:         '/api/v1/auth/refresh-token'
 89:       );
 90:       thunkAPI.dispatch(setLoading({ ...dispatchPayload, loading: false }));
 91:       return data;
 92:     } catch (error: any) {
 93:       return thunkAPI.rejectWithValue(
 94:         error.response?.data?.message || 'Refresh token failed'
 95:       );
 96:     } finally {
 97:       thunkAPI.dispatch(setLoading({ ...dispatchPayload, loading: false }));
 98:     }
 99:   }),
100: };
101: 
102: export default authAPI;
```

## File: frontend/src/pages/Login.tsx
```typescript
  1: import { useState } from 'react';
  2: import AuthFormContainer from '../layout/AuthFormLayout';
  3: import { Link, useNavigate } from 'react-router-dom';
  4: import authAPI from '../features/auth/authAPI';
  5: import { useAppDispatch, useAppSelector } from '../app/store';
  6: import Header from '../components/Header';
  7: import navigateToDashboard from '../utils/navigateToDashboard';
  8: 
  9: const Login = () => {
 10:   const dispatch = useAppDispatch();
 11:   const navigate = useNavigate();
 12:   const role = useAppSelector((state) => state.auth.role);
 13:   const [formData, setformData] = useState({
 14:     email: '',
 15:     password: '',
 16:   });
 17: 
 18:   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
 19:     setformData({
 20:       ...formData,
 21:       [e.target.name]: e.target.value,
 22:     });
 23:   };
 24: 
 25:   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
 26:     e.preventDefault();
 27:     const resultAction = await dispatch(authAPI.login(formData));
 28:     if (authAPI.login.fulfilled.match(resultAction)) {
 29:       navigate(navigateToDashboard(role || ''));
 30:     }
 31:   };
 32: 
 33:   return (
 34:     <>
 35:       <Header />
 36:       <AuthFormContainer title='Login'>
 37:         <form
 38:           className='mt-8 space-y-6'
 39:           onSubmit={handleSubmit}
 40:         >
 41:           <div className='rounded-md shadow-sm space-y-px'>
 42:             <div>
 43:               <label
 44:                 htmlFor='email'
 45:                 className='sr-only'
 46:               >
 47:                 Email address
 48:               </label>
 49:               <input
 50:                 id='email'
 51:                 name='email'
 52:                 type='email'
 53:                 required
 54:                 className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:border-gray-600 dark:placeholder-gray-400 dark:text-white'
 55:                 placeholder='Email address'
 56:                 value={formData.email}
 57:                 onChange={handleChange}
 58:               />
 59:             </div>
 60:             <div>
 61:               <label
 62:                 htmlFor='password'
 63:                 className='sr-only'
 64:               >
 65:                 Password
 66:               </label>
 67:               <input
 68:                 id='password'
 69:                 name='password'
 70:                 type='password'
 71:                 required
 72:                 className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:border-gray-600 dark:placeholder-gray-400 dark:text-white'
 73:                 placeholder='Password'
 74:                 value={formData.password}
 75:                 onChange={handleChange}
 76:               />
 77:             </div>
 78:           </div>
 79: 
 80:           <div className='flex items-center justify-between'>
 81:             <div className='flex items-center'>
 82:               <input
 83:                 id='remember-me'
 84:                 name='remember-me'
 85:                 type='checkbox'
 86:                 className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
 87:               />
 88:               <label
 89:                 htmlFor='remember-me'
 90:                 className='ml-2 block text-sm text-gray-900 dark:text-white'
 91:               >
 92:                 Remember me
 93:               </label>
 94:             </div>
 95: 
 96:             <div className='text-sm'>
 97:               <a
 98:                 href='#'
 99:                 className='font-medium text-blue-600 hover:text-blue-500 '
100:               >
101:                 Forgot your password?
102:               </a>
103:             </div>
104:           </div>
105: 
106:           <div>
107:             <button
108:               type='submit'
109:               className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
110:             >
111:               Sign in
112:             </button>
113:           </div>
114: 
115:           <div className='text-sm text-center dark:text-white'>
116:             Don't have an account?{' '}
117:             <Link
118:               to='/register'
119:               className='font-medium text-blue-600 hover:text-blue-500'
120:             >
121:               Sign up
122:             </Link>
123:           </div>
124:         </form>
125:       </AuthFormContainer>
126:     </>
127:   );
128: };
129: 
130: export default Login;
```

## File: package.json
```json
 1: {
 2:   "name": "job-api",
 3:   "version": "1.0.0",
 4:   "description": "",
 5:   "main": "server.js",
 6:   "type": "module",
 7:   "scripts": {
 8:     "build:backend": "tsc -p backend/tsconfig.json",
 9:     "start": "node backend/dist/server.js",
10:     "server": "nodemon --watch backend --ext ts --exec \"npm run build:backend && node backend/dist/server.js\"",
11:     "client": "cd frontend && npm run dev",
12:     "dev": "concurrently \"npm run server\" \"npm run client\"",
13:     "build": "npm run build:backend && cd frontend && npm run build",
14:     "preview": "cd frontend && npm run preview"
15:   },
16:   "author": "Reanz Arthur",
17:   "license": "ISC",
18:   "dependencies": {
19:     "@types/cookie-parser": "^1.4.9",
20:     "@types/cors": "^2.8.19",
21:     "@types/express": "^5.0.3",
22:     "@types/jsonwebtoken": "^9.0.10",
23:     "@types/node": "^24.5.0",
24:     "@types/sanitize-html": "^2.16.0",
25:     "bcryptjs": "^3.0.2",
26:     "cookie-parser": "^1.4.7",
27:     "cors": "^2.8.5",
28:     "dotenv": "^17.2.1",
29:     "express": "^5.1.0",
30:     "express-rate-limit": "^8.0.1",
31:     "helmet": "^8.1.0",
32:     "http-status-codes": "^2.3.0",
33:     "jsonwebtoken": "^9.0.2",
34:     "mongoose": "^8.18.0",
35:     "sanitize-html": "^2.17.0",
36:     "socket.io": "^4.8.1"
37:   },
38:   "devDependencies": {
39:     "concurrently": "^9.2.1",
40:     "nodemon": "^3.1.10",
41:     "typescript": "^5.x.x"
42:   },
43:   "engines": {
44:     "node": "22.x"
45:   }
46: }
```

## File: frontend/src/components/Header.tsx
```typescript
 1: import { memo } from 'react';
 2: import ActiveAccount from './account/ActiveAccount';
 3: import { useAppSelector } from '../app/store';
 4: import DarkModeToggle from './DarkModeToggle';
 5: import NotificationIcon from './notification/notificationIcon';
 6: const Header = () => {
 7:   const { accessToken, user, role } = useAppSelector((state) => state.auth);
 8:   return (
 9:     <div className='bg-sky-500 w-full h-auto min-h-[70px] flex items-center justify-between px-3 py-2 fixed top-0 z-50'>
10:       <h1 className='text-4xl font-bold text-white'>Job API</h1>
11:       <div
12:         className={`h-full w-auto ${
13:           accessToken && 'min-w-[150px]'
14:         } flex items-center gap-2`}
15:       >
16:         <DarkModeToggle />
17:         {accessToken && (
18:           <>
19:             <NotificationIcon />
20:             <ActiveAccount
21:               user={user || 'Guest'}
22:               role={role || 'Guest'}
23:             />
24:           </>
25:         )}
26:       </div>
27:     </div>
28:   );
29: };
30: 
31: export default memo(Header);
```

## File: frontend/src/App.tsx
```typescript
 1: import { useEffect } from 'react';
 2: import { BrowserRouter as Router, useLocation } from 'react-router-dom';
 3: import './App.css';
 4: import { Provider } from 'react-redux';
 5: import { store } from './app/store';
 6: import { Toaster } from 'react-hot-toast';
 7: import AppRouter from './routes/AppRouter';
 8: 
 9: const titles: Record<string, string> = {
10:   '/': 'Landing Page',
11:   '/login': 'Login',
12:   '/register': 'Register',
13:   '/user/dashboard': 'Dashboard',
14:   '/admin/dashboard': 'Admin Dashboard',
15:   '/account': 'Account',
16: };
17: 
18: const TitleManager = () => {
19:   const location = useLocation();
20:   useEffect(() => {
21:     document.title = titles[location.pathname] || 'Job API';
22:   }, [location]);
23: 
24:   return null;
25: };
26: 
27: const App = () => {
28:   return (
29:     <Router>
30:       <Provider store={store}>
31:         <TitleManager />
32:         <AppRouter />
33:         <Toaster />
34:       </Provider>
35:     </Router>
36:   );
37: };
38: 
39: export default App;
```
