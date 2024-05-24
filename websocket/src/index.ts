import prisma from "../db/db";
import { app, io, startServer, url } from "./server";
import { SocketConnections } from "./socket";
import { Sockets, userSocket } from "./userssocket";

// start the server
const start = async () => {
  await startServer();
  SocketConnections();
}

start();

//routes  
io.use((socket, next) => {
  const userId = socket.handshake.query.userId;
  console.log("user id : ",userId);
  console.log("socket id : ",socket.id);
  if(typeof userId === "string" ){
    userSocket(userId,socket.id)
    console.log(Sockets)
  }
  next();
});

app.get("/", (req, res) => {
  res.send("hello world");
  console.log(`Frontend URL: ${url}`);
});


app.post("/addfriend" , async(req, res) => {
  const {sender ,senderId , receiver ,roomId} = req.body;
//if user send self request
  if(sender === receiver){
    return res.status(400).json({
      msg : "self"
    })
  }
  try{ //check if the receiver exist or not
    const friend = await prisma.users.findFirst({
      where : {
        email : receiver
      }
    }) //if receiver exists , check if he already a friend of sender
    if(friend){
      const exists = await prisma.users.findFirst({
        where : {
          email : sender,
          friends : {
            has : friend.username
          }
        }
      })
      if(exists){
        return res.status(200).json({
          msg : "added"
        })
      }// if is not an friend already , send the request successfully
      try{
        const requestdetails = await prisma.requests.create({
          data : {
            senderId : senderId,
            receiverId : friend.id,
            status : "PENDING"
          }
        })
        console.log(requestdetails);
        return res.status(201).json({
          msg : "sent"
        })
      }
      catch{//if unable to process prisma request
        console.log("request details not saved")
        return res.status(202).json({
          msg : "error"
        })
      }
    }
    else{// receiver does not exists
      return res.status(200).json({
        msg : "notexists"
      })
    }
  }
  catch(e){
    console.log(e)
    return res.status(500).json({
      error : e
    })
  }
})
app.post("/getrequest" , async (req , res)=>{
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