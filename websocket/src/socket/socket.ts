import { io } from "../server";
import { getStatusHandler, joinRoomHandler, messageHandler, msgSeenHandler, statusHandler, unreadMessage } from "./handlers"
import { Sockets, handleDisconnect, removeSocket,userSocket } from "./user-socket";
import { sendRequest } from "./handlers";
import { saveRedisChatToDatabase } from "../redis/redis";
import { getUserId, populateUserData } from "../lib/functions";
import { getUserData } from "./handlers/userdata";
import { notificationhandler } from "./handlers/notification";

export const SocketConnections = ()=>{
  console.log("socket server starting..")
    io.on("connection", async (socket) => {
        console.log("A user connected:", socket.id);
        const id = await getUserId(socket.id)
        console.log(id)
        populateUserData(id as number)
        // io.sockets.sockets.forEach((socket) => {
        //   socket.disconnect(true); // Send a disconnect message to the client
        // });
        
        socket.on("disconnect", async() => {
          removeSocket(socket.id)
          console.log("A user disconnected:", socket.id);
          console.log(Sockets);
          handleDisconnect(socket.id)
        });

        socket.on("SEND_REQUEST" , (data)=>sendRequest(socket , data))

        socket.on('message', (data) => messageHandler(socket, data));

        socket.on("USER_DATA", (data) => getUserData(socket, data));

        socket.on("NOTIFICATION", (data) => notificationhandler(socket, data));

        socket.on('STATUS', (data) => statusHandler(socket, data));

        socket.on('GET_STATUS', (data) => getStatusHandler(socket, data));

        socket.on("MSG_SEEN" , (data) => msgSeenHandler(socket, data));
        
        socket.on('UNREAD_MSG', (data) => unreadMessage(socket, data));
        
        socket.on('JOIN_ROOM', (data) => joinRoomHandler(socket, data));
        
      });
}