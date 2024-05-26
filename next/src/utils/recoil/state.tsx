import { atom } from 'recoil';
import { Socket, io } from 'socket.io-client';

const socketurl = process.env.SOCKET_URL || "http://localhost:8080";

interface SocketIOClientEvents{
  someEvent: (data: any) => void;
}
// export const socketState= atom<Socket | null>({
//   key: 'socketState',
//   default: io(socketurl, {
//     autoConnect: false,
//   }),
// });
export const DialogState = atom({
  key: 'DialogState',
  default: false,
});
