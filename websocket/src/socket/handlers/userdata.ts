import { Socket } from "socket.io";
import { fetchUserData, getKey, getSocketId } from "../../lib/functions";
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
        const userData = await fetchUserData(data.id)

        if(userData){
            return userData
        }
        else{
            console.log("User data error")
            return false
        }
    }
    catch(e){
        console.error("Error while fetching userdata from redis" ,e)
        return false
    }
}