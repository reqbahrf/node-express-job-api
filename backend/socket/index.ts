import { Server as NodeServer } from 'node:http';
import { Server } from 'socket.io';

const onlineUsers = new Map();
let io: Server;

const initSocket = (server: NodeServer) => {
  io = new Server(server, {
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
      for (const [userId, socketId] of onlineUsers.entries()) {
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
};

export { initSocket, io };
