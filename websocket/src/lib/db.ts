import prisma from "../../db/db"
import { redis } from "../server"
import { SocketProps } from "../socket/user-socket"
import { getUserId } from "./functions"

export const updateMsgToSeen = async({ rid, sid }: { rid: number, sid: number }) =>{
    try{
        await prisma.chat.updateMany({
            where : {
                AND : {
                    senderId : rid,
                    receiverId : sid
                }
            },
            data : {
                seen : true
            }
        })
        return true
    }
    catch{
        return false
    }
}

export const setLastSeen = async (id : string):Promise<boolean> =>{
    console.log(id)
    const Socketstr = await redis.get("Sockets")
    if(!Socketstr){
        console.error("Redis key for Sockets not found")
        return false
    }
    if(Socketstr){
        const Sockets:SocketProps[] = JSON.parse(Socketstr)
        if(Sockets){
            const socket = Sockets.find(s => s.socketId === id)
            const uid = socket?.userId
            console.log(uid)
            if(uid){
                try{
                    const res = await prisma.users.update({
                        where : {
                            id : uid
                        },
                        data : {
                            lastSeen : new Date()
                        }
                    })
                    return true
                }
                catch(e:any){
                    console.error("Error setting last seen" , e.message)
                    return false
                }   
            }
            else{
                console.error("User id from redis Sockets not found")
                return false
            }
        }
        else{return false}
    }
    else{
        return false
    }
}