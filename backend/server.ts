import { createServer } from 'http';
import app from './app.js';
import connectDB from './db/connect.js';
import { initSocket } from './socket/index.js';

const server = createServer(app);
initSocket(server);

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
