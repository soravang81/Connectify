import express, { Request } from 'express';
import { getSocketId, getUserdetails } from '../../../lib/functions';
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

request.post("/send", async (req, res) => {
  console.log(req.body);
  const { senderId, receiver } = req.body;
  const senderid = parseInt(senderId);
  const senderInfo = await getUserdetails(senderid);

  try {
    // Check if the receiver exists or not
    const friend = await prisma.users.findFirst({
      where: {
        email: receiver
      }
    });
    console.log(friend);

    if (friend) {
      if (senderid === friend.id) {
        return res.status(400).json({
          msg: "self"
        });
      }

      // If receiver exists, check if he is already a friend of the sender
      const exists = await prisma.friends.findFirst({
        where: {
          OR: [
            { userId: senderid, friendId: friend.id },
            { userId: friend.id, friendId: senderid }
          ]
        }
      });
      if (exists) {
        return res.status(200).json({
          msg: "added"
        });
      }

      const requestAlreadyExist = await prisma.requests.findFirst({
        where: {
          AND: {
            senderId: senderid,
            receiverId: friend.id,
            status: "PENDING"
          }
        }
      });
      if (requestAlreadyExist) {
        return res.status(200).json({
          msg: "already"
        });
      }

      // If not already a friend, send the request successfully
      try {
        await prisma.requests.create({
          data: {
            sender: senderInfo?.email,
            senderId: senderid,
            receiver,
            receiverId: friend.id,
            status: "PENDING"
          }
        });
        return res.status(201).json({
          msg: "sent"
        });
      } catch {
        // If unable to process Prisma request
        return res.status(202).json({
          msg: "error"
        });
      }
    } else {
      // Receiver does not exist
      return res.status(200).json({
        msg: "notexists"
      });
    }
  } catch (e) {
    return res.status(500).json({
      error: e
    });
  }
});


request.put("/edit", async (req, res) => {
  const { sid, rid, action } = req.body;
  const senderId = parseInt(sid);
  const receiverId = parseInt(rid);

  try {
    if (action === "accepted") {
      const requestUpdate = prisma.requests.updateMany({
        where: {
          AND: {
            senderId,
            receiverId,
            status: {
              not: "REJECTED"
            }
          }
        },
        data: {
          status: "ACCEPTED"
        }
      });

      const createFriendship1 = prisma.friends.create({
        data: {
          userId: senderId,
          friendId: receiverId
        }
      });

      const createFriendship2 = prisma.friends.create({
        data: {
          userId: receiverId,
          friendId: senderId
        }
      });

      const resp = await prisma.$transaction([requestUpdate, createFriendship1, createFriendship2]);

      if (resp) {
        return res.send(true);
      } else {
        return res.send(false);
      }
    } else {
      try {
        const requestUpdate = await prisma.requests.updateMany({
          where: {
            AND: {
              senderId,
              receiverId
            }
          },
          data: {
            status: "REJECTED"
          }
        });
        return res.send(true);
      } catch (e) {
        return res.send(false);
      }
    }
  } catch (e) {
    console.error(e);
    return res.status(500).send(false);
  }
});


export default request;