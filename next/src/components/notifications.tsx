"use client";

import axios from "axios"
import { useSession } from "next-auth/react"
import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Button } from "./ui/button"
import { BellAlertIcon } from "@heroicons/react/24/outline"
import dotenv from "dotenv"
import { Bell } from "lucide-react"
import { Card } from "./ui/card";
dotenv.config();

export const Notifications = ()=>{
    const  {data : session} = useSession()
    const [req , setRequests] = useState<string[]>([]);

    const fetchRequests = async()=>{
        const url = process.env.NEXT_PUBLIC_SOCKET_URL
        if(url){
            const res = await axios.post(url+"/getrequests" , {
                email : session?.user.email
            })
            setRequests(res.data);
        }
    }
    return(
        <Popover>
            <PopoverTrigger asChild>
                <Button variant={"default"} size={"default"} className="text-lg " onClick={fetchRequests}><Bell/>
                </Button>
            </PopoverTrigger>
            <PopoverContent>
                <div>
                    <h3>Your Friend Requests</h3>
                    {req.map(()=>{
                        return(
                            <Card>

                            </Card>
                        )
                    })}
                </div>
            </PopoverContent>
        </Popover>
    )
}