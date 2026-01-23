import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuthStore } from "../../store/auth.store";

const SocketContext = createContext();

export function SocketProvider({ children }) {
    const [socket, setSocket] = useState(null);
    const { accessToken } = useAuthStore();

    useEffect(() => {
        if (!accessToken) {
            if (socket) {
                socket.disconnect();
                setSocket(null);
            }
            return;
        }

        const newSocket = io("/realtime", {
            auth: { token: accessToken },
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

        setSocket(newSocket);

        return () => newSocket.disconnect();
    }, [accessToken]);

    return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
}

export const useSocket = () => useContext(SocketContext);
