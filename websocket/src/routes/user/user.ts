import express, { Request } from 'express';
import profile from "./profile/profile"
import request from './requests/requests';
import prisma from '../../../db/db';
import cors from 'cors';
import chat from './chat/chat';
import { redis } from '../../server';
import { UserData } from '../../socket/handlers/userdata';

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
        friend: friendsData
      });
    } else {
      return res.send(false);
    }
  } catch (e) {
    console.error(e);
    return res.status(500).send(false);
  }
});



export default user;