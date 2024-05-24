import { io } from 'socket.io-client';

const socketurl = process.env.SOCKET_URL || "http://localhost:8080";
export const socket = io(socketurl, {
        autoConnect: false,
    });
