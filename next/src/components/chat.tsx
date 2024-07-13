"use client";

import { useEffect, useRef, useState } from "react";
import { socket } from "../utils/socket/io";
import { Container } from "./container";
import { getSession, useSession } from "next-auth/react";
import { CurrentChatUserId,Messages,refetchUserData, } from "../utils/recoil/state";
import { useRecoilState, useRecoilStateLoadable } from "recoil";
import { messagesprop, socketmessageprop, statuss } from "../utils/types/alltypes";
import { MsgSendForm } from "./msgSendBtn";
import { getUserData } from "../utils/functions/fetchData";
import useListenMessages from "../utils/hooks/socketsListners";
import { useChatData } from "../utils/hooks/chat";
import { emitOnChatStatus } from "../utils/socket/socket";


export const ChatSection = ()=>{
    const { messages, setMessages , loading } = useChatData();
    const msgbox = useRef<HTMLDivElement>(null)
    const bottom = useRef<HTMLDivElement>(null)
    const { data : session , status } = useSession()
    const [rid , setRid] = useRecoilState<number>(CurrentChatUserId)
    console.log("rerender chatswction")
    console.log(messages)
    
    useEffect(() => {
      console.log("inside effect")
      socket.on("DIRECT_MSG", (data: socketmessageprop) => {
        const newMessage:messagesprop = {
          message: data.message,
          type: 'received',
          time: new Date(),
        };
        console.log(newMessage);
  
        setMessages((prevMessages) => {
          if (prevMessages.some((msg) => msg.message === data.message && msg.time.getTime() === newMessage.time.getTime())) {
            return prevMessages;
          }
          return [...prevMessages, newMessage];
        });
      })

      return () => {
        socket.off("DIRECT_MSG");
      };
    }, []);

    const scrollToBottom = () => {
      if (msgbox.current) {
          msgbox.current.scrollTop = msgbox.current.scrollHeight;
      }
    };
    useEffect(() => {
      scrollToBottom();
    },[messages]);


    if(loading){
      return <div>Loading...</div>
    }
    return (
      <Container className="h-full flex flex-col gap-4 text-2xl md:mt-0"> 
        <div ref={msgbox} className="overflow-hidden hover:overflow-auto gap-3 max-w-full   h-[38rem] flex flex-col pt-2 ">
            {messages.map((msg, index)=>{
              return(
                <p key={index} className={`text-2xl border w-fit max-w-auto p-1 border-foreground rounded-lg ${msg.type === "sent"? "self-end" : ""}`}>{msg.message} <span className="text-xs">{msg.time.toLocaleTimeString()}</span></p>
              )
            })}
            <div ref={bottom}></div>
        </div>
        <MsgSendForm/>
      </Container>
    );

  }
