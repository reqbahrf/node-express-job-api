import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
const app = express();
import path from 'path';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//security packages
import helmet from 'helmet';
import cors from 'cors';
import rateLimiter from 'express-rate-limit';
// connectDB
import connectDB from './db/connect.js';
import authMiddleware from './middleware/authenticated.js';
import expressSanitizer from './middleware/expressSanitizer.js';

// routers
import authRouter from './routes/auth.js';
import jobRouter from './routes/jobs.js';

// error handler
import notFoundMiddleware from './middleware/not-found.js';
import errorHandlerMiddleware from './middleware/error-handler.js';

// extra packages
app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);
app.use(express.json());
app.use(helmet());

// Enable CORS for development
if (process.env.NODE_ENV === 'development') {
  app.use(
    cors({
      origin: 'http://localhost:3000',
      credentials: true,
    })
  );
} else {
  app.use(cors());
}

// API routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', authMiddleware, expressSanitizer(), jobRouter);

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  // Serve static files from the React app
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  // Handle React routing, return all requests to React's index.html
  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
  });
}

// Error handling
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
