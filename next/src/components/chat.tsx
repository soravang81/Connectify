"use client";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { useEffect, useRef, useState } from "react";
import { sendMessage } from "@/src/utils/socket/socket";
import { socket } from "../utils/socket/io";
import { Container } from "./container";
import { Send } from "lucide-react";
import { getSession, useSession } from "next-auth/react";
import { CurrentChatUserId,Messages,refetchUserData, } from "../utils/recoil/state";
import { useRecoilState } from "recoil";
import axios from "axios";
import { Session } from "next-auth";

interface sentMessage{
  message : string,
  sid : number,
  rid : number,
  time : Date
}
export interface messagesprop {
  message : string,
  type : "sent" | "received"
  time : Date
}

export type status = "ONLINE" | "ONCHAT" | "OFFLINE";

export interface socketmessageprop{
    message : string;
    sid : number;
    rid : number;
    time : Date,
    seen : boolean
}
export interface statuss {
  sid : number
  status : {
    status : status
    id? : number
  }
}
export const fetchCurrentUrl = () => {
  if (typeof window !== 'undefined') {
    const currentUrl = window.location.href;
    const urlParts = currentUrl.split('/');
    const url = parseInt(urlParts[urlParts.length - 1])
    console.log(url)
    if(Number.isNaN(url)){
      return 0
    }
    return url
  }
};


export const ChatSection = ()=>{
    const [message, setMessage] = useState<string>("");
    const [messages, setMessages] = useRecoilState<messagesprop[]>(Messages);
    const msgbox = useRef<HTMLDivElement>(null)
    const bottom = useRef<HTMLDivElement>(null)
    const [fetched , setfetched] = useState(false)
    const [refetchuserData, setRefetchUserData] = useRecoilState(refetchUserData);
    const url = process.env.NEXT_PUBLIC_SOCKET_URL;
    const { data : session} = useSession();
    const sid = session?.user.id
    const currentUrl = window.location.href;
    const urlParts = currentUrl.split('/');
    const ridd = parseInt(urlParts[urlParts.length - 1])
    const [rid , setRid] = useRecoilState<number>(CurrentChatUserId)
    
    useEffect(() => {
      const url = fetchCurrentUrl()
      setRid(url as number)
      setRefetchUserData(!refetchUserData)
      console.log(sid)
      if(sid){
        const status : statuss =  {
          sid,
          status : {
            status : "ONCHAT",
            id : rid
          }
        }
        socket.emit("STATUS" , status)
      }
      // receive message
      socket.on("DIRECT_MSG", (data:socketmessageprop) => {
        const newMessage: messagesprop = {
          message: data.message,
          type: 'received',
          time: new Date(),
        };//get rid of unreadmsg smhw
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });
      return () => {
        socket.off("DIRECT_MSG");
      };
    }, []);
    //send message
    const sendMessageHandler = () => {
      console.log(sid , rid)
      if(sid && message!=="" && rid){
        const newMessage : sentMessage= {
          message : message,
          sid,
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
          senderId : sid,
          receiverId : rid, 
        })
      }
    };
    
    const scrollToBottom = () => {
      if (msgbox.current) {
          msgbox.current.scrollTop = msgbox.current.scrollHeight;
      }
    };
    useEffect(() => {
      scrollToBottom();
    },[messages]);

    //old chat
    const getData = async()=>{
      const session = await getSession();
      if(session){
        const res = await axios.get(url +`/user/chat` , {
          params : {
            sid : session.user.id,
            rid : rid,
          }
        })
        console.log(res.data)
        if(res.data.length > 0 && messages.length===0){
          console.log(res)
          console.log(sid)
          res.data.map((msg:any)=>{
            msg.sid === sid
            ? setMessages((prevmsg)=>[
              ...prevmsg , {
                message : msg.message,
                type : "sent",
                time : new Date(msg.time)
              }
            ])
            : setMessages((prevmsg)=>[
             ...prevmsg , {
              message : msg.message,
              type : "received",
              time : new Date(msg.time)
             }])
          })
        }
      }
    }
    useEffect(()=>{
      if(sid  && !Number.isNaN(rid) && rid !== 0){
        getData()
      }
    },[])

    return (
      <Container className="w-full h-full flex flex-col gap-4 text-2xl md:mt-0"> 
        <div ref={msgbox} className="overflow-hidden hover:overflow-auto gap-3 h-full w-full flex flex-col pt-2 ">
            {messages.map((msg, index)=>{
              // console.log(msg)
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