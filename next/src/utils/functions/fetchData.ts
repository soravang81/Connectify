import axios from "axios"
import { getSession, useSession } from "next-auth/react"
import { useRecoilState, useSetRecoilState } from "recoil";
import { promise } from "zod";
import { useEffect } from "react";
import { chatReceived, messagesprop, statuss } from "../types/alltypes";
import { toast } from "sonner";
import { socket } from "../socket/io";
const url = process.env.NEXT_PUBLIC_SOCKET_URL;



export const getUserData = async(sid : number,rid : number)=>{
    const status : statuss =  {
        sid ,
        status : {
          status : "ONCHAT",
          id : rid
        }
      }
    socket.emit("STATUS" , status)
    
    try {
        const res = await axios.get<chatReceived>(url +`/user/chat` , {
            params : {
              sid ,
              rid ,
            }
        })
        return res.data
    }
    catch(error){
        toast.error('Error fetching user data:');
        console.error('Error fetching user data:', error);
    }
}