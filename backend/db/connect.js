import mongoose from 'mongoose';

const connectDB = (url) => {
  const options = {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    bufferCommands: false,
  };

  return mongoose.connect(url, options);
};

export default connectDB;
