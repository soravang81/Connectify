import { Socket } from "socket.io"
import { getRequestdetails, getSocketId, getUserdetails } from "../lib/functions";
import { redis } from "../server";
import { saveRedisChatToDatabase } from "../redis/redis";


interface requests{
  // sender : string;
  senderId : number
  receiver : string;
}
interface dataprop{
  message : string;
  sid : number;
  rid : number;
  time : Date
}

export const sendRequest = async (socket : Socket , data:requests)=>{
  const res = await getRequestdetails({senderId : data.senderId})
  if(res){
    const receiverSocket = await getSocketId(res.receiverId)
    if(receiverSocket){
      socket.to(receiverSocket).emit("RECEIVED_REQUEST"
    )
    }
  }
}

export const messageHandler = async( socket: Socket ,data :dataprop) => {
  console.log("Received message:", data);
  const receiverSocket = await getSocketId(data.rid)
  // if receiver socket is not available then send messages on mount to that user
  console.log("receiver socket : ",receiverSocket)
  const key = `user:${data.sid}:${data.rid}`;
  const reversekey = `user:${data.rid}:${data.sid}`;
  if(receiverSocket){
    const message = {
      message : data.message,
      senderId : data.sid,
      receiverId : data.rid,
      time : data.time 
    }
    try{
      socket.to(receiverSocket).emit("message" , message)
        const keyy = await redis.exists(key)
        const reversekeyy = await redis.exists(reversekey)
        let newKey = "";

        await redis.exists(key) ? newKey = key : newKey = reversekey
        if(!keyy && !reversekeyy){
          redis.set(key , JSON.stringify([message]))
          console.log(key)
          saveRedisChatToDatabase(key)
        }
        
        const prevData = await redis.get(newKey)
        console.log("prevData ",prevData)
        if(typeof prevData === "string"){
          const data = JSON.parse(prevData)
          data.push(message)
          redis.set(newKey , JSON.stringify(data))
          saveRedisChatToDatabase(newKey)
        }
    }
    catch(err){
      console.log("message handler error : " , err)
    }
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