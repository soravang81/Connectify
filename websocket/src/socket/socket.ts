import { io } from "../server";
import { getStatusHandler, joinRoomHandler, messageHandler, msgSeenHandler, statusHandler } from "./handlers"
import { Sockets, handleDisconnect, removeSocket,userSocket } from "./user-socket";
import { sendRequest } from "./handlers";
import { saveRedisChatToDatabase } from "../redis/redis";
import { getUserId } from "../lib/functions";
import { getUserData } from "./handlers/userdata";
import { router ,  } from "..";
import { notificationhandler } from "./handlers/notification";
import { onAnswer, onNegotiation, onNegotiationEnd, onOffer, onVideoEnd } from "./handlers/video";

export const SocketConnections = ()=>{
  console.log("socket server starting..")
    io.on("connection", async (socket) => {
        console.log("A user connected:", socket.id);
        const id = await getUserId(socket.id)
        console.log(id)
        // io.sockets.sockets.forEach((socket) => {
        //   socket.disconnect(true); // Send a disconnect message to the client
        // });
        
        socket.on("disconnect", async() => {
          await handleDisconnect(socket.id)
          removeSocket(socket.id)
          console.log("A user disconnected:", socket.id);
          console.log(Sockets);
        });

        socket.on("SEND_REQUEST" , (data)=>sendRequest(socket , data))

        socket.on('message', (data) => messageHandler(socket, data));

        socket.on("USER_DATA", (data) => getUserData(socket, data));

        socket.on("NOTIFICATION", (data) => notificationhandler(socket, data));

        socket.on('STATUS', (data) => statusHandler(socket, data));

        socket.on('GET_STATUS', (data) => getStatusHandler(socket, data));

        socket.on("MSG_SEEN" , (data) => msgSeenHandler(socket, data));

        socket.on("VIDEO_OFFER_OUT" , (data) => onOffer(socket, data));

        socket.on("VIDEO_ANSWER_OUT" , (data) => onAnswer(socket, data));

        socket.on("VIDEO_END" , (data) => onVideoEnd(socket, data));

        socket.on("VIDEO_NEGOTIATION_END" , (data) => onNegotiationEnd(socket, data));
        
        socket.on("VIDEO_NEGOTIATION_OUT" , (data) => onNegotiation(socket, data));
                
        socket.on('JOIN_ROOM', (data) => joinRoomHandler(socket, data));
        
        socket.on('startVideoCall', async ({ roomId }) => {
          try {
            const transport = await router.createWebRtcTransport({
              listenIps: ['0.0.0.0'],
              enableUdp: true,
              enableTcp: true,
              preferUdp: true,
            });
      
            socket.emit('roomInfo', {
              roomId,
              transportOptions: {
                id: transport.id,
                iceParameters: transport.iceParameters,
                iceCandidates: transport.iceCandidates,
                dtlsParameters: transport.dtlsParameters,
              },
            });
      
            transport.on('close', () => {
              console.log(`Transport closed for roomId=${roomId}`);
            });
          } catch (err) {
            console.error('Error creating WebRTC transport:', err);
          }
        });
      
        socket.on('connectTransport', async ({ dtlsParameters, roomId }) => {
          const transport = router.getTransportById(roomId);
          if (!transport) {
            console.error(`Transport not found for roomId=${roomId}`);
            return;
          }
          await transport.connect({ dtlsParameters });
        });
      
        socket.on('connectConsumerTransport', async ({ dtlsParameters, roomId }) => {
          const transport = router.getTransportById(roomId);
          if (!transport) {
            console.error(`Transport not found for roomId=${roomId}`);
            return;
          }
          await transport.connect({ dtlsParameters });
        });
      });
}