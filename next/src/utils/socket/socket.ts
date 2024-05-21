// "use client"
import { useEffect, useState } from "react";
import { RecoilState, useRecoilState, useSetRecoilState } from "recoil";
import { socketState } from "../recoil/state";
import { Socket, io } from "socket.io-client";
import { socket } from "@/src/socket";

const socketurl = process.env.SOCKET_URL || "http://localhost:8080";

export interface dataprop{
  event : string;
  msg : string;
  room? : string | string[];
  sender? : string;
  receiver? : string;
}
// export const sendMessage = (data :dataprop )=>{
//   socket.emit(data.event , data.msg)
// }
export const sendMessagz = ( event :string , data: string): void => {
  console.log("sent :", data);
  socket.emit(event, data);    
};

export const handleJoinRoom = (data: {room : string}): void => {
// socket.join(data.room);
console.log("User joined room:", data.room);
};

export const handleLeaveRoom = (data: { room : string }): void => {
// socket.leave(data.room);
console.log("User left room:", data.room);
};

export const customEventHandler = (data?: any): void => {
console.log("Received custom event:", data);
}
// Handle custom event
  