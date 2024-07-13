import { Request, Router } from "express";
import prisma from "../db/db";
import * as mediasoup from "mediasoup"
import { getRequestdetails, getUserdetails } from "./lib/functions";
import { app, io, startServer, url } from "./server";
import { SocketConnections } from "./socket/socket";
import { Sockets, userSocket } from "./socket/user-socket";



// start the server
const start = async () => {
  await startServer();
  SocketConnections();
}

start();

//routes  
io.use((socket, next) => {
  const userId = socket.handshake.query.userId;
  if(userId !== undefined && typeof userId === "string"){
    const userid = parseInt(userId);
    userSocket(socket.id , userid)
    console.log(Sockets)
  }
  next();
});

app.get("/", (req, res) => {
  res.send("hello world");
  console.log(`Frontend URL: ${url}`);
});



export let mediasoupWorker:any;
export let router:any

(async () => {
  try {
    mediasoupWorker = await mediasoup.createWorker({
      rtcMinPort: 10000,
      rtcMaxPort: 10100,
    });

    router = await mediasoupWorker.createRouter({
      mediaCodecs: [
        {
          kind: 'audio',
          mimeType: 'audio/opus',
          clockRate: 48000,
          channels: 2,
        },
        {
          kind: 'video',
          mimeType: 'video/VP8',
          clockRate: 90000,
          parameters: {
            'x-google-start-bitrate': 1000,
          },
        },
      ],
    });
  } catch (err) {
    console.error('Error creating mediasoup worker:', err);
    process.exit(1);
  }
})();






