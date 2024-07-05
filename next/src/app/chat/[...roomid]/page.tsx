"use client"
import dotenv from "dotenv";
import { FriendsList } from "@/src/components/friends";
import { Container } from "@/src/components/container";
import { ChatSection } from "@/src/components/chat";
import { getSession, useSession } from "next-auth/react";
import Navbar from "@/src/components/navbar";
import { useEffect, useState } from "react";
import { connect, socket } from "@/src/utils/socket/io";
import { useRecoilState } from "recoil";
import { ChatbarBackbtn, UserData, userData } from "@/src/utils/recoil/state";
import { ChatBar } from "@/src/components/chatbar";
import { ExpandedChatBar } from "@/src/components/chatinfo";
dotenv.config();

export default function (){
  const {data : session} =  useSession();
  const [userdata, setUserData] = useRecoilState<UserData>(userData);
  const [isChatSection, setIsChatSection] = useRecoilState<boolean>(ChatbarBackbtn);
  console.log("mounted chat page")

  useEffect(()=>{
    
    session?.user.id ? console.log("inside chateffect") : null
    // connect()
    return (()=>{
      // socket.disconnect()
    })
  },[])
  if(session?.user){
    return(
      <Container className="flex flex-col min-w-screen max-h-screen mb-0">
        <Navbar/>
        <div className="flex justify-center border-2 border-foreground rounded-xl mt-2">
          <FriendsList/>
          {/* <div className="border-2 border-slate-500 w[1px] m-3"></div> */}
          <div className="flex flex-col w-full ">
            <ChatBar/>
            {isChatSection ? <ChatSection/> : <ExpandedChatBar/>}
          </div>
        </div>
      </Container>
    )
  }
}

