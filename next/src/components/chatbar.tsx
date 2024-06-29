import { useRecoilValue, useRecoilValueLoadable } from "recoil"
import { CurrentChatUserId, userData } from "../utils/recoil/state"
import { socket } from "../utils/socket/io";
import { useEffect, useState } from "react";
import { getUid } from "../utils/functions/lib";

type status = "ONLINE" | string
export const ChatBar = ()=>{
    const userdata = useRecoilValueLoadable(userData)
    const friendId = useRecoilValueLoadable<number>(CurrentChatUserId)
    const [friendStatus , setFriendStatus] = useState<status>()

    const friend = userdata.contents.friends.find((f:any)=>f.id === friendId.contents)
    const friendName = friend?.username
    
    const getFriendStatus = async() =>{
        console.log("getStatus call")
        const sid = await getUid()
        socket.emit("GET_STATUS" , {
            sid, 
            rid : friendId.contents
        })
    }
    useEffect(()=>{
        if(friendId.state && userdata.state === "hasValue"){
            getFriendStatus()
        }
    },[friendId.state])
    socket.on("GET_STATUS", (data) => {
        console.log("received getstatus" , data)
        if(data.status !== false){
            const status:status = data.status === "ONCHAT" ? "ONLINE" : data.status as string
            setFriendStatus(status.toLowerCase())
        }
    });
    return(
        <>
        <div className="flex w-full text-xl gap-4 p-3 rounded-lg hover:bg-slate-600 hover:cursor-pointer">
            {/* <img src="" ></img> */}
            <div className="w-12 h-12 rounded-full bg-white"></div>
            <div className="flex flex-col">
                <p>{friendName}</p>
                <p>{friendStatus}</p>
            </div>
        </div>
        </>
    )
}
