import { Socket } from "socket.io"
import { Sockets } from "./user-socket";
import { io, redis } from "./server";
import { v4 }  from "uuid";
import { getRequestdetails, getSocketId, getUserdetails } from "./lib/functions";


interface requests{
  // sender : string;
  senderId : number
  receiver : string;
}
interface dataprop{
  message : string;
  sid : number;
  rid : number;
}

export const sendRequest = async (socket : Socket , data:requests)=>{
  const res = await getRequestdetails({senderId : data.senderId})
  if(res){
    const receiverSocket = await getSocketId(res.receiverId)
    if(receiverSocket){
      socket.to(receiverSocket).emit("RECEIVED_REQUEST"
      // redis.
    )
    }
  }
}

export const messageHandler = async( socket: Socket ,data :dataprop) => {
  console.log("Received message:", data);
  const receiverSocket = await getSocketId(data.rid)
  console.log("receiver socket : ",receiverSocket)
  if(receiverSocket){
    socket.to(receiverSocket).emit("message" , {
      message : data.message,
      sid : data.sid,
      rid : data.rid
    })
    //redis upload message -> then to database
  }
}

export const joinRoomHandler = ( socket: Socket ,data:any ): void => {
  if(data.roomId){
    socket.join(data.roomId)
    console.log("User joined room:", data.roomId);
  }
};

export const leaveRoomHandler = (socket: Socket, data: { room : string }): void => {
  socket.leave(data.room);
  console.log("User left room:", data.room);
};

export const customEventHandler = (socket: Socket, data?: any): void => {
  console.log("Received custom event:", data);
  // Handle custom event
};