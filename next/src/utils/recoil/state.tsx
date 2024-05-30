import { atom } from 'recoil';
import { Socket, io } from 'socket.io-client';

const socketurl = process.env.SOCKET_URL || "http://localhost:8080";


export const DialogState = atom({
  key: 'DialogState',
  default: false,
});
export const CurrentChatUserId = atom({
  key: 'CurrentChatUserId',
  default: "",
});
export const refetchFriends = atom({
  key: 'refetchFriends',
  default: false,
});
