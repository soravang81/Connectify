"use client"
import { useRecoilValueLoadable } from "recoil"
import { CurrentChatUserId } from "../utils/recoil/state"
import { socket } from "../utils/socket/io";
import React, { useEffect, useState } from "react";
import { getUid } from "../utils/functions/lib";
import { DropDownMenu } from "./chatbar-menu";
import { useUserData } from "../utils/hooks/userdata";
// import { VideoCallBtn } from "./videoCallbtn";
import { VideoPopup } from "./video";
type status = "ONLINE" | string
interface props extends React.HTMLAttributes<HTMLDivElement> {}

export const ChatBar:React.FC<props> = ({...props } , fid)=>{
    const { userData } = useUserData()
    const friendId = useRecoilValueLoadable<number>(CurrentChatUserId)
    const [friendStatus , setFriendStatus] = useState<status>()
    const [isVisible , setIsVisible] = useState(false)

    const friend = userData.friends.find((f:any)=>f.id === friendId.contents)
    
    const getFriendStatus = async() =>{
        const sid = userData.id
        socket.emit("GET_STATUS" , {//emit event to get the friend status
            sid, 
            rid : friendId.contents
        })
    }
    socket.on("GET_STATUS", (data) => {//listen the sent event i.e getstatus to get friend status
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
    useEffect(()=>{
        if(friendId.state === "hasValue" && userData){
            getFriendStatus()
        }
        
    },[friendId.state])
    
    return(
        <>
        <div className="flex w-full items-center text-xl gap-2 p-3 rounded-lg ">
            <img src={friend?.pfp.link} className="aspect-square size-16 rounded-full p-1 border border-foreground"></img>
            <div  className="flex flex-col w-full  rounded-lg p-1">
                <p className="text-2xl">{friend?.username}</p>
                <p className={`text-xs transition-opacity duration-5000 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'}`} >{friendStatus}</p>
            </div>
            <div className="flex lg:gap-5 md:gap-3 gap-2">
                <VideoPopup id={friendId.contents}/>
                {/* <DialogDemo/> */}
                <DropDownMenu friendId={friendId.contents} ></DropDownMenu>
            </div>
        </div>
        </>
    )
    
}
