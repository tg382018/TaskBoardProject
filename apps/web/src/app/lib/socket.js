/**
 * Socket.io client instance
 * Creates and exports a socket connection for use throughout the app
 */
import { io } from "socket.io-client";
import { env } from "@/app/config/env";

/**
 * Create socket instance with auth token
 * @param {string} token - JWT access token
 * @returns {Socket} Socket.io client instance
 */
export function createSocket(token) {
    const socketPath = env.SOCKET_URL || "/realtime";
    return io(socketPath, {
        auth: { token },
        autoConnect: false,
    });
}

/**
 * Default socket instance (without auth)
 * Note: For authenticated sockets, use SocketProvider or createSocket with token
 */
export const socket = io(env.SOCKET_URL || "/realtime", {
    autoConnect: false,
});

export default socket;
