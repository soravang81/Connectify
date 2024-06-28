"use client"
import dotenv from "dotenv";
import { FriendsList } from "@/src/components/friends";
import { Container } from "@/src/components/container";
import { ChatSection } from "@/src/components/chat";
import { getSession, useSession } from "next-auth/react";
import Navbar from "@/src/components/navbar";
import { useEffect } from "react";
import { connect, socket } from "@/src/utils/socket/io";
import { useRecoilState } from "recoil";
import { UserData, userData } from "@/src/utils/recoil/state";
dotenv.config();

export default function (){
  const {data : session} =  useSession();
  const [userdata, setUserData] = useRecoilState<UserData>(userData);

  useEffect(()=>{
    async function emit () {
      const session = await getSession();
      session ? socket.emit("USER_DATA" , { sid : session.user.id}) : null
    }
    emit()
    socket.on("USER_DATA" , (data:UserData)=>{
      setUserData(data)
    })
    // connect()
    return (()=>{
      // socket.disconnect()
    })
  },[])
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

