import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
const app = express();
import path from 'path';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//security packages
import helmet from 'helmet';
import cors from 'cors';

import adminUser from './middleware/adminUser.js';
import authMiddleware from './middleware/authenticated.js';
import expressSanitizer from './middleware/expressSanitizer.js';

// routers
import authRouter from './routes/auth.js';
import jobRouter from './routes/jobs.js';
import companyRouter from './routes/company.js';
import adminRouter from './routes/adminDashboard.js';
import passwordRouter from './routes/password.js';

// error handler
import notFoundMiddleware from './middleware/not-found.js';
import errorHandlerMiddleware from './middleware/error-handler.js';

// extra packages
app.set('trust proxy', 1);
// app.use(
//   rateLimiter({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 100, // limit each IP to 100 requests per windowMs
//   })
// );
app.use(express.json());
app.use(cookieParser());
app.use(helmet());

// Enable CORS for development
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  // Serve static files from the React app
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  // Handle React routing, return all requests to React's index.html
  app.get(/^(?!\/api\/).*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
  });
}

app.use('/api/v1/admin', authMiddleware, adminUser, adminRouter);
// API routes
app.use('/api/v1/auth', expressSanitizer, authRouter);
app.use('/api/v1/password', authMiddleware, expressSanitizer, passwordRouter);
app.use('/api/v1/jobs', authMiddleware, expressSanitizer, jobRouter);
app.use('/api/v1/company', authMiddleware, expressSanitizer, companyRouter);
app.use(/^(?!\/api\/).*/, notFoundMiddleware);

// Error handling
app.use(errorHandlerMiddleware);

export default app;
