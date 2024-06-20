import prisma from "../../db/db"
import { redis } from "../server"
import { Sockets } from "../socket/user-socket"
import dotenv from "dotenv"
dotenv.config()

interface requestProps {
    senderId? : number ,
    receiverId? : number
}

export const getUserdetails = async (data : string | number) =>{
    if(typeof data === "number"){
        const res = await prisma.users.findFirst({
            where : {
                id : data
            }
        })
    return res
    }
    else {
        const res =  await prisma.users.findFirst({
            where : {
                email : data
            }
        })
        return res
    }
}
export const getRequestdetails = async (data : requestProps) =>{
    const res = data.senderId ? await prisma.requests.findFirst({
        where : {
            senderId : data.senderId
        }
    }) : await prisma.requests.findFirst({
        where : {
            receiverId : data.receiverId
        }
    })
    return res
}
export const getSocketId = async (userId: number): Promise<string | null> => {
    const socket = Sockets.find(s => s.userId === userId);
    console.log(socket?.socketId)
    return socket?.socketId!==undefined ? socket.socketId : null;
};

export const getUserId = async (socketId : string) =>{
    Sockets.forEach((s)=>{
        if(s.socketId === socketId){
            return s.userId
        }
        else return
    })
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
interface updateUserDatatype {
    id:number ,
    fid : number ,
    keyy :keyof UserData ,
    value : string | number
}

export const updateUserData = async (args:updateUserDatatype)=>{
    const key = `data:${args.id}`;
    const userDataStr= await redis.get(key);
    if (typeof userDataStr === 'string' && args.keyy === "friends"){
        const userData: UserData = JSON.parse(userDataStr);
        const friend = userData.friends.find(friend => friend.id === args.fid);
        if (friend) {
            friend.unreadMessageCount += 1;
            await redis.set(key, JSON.stringify(userData));
        }
        else {
            console.error('Friend not found');
        }
    }
    if (typeof userDataStr === 'string' &&args.keyy === "pendingRequests"){
        const userData: UserData = JSON.parse(userDataStr);
        const friend = userData.pendingRequests.find(friend => friend.id === args.fid);
        if (friend) {
            // friend.unreadMessageCount += 1;
            await redis.set(key, JSON.stringify(userData));
        }
        else {
            console.error('Friend not found');
        }
    }
    else if(typeof userDataStr === 'string'){
        const userData: UserData = JSON.parse(userDataStr);
        args.keyy === "id" ? userData.id = (args.value as number):
        args.keyy === "username" ? userData.username = (args.value as string):
        args.keyy === "email" ? userData.email = (args.value as string):
        args.keyy === "pfp" ? userData.pfp = (args.value as string):
        args.keyy === "notifications" ? userData.notifications = userData.notifications+(args.value as number):null
    }

}
