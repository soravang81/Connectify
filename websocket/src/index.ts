import { Request, Router } from "express";
import prisma from "../db/db";
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







