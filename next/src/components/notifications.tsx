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
import { FriendRequest } from "./request";
import axios from "axios";
import { Badge } from "./ui/badge";
import { getTimeDifference } from "../utils/functions/lib";
import { notificationFetched, refetchFriends, userData } from "../utils/recoil/state";
import { useRecoilState } from "recoil";
dotenv.config();

interface props{
    id : number,
    username : string,
    pfp : string,
    createdAt : string
  }
export const Notifications = ()=>{
    const {data : session,status} = useSession()
    // const [req , setRequests] = useState<props[]>([]);
    const [refetch , setRefetch] = useRecoilState<boolean>(refetchFriends);
    const [notiFetch , setNotiFetch] = useRecoilState<boolean>(notificationFetched);
    const [userdata , setUserData] = useRecoilState(userData);

    useEffect(()=>{
        if(status === "authenticated" && !notiFetch ){
            fetchRequests()
            setNotiFetch(true)
        socket.on("RECEIVED_REQUEST" , (data:props)=>{
            fetchRequests()
        })}       
    },[status])
    const fetchRequests = async()=>{
        const url = process.env.NEXT_PUBLIC_SOCKET_URL
        if(url){
            const id = session?.user.id
            console.log(id)
            const res = await axios.get(url+`/user/request?id=${id}`)
            if(res.data.request){
                setUserData({... userdata ,
                    pendingRequests : res.data.requests
                })
            }
            console.log(userdata.pendingRequests)
        }
    }
    async function handleClick (e: MouseEvent<HTMLButtonElement> , id : number){
        //todo : send socket event of accept and toast also also a rest notification
        const url = process.env.NEXT_PUBLIC_SOCKET_URL
        if(url && session?.user.id){
            const rid = session?.user.id
            const res = await axios.put(url+`/user/request/edit` , {
                sid : id,
                rid,
                action : e.currentTarget.value
            })
            if(res){
                const index = userdata.pendingRequests.findIndex(r => r.id === id);
                userdata.pendingRequests.splice(index, 1)[0];
                fetchRequests()
                setRefetch(!refetch)
            }
        }
    }
    
    return(
        <>
        <Popover>
            <PopoverTrigger asChild>
                <Button variant={"ghost"} size={"icon"} className="text-lg text-foreground flex"><Bell />{userdata.pendingRequests && userdata.pendingRequests.length > 0 ?<Badge className="
               self-start size-4 bg-red-500 flex justify-center items-center p-1"><span className="text-center text-slate-200">{userdata.pendingRequests.length}</span></Badge>:null}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96 p-2 min-h-20">
                <div>
                    {userdata.pendingRequests && userdata.pendingRequests.length >0 ? userdata.pendingRequests.map((item)=>{
                        return(
                        <Card key={item.id} className="rounded-md border-slate-600 border-2 flex gap-4 p-1">
                            <div className="p-4">
                                {/* {<img src={item.user.pfp} alt="img" className="rounded-full h- w-6" />: null} */}
                            </div>
                            <div className="flex flex-col justify-start w-full">
                                <div className="flex justify-between p-2 w-full">
                                    <h5 className="font-semibold text-lg">{item.username}</h5>
                                    <span className="text-sm">{getTimeDifference(item.createdAt)}
                                    </span>
                                </div>
                                <div className="flex gap-6 justify-center">
                                    <Button variant={"default"} className="bg-blue-500 w-28 rounded-sm hover:border-none hover:bg-slate-800" value={"accept"} onClick={(e)=>handleClick(e , item.id)}>Accept
                                    </Button>
                                    <Button variant={"default"} className="bg-red-400 w-28 rounded-sm hover:border-none hover:bg-slate-800" value={"reject"} onClick={(e)=>handleClick(e , item.id)}>Reject
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
        <Popover>
            <PopoverTrigger asChild>
                <Button variant={"ghost"} size={"icon"} className="text-sm text-foreground" ><UserGroupIcon height={28}/>
                </Button>
            </PopoverTrigger>
            <PopoverContent>
                
            </PopoverContent>
        </Popover>
        </>
    )
}