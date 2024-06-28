import { Socket } from "socket.io";
import { getKey, getSocketId, populateUserData } from "../../lib/functions";
import { redis } from "../../server";

export interface UserData {
    id: number;
    username: string;
    email: string;
    pfp: string | null;
    friends: {
      id: number;
      username: string;
      pfp: string | null;
    //   unreadMessageCount: number;
    }[];
    notifications: number;
    pendingRequests: {
        user : {
            id: number;
            username: string;
            pfp: string;
          }
      createdAt: string;
    }[];
  }
export interface updateUserDatatype {
    id:number ,
    fid : number ,
    keyy :keyof UserData ,
    value : string | number
    data : []
}

export const getUserData = async(socket : Socket , data : {sid : number , rid : number}) : Promise<boolean>=>{
    try{
        const key = await getKey("data" , data.sid , data.rid)
        if(key){
            const resp =  await redis.get(key)
            if(resp){
                const userData =  JSON.parse(resp)
                const r_socket = await getSocketId(data.rid) 
                socket.to(r_socket as string).emit(userData)
                return true
            }
            else {
                await populateUserData(data.sid)
                const resp =  await redis.get(key)
                if(resp){
                    const userData =  JSON.parse(resp)
                    const r_socket = await getSocketId(data.rid) 
                    socket.to(r_socket as string).emit(userData)
                    return true
                }
            }
        }
        return false

    }
    catch(e){
        console.error("Error while fetching userdata from redis")
        return false
    }
}