import { Socket } from "socket.io"
import { getSocketId } from "../../lib/functions"

export type notifMsgType = "accept" | "reject" | "received" | "sent"
export interface notification{
    type : "REQUEST_STATUS" | "REQUEST"
    sid : number,
    rid : number,
    message : notifMsgType
}

export const notificationhandler = async(socket : Socket , data :notification ) =>{
    const r_socket = await getSocketId(data.rid)
    if(r_socket){
        const notification:notification = {
            type : data.type,
            sid : data.sid,
            rid : data.rid,
            message : data.message as notifMsgType
        }
        socket.to(r_socket).emit("NOTIFICATION" , notification)
    }
}