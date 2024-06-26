"use client";

import { Container } from "@/src/components/container";
import Navbar from "../components/navbar";
import { FriendsList } from "../components/friends";
import { useEffect  } from "react";
import { connect, socket } from "../utils/socket/io";
import { Messages, refetchUserData, userData } from "../utils/recoil/state";
import { useRecoilState } from "recoil";
import { Session } from "inspector";
import { getSession, useSession } from "next-auth/react";
import { messagesprop, socketmessageprop, statuss } from "../components/chat";
import { useToast } from "../components/ui/use-toast";
import { cn } from "../utils/utils";
import { Toaster, toast } from "sonner"
import { getuid } from "process";
import { getUid } from "../utils/functions/lib";

export default function Home(){
  const [userdata, setUserData] = useRecoilState(userData);
  const [refetchuserData, setRefetchUserData] = useRecoilState(refetchUserData);
  const [messages, setMessages] = useRecoilState<messagesprop[]>(Messages);
  // const {toast} = useToast()
  
  useEffect(()=>{
    console.log("home render")
    // connect()
    const isSignedIn = async()=>{
      const uid = await getUid()
      console.log(uid);
      if(!uid){
        toast.info("You are not signed in")
      }
    }
    isSignedIn();
    socket.on("message" , (data:socketmessageprop)=>{
      console.log("received 'message' ")
      const newMessage: messagesprop = {
        message: data.message,
        type: 'received',
        time: new Date(),
      };//get rid of unreadmsg smhw
      setMessages((prevMessages) => [...prevMessages, newMessage]);      

      if(data.seen === false && window.location.pathname === "/"){
        setUserData((prevUserData) => {
          const updatedFriends = prevUserData.friends.map((friend) =>
            {console.log(friend.unreadMessageCount);
            console.log(friend.id , data.sid)
            if(friend.id === data.sid){
              toast(
                <div className="flex flex-col">
                  <p className="text-xl">{friend.username}</p>
                  <p>{data.message}</p>
                </div>
              )
            }
            return(
              friend.id === data.sid
            ? { ...friend, unreadMessageCount : friend.unreadMessageCount +1 }
            : friend
            )
            }
          );
          return { ...prevUserData, friends: updatedFriends };
        });
        
      }
    setRefetchUserData(!refetchUserData)
    })
  return (()=>{
    // socket.disconnect()
    socket.off("message")
    socket.off("UNREAD_MSG")
  })
  },[])
  useEffect(()=>{
    async function emit() {
      const session = await getSession();
      if(session){
        const status : statuss =  {
          sid : session.user.id,
          status : {
            status : "ONLINE",
          }
        }
        socket.emit("STATUS" , status)
      }
      else{
        toast.info("You are not signed in")
      }
    }
    emit()
  },[])
  
    return(
      <Container className="flex flex-col min-w-screen min-h-[92.9vh] mb-0">
        <Navbar/>
        <div className="flex justify-between border-2 border-foreground rounded-xl mt-2 min-h-[87vh]">
          <FriendsList/>
          <div className="border-2 border-slate-500 w[1px] m-4"></div>
          <Container className="w-full h-[80vh] flex flex-col gap-4 text-2xl">
            {/* <ChatSection/> */}
          </Container>
        </div>
      </Container>
    )
}
