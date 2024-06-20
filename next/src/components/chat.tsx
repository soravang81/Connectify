"use client";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { useEffect, useRef, useState } from "react";
import { sendMessage } from "@/src/utils/socket/socket";
import { socket } from "../utils/socket/io";
import { Container } from "./container";
import { Send } from "lucide-react";
import { useSession } from "next-auth/react";
import { mountMsgBox,  refetchUserData, } from "../utils/recoil/state";
import { useRecoilState } from "recoil";
import axios from "axios";

interface sentMessage{
  message : string,
  sid : number,
  rid : number,
  time : Date;
}
export interface messagesprop {
  message : string,
  type : "sent" | "received"
  time : Date
}

export const ChatSection = ()=>{
    const [message, setMessage] = useState<string>("");
    const [messages, setMessages] = useState<messagesprop[]>([]);
    const { data: session , status } = useSession();
    const msgbox = useRef<HTMLDivElement>(null)
    const bottom = useRef<HTMLDivElement>(null)
    const [rid, setCurrentUrl] = useState(0);
    const [mount , setMount] = useRecoilState(mountMsgBox)
    const [refetchuserData, setRefetchUserData] = useRecoilState(refetchUserData);
    const url = process.env.NEXT_PUBLIC_SOCKET_URL;

    const currentUrl = window.location.href;
    const urlParts = currentUrl.split('/');
    const ridd = parseInt(urlParts[urlParts.length - 1])
    
    useEffect(() => {
      setMount(true)
      const fetchCurrentUrl = async () => {
        if (typeof window !== 'undefined') {
          const currentUrl = window.location.href;
          const urlParts = currentUrl.split('/');
          const rid = parseInt(urlParts[urlParts.length - 1])
          setCurrentUrl(rid);
        }
      };
      fetchCurrentUrl();
      setRefetchUserData(!refetchUserData)
      // receive message
      socket.on("message", (data) => {
        const newMessage: messagesprop = {
          message: data.message,
          type: 'received',
          time: new Date(),
        };
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });
      return () => {
        socket.off("message");
      };
    }, []);
    //send message
    const sendMessageHandler = () => {
      if(session?.user.id && message!==""){
        const newMessage : sentMessage= {
          message : message,
          sid : session?.user.id,
          rid : ridd,
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
          senderId : session?.user.id,
          receiverId : ridd, 
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
      if(status === "authenticated"){
        const res = await axios.get(url +`/user/chat` , {
          params : {
            sid : session?.user.id,
            rid : rid,
          }
        })
        console.log(res.data)
        if(res.data.length > 0){
          res.data.map((msg:any)=>{
            msg.senderId === session?.user.id
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
      if(session?.user.id && status === "authenticated" && typeof rid === "number" && !Number.isNaN(rid) && rid !== 0){
        getData()
      }
    },[status , rid])

    return (
      <Container className="w-full h-[80vh] flex flex-col gap-4 text-2xl"> 
        <div ref={msgbox} className="overflow-hidden hover:overflow-auto gap-3 h-full w-full flex flex-col">
            {messages.map((msg, index)=>{
              console.log(msg)
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