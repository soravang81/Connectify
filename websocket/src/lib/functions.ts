import prisma from "../../db/db"
import { redis } from "../server"
import { UserData } from "../socket/handlers/userdata"
import { updateUserDatatype } from "../socket/handlers/userdata"
import { Sockets } from "../socket/user-socket"
import dotenv from "dotenv"
dotenv.config()
import CryptoJS from 'crypto-js';
import user from "../routes/user/user"

interface requestProps {
    senderId? : number ,
    receiverId? : number
}

export const getUserdetails = async (data : string | number) =>{
    if(typeof data === "number"){
        const res = await prisma.users.findFirst({
            where : {
                id : data
            }
        })
    return res
    }
    else {
        const res =  await prisma.users.findFirst({
            where : {
                email : data
            }
        })
        return res
    }
}
export const getRequestdetails = async (data : requestProps) =>{
    const res = data.senderId ? await prisma.requests.findFirst({
        where : {
            senderId : data.senderId
        }
    }) : await prisma.requests.findFirst({
        where : {
            receiverId : data.receiverId
        }
    })
    return res
}
export const getSocketId = async (userId: number): Promise<string | null> => {
    const socket = Sockets.find(s => s.userId === userId);
    console.log(socket?.socketId)
    return socket?.socketId!==undefined ? socket.socketId : null;
};

export const getUserId = async (socketId : string) : Promise<number | false> =>{
    const socket = Sockets.find(s=>s.socketId === socketId)
    console.log("get user id , socket : " , socket)
    return socket?.userId!==undefined ? socket.userId : false
}

export const getKey = async(type :"chat" | "data" ,id1 : number, id2 : number): Promise<string | false>=>{
    const key = `${type}:${id1}:${id2}`;
    const reverseKey = `${type}:${id2}:${id1}`;
    let newKey: string | false;
    await redis.exists(key) ? newKey = key : await redis.exists(reverseKey) ? newKey = reverseKey : newKey = false
    return newKey
}



// export const updateUserData = async (args:updateUserDatatype)=>{
//     const key = `data:${args.id}`;
//     const userDataStr= await redis.get(key);
//     if(typeof userDataStr === 'string'){
//         const userData: UserData = JSON.parse(userDataStr);
//         args.keyy === "id" ? userData.id = (args.value as number):
//         args.keyy === "username" ? userData.username = (args.value as string):
//         args.keyy === "email" ? userData.email = (args.value as string):
//         args.keyy === "pfp" ? userData.pfp = (args.value as string):
//         args.keyy === "notifications" ? userData.notifications = userData.notifications+(args.value as number):null
//     }
// }
export const populateUserData = async (id: number) => {
    try {
      // Concurrently fetch user data, profile picture, friend IDs, friends' data, and pending requests
      const [userData, profilePic, friendIds, pendingRequests] = await Promise.all([
        prisma.users.findUnique({ where: { id } }),
        prisma.profilePics.findFirst({ where: { uid: id } }),
        prisma.friends.findMany({ where: { userId: id }, select: { friendId: true } }),
        prisma.requests.findMany({
          where: {
            receiverId: id,
            status: 'PENDING',
          },
          select: {
            createdAt: true,
            user: {
              select: {
                id: true,
                username: true,
                pfp: {
                  select: {
                    path: true,
                    link: true,
                  },
                },
              },
            },
          },
        }),
      ]);
  
      // Extract friend IDs
      const friendIdsArray = friendIds.map(friend => friend.friendId);
  
      // Fetch friends' data
      const friendsData = await prisma.users.findMany({
        where: { id: { in: friendIdsArray } },
        select: {
          id: true,
          username: true,
          email: true,
          pfp: {
            select: {
              path: true,
              link: true,
            },
          },
        },
      });
  
      if (userData && profilePic && friendsData && pendingRequests) {
        const userProfilePic = { path: profilePic.path, link: profilePic.link };
        const userFriendsData = friendsData.map(friend => ({
          ...friend,
          pfp: friend.pfp[0]
        }));
  
        const userPendingRequests = pendingRequests.map(request => ({
          ...request,
          user: {
            ...request.user,
            pfp: request.user.pfp[0]
        },
        }));
  
        const userDataToReturn: UserData = {
          id: id,
          username: userData.username,
          email: userData.email,
          pfp: userProfilePic,
          friends: userFriendsData,
          notifications: 0,
          pendingRequests: userPendingRequests,
        };
  
        console.log('Populated user data:', userDataToReturn);
        return userDataToReturn;
      }
    } catch (error) {
      console.error('Error populating user data:', error);
    } finally {
      await prisma.$disconnect();
    }
  };

export const getTimeDifference = (time: Date | string): string => {
    const timeDate = typeof time === 'string' ? new Date(time) : time;

    const timeDifference = Date.now() - timeDate.getTime();

    const minutes = Math.floor(timeDifference / (1000 * 60));

    if (minutes < 1) {
      return 'now';
    }
    else if (minutes < 5) {
      return 'few mins ago';
    }
    else if (minutes < 60) {
      return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
    }
    else if (minutes < 1440) {
      return `${Math.floor(minutes / 60)} hr${Math.floor(minutes / 60) > 1 ? 's' : ''} ago`;
    }
    else {
      return `${Math.floor(minutes / 1440)}d${Math.floor(minutes / 1440) > 1 ? 's' : ''} ago`;
    }
  };


export function encrypt(data: string): string {
    const key = "adhbaja"
    return CryptoJS.AES.encrypt(data, key).toString();
}

export function decrypt(ciphertext: string): string {
    const key = "adhbaja"
    const bytes = CryptoJS.AES.decrypt(ciphertext, key);
    return bytes.toString(CryptoJS.enc.Utf8);
}