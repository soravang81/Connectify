import { Socket } from "socket.io"
import { getKey, getRequestdetails, getSocketId, getTimeDifference, getUserdetails } from "../lib/functions";
import { redis } from "../server";
import { saveRedisChatToDatabase } from "../redis/redis";
import { updateMsgToSeen } from "../lib/db";
import { Sockets, editSocket, getStatus, status } from "./user-socket";
import { UserData } from "./handlers/userdata";
import prisma from "../../db/db";


interface requests{
  // sender : string;
  senderId : number
  receiver : string;
}
export interface msgprop{
  message : string;
  sid : number;
  rid : number;
  time : Date,
  seen : boolean
}
interface msgseen  {
  sid : number ,
  rid : number ,
  seen : boolean
}
interface statuss {
  sid : number
  status : {
    status : status
    id? : number
  }
}

export const sendRequest = async (socket : Socket , data:requests)=>{
  const res = await getRequestdetails({senderId : data.senderId})
  console.log(res)
  if(res){
    const receiverSocket = await getSocketId(res.receiverId)
    console.log(receiverSocket)
    if(receiverSocket){
      socket.to(receiverSocket).emit("RECEIVED_REQUEST"
    )
    }
  }
}

export const statusHandler = async (socket : Socket , data : statuss) =>{
  await editSocket(data.sid , data.status.status , data.status.id)
  console.log(Sockets)
}

export const getStatusHandler = async (socket : Socket , data : { sid : number , rid : number}) =>{
  const status = await getStatus(data.rid)
  const s_socket = await getSocketId(data.sid)
  console.log("r_socket" , data.sid  , data.rid,s_socket)
  console.log("status" , status)
  if(status && s_socket){
    console.log("emmiting")
    try{
      socket.emit("GET_STATUS" , status)
    }
    catch(e){
      console.error("Error sending status to client:", e);
    }
  }
  else if(s_socket){
    try{
      const res = await prisma.users.findUnique({
        where : {
          id : data.rid
        },
        select : {
          lastSeen : true
        }
      })
      if(res && res.lastSeen){
        const time = getTimeDifference(res.lastSeen.toString())
        console.log("lastseen",res.lastSeen)
        console.log("time",time)
        socket.emit("GET_STATUS" , {
          status : `last seen ${time}`
        })
      }
      else{
        socket.emit("GET_STATUS" , {
          status : ""
        })
      }
    }
    catch(e){
      console.error("Error getting user last seen:", e);
    }
  }
  else{
    console.log("No socket found")
  }
}

export const messageHandler = async (socket: Socket, data: msgprop) => {
  console.log("Received message:", data);

  try {
    const receiverSocket = await getSocketId(data.rid);
    console.log("Receiver socket:", receiverSocket);

    let message:msgprop = {
      message: data.message,
      sid: data.sid,
      rid : data.rid,
      time: data.time,
      seen: false 
    };

    const status:{status : status , id? : number} | false = await getStatus(data.rid)
    console.log("status : " , status , data.sid)
    status ? console.log("status.status : " , status.status) : null
    if (receiverSocket && status && status.status === "ONCHAT" && status.id === data.sid ) {
      message.seen = true
      console.log("sent direct message")

      socket.to(receiverSocket).emit("DIRECT_MSG", message);
    }
    else if (receiverSocket && status  && status.status === "ONLINE"){
      console.log("sent message")
      socket.to(receiverSocket).emit("message", message);
    }
    else {
      //handle redis blpop to push notification/toast on login
      // also add toast as new messages
    }
    //saving to redis and database
    const key = `chat:${data.sid}:${data.rid}`;
    const reverseKey = `chat:${data.rid}:${data.sid}`;
    
    const keyExists = await redis.exists(key);
    const reverseKeyExists = await redis.exists(reverseKey);

    const newKey = keyExists ? key : (reverseKeyExists ? reverseKey : key);

    if (!keyExists && !reverseKeyExists) {
      await redis.set(key, JSON.stringify([message]));
      console.log("New key created:", key);
      saveRedisChatToDatabase(key);
    } else {
      const prevData = await redis.get(newKey);
      console.log("Previous data:", prevData);

      if (typeof prevData === "string") {
        const data = JSON.parse(prevData);
        data.push(message);
        await redis.set(newKey, JSON.stringify(data));
        saveRedisChatToDatabase(newKey);
      }
    }
  } catch (err) {
    console.log("Message handler error:", err);
  }
};



export const msgSeenHandler = async(socket: Socket ,data : msgseen)=>{
  const key = await getKey("chat" ,data.sid , data.rid)
  console.log("key",key)
  const prevData = key ? await redis.get(key) : null
  if(prevData != null && key){
    const chat = JSON.parse(prevData)
    console.log(data.sid)
    chat.map((key:msgseen)=>{
      key.sid === data.rid ? key.seen = true : null
    })
    redis.set(key , JSON.stringify(chat))
    updateMsgToSeen({rid: data.rid , sid : data.sid })
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
