"use client"
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { Container } from "./container";
import { useRecoilState, useRecoilValue } from "recoil";
import { encrypt } from "../utils/functions/lib";
import { useRouter } from "next/navigation";
import { FriendList, friendsFetched, mountMsgBox, refetchFriends, userData } from "../utils/recoil/state";
import { socket } from "../utils/socket/io";
import { Badge } from "./ui/badge";

interface friends{
  id : number,
  username : string,
  pfp : string | null,
  unreadMessageCount : number
}

export const FriendsList = () => {
  const { data: session , status} = useSession();
  const [userdata, setUserData] = useRecoilState(userData);
  const [friendsfetched, setFriendsFetched] = useRecoilState<boolean>(friendsFetched);
  const refetch = useRecoilValue<boolean>(refetchFriends);
  const router = useRouter()
  const [mount , setMount] = useRecoilState(mountMsgBox)
  const url = process.env.NEXT_PUBLIC_SOCKET_URL;

  const getFriends = async () => {
    if(session?.user.id && friendsfetched !== true) {
      try {
        const res = await axios.get(url + `/user/friends?id=${session.user.id}`);
        if(res.data.friend){
          console.log(res.data.friend)
          setUserData({...userdata ,
            friends : res.data.friend
          });
        }
        setFriendsFetched(true)
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    }
  };
  
  useEffect(() => {
    if (status ==="authenticated") {
      getFriends();
    }
  }, [status, refetch]);

  const handleClick = (rid : number)=>{
    const uid = encrypt(rid.toString())
    console.log(uid)
    router.push(`/chat/${uid}`)
    setUserData((prevUserData) => {//to remove the current notification count when entered chat with user , this is not ai genreated :P
      const updatedFriends = prevUserData.friends.map((friend) => {
        if (friend.id === rid) {
          return { ...friend, unreadMessageCount: 0 };
        } else {
          return friend;
        }
      });
      return { ...prevUserData, friends: updatedFriends };
    });
  }

  return (
    <Container className="overflow-hidden hover:overflow-auto h-[75vh] w-full ">
      <h2 className="text-2xl">Friends List</h2><br/>
        <div className="flex flex-col gap-2">
        {userdata.friends !==null && userdata.friends.map((friend) =>{
          if(friend){
            return ( // change the key to the recent chat ...later
              <Card key={friend.id} className="rounded-2xl border-slate-600 border-2 flex gap-4 px-1 py-1 hover:cursor-pointer" onClick={(e)=>handleClick(friend.id)}>
                <div className="m-1 rounded-full xl:p-[3%] p-5  bg-foreground">
                  {/* {typeof friend.pfp === "string" && <img src={friend.pfp} alt="img" className="" />} */}
                </div>
                <div className="flex flex-col justify-start w-full">
                  <div className="flex justify-between p-2 w-full items-center">
                    <h5 className="font-semibold text-2xl self-center" >{friend.username}</h5>
                  </div>
                </div>
                {friend.unreadMessageCount > 0 ? <Badge variant={"default"} className="self-center size-4 bg-red-500 flex justify-center items-center p-2">{friend.unreadMessageCount}</Badge> : null}
              </Card>
            )
          }
        })}
        </div>
    </Container>
  );
};