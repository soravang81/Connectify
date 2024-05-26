import { Socket } from "socket.io"
import { Sockets } from "./user-socket";
import { io } from "./server";
import { v4 }  from "uuid";
import { getRequestdetails, getSocketId, getUserdetails } from "./lib/functions";


interface requests{
  // sender : string;
  senderId : number
  receiver : string;
}
interface dataprop{
  event : string;
  msg : string;
  room? : string | string[];
  sender? : string;
  receiver? : string;
}


export const sendRequest = async (socket : Socket , data:requests)=>{
  console.log("sendingrequest")
  const res = await getRequestdetails(data.senderId)
  if(res){
    const receiverSocket = await getSocketId(res?.receiverId)
    console.log("receiver socket : ",receiverSocket)
    if(receiverSocket){
      socket.to(receiverSocket).emit("RECEIVED_REQUEST",
      {
        sender : res.sender,
        senderId : data.senderId,
        receiver : data.receiver,
      })
    }
  }
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