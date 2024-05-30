import { Request } from "express";
import prisma from "../db/db";
import { getRequestdetails, getUserdetails } from "./lib/functions";
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
interface props {
  id :  number
}


app.post("/addfriend" , async(req, res) => {
  const {senderId , receiver ,roomId} = req.body;
  const senderid = parseInt(senderId)
  const senderInfo = await getUserdetails(senderid)
  try{ //check if the receiver exist or not
    const friend = await prisma.users.findFirst({
      where : {
        email : receiver
      }
    })
    console.log(friend)
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
      if(exists){
        return res.status(200).json({
          msg : "added"
        })
      }
      const requestAlreadyExist = await prisma.requests.findFirst({
        where : {
          AND : {
            senderId : senderid,
            receiverId : friend.id,
            status : "PENDING"
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
        await prisma.requests.create({
          data : {
            sender : senderInfo?.email,
            senderId : senderid,
            receiver,
            receiverId : friend.id,
            status : "PENDING"
          }
        })
        return res.status(201).json({
          msg : "sent"
        })
        
      }
      catch{//if unable to process prisma request
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
    return res.status(500).json({
      error : e
    })
  }
})
app.get("/requests" , async (req :Request<{}, {}, {}, props> , res)=>{
  const id = req.query.id
  const rid = parseInt(id.toString())
  try{
    const request = await prisma.requests.findMany({
      where : {
        AND : {
          receiverId : rid,
          status : "PENDING"
        }
      },
      include : {
        user : {
          select : {
            username : true,
            pfp : true
          }
        }
      }
    })
    if(request ){
      return res.json({
        request
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

app.put("/acceptrequest" , async (req , res)=>{
  const {sid , rid , action} = req.body;
  const senderId = parseInt(sid)
  const receiverId = parseInt(rid)
  try{
    if(action === "accept"){
      const requestUpdate = prisma.requests.updateMany({
        where : {
          AND : {
            senderId,
            receiverId,
            status : {
              not : "REJECTED"
            }
          }
        },
        data : {
          status : "ACCEPTED"
        }
      })
      const updateReceiver = prisma.users.update({
        where: {
          id: receiverId,
        },
        data: {
          friends: {
            push: senderId,
          },
        },
      });
      const updateSender = prisma.users.update({
        where: {
          id: senderId,
        },
        data: {
          friends: {
            push: receiverId,
          },
        },
      });
      const resp = await prisma.$transaction([ requestUpdate,updateReceiver, updateSender]);
      if(resp){
        return res.send(true)
      }
      else{
        return res.send(false)
      }
    }
    else {
      try{
        const requestUpdate = await prisma.requests.updateMany({
          where : {
            AND : {
              senderId,
              receiverId
            }
          },
          data : {
            status : "REJECTED"
          }
        })
        return res.send(true)
      }
      catch(e){
        return res.send(false)
      }
    }
  }
  catch (e){
    return console.error(e);
    
  }
})

app.get("/friends" , async (req : Request<{}, {}, {}, props> , res) =>{
  const id = req.query.id
  const rid = parseInt(id.toString())
  try{
    const resp = await prisma.users.findUnique({
      where : {
        id : rid
      },
      select : {
        friends : true
      }
    })
    if(resp!== null && resp?.friends.length > 0){
      const friendsPromises = resp.friends.map(async (fid) => {
        return await prisma.users.findUnique({
          where: {
            id: fid
          },
          select: {
            id: true,
            username: true,
            pfp: true
          }
        });
      });
      const friendsData = await Promise.all(friendsPromises);
      if(friendsData){
        return res.json({
          friend : friendsData
        })
      }
      else {
         return res.send(false)
      }
    }    
    else{
      return res.send(false)
    }
  }
  catch(e) {
    return console.error({
      error : e
    })
  }
})