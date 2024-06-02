"use client"
import dotenv from "dotenv";
import { FriendsList } from "@/src/components/friends";
import { Container } from "@/src/components/container";
import { ChatSection } from "@/src/components/chat";
import { getSession, useSession } from "next-auth/react";
import Navbar from "@/src/components/navbar";
import { DashBoard } from "@/src/components/dashboard";
import { useEffect } from "react";
import { socket } from "@/src/utils/socket/io";
dotenv.config();

export default function (){
  const {data : session} =  useSession();
  useEffect(()=>{
    return (()=>{
      socket.disconnect()
    })
  })
  if(session?.user){
    return(
      <Container className="flex flex-col min-w-screen min-h-[92.9vh] mb-0">
        <Navbar/>
        <div className="flex justify-between border-2 border-foreground rounded-xl mt-2 min-h-[87vh]">
          <FriendsList/>
          <div className="border-2 border-slate-500 w[1px] m-4"></div>
          <ChatSection/>
        </div>
      </Container>
    )
  }
}

