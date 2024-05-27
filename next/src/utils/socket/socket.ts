import { socket } from "./io";

const socketurl = process.env.SOCKET_URL || "http://localhost:8080";

export interface dataprop{
  event : string;
  msg : string;
  room? : string | string[];
  sender? : string;
  receiver? : string;
}
export const sendMessage = ( event :string , data: string): void => {
  console.log("sent :", data);
  socket.emit(event, data);    
};

export const handleJoinRoom = (data: {room : string}): void => {
console.log("User joined room:", data.room);
};

export const handleLeaveRoom = (data: { room : string }): void => {
console.log("User left room:", data.room);
};

export const customEventHandler = (data?: any): void => {
console.log("Received custom event:", data);
}
  