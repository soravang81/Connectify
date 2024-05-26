import { getSession } from 'next-auth/react';
import { io } from 'socket.io-client';

const socketurl = process.env.SOCKET_URL || "http://localhost:8080";
export const socket = io(socketurl, {
        autoConnect: false,
        reconnection : true
    });
export async function connect(){
  const session = await getSession()
    if(session?.user){
        socket.io.opts.query = {
          userId: session?.user.id.toString(),
        };
        if (!socket.connected) {
          socket.connect();
        }
      }
}
