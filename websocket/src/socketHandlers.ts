import { Socket } from "socket.io"
import { Sockets } from "./user-socket";
import { io } from "./server";
import { v4 }  from "uuid";


interface requests{
    sender : string;
    senderId : string;
    receiver : string;
}
interface dataprop{
    event : string;
    msg : string;
    room? : string | string[];
    sender? : string;
    receiver? : string;
}


export const sendRequest = (socket : Socket , data:requests)=>{
    console.log("sendrequest")
    const receiverSocket = Sockets[data.receiver]
    console.log("receiver socket : ",receiverSocket)
    socket.to(receiverSocket).emit("RECEIVED_REQUEST",
      {
        sender : data.sender,
        senderId : data.senderId,
        receiver : data.receiver,
      }
    )
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