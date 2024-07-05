"use client"
import axios from "axios";
import { getSession, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { Container } from "./container";
import { useRecoilState, useRecoilValue } from "recoil";
import { encrypt } from "../utils/functions/lib";
import { useRouter } from "next/navigation";
import { CurrentChatUserId, UserData, friendsFetched,  refetchFriends, userData } from "../utils/recoil/state";
import { socket } from "../utils/socket/io";
import { Badge } from "./ui/badge";
import { getImageUrlWithPath } from "../utils/firebase/bucket";

interface friends {
  id: number;
  username: string;
  pfp: string | null;
  unreadMessageCount: number;
}

export const FriendsList = () => {
  const { data: session, status } = useSession();
  const [userdata, setUserData] = useRecoilState<UserData>(userData);
  const [friendsfetched, setFriendsFetched] = useRecoilState<boolean>(
    friendsFetched
  );
  const refetch = useRecoilValue<boolean>(refetchFriends);
  const [rid, setRid] = useRecoilState<number>(CurrentChatUserId);
  const router = useRouter();
  const url = process.env.NEXT_PUBLIC_SOCKET_URL;

  const getFriends = async () => {
    if (session?.user.id && friendsfetched !== true) {
      try {
        const res = await axios.get(url + `/user/friends?id=${session.user.id}`);
        if (res.data.friends) {
          setUserData((prevData: UserData) => ({
            ...prevData,
            friends: res.data.friends,
          }));

        }
        setFriendsFetched(true);
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    }
  };
  async function emit() {
    console.log("emit fn")
    const session = await getSession();
    if(session){
      socket.emit("USER_DATA" , { id : session.user.id})
    }
  }

  useEffect(() => {
    if (status === "authenticated") {
      socket.on("USER_DATA" , (data:UserData)=>{
        console.log(data)
        setUserData((currvalue)=>data)
      })
      emit()
      getFriends();
    }
  }, [status, refetch]);

  const handleClick = (rid: number) => {
    setRid(rid);
    router.push(`/chat/${rid}`);
    setUserData((prevUserData) => {
      const updatedFriends = prevUserData.friends.map((friend) => {
        if (friend.id === rid) {
          return { ...friend, unreadMessageCount: 0 };
        } else {
          return friend;
        }
      });
      return { ...prevUserData, friends: updatedFriends };
    });
    socket.emit("MSG_SEEN", {
      sid: session?.user.id,
      rid: rid,
      seen: true,
    });
  };

  return (
    <Container className="overflow-hidden hover:overflow-auto h-[75vh] w-full">
      <h2 className="text-2xl">Friends List</h2>
      <br />
      <div className="flex flex-col gap-2">
        {userdata.friends !== null &&
          // mappedPics &&
          userdata.friends.map((friend, index) => {
            if (friend) {
              return (
                <Card
                  key={friend.id}
                  className="rounded-2xl border-slate-600 border-2 h-18 flex gap-4 px-1 py-1 hover:cursor-pointer"
                  onClick={() => handleClick(friend.id)}
                >
                  {/* <div className="m-1 rounded-full xl:p-[3%] p-5 bg-foreground"> */}
                    <img src={userdata.pfp.link} alt="img" className="aspect-square size-14 rounded-full p-1" />
                  {/* </div> */}
                  <div className="flex flex-col justify-start w-full">
                    <div className="flex justify-between p-2 w-full items-center">
                      <h5 className="font-semibold text-2xl self-center">
                        {friend.username}
                      </h5>
                    </div>
                  </div>
                  {friend.unreadMessageCount > 0 ? (
                    <Badge
                      variant={"default"}
                      className="self-center size-4 bg-red-500 flex justify-center items-center p-2"
                    >
                      {friend.unreadMessageCount}
                    </Badge>
                  ) : null}
                </Card>
              );
            }
          })}
      </div>
    </Container>
  );
};