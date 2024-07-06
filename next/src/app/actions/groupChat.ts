"use server";

import prisma from '@/db/db';
import Error from 'next/error';
import { promise } from 'zod';

interface GroupInfo {
  groupName: string;
  userId: number;
  pfp?: string | null;
  memberIds: number[];
}

export const createGroup = async ({ groupName, memberIds, userId }: GroupInfo): Promise<true | string> => {
  try {
    const result = await prisma.$transaction(async (prisma) => {
      // Check if a group with the same name and exact members already exists
      const existingGroup = await prisma.group.findFirst({
        where: {
          AND: [
            { name: groupName },
            {
              members: {
                every: {
                  userId: {
                    in: memberIds,
                  },
                },
              },
            },
            
          ],
        },
      });

      if (existingGroup) {
        console.error("Group already exists")
        return 'You already have a group with the same name and members'
      }

      // Create the group and add members in the transaction
      await prisma.group.create({
        data: {
          name: groupName,
          members: {
            createMany: {
              data: memberIds.map((memberId) => ({
                userId: memberId,
              })),
            },
          },
          admins: {
            create: {
              userId,
            },
          },
        },
      });
      const res = await Promise.all([result])
      if(res){
        return true
      }
      else{
        return  "Group creation failed !"
      }
    });
    return result
  } catch (error: any) {
    console.error('Error creating group:', error.message);
    return 'An error occurred while creating the group';
  }
};
