"use client";

import { Container } from "@/src/components/container";
import Navbar from "../components/navbar";
import { Button } from "../components/ui/button";
import { DashBoard } from "../components/dashboard";
import { FriendsList } from "../components/friends";
import { ChatSection } from "../components/chat";
import { useEffect } from "react";
import { socket } from "../utils/socket/io";

export default function Home(){
  useEffect(()=>{
    return (()=>{
      socket.disconnect()
    })
  })
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
