import prisma from "../../db/db"

export const updateMsgToSeen = async({ rid, sid }: { rid: number, sid: number }) =>{
    try{
        await prisma.chat.updateMany({
            where : {
                AND : {
                    senderId : rid,
                    receiverId : sid
                }
            },
            data : {
                seen : true
            }
        })
        return true
    }
    catch{
        return false
    }
}