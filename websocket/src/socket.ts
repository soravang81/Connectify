import { io } from "./server";
import { dataprop, joinRoomHandler, messageHandler } from "./rooms";


export const SocketConnections = ()=>{
  console.log("socket server starting..")
    io.on("connection", (socket) => {
        console.log("A user connected:", socket.id);
        // io.sockets.sockets.forEach((socket) => {
        //   socket.disconnect(true); // Send a disconnect message to the client
        // });
        socket.on("disconnect", () => {
          console.log("User disconnected:", socket.id);
        });
        socket.on("SEND_REQUEST" , (data)=>{
          console.log("sendrequest")
          socket.to(data.receiver).emit("RECEIVED_REQUEST",
            {
              sender : data.sender,
              senderId : data.senderId,
              receiver : data.receiver,
            }

          )

        })
        // console.log(joinRoom);
        socket.on('message', (data : dataprop) => messageHandler(socket, data));
        socket.on('JOIN_ROOM', (data) => joinRoomHandler(socket, data));
        
      });
}