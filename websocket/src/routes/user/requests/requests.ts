import express, { Request } from 'express';
import { getUserdetails } from '../../../lib/functions';
import prisma from '../../../../db/db';

const request = express.Router();

interface props {
  id :  number
}
request.get("/" , async (req :Request<{}, {}, {}, props> , res)=>{
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
      select : {
        createdAt : true,
        user : {
          select : {
            id : true,
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
    console.log(e)
    return res.json({
      error : e
    })
  }
})

request.post("/send" , async(req, res) => {
  console.log(req.body)
  const {senderId , receiver } = req.body;
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

request.put("/edit" , async (req , res)=>{
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

export default request;