import express, { Request, Response } from 'express';
import profile from "./profile/profile"
import request from './requests/requests';
import prisma from '../../../db/db';
import cors from 'cors';
import chat from './chat/chat';
import { redis } from '../../server';

const user = express.Router();
user.use(express.json())
user.use(cors())
user.use('/profile', profile);
user.use('/request', request);
user.use('/chat', chat);

interface props {
    id :  number
}

user.get("/friends", async (req : Request<{}, {}, {}, props> , res) => {
  const id = req.query.id;
  const rid = parseInt(id.toString());

  try {
    const resp = await prisma.users.findUnique({
      where: {
        id: rid
      },
      select: {
        friends: {
          select: {
            friend: {
              select: {
                id: true,
                username: true,
                pfp: true
              }
            }
          }
        }
      }
    });

    if (resp !== null && resp.friends.length > 0) {
      const friendsData = resp.friends.map((friendRelation) => {
        const f = friendRelation.friend;
        return {
          id: f.id,
          username: f.username,
          pfp: f.pfp,
          unreadMessageCount: 0
        };
      });

      const key = `data:${rid}`;
      console.log(key);
      const data = await redis.get(key);

      if (data) {
        try {
          const userData = JSON.parse(data);
          userData.friends = friendsData;
          await redis.set(key, JSON.stringify(userData));
          console.log("friends set successfully");
        } catch {
          console.error("Error setting friends");
        }
      }

      return res.json({
        friends: friendsData
      });
    } else {
      return res.send(false);
    }
  } catch (e) {
    console.error(e);
    return res.status(500).send(false);
  }
});
user.delete("/friend" , async(req : Request , res : Response)=>{
  const {sid , fid } = req.body
  try {
    const resp = await prisma.friends.deleteMany({
      where: {
        OR: [
          { userId: sid, friendId: fid },
          { userId: fid, friendId: sid }
        ]
      }
    });
    if (resp.count > 0) {
      const key = `data:${sid}`;
      console.log(key);
      const data = await redis.get(key);
      if (data) {
        try {
          const userData = JSON.parse(data);
          userData.friends = userData.friends.filter((friend:any) => friend.id!== fid);
          await redis.set(key, JSON.stringify(userData));
          console.log("friends set successfully");
        } catch {
          console.log("Error updating redis after deleting friend")
        }
      }
    }
  }
  catch (e) {
    console.error("Error deleting friend",e);
    return res.status(500).send(false);
  }
})

user.get("/data" , async (req : Request<{}, {}, {}, props> , res) => {
  try{
    const id = parseInt(req.query.id.toString());
    console.log("pfp id : ",id)
    const data = await prisma.profilePics.findUnique({
      where :{
        uid : id
      },
      select : {
        path : true,
        link : true
      }
    })
    if(data){
      return res.json({
        pfp : data
      })
    }
    else {
      return res.send(false)
    }
  }
  catch(error){
    console.error("Error fetching profile pic ",error)
    return res.send(false)
  }
})

user.post("/data" , async (req : Request, res:Response) => {
  try{
    const {id , path , url }:{id : number ,path : string ,url : string} = req.body
    console.log(id , path , url)
    const resp = await prisma.profilePics.update({
      where : {
        uid : id
      },
      data : {
        path,
        link : url
      }
    })
    if(resp){
      return res.status(200).send(true)
    }
    else {
      return res.send(false)
    }
  }
  catch(e){
    console.error("Error updating profile pic",e)
    return res.send(false)
  }
})

export default user;