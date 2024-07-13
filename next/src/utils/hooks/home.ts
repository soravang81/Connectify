// "use client"
// import { useEffect } from "react";
// import { toast } from "sonner";
// import { getSession } from "next-auth/react";
// import { useRecoilState } from "recoil";
// import { socket } from "../../utils/socket/io";
// import { Messages, refetchUserData, userDataState } from "../../utils/recoil/state";
// import { messagesprop } from "@/src/utils/types/alltypes";



// export const useSocketAndRecoil = () => {
//   const [userData, setUserData] = useRecoilState(userDataState);
//   const [refetchUserDataState, setRefetchUserData] = useRecoilState(refetchUserData);
//   const [messagesState, setMessages] = useRecoilState<messagesprop[]>(Messages);

//   useEffect(() => {
//     const fetchData = async () => {
//       const session = await getSession();
//       if (session) {
//         emitStatus(session.user.id);
//         socket.on("message", handleMessage);
//       } else {
//         toast.info("You are not signed in");
//       }
//     };

//     fetchData();

//     return () => {
//       socket.off("message");
//     };
//   }, []);

//   const emitStatus = (userId: number) => {
//     const status = {
//       sid: userId,
//       status: {
//         status: "ONLINE",
//       },
//     };
//     socket.emit("STATUS", status);
//   };

//   const handleMessage = (data: SocketMessage) => {
//     console.log("received 'message' ", data);

//     const newMessage:messagesprop = {
//       message: data.message,
//       type: "received",
//       time: new Date(),
//     };

//     setMessages((prevMessages) => [...prevMessages, newMessage]);

//     if (!data.seen && window.location.pathname === "/") {
//       setUserData((prevUserData) => {
//         const updatedFriends = prevUserData.friends.map((friend) =>
//           friend.id === data.sid
//             ? { ...friend, unreadMessageCount: friend.unreadMessageCount + 1 }
//             : friend
//         );
//         return { ...prevUserData, friends: updatedFriends };
//       });

//       setRefetchUserData((prev) => !prev);
//     }
//   };

//   return { userDataState, refetchUserDataState, messagesState };
// };
