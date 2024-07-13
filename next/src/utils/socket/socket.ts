import { socket } from "./io";

import { v4 } from "uuid";
import { redirect, useRouter } from "next/navigation";
import { SocketMessage, messagesprop } from "../types/alltypes";
import { useEffect } from "react";
import { getSession } from "next-auth/react";

interface dataprop{
  message : string;
  sid : number;
  rid : number;
}
interface seen{
  rid : number;
  sid : number;
}

interface joinRoom{
  sid : number | string;
  rid : number | string;
}

export const sendMessage = (data: dataprop): void => {
  socket.emit("message", data);
};

export const joinRoom = (props:joinRoom) => {
  const roomId = v4()
    socket.emit("JOIN_ROOM" , {
      senderId : props.sid,
      receiverId : props.rid,
      roomId
    })
    redirect(`/chat/${roomId}`)
}

export const handleLeaveRoom = (data: { room : string }): void => {
console.log("User left room:", data.room);
};

export const customEventHandler = (data?: any): void => {
console.log("Received custom event:", data);
}

export const emitOnlineStatus = async (id : number) => {
  // const session = await getSession();
  // if (session) {
    socket.emit("STATUS", {
      sid : id,
      status: {
        status: "ONLINE",
      },
    });
  // }
};
export const emitOnChatStatus = async (sid : number ,rid : number) => {
  const session = await getSession();
  if (session) {
    console.log("emmiting onchat")
    socket.emit("STATUS", {
      sid,
      status: {
        status: "ONCHAT",
        id : rid
      },
    });
  }
};

// export const useSocket = () => {
//   const setMessages = useSetRecoilState(Messages)
//   // const [messages, setMessages] = useRecoilState(Messages);
//   const [userData,setUserData] = useRecoilStateLoadable(userDataState);
//   const { toast } = useToast()

//   useEffect(() => {
//     const socket = initSocket();

//     return () => {
//       closeSocket();
//     };
//   }, []);

//   return { messages };
// };