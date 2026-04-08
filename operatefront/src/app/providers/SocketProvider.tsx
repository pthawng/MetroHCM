import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { processSocketPayload, processSnapshot, startBufferFlushLoop } from '../../features/realtime-tracking/socket/buffer';

// Socket setup
const rawUrl = import.meta.env.VITE_WEBSOCKET_URL || 'ws://localhost:3001';

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // 1. Initialize buffer flush loop for Canonical store
    startBufferFlushLoop();

    // 2. Connect to WebSocket
    // Split the base URL and the namespace correctly for Socket.io v4
    const baseHost = rawUrl.replace(/\/simulation$/, '');
    const socket: Socket = io(baseHost + '/simulation', {
      transports: ['websocket'],
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      autoConnect: true
    });

    socket.on('connect', () => {
      setIsConnected(true);
      console.log('✅ Connected to Command Center Socket');
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      console.warn('❌ Disconnected from Command Center Socket');
    });

    socket.on('connect_error', (error) => {
      console.error('⚠️ Socket Connection Error:', error.message);
    });

    socket.on('reconnect_attempt', (attempt) => {
      console.log(`📡 Socket Reconnecting... (Attempt ${attempt})`);
    });

    // 3. High-frequency Ingestion Stream (Elite Standard)
    socket.on('snapshot', (payload) => {
      processSnapshot(payload);
    });

    socket.on('train_telemetry', (payload) => {
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
