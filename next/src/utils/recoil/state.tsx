import { atom } from 'recoil';
import { Socket } from 'socket.io-client';

interface SocketIOClientEvents{
  someEvent: (data: any) => void;
}
export const socketState= atom<Socket | null>({
  key: 'socketState',
  default: null,
});
export const DialogState = atom({
  key: 'DialogState',
  default: false,
});
