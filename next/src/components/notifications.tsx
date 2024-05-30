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
import { refetchFriends } from "../utils/recoil/state";
import { useRecoilState } from "recoil";
dotenv.config();

interface props{
    sender : string;
    senderId : number;
    receiver : string;
    createdAt : Date
    user : {
        username : string;
        // pfp? : string | null
    }
  }
export const Notifications = ()=>{
    const  {data : session,status} = useSession()
    const [req , setRequests] = useState<props[]>([]);
    const [count , setCount] = useState<number>(0);
    const [refetch , setRefetch] = useRecoilState<boolean>(refetchFriends);
    // console.log(req.length)

    useEffect(()=>{
        console.log(session?.user.id)
        if(status === "authenticated"){
            fetchRequests()
        // }
        socket.on("RECEIVED_REQUEST" , (data:props)=>{
            // setCount(count+1)
            // // if(data){
            // //     setRequests([...req, data])
            // // }
            fetchRequests()
        }) }       
    },[status])
    const fetchRequests = async()=>{
        const url = process.env.NEXT_PUBLIC_SOCKET_URL
        if(url){
            const id = session?.user.id
            console.log(session?.user.id)
            const res = await axios.get(url+`/requests?id=${id}`)
            if(res.data.request){
                // console.log(res.data.request)
                setRequests(res.data.request);
            }
        }
    }
    async function handleClick (e: MouseEvent<HTMLButtonElement> , id : number){
        //send socket event of accept and toast also
        const url = process.env.NEXT_PUBLIC_SOCKET_URL
        if(url && session?.user.id){
            const rid = session?.user.id
            const res = await axios.put(url+`/acceptrequest` , {
                sid : id,
                rid,
                action : e.currentTarget.value
            })
            const index = req.findIndex(r => r.senderId === id);
            req.splice(index, 1)[0];
            fetchRequests()
            setRefetch(!refetch)
        }
    }
    
    return(
        <>
        <Popover>
            <PopoverTrigger asChild>
                <Button variant={"ghost"} size={"icon"} className="text-lg text-foreground flex"><Bell /><Badge className="
               self-start size-4 bg-red-500 flex justify-center items-center p-1"><span className="text-center text-slate-200">{req.length}</span></Badge>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96 p-2 min-h-20">
                <div>
                    {/* <h3>Your Friend Requests</h3> */}
                    {/* {req} */}
                    {req.map((item)=>{
                        return(
                            <Card key={item.senderId} id={item.senderId.toString()} className="rounded-md border-slate-600 border-2 flex gap-4 p-1">
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
                                        <Button variant={"default"} className="bg-blue-500 w-28 rounded-sm hover:border-none hover:bg-slate-800" value={"accept"} onClick={(e)=>handleClick(e , item.senderId)}>Accept
                                        </Button>
                                        <Button variant={"default"} className="bg-red-400 w-28 rounded-sm hover:border-none hover:bg-slate-800" value={"reject"} onClick={(e)=>handleClick(e , item.senderId)}>Reject
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        )
                    })}
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