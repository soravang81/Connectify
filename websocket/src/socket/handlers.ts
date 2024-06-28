import { Socket } from "socket.io"
import { getKey, getRequestdetails, getSocketId, getUserdetails } from "../lib/functions";
import { redis } from "../server";
import { saveRedisChatToDatabase } from "../redis/redis";
import { updateMsgToSeen } from "../lib/db";
import { Sockets, editSocket, getStatus, status } from "./user-socket";
import { UserData } from "./handlers/userdata";


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
  const res = await editSocket(data.sid , data.status.status , data.status.id)
  console.log(Sockets)
  // console.log(Sockets)
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

    const status:{status : status , id? : number} = await getStatus(data.rid)
    console.log("status : " , status , data.sid)
    console.log("status.status : " , status.status)
    if (receiverSocket && status.status === "ONCHAT" && status.id === data.sid ) {
      message.seen = true
      console.log("sent direct message")

      socket.to(receiverSocket).emit("DIRECT_MSG", message);
    }
    else if (receiverSocket && status.status === "ONLINE"){
      console.log("sent message")
      socket.to(receiverSocket).emit("message", message);
    }
    else {
      //handle redis blpop to push notification/toast on login
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

export const unreadMessage = async (socket: Socket, data?: any) => {
  if (!data || !data.senderId || !data.receiverId) {
    console.error('Invalid data');
    return;
  }

  const key = `data:${data.receiverId}`;
  console.log(key)
  
  try {
    const receiverSocket = await getSocketId(data.receiverId)
    receiverSocket ? socket.to(receiverSocket).emit("UNREAD_MSG" , {
      senderId : data.senderId,
      receiverId : data.receiverId,

    }):null;
    const userDataStr = await redis.get(key);
    if (!userDataStr) {
      console.error('User data not found');
      return
    }
    const userData: UserData = JSON.parse(userDataStr);

    const friend = userData.friends.find(friend => friend.id === data.senderId);
    console.log(friend)
    if (friend) {
      // friend.unreadMessageCount += 1;
      await redis.set(key, JSON.stringify(userData));
      //update the db also and also migrate and remake friendsapi
    }
    else {
      console.error('Friend not found');
    }
  }
  catch (error) {
    console.error('Error updating unread message count:', error);
  }
};