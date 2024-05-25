"use client";

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
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
dotenv.config();

interface props{
    sender : string;
    senderId : string | number;
    receiver? : string;
    receiverId? : string | number;
    status? : string;
  }
export const Notifications = ()=>{
    const  {data : session,status} = useSession()
    const [req , setRequests] = useState<props[]>([]);

    useEffect(()=>{
        console.log(session?.user)
        socket.on("RECEIVED_REQUEST" , (data:props)=>{
            console.log("receivedreq")
            if(data){
                console.log("inside socket")
                setRequests([...req, data])
            }
        })
        if(status === "authenticated"){
            fetchRequests()
        }
    },[status])
    const fetchRequests = async()=>{
        
        const url = process.env.NEXT_PUBLIC_SOCKET_URL
        if(url){
            const res = await axios.post(url+"/getrequests" , {
                senderId : session?.user.id
            })
            if(res.data.resp){
                console.log(res.data.resp)
                setRequests(res.data.resp);
            }
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
            <PopoverContent>
                <div>
                    <h3>Your Friend Requests</h3>
                    {/* {req} */}
                    {req.map((item , index)=>{
                        return(
                            <Card key={index}>
                                {item.sender}
                                {item.senderId}
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
                <div>
                    <h3>Your Friend Requests</h3>
                    {/* {req} */}
                    {req.map((item , index)=>{
                        return(
                            <Card key={index}>
                                {item.sender}
                                {item.senderId}
                            </Card>
                        )
                    })}
                </div>
            </PopoverContent>
        </Popover>
        </>
    )
}