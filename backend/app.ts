import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
const app = express();
import path from 'path';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { Server } from 'socket.io';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//security packages
import helmet from 'helmet';
import cors from 'cors';
import rateLimiter from 'express-rate-limit';
// connectDB
import connectDB from './db/connect.js';

import adminUser from './middleware/adminUser.js';
import authMiddleware from './middleware/authenticated.js';
import expressSanitizer from './middleware/expressSanitizer.js';

// routers
import authRouter from './routes/auth.js';
import jobRouter from './routes/jobs.js';
import adminRouter from './routes/adminDashboard.js';
import passwordRouter from './routes/password.js';

// error handler
import notFoundMiddleware from './middleware/not-found.js';
import errorHandlerMiddleware from './middleware/error-handler.js';

const onlineUsers = new Map();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  },
});

io.on('connection', (socket) => {
  socket.on('join', (userid) => {
    onlineUsers.set(userid, socket.id);
    io.emit('rt-user-count', onlineUsers.size);
  });
  socket.on('disconnect', () => {
    for (let [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
    io.emit('rt-user-count', onlineUsers.size);
  });
  socket.on('leave', (userid) => {
    onlineUsers.delete(userid);
    io.emit('rt-user-count', onlineUsers.size);
  });
});
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
app.use('/api/v1/auth', expressSanitizer(), authRouter);
app.use('/api/v1/password', authMiddleware, expressSanitizer(), passwordRouter);
app.use('/api/v1/jobs', authMiddleware, expressSanitizer(), jobRouter);
app.use(/^(?!\/api\/).*/, notFoundMiddleware);

// Error handling
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    const secret = process.env.MONGO_URI;
    if (!secret) throw new Error('Mongo URI not found');
    await connectDB(secret);
    server.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
