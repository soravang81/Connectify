import { useRecoilState, useRecoilValueLoadable } from "recoil"
import { ChatbarBackbtn, CurrentChatUserId, userData } from "../utils/recoil/state"
import { socket } from "../utils/socket/io";
import React, { useEffect, useState } from "react";
import { getUid } from "../utils/functions/lib";
import { Button } from "./ui/button";
import { ArrowLeft, icons } from "lucide-react";
import { DropDownMenu } from "./chatbar-menu";

type status = "ONLINE" | string
interface props extends React.HTMLAttributes<HTMLDivElement> {}

export const ChatBar:React.FC<props> = ({...props })=>{
    const userdata = useRecoilValueLoadable(userData)
    const friendId = useRecoilValueLoadable<number>(CurrentChatUserId)
    const [friendStatus , setFriendStatus] = useState<status>()
    const [isVisible , setIsVisible] = useState(false)

    const friend = userdata.contents.friends.find((f:any)=>f.id === friendId.contents)
    const friendName = friend?.username
    
    const getFriendStatus = async() =>{
        console.log("getStatus call")
        const sid = await getUid()
        socket.emit("GET_STATUS" , {//emit event to get the friend status
            sid, 
            rid : friendId.contents
        })
    }
    useEffect(()=>{
        if(friendId.state && userdata.state === "hasValue"){
            getFriendStatus()
        }
        socket.on("GET_STATUS", (data) => {//listen the sent event i.e getstatus to get friend status
            console.log("received getstatus" , data)
            if(data.status !== false){
                const status:status = data.status === "ONCHAT" ? "ONLINE" : data.status as string
                setFriendStatus(status.toLowerCase())
                setTimeout(() => {//to fade the status after 5 seconds with animation
                    setIsVisible(true)
                }, 700);
                setTimeout(() => {
                    setIsVisible(false)
                }, 5700);
            }
        });
    },[friendId.state])
    
    if(userdata.contents){
        return(
            <>
            <div className="flex w-full items-center text-xl gap-2 p-3 rounded-lg ">
                <img src={userdata.contents.pfp.link} className="aspect-square size-16 rounded-full p-1"></img>
                <div  className="flex flex-col w-full  rounded-lg p-1">
                    <p className="text-2xl">{friendName}</p>
                    <p className={`text-xs transition-opacity duration-5000 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'}`} >{friendStatus}</p>
                </div>
                <DropDownMenu friendId={friendId.contents} ></DropDownMenu>
            </div>
            </>
        )
    }
    else{
        return <div>loading..</div>
    }
    
}
