import prisma from "../../db/db"
import { redis } from "../server"
import { UserData } from "../socket/handlers/userdata"
import { updateUserDatatype } from "../socket/handlers/userdata"
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

export const getUserId = async (socketId : string) : Promise<number | boolean> =>{
    const socket = Sockets.find(s=>s.socketId === socketId)
    return socket?.userId!==undefined ? socket.userId : false
}

export const getKey = async(type :"chat" | "data" ,id1 : number, id2 : number): Promise<string | false>=>{
    const key = `${type}:${id1}:${id2}`;
    const reverseKey = `${type}:${id2}:${id1}`;
    let newKey: string | false;
    await redis.exists(key) ? newKey = key : await redis.exists(reverseKey) ? newKey = reverseKey : newKey = false
    return newKey
}



export const updateUserData = async (args:updateUserDatatype)=>{
    const key = `data:${args.id}`;
    const userDataStr= await redis.get(key);
    if(typeof userDataStr === 'string'){
        const userData: UserData = JSON.parse(userDataStr);
        args.keyy === "id" ? userData.id = (args.value as number):
        args.keyy === "username" ? userData.username = (args.value as string):
        args.keyy === "email" ? userData.email = (args.value as string):
        args.keyy === "pfp" ? userData.pfp = (args.value as string):
        args.keyy === "notifications" ? userData.notifications = userData.notifications+(args.value as number):null
    }
}
export const populateUserData = async( id : number)=>{
        const key = `data:${id}`;
        const data = await prisma.users.findUnique({
            where : {
                id : id
            }
        })
        if(data){
            const userData: UserData = {
                id: id,
                username: data.username,
                email: data.email,
                pfp: data.pfp as string,
                friends: [],
                notifications: 0,
                pendingRequests: [],
              };
            await redis.set(key, JSON.stringify(userData),'EX', 60 * 10);
        }
        console.log("populate " , await redis.get(key))
}