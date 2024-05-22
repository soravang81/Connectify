"use client"
import { Button } from "@/src/components/ui/button"
import { Dialog,DialogTrigger,DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/src/components/ui/dialog"
import { Label } from "@/src/components/ui/label"
import { Input } from "@/src/components/ui/input"
import axios from "axios"
import dotenv from "dotenv"
import { ChangeEvent, FormEvent, FormEventHandler, useState } from "react"
import { useSession } from "next-auth/react"
import { CheckIcon, GifIcon, XMarkIcon } from "@heroicons/react/24/outline"
import { Check, X } from "lucide-react"
import { socket } from "../socket"
dotenv.config();

const socketurl = process.env.NEXT_PUBLIC_SOCKET_URL
export const AddNewContactPopup = ()=>{
    const [receiver ,setEmail] = useState("")
    const {data : session} = useSession()
    const [Sent , setSent] = useState<boolean>(false)
    const [added , setAdded] = useState<boolean>(false)
    const [self , setSelf] = useState<boolean>(false)
    const [notSent , setNotSent] = useState<boolean>(false)
    const [InternalError , setInternalError] = useState<boolean>(false)

    const handleChange =(e : ChangeEvent<HTMLInputElement>)=>{
        setSent(false)
        setAdded(false)
        setSelf(false)
        setNotSent(false)
        setInternalError(false)
        setEmail(e.target.value)
    }
    async function handleSubmit(){
        if(session?.user){
            const sender = session.user.email
            console.log(sender , receiver)

        if(sender === receiver){
            setSelf(true)
        }
        else{setSelf(false)}
        }
        console.log(self)
        if(!self){
            const res = await axios.post(socketurl+"/addfriend" , {
                sender : session?.user.email,
                senderId : session?.user.id,
                receiver
            })
            // socket.emit("JOIN_ROOM" , {
            //     sender : session?.user.email,
            //     receiver
            // })
            // console.log(res , res.data)
            
            if(res.data === false){
                setInternalError(false)
                setSent(false)
                setAdded(false)
                setNotSent(true)
            }
            else if(res.data.msg === "added"){
                setInternalError(false)
                setNotSent(false)
                setSent(false)
                setAdded(true)
            }
            else if(res.data.msg === "self"){
                setInternalError(false)
                setNotSent(false)
                setSent(false)
                setAdded(false)
                setSelf(true)
            }
            else if (res.data.msg === "sent"){
                setInternalError(false)
                setNotSent(false)
                setAdded(false)
                setSent(true)
            }
            else {
                setInternalError(true)
            }
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
                    {Sent ? <div className="text-green-500 flex">Friend Request sent <Check/></div> :null}
                    {notSent ? <div className="text-red-400 flex">User does not exist <X/></div> :null}
                    {added ? <div className="text-red-400 flex">Cannot add friend twice <X/></div> :null}
                    {self ? <div className="text-red-400 flex">Cannot send friend request to yourself<X/></div> :null}
                    {InternalError ? <div className="text-red-400 flex">Internal error</div> :null}
                    <DialogFooter>
                    <Button type="button" onClick={handleSubmit} >Send</Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    )
}
