import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import { createClient } from 'redis';
import { dataprop, joinRoomHandler, messageHandler } from './rooms';
import prisma from '../db/db';
import cors from "cors"
// import prisma from '../db/db';
// import { handleEvent } from './rooms';

dotenv.config(); 

const app = express();
const redis = createClient();
const httpServer = createServer(app);
app.use(express.json())
app.use(cors())

const url = process.env.FRONTEND_URL;
const port = process.env.SOCKET_PORT || 8080;
console.log(url)
export const io = new Server(httpServer, {
  cors: {
    origin: url || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  },
});

app.get("/", (req, res) => {
  res.send("hello world");
  console.log(`Frontend URL: ${url}`);
});

async function startServer() {
  try {
    await redis.connect();
    console.log("Connected to Redis");

    httpServer.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
    
  } catch (error) {
      console.error("Failed to connect to Redis", error);
  }
}

startServer();

//socket connection

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

//routes

app.post("/addfriend" , async(req, res) => {
  const {sender , receiver} = req.body;

  if(sender === receiver){
    return res.json({
      msg : "self"
    })
    // return res.json(false)
  }
  try{ 
    const friend = await prisma.users.findFirst({
      where : {
        email : receiver
      }
    })
    if(friend){
      const exists = await prisma.users.findFirst({
        where : {
          email : sender,
          friends : {
            has : friend.username
          }
        }
      })
      console.log(exists)
      if(exists){
        return res.json({
          msg : "added"
        })
      }
      else {
        const user = await prisma.users.update({
          data : {
            friends : {
              push : friend.username
            }
          },
          where : {
            email : sender
          }
        })
        if(user){
          return res.json({
            msg : "sent"
          })
        }
        else{
          return res.json(false)
        }
      }
    }
    else{
      return res.json(false)
    }
  }
  catch(e){
    console.log(e)
    return res.json({
      error  : e
    })
  }
})
app.post("/getfriend" , async (req , res)=>{
  const { email } = req.body
  try{
    const resp = await prisma.users.findMany({
      where : {
        email
      },
      select : {
        friends : true
      }
    })
    if(resp){
      return res.json({
        resp
      })
    }
    else{
      return res.json(false)
    }
  }
  catch(e) {
    return res.json({
      error : e
    })
  }
})