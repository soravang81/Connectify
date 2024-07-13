"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Send } from "lucide-react"
import { getSession } from "next-auth/react"
import { useRecoilState, useRecoilValue } from "recoil"
import { CurrentChatUserId, Messages } from "../utils/recoil/state"
import { sentMessage } from "../utils/types/alltypes"
import { sendMessage } from "../utils/socket/socket"
import { socket } from "../utils/socket/io"

export const MsgSendForm = () =>{
    const [message , setMessage] = useState("")
    const [messages,setMessages] = useRecoilState(Messages)
    const currentFriendId = useRecoilValue(CurrentChatUserId)

    const handleMsgSend = async ()=>{
        const session = await getSession();
        const rid = currentFriendId;
        console.log(session?.user.id , rid)

        if(session && message!=="" && rid){
          const newMessage : sentMessage = {
            message : message,
            sid : session.user.id,
            rid,
            time : new Date(),
          }
          sendMessage(newMessage)
          setMessages([...messages , {
            message : message,
            type : "sent" ,
            time : newMessage.time
          }])
          setMessage("");
          socket.emit("UNREAD_MSG" , {
            senderId : session.user.id,
            receiverId : rid, 
          })
        }
        setMessage("")  
    }
    
    return (
        <form className="flex gap-6" onSubmit={(e)=>e.preventDefault()}>
            <Input
                className="lg:py-7 py-5 text-xl"
                type="text"
                placeholder="Enter message here"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <Button type="submit" variant={"default"} className="rounded-full h-fit lg:p-3 p-2" onClick={handleMsgSend}>
                <Send className="size-8"/>
            </Button>
        </form>
    )
}