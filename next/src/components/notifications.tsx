"use client";

import { useSession } from "next-auth/react"
import { MouseEvent, useEffect, useRef, useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Button } from "./ui/button"
import { UserGroupIcon } from "@heroicons/react/24/outline"
import dotenv from "dotenv"
import { Bell } from "lucide-react"
import { Card } from "./ui/card";
import { socket } from "../utils/socket/io";
import { FriendRequest } from "./addFriend";
import axios from "axios";
import { Badge } from "./ui/badge";
import { getTimeDifference } from "../utils/functions/lib";
import { notificationFetched, refetchFriends, userDataState } from "../utils/recoil/state";
import { useRecoilState } from "recoil";
import { string } from "zod";
import { toast } from "sonner";
import { CreateGroup } from "./creategroup";
import { UserData } from "../utils/hooks/userdata";
dotenv.config();

interface props{
    id : number,
    username : string,
    pfp : string,
    createdAt : string
}
type notifMsgType = "accepted" | "rejected" | "received" | "sent"
interface notification{
    type : "REQUEST"
    sid : number,
    rid : number,
    s_name? : string
    r_name? : string
    message : notifMsgType
}

export const Notifications = ()=>{
    const {data : session,status} = useSession()
    // const [req , setRequests] = useState<props[]>([]);
    const [refetch , setRefetch] = useRecoilState<boolean>(refetchFriends);
    const [notiFetch , setNotiFetch] = useRecoilState<boolean>(notificationFetched);
    const [userdata , setUserData] = useRecoilState(userDataState);

    useEffect(()=>{
        if(status === "authenticated" && !notiFetch ){
            fetchRequests()
            setNotiFetch(true)
        socket.on("RECEIVED_REQUEST" , (data:props)=>{
            console.log("received")
            fetchRequests()
        })} 
        console.log("received notif handler" )

        socket.on("NOTIFICATION" , (data:notification)=>{ // receive notification
            console.log("received notif" , data)
            data.message === "accepted" ? toast.success(
                `${(data.type.toLowerCase()).toUpperCase()} ${data.message.toLowerCase().toUpperCase()}`,
            )
            : toast.error(
                `${(data.type.toLowerCase()).toUpperCase()} ${data.message.toLowerCase().toUpperCase()}`,
            )
        })      
    },[status])
    const fetchRequests = async()=>{
        const url = process.env.NEXT_PUBLIC_SOCKET_URL
        if(url){
            const id = session?.user.id
            console.log(id)
            const res = await axios.get(url+`/user/request?id=${id}`)
            console.log(res)
            if(res.data.request.length > 0){
                setUserData((prevData: UserData) => ({
                    ...prevData,
                    pendingRequests : res.data.request
                }))
            }
            console.log(userdata.pendingRequests)
        }
    }
    async function handleClick (e: any , id : number){
        //todo : send socket event of accept and toast also also a rest notification
        const action:notifMsgType = e.currentTarget.name
        const url = process.env.NEXT_PUBLIC_SOCKET_URL
        if(url && session?.user.id){
            const rid = session?.user.id
            const res = await axios.put(url+`/user/request/edit` , {
                sid : id,
                rid,
                action : action
            })
            console.log(res)
            if(res){
                setUserData(prevState => ({
                    ...prevState,
                    pendingRequests: prevState.pendingRequests.filter(r => r.user.id !== id)
                }));
                console.log(e)
                //send toast via socket "notification"
                const notification:notification = {
                    type : "REQUEST",
                    sid : session?.user.id,
                    rid : id,
                    message : action
                }
                socket.emit("NOTIFICATION" ,notification )
                fetchRequests()
                setRefetch(!refetch)
            }
        }
    }
    
    return(
        <>
        <Popover>
            <PopoverTrigger asChild>
                <Button variant={"ghost"} onClick={(()=> console.log(userdata.pendingRequests)
)} size={"icon"} className="text-lg text-foreground flex"><Bell />{userdata.pendingRequests && userdata.pendingRequests.length > 0 ?<Badge className="
               self-start size-4 bg-red-500 flex justify-center items-center p-1"><span className="text-center text-slate-200">{userdata.pendingRequests.length}</span></Badge>:null}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96 p-2 min-h-20">
                <div>
                    {userdata.pendingRequests && userdata.pendingRequests.length >0 ? userdata.pendingRequests.map((item)=>{
                        console.log(item)
                        return(
                        <Card key={item.user.id} className="rounded-md border-slate-600 border-2 flex gap-4 p-1">
                            <div className="p-4">
                                {/* {<img src={item.user.pfp} alt="img" className="rounded-full h- w-6" />: null} */}
                            </div>
                            <div className="flex flex-col justify-start w-full">
                                <div className="flex justify-between p-2 w-full">
                                    <h5 className="font-semibold text-lg">{item.user.username}</h5>
                                    <span className="text-sm">{getTimeDifference(item.createdAt)}
                                    </span>
                                </div>
                                <div className="flex gap-6 justify-center">
                                    <Button variant={"default"} className="bg-blue-500 w-28 rounded-sm hover:border-none hover:bg-slate-800" name={"accepted"} onClick={(e)=>handleClick(e , item.user.id)}>Accept
                                    </Button>
                                    <Button variant={"default"} className="bg-red-400 w-28 rounded-sm hover:border-none hover:bg-slate-800" name={"rejected"} onClick={(e)=>handleClick(e , item.user.id)}>Reject
                                    </Button>
                                </div>
                            </div>
                        </Card>
                        )
                    }):null}
                </div>
            </PopoverContent>
        </Popover>
        <FriendRequest/>
        <CreateGroup/>
        </>
    )
}