"use client"

import { socket } from "../utils/socket/io";
import { useToast } from "../components/ui/use-toast";
import { SocketMessage } from "../utils/types/alltypes";
import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import { useUserData } from "../utils/hooks/userdata";
import { emitOnlineStatus } from "../utils/socket/socket";


export default function ClientSideComponent() {
    const { userData, updateUser } = useUserData();
    const { toast } = useToast();
    const { data: session, status } = useSession();
  
    const userDataRef = useRef(userData);
  
    useEffect(() => {
      userDataRef.current = userData;
    }, [userData]);
  
    useEffect(() => {
      if(status === "authenticated"){
        emitOnlineStatus(session?.user.id )
      }
      socket.on("message", async (data: SocketMessage) => {
        console.log("Received 'message' ", data);
        console.log(userDataRef.current, data.sid);
  
        if (!data.seen && window.location.pathname === "/") {
          const updatedFriends = userDataRef.current.friends.map((friend) => {
            if (friend.id === data.sid) {
              return { ...friend, unreadMessageCount: friend.unreadMessageCount + 1 };
            }
            return friend;
          });
          updateUser({ ...userDataRef.current, friends: updatedFriends });
        }
  
        const friend = userDataRef.current.friends.find((friend: any) => friend.id === data.sid);
        if (friend) {
          toast({
            title: "New message from " + friend?.username,
            description: data.message,
            duration: 3000,
          });
        }
      });
  
      return () => {
        socket.off("message");
      };
    }, [status,session]);
  
    return (
      <></>
    );
  }