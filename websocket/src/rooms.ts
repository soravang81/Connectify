import { Socket } from "socket.io";
import { io } from "./server";
import { v4 }  from "uuid";

export interface dataprop{
  event : string;
  msg : string;
  room? : string | string[];
  sender? : string;
  receiver? : string;
}
export const messageHandler = ( socket: Socket ,data :dataprop |string ): void => {
    console.log("Received message:", data);
    // io.emit(data.event, data.msg);   
    io.emit("message" , data) 
  };
  
export const joinRoomHandler = ( socket: Socket ,data :dataprop ): void => {
  if(data){
    const roomId = v4();
    socket.join(roomId)
  }
  console.log("User joined room:", data.room);
};

export const leaveRoomHandler = (socket: Socket, data: { room : string }): void => {
  socket.leave(data.room);
  console.log("User left room:", data.room);
};

export const customEventHandler = (socket: Socket, data?: any): void => {
  console.log("Received custom event:", data);
  // Handle custom event
};