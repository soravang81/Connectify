import { io } from "./server";
import { joinRoomHandler, messageHandler } from "./socketHandlers"
import { Sockets, removeSocket, userSocket } from "./user-socket";
import { sendRequest } from "./socketHandlers";

export const SocketConnections = ()=>{
  console.log("socket server starting..")
    io.on("connection", (socket) => {
        console.log("A user connected:", socket.id);
        // io.sockets.sockets.forEach((socket) => {
        //   socket.disconnect(true); // Send a disconnect message to the client
        // });
        
        socket.on("disconnect", () => {
          removeSocket(socket.id)
          console.log("A user disconnected:", socket.id);
          console.log(Sockets);
        });

        socket.on("SEND_REQUEST" , (data)=>sendRequest(socket , data))

        socket.on('message', (data) => messageHandler(socket, data));
        
        socket.on('JOIN_ROOM', (data) => joinRoomHandler(socket, data));
        
      });
}