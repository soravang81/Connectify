"use client";

import { Container } from "@/src/components/container";
import Navbar from "../components/navbar";
import { FriendsList } from "../components/friends";
import { useEffect  } from "react";
import { connect, socket } from "../utils/socket/io";
import { refetchUserData, userData } from "../utils/recoil/state";
import { useRecoilState } from "recoil";
import { Session } from "inspector";
import { getSession, useSession } from "next-auth/react";
import { statuss } from "../components/chat";

export default function Home(){
  const [userDataState, setUserData] = useRecoilState(userData);
  const [refetchuserData, setRefetchUserData] = useRecoilState(refetchUserData);
  
  useEffect(()=>{
    console.log("home render")
    // connect()
    socket.on("UNREAD_MSG" , (data)=> {
      console.log("received event " , data)
      if(window.location.pathname === "/"){
          setUserData((prevUserData) => {
            const updatedFriends = prevUserData.friends.map((friend) =>
              {console.log(friend.unreadMessageCount);
              console.log(friend.id , data.senderId)
                return(
                  friend.id === data.senderId
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
