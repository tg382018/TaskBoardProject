import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useAuthStore } from "@/app/store/auth.store";
import { env } from "@/app/config/env";

const SocketContext = createContext();

export function SocketProvider({ children }) {
    const [socket, setSocket] = useState(null);
    const socketRef = useRef(null);
    const { isAuthenticated } = useAuthStore();

    useEffect(() => {
        // Cleanup existing socket if not authenticated
        if (!isAuthenticated) {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
                setSocket(null);
            }
            return;
        }

        // Don't create a new socket if one already exists
        if (socketRef.current) {
            return;
        }

        const socketPath = env.SOCKET_URL || "/realtime";
        const newSocket = io(socketPath, {
            withCredentials: true, // Use cookies for auth instead of token
        });

        // Listen for OTP stub delivery (development/demo feature)
        newSocket.on("otp.stub.delivered", (data) => {
            console.log(
                "%c📧 1 New Notification on Stub Mail Service",
                "background: #4CAF50; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold;"
            );
            console.log(
                `%cYour code is: ${data.code}`,
                "color: #2196F3; font-size: 16px; font-weight: bold;"
            );
        });

        socketRef.current = newSocket;
        setSocket(newSocket);

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, [isAuthenticated]);

    return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
}

export const useSocket = () => useContext(SocketContext);
