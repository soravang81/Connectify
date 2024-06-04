"use client";

import { Container } from "@/src/components/container";
import Navbar from "../components/navbar";
import { FriendsList } from "../components/friends";
import { useEffect  } from "react";
import { connect, socket } from "../utils/socket/io";
import { userData } from "../utils/recoil/state";
import { useRecoilState } from "recoil";


export default function Home(){
  const [userDataState, setUserData] = useRecoilState(userData);
  useEffect(()=>{
  connect()
  return (()=>{
    socket.disconnect()
  })
  },[socket])
  socket.on("message" , (data)=>{
    //todo toast of the messages
    if(window.location.pathname === "/"){
      setUserData((prevUserData) => {
        const updatedFriends = prevUserData.friends.map((friend) =>
          {console.log(friend.unreadMessageCount)
            return(
              friend.id === data.sid
            ? { ...friend, unreadMessageCount : friend.unreadMessageCount +0.5 }
            : friend
            )//todo fix rerender here and +0.5 to +1
          }
        );
        return { ...prevUserData, friends: updatedFriends };
      });
    }
  })
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
