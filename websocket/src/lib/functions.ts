import prisma from "../../db/db"
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

