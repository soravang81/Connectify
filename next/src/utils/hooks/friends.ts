import { useEffect } from "react";
import axios from "axios";
import { useRecoilState, useRecoilValue } from "recoil";
import { useRouter } from "next/router";
import { socket } from "../../utils/socket/io";
import {
  CurrentChatUserId,
  UserData,
  friendsFetched,
  refetchFriends,
  userData,
} from "../../utils/recoil/state";
import { redirect } from "next/navigation";

export interface FriendProps {
  id: number;
  username: string;
  pfp: {
    path: string;
    link: string;
  }
  unreadMessageCount: number;
}

export const useFriendsList = (session: any) => {
  const [userDataState, setUserDataState] = useRecoilState(userData);
  const [friendsFetchedState, setFriendsFetchedState] = useRecoilState(friendsFetched);
  const [ridState, setRidState] = useRecoilState(CurrentChatUserId);
  const url = process.env.NEXT_PUBLIC_SOCKET_URL;

  const getFriends = async () => {
    if (session?.user.id && !friendsFetchedState) {
      try {
        const res = await axios.get(url + `/user/friends?id=${session.user.id}`);
        if (res.data.friends) {
          setUserDataState((prevData: UserData) => ({
            ...prevData,
            friends: res.data.friends,
          }));
        }
        setFriendsFetchedState(true);
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    }
  };

  const handleClick = (friendId: number) => {
    setRidState(friendId);
    setUserDataState((prevUserData: UserData) => {
      const updatedFriends = prevUserData.friends.map((friend: FriendProps) => ({
        ...friend,
        unreadMessageCount: friend.id === friendId ? 0 : friend.unreadMessageCount,
      }));
      return { ...prevUserData, friends: updatedFriends };
    });
    socket.emit("MSG_SEEN", {
      sid: session?.user.id,
      rid: friendId,
      seen: true,
    });
    redirect(`/chat/${friendId}`)
  };

  useEffect(() => {
    if (session?.user.id) {
      getFriends();
    }
  }, [session]);

  return {
    userDataState,
    friendsFetchedState,
    ridState,
    handleClick,
  };
};
