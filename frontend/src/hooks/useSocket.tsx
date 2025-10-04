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
