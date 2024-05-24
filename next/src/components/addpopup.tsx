"use client"
import { Button } from "@/src/components/ui/button"
import { Dialog,DialogTrigger,DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/src/components/ui/dialog"
import { Label } from "@/src/components/ui/label"
import { Input } from "@/src/components/ui/input"
import axios from "axios"
import dotenv from "dotenv"
import { ChangeEvent, useState } from "react"
import { useSession } from "next-auth/react"
import { Check, X } from "lucide-react"
import { v4 } from "uuid"
import { socket } from "../utils/socket/io"
dotenv.config();

const socketurl = process.env.NEXT_PUBLIC_SOCKET_URL

export const AddNewContactPopup = ()=>{
    const [receiver ,setEmail] = useState("")
    const {data : session} = useSession()
    const [status , setStatus] = useState<string>("")

    const handleChange =(e : ChangeEvent<HTMLInputElement>)=>{
        setStatus("")
        setEmail(e.target.value)
    }
    async function handleSubmit(){
        if(session?.user){
            const sender = session.user.email
            console.log(sender , receiver)

        if(sender === receiver){
            setStatus("self")
            return
        }
        }
        console.log(status)
        if(status !== "self" ){
            const res = await axios.post(socketurl+"/addfriend" , {
                sender : session?.user.email,
                senderId : session?.user.id,
                receiver,
            })
            socket.emit("SEND_REQUEST" , {
                sender : session?.user.email,
                senderId : session?.user.id,
                receiver,
                roomId : v4()
            })
            setStatus(res.data.msg)
            console.log(res , res.data)
        }
    }

    return(
        <Dialog>
            <DialogTrigger>
                <Button variant={"ghost"} className="mt-2 w-full">Add new contact</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                <DialogTitle>Send Friend request</DialogTitle>
                <DialogDescription>
                    Enter your friend's username.
                </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col items-start p-2 gap-7">
                    <Label htmlFor="name" className="text-right">
                    Name
                    </Label>
                    <Input
                    id="name"
                    placeholder="user@example.com"
                    className="col-span-3"
                    onChange={(e)=>{handleChange(e)}}
                    />
                    {/* */}
                    {status === "sent" && <div className="text-green-500 flex">Friend Request sent <Check /></div>}
                    {status === "added" && <div className="text-red-400 flex gap-1"><X /> Friend Request already sent </div>}
                    {status === "notexists" && <div className="text-red-400 flex">User does not exist <X /></div>}
                    {status === "self" && <div className="text-red-400 flex">Cannot send friend request to yourself <X /></div>}
                    {status === "error" && <div className="text-red-400 flex">Internal error</div>}
                    <DialogFooter>
                    <Button type="button" onClick={handleSubmit} >Send</Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    )
}
