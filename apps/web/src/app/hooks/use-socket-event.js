import { useEffect } from "react";
import { useSocket } from "@/app/hooks/use-socket";

export function useSocketEvent(event, callback) {
    const socket = useSocket();

    useEffect(() => {
        if (!socket) return;

        socket.on(event, callback);

        return () => {
            socket.off(event, callback);
        };
    }, [socket, event, callback]);
}
