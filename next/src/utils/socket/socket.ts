import { socket } from "./io";

import { v4 } from "uuid";
import { redirect, useRouter } from "next/navigation";

const socketurl = process.env.SOCKET_URL || "http://localhost:8080";

interface dataprop{
  message : string;
  sid? : number;
  rid : number;
}

interface joinRoom{
  sid : number | string;
  rid : number | string;
}

export const sendMessage = (data: dataprop): void => {
  console.log("sent :", data);
  socket.emit("message", data);
};

export const joinRoom = (props:joinRoom) => {
  const roomId = v4()
    socket.emit("JOIN_ROOM" , {
      senderId : props.sid,
      receiverId : props.rid,
      roomId
    })
    redirect(`/chat/${roomId}`)
}

export const handleLeaveRoom = (data: { room : string }): void => {
console.log("User left room:", data.room);
};

export const customEventHandler = (data?: any): void => {
console.log("Received custom event:", data);
}
  