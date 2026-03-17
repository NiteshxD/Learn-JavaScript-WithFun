// =============================================================================
// Socket Context — Socket.io Connection Management
// =============================================================================
// Manages the WebSocket connection lifecycle. Provides the socket instance
// and connection status to all components.
//
// WHY A CONTEXT?
//   The socket must persist across page navigations and be accessible
//   from any component (lobby, quiz, results). Context ensures a single
//   connection instance is shared app-wide.
// =============================================================================

import { createContext, useContext, useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

// Socket.io server URL — uses env var or deployed backend
const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ||
  import.meta.env.VITE_API_URL?.replace("/api", "") ||
  "https://learn-javascript-withfun.onrender.com";

export const SocketProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    // Create socket connection
    const socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("🔌 Connected to server:", socket.id);
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("🔌 Disconnected from server");
      setIsConnected(false);
    });

    socket.on("connect_error", (err) => {
      console.error("🔌 Connection error:", err.message);
    });

    // Cleanup on unmount
    return () => {
      socket.removeAllListeners();
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  const value = {
    socket: socketRef.current,
    isConnected,
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

/**
 * Hook to access the socket instance and connection status
 */
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
