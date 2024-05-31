"use client";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { useEffect, useRef, useState } from "react";
import { sendMessage } from "@/src/utils/socket/socket";
import { socket } from "../utils/socket/io";
import { Container } from "./container";
import { Send } from "lucide-react";
import { useSession } from "next-auth/react";

interface receivedMessage{
  message : string;
  sid : number;
  time : Date;
}
interface sentMessage{
  message : string,
  sid : number,
  rid : number,
  time : Date;
}
interface messages {
  message : string,
  type : "sent" | "received"
  time : Date
}

export const ChatSection = ()=>{
    const [message, setMessage] = useState<string>("");
    const [messages, setMessages] = useState<messages[]>([]);
    const { data: session } = useSession();
    const msgbox = useRef<HTMLDivElement>(null)
    const bottom = useRef<HTMLDivElement>(null)
    const [rid, setCurrentUrl] = useState(0);
    // todo : fetch old messages from server on refresh
    useEffect(() => {
      const fetchCurrentUrl = async () => {
        if (typeof window !== 'undefined') {
          const currentUrl = window.location.href;
          const urlParts = currentUrl.split('/');
          const rid = parseInt(urlParts[urlParts.length - 1])
          setCurrentUrl(rid);
        }
      };
      fetchCurrentUrl();
    }, []);
    //sendmessage
    const sendMessageHandler = () => {
      if(session?.user.id && message!==""){
        const newMessage : sentMessage= {
          message : message,
          sid : session?.user.id,
          rid : rid,
          time : new Date()
        }
        sendMessage(newMessage)
        setMessages([...messages , {
          message : message,
          type : "sent" ,
          time : new Date()
        }])
        setMessage("");
      }
    };
    //receivemessage
    socket.on("message" , (data) => {
      const newMessage : receivedMessage = {
        message : data.message,
        sid : data.sid,
        time : new Date()
      }
      setMessages([...messages , {
        message : data.message,
        type : "received" ,
        time : new Date()
      }])
    });
    const scrollToBottom = () => {
      if (msgbox.current) {
          msgbox.current.scrollTop = msgbox.current.scrollHeight;
      }
    };
    useEffect(() => {
      scrollToBottom();
    },[messages]);

    return (
      <Container className="w-full h-[80vh] flex flex-col gap-4 text-2xl"> 
        <div className="overflow-hidden hover:overflow-auto gap-3 h-full w-full flex flex-col" ref={msgbox}>
            {messages.map((msg, index)=>{
              return(
                <p key={index} className={`text-2xl border w-fit p-1 border-foreground rounded-lg ${msg.type === "sent"? "self-end" : ""}`}>{msg.message} <span className="text-xs">{msg.time.toLocaleTimeString()}</span></p>
              )
            })}
            <div ref={bottom}></div>
        </div>
        <form className="flex gap-6" onSubmit={(e)=>e.preventDefault()}>
            <Input
            className="lg:py-7 py-5 text-xl"
            type="text"
            placeholder="Enter message here"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            />
            <Button type="submit" variant={"default"} className="rounded-full h-fit lg:p-3 p-2" onClick={sendMessageHandler}>
            <Send className="size-8"/>
            </Button>
        </form>
      </Container>
    );
  }