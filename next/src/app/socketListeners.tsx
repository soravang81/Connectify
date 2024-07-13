"use client";

import { useEffect } from 'react';
import useListenMessages from '../utils/hooks/socketsListners';
import { useChatData } from '../utils/hooks/chat';
import { socket } from '../utils/socket/io';
import { SocketMessage, messagesprop, socketmessageprop } from '../utils/types/alltypes';
import { useRecoilState, useRecoilStateLoadable, useSetRecoilState } from 'recoil';
import { Messages, userDataState } from '../utils/recoil/state';
import { useToast } from '../components/ui/use-toast';

const SocketListeners = ({ children }: { children: React.ReactNode }) => {
  const setMessages = useSetRecoilState(Messages)
  // const [messages, setMessages] = useRecoilState(Messages);
  const [userData,setUserData] = useRecoilStateLoadable(userDataState);
  const { toast } = useToast()
  
  // useListenMessages()
  
  // socket.on("DIRECT_MSG", (data:socketmessageprop) => {
  //   const newMessage: messagesprop = {
  //     message: data.message,
  //     type: 'received',
  //     time: new Date(),
  //   };
  //   setMessages((prevMessages) => [...prevMessages, newMessage]);
  // });
  useEffect(() => {
    // socket.on("message", (data: SocketMessage) => {
    //   console.log("Received 'message' ", data);
  
    //   // Update messages state
    //   const newMessage: messagesprop = {
    //     message: data.message,
    //     type: "received",
    //     time: new Date(),
    //   };
    //   setMessages((prevMessages) => [...prevMessages, newMessage]);
      
    //   // Send toast
    //   console.log(userData.contents , data.sid)
      
    //   // Send badge notification
    //   if (!data.seen && window.location.pathname === "/") {
    //     setUserData((prevUserData) => {
    //       const updatedFriends = prevUserData.friends.map((friend) =>
    //         friend.id === data.sid
    //           ? { ...friend, unreadMessageCount: friend.unreadMessageCount + 1 }
    //           : friend
    //       );
    //       return { ...prevUserData, friends: updatedFriends };
    //     });
    //   }
    //   const friend = userData.contents.friends.find((friend :any) => friend.id === data.sid)
    //   friend ? toast({
    //     title: "New message from "+friend?.username,
    //     description: data.message,
    //     duration: 3000,
    //   }) : null
    // })
    return () => {
      // socket.off("DIRECT_MSG");
      socket.off("message");
    };
  }, []);

  return <>{children}</>;
};

export default SocketListeners;
