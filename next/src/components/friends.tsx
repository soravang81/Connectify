"use client"
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { Container } from "./container";
import { useRecoilState, useRecoilValue } from "recoil";
import { encrypt } from "../utils/functions/lib";
import { useRouter } from "next/navigation";
import { refetchFriends } from "../utils/recoil/state";

interface friends{
  id : number,
  username : string,
  pfp : string | null
}

export const FriendsList = () => {
  const { data: session } = useSession();
  const [friendList, setFriendList] = useState<[friends | null]>([null]);
  const refetch = useRecoilValue<boolean>(refetchFriends);
  const router = useRouter()
  const url = process.env.NEXT_PUBLIC_SOCKET_URL;

  const getFriends = async () => {
    if(session?.user){
      try {
        const res = await axios.get(url + `/friends?id=${session.user.id}`);
        setFriendList(res.data.friend);
        console.log(res.data.friend)
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    }
  };
  useEffect(() => {
    if (session?.user) {
      getFriends();
    }
  }, [session, url , refetch]);

  const handleClick = (rid : number)=>{
    const uid = encrypt(rid.toString())
    console.log(uid)
    router.push(`/chat/${uid}`)
    
    // if(session && session.user.id ){
    //   joinRoom({
    //     sid : session.user.id,
    //     rid
    //   })
    // }
  }

  return (
    <Container className="overflow-hidden hover:overflow-auto h-[75vh] w-full ">
      <h2 className="text-2xl">Friends List</h2><br/>
      {/* <ul> */}
        {friendList !==null && friendList?.map((friend) =>{
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
              </Card>
            )
          }
        })}
      {/* </ul> */}
    </Container>
  );
};