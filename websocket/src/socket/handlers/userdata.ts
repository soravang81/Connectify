import { Socket } from "socket.io";
import { getKey, getSocketId, populateUserData } from "../../lib/functions";
import { redis } from "../../server";

export interface UserData {
    id: number;
    username: string;
    email: string;
    pfp : {
        path : string,
        link : string
    }
    friends: {
      id: number;
      email : string
      username: string;
      pfp : {
        path : string,
        link : string
    }
    }[];
    notifications: number;
    pendingRequests: {
        user : {
            id: number;
            username: string;
            pfp : {
                path : string,
                link : string
            }
          }
      createdAt: Date;
    }[];
  }
export interface updateUserDatatype {
    id:number ,
    fid : number ,
    keyy :keyof UserData ,
    value : string | number
    data : []
}

export const getUserData = async(socket : Socket , data : {id : number})=>{
    console.log("userdata id :",data.id)
    try{
        const key = `data:${data.id}`
            const resp =  await redis.get(key)
            console.log("redis userdata ",resp)
            if(resp){
                console.log("inside resp userdata")
                const userData =  JSON.parse(resp)
                console.log(userData)
                socket.emit("USER_DATA",userData)
            }
            else {
                console.log("insdie else userdata")
                await populateUserData(data.id)
                const resp =  await redis.get(key)
                if(resp){
                    const userData =  JSON.parse(resp)
                    socket.emit("USER_DATA",userData)
                }
            }
    }
    catch(e){
        console.error("Error while fetching userdata from redis" ,e)
        return false
    }
}