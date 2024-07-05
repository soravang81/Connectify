"use server"

import prisma from "@/db/db"
import { revalidatePath } from "next/cache";

export const unFriend = async(sid : number , fid : number)=>{
    try {
      console.log(sid , fid)
      const res = await prisma.friends.deleteMany({
        where: {
          OR: [
            { userId: sid, friendId: fid },
            { userId: fid, friendId: sid }
          ]
        }
      });
      console.log(res)
      if(res.count > 0){
        revalidatePath(`/`)
        return true
      }
      else{
        console.error("Cannot delete friend")
        return false
      }
    }
    catch (e) {
        console.error("Error deleting friend",e);
        return false
    }
}