import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { processSocketPayload, startBufferFlushLoop } from '../../features/realtime-tracking/socket/buffer';
import { metrics } from '../../shared/lib/metrics';

// Socket setup
const SOCKET_URL = import.meta.env.VITE_WEBSOCKET_URL || 'ws://localhost:3001';

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // 1. Initialize buffer flush loop for Canonical store
    startBufferFlushLoop();

    // 2. Connect to WebSocket
    const socket: Socket = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
      setIsConnected(true);
      console.log('✅ Connected to Command Center Socket');
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      console.warn('❌ Disconnected from Command Center Socket');
    });

    // 3. High-frequency Ingestion Stream
    socket.on('train_positions', (payload) => {
      processSocketPayload(payload);
    });

    // Clean up
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <>
      {/* Optional: We can provide socket instance via context if needed, but not strictly required for ingestion */}
      {children}
      {!isConnected && (
        <div style={{ position: 'fixed', top: 0, width: '100%', background: 'red', color: 'white', textAlign: 'center', zIndex: 9999 }}>
          Socket Disconnected - Trying to reconnect...
        </div>
      )}
    </>
  );
};
