"use server"
import prisma from "@/db/db";
import { UserData } from "@/src/utils/hooks/userdata";

export const fetchUserData = async (id: number) => {
    try {
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
  
      const friendIdsArray = friendIds.map(friend => friend.friendId);
  
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
          ,unreadMessageCount : 0
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