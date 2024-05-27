import prisma from "../db/db";
import { getUserdetails } from "./lib/functions";
import { app, io, startServer, url } from "./server";
import { SocketConnections } from "./socket";
import { Sockets, userSocket } from "./user-socket";

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


app.post("/addfriend" , async(req, res) => {
  const {senderId , receiver ,roomId} = req.body;
  const senderid = parseInt(senderId)
  const senderInfo = await getUserdetails(senderid)
  console.log("sender info : ",senderInfo)
  const receiverInfo = await getUserdetails(receiver)
  console.log("receiver info : ",receiverInfo)
  try{ //check if the receiver exist or not
    const friend = await prisma.users.findFirst({
      where : {
        email : receiver
      }
    }) 
    if(friend){
      if(senderid === friend.id){
        return res.status(400).json({
          msg : "self"
        })
      }
      //if receiver exists , check if he already a friend of sender
      const exists = await prisma.users.findFirst({
        where : {
          AND : {
            id : senderid,
            friends : {
              has : friend.id
            }
          }
        }
      })
      console.log(exists)
      if(exists){
        return res.status(200).json({
          msg : "added"
        })
      }
      const requestAlreadyExist = await prisma.requests.findFirst({
        where : {
          AND : {
            senderId : senderid,
            receiverId : friend.id
          }
        }
      })
      if(requestAlreadyExist){
        return res.status(200).json({
          msg : "already"
        })
      }
      // if is not an friend already , send the request successfully
      try{
        const requestdetails = await prisma.requests.create({
          data : {
            sender : senderInfo?.email,
            senderId : senderId,
            receiver,
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
app.post("/getrequests" , async (req , res)=>{
  const { id } = req.body
  console.log(id)
  try{
    const resp = await prisma.requests.findMany({
      where : {
        receiverId : id
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