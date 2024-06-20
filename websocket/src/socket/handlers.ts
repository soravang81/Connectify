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
export interface UserData {
  id: number;
  username: string;
  email: string;
  pfp: string;
  friends: {
    id: number;
    username: string;
    pfp: string;
    unreadMessageCount: number;
  }[];
  notifications: number;
  pendingRequests: {
    id: number;
    username: string;
    pfp: string;
    createdAt: string;
  }[];
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
  console.log("receiver socket : ",receiverSocket)
  const key = `user:${data.sid}:${data.rid}`;
  const reversekey = `user:${data.rid}:${data.sid}`;
  const message = {
    message : data.message,
    senderId : data.sid,
    receiverId : data.rid,
    time : data.time 
  }
  try{
    if(receiverSocket){
      socket.to(receiverSocket).emit("message" , message)
    }
    else{
      //send message on when reciever mounts
    }
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

export const unreadMessage = async (socket: Socket, data?: any): Promise<void> => {
  if (!data || !data.senderId || !data.receiverId) {
    console.error('Invalid data');
    return;
  }

  const key = `data:${data.receiverId}`;
  
  try {
    const receiverSocket = await getSocketId(data.receiverId)
    receiverSocket ? socket.to(receiverSocket).emit("UNREAD_MSG" , {
      senderId : data.senderId,
      receiverId : data.receiverId
    }):null;
    const userDataStr = await redis.get(key);
    if (!userDataStr) {
      console.error('User data not found');
      return;
    }

    const userData: UserData = JSON.parse(userDataStr);

    const friend = userData.friends.find(friend => friend.id === data.senderId);
    if (friend) {
      friend.unreadMessageCount += 1;
      await redis.set(key, JSON.stringify(userData));
    }
    else {
      console.error('Friend not found');
    }
  }
  catch (error) {
    console.error('Error updating unread message count:', error);
  }
};