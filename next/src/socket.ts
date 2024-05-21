import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
// const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:3000';

const socketurl = process.env.SOCKET_URL || "http://localhost:8080"
export const socket = io(socketurl);