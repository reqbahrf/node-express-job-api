import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
const app = express();
//security packages
import helmet from 'helmet';
import cors from 'cors';
import rateLimiter from 'express-rate-limit';
// connectDB
import connectDB from './db/connect.js';
import authMiddleware from './middleware/authenticated.js';

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
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);
app.use(express.json());
app.use(helmet());
app.use(cors());

// routes
app.get('/', (req, res) => {
  res.send('jobs api');
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', authMiddleware, jobRouter);

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
