import { io } from "./server";
import { dataprop, joinRoomHandler, messageHandler } from "./rooms";


export const SocketConnections = ()=>{
    io.on("connection", (socket) => {
        console.log("A user connected:", socket.id);
        // io.sockets.sockets.forEach((socket) => {
        //   socket.disconnect(true); // Send a disconnect message to the client
        // });
        socket.on("disconnect", () => {
          console.log("User disconnected:", socket.id);
        });
        socket.on('message', (data : dataprop) => messageHandler(socket, data));
        socket.on('JOIN_ROOM', (data) => joinRoomHandler(socket, data));
        
      });
}