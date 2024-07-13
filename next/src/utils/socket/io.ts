// "use client"
import { getSession } from 'next-auth/react';
import { io } from 'socket.io-client';
import { SocketMessage, messagesprop, socketmessageprop } from '../../utils/types/alltypes';
import { useRecoilState, useRecoilStateLoadable, useSetRecoilState } from 'recoil';
import { Messages, userDataState } from '../../utils/recoil/state';
import { useToast } from '../../components/ui/use-toast';

const socketurl = process.env.NEXT_PUBLIC_SOCKET_URL || "";

export const socket = io(socketurl, {
  autoConnect: false,
}); 

export async function connect(){
  console.log("rerender")
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
export const initSocket = ()=>{
  
    
}
