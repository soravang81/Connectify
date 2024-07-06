"use client"
import { Button } from "@/src/components/ui/button"
import { Dialog,DialogTrigger,DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/src/components/ui/dialog"
import { Label } from "@/src/components/ui/label"
import { Input } from "@/src/components/ui/input"
import axios from "axios"
import dotenv from "dotenv"
import { ChangeEvent, useState } from "react"
import { useSession } from "next-auth/react"
import { Check, UserPlus, X } from "lucide-react"
import { v4 } from "uuid"
import { socket } from "../utils/socket/io"
import { response } from "express"
import { toast } from "sonner"
dotenv.config();

const socketurl = process.env.NEXT_PUBLIC_SOCKET_URL

export const FriendRequest = ()=>{
    const [receiver ,setEmail] = useState("")
    const {data : session} = useSession()
    const [status , setStatus] = useState<string>("")

    const handleChange =(e : ChangeEvent<HTMLInputElement>)=>{
        setStatus("")
        setEmail(e.target.value)
    }
    async function handleSubmit(){
        if(session?.user){
            console.log(session.user.id)
            const res = await axios.post(socketurl+"/user/request/send" , {
                senderId : session?.user.id,
                receiver,
            })
            console.log("msggg : ",res.data.msg)
            if(res.data.msg === "sent"){
                console.log("sent request by socket")
                socket.emit("SEND_REQUEST" , {
                    senderId : session?.user.id,
                    receiver,
                    roomId : v4()
                })
            }
            switch (res.data.msg) {
                case "sent":
                  toast.success("Friend Request sent", { icon: <Check /> });
                  break;
                case "already":
                  toast.error("Friend Request already sent", { icon: <X /> });
                  break;
                case "added":
                  toast.error("User is already your friend", { icon: <X /> });
                  break;
                case "notexists":
                  toast.error("User does not exist", { icon: <X /> });
                  break;
                case "self":
                  toast.error("Cannot send friend request to yourself", { icon: <X /> });
                  break;
                case "error":
                  toast.error("Internal error");
                  break;
                default:
                  break;
              }
        }
    }

    return(
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={"ghost"} size={"icon"} className="text-sm text-foreground" ><UserPlus/>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] ">
                <DialogHeader>
                <DialogTitle className="">Send Friend request</DialogTitle>
                <DialogDescription >
                    Enter your friend's email address.
                </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col items-start p-2 gap-4">
                    <Label htmlFor="name" className="text-right">
                    email
                    </Label>
                    <Input
                    id="name"
                    placeholder="user@example.com"
                    className="col-span-3"
                    onChange={(e)=>{handleChange(e)}}
                    />
                    <DialogFooter>
                    <Button type="button" onClick={handleSubmit} >Send</Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    )
}
