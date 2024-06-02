import { getSession } from 'next-auth/react';
import { io } from 'socket.io-client';

const socketurl = process.env.NEXT_PUBLIC_SOCKET_URL || "";

export const socket = io(socketurl, {
  autoConnect: false,
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
