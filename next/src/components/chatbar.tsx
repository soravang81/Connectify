import { useRecoilState, useRecoilValueLoadable } from "recoil"
import { ChatbarBackbtn, CurrentChatUserId, userData } from "../utils/recoil/state"
import { socket } from "../utils/socket/io";
import React, { useEffect, useState } from "react";
import { getUid } from "../utils/functions/lib";
import { Button } from "./ui/button";
import { ArrowLeft, icons } from "lucide-react";

type status = "ONLINE" | string
interface props extends React.HTMLAttributes<HTMLDivElement> {}
export const ChatBar:React.FC<props> = ({...props })=>{
    const userdata = useRecoilValueLoadable(userData)
    const friendId = useRecoilValueLoadable<number>(CurrentChatUserId)
    const [friendStatus , setFriendStatus] = useState<status>()
    const [isBackButton , showBackButton] = useState(false)
    const [isChatSection, setIsChatSection] = useRecoilState<boolean>(ChatbarBackbtn);

    const [isVisible , setIsVisible] = useState(false)

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
        socket.on("GET_STATUS", (data) => {
            console.log("received getstatus" , data)
            if(data.status !== false){
                const status:status = data.status === "ONCHAT" ? "ONLINE" : data.status as string
                setFriendStatus(status.toLowerCase())
                setTimeout(() => {
                    setIsVisible(true)
                }, 700);
                setTimeout(() => {
                    setIsVisible(false)
                }, 5700);
            }
        });
    },[friendId.state])
    
    const handleClick = ()=>{
        setIsChatSection(false)
        showBackButton(true)
    }
    return(
        <>
        <div className="flex w-full items-center text-xl gap-4 p-3 rounded-lg ">
            {/* <img src="" ></img> */}
            {isBackButton && <Button className="rounded-full p-2" onClick={()=>{setIsChatSection(true);showBackButton(false)}} size={"icon"}><ArrowLeft className=""/></Button>}
            <div className="p-6 rounded-full bg-white"></div>
            <div {...props} onClick={handleClick} className="flex flex-col w-full hover:bg-slate-600 hover:cursor-pointer rounded-lg p-1">
                <p className="text-2xl">{friendName}</p>
                <p className={`text-xs transition-opacity duration-5000 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'}`} >{friendStatus}</p>
            </div>
        </div>
        </>
    )
}
