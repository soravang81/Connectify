import { NextFunction, Request, Response , RequestParamHandler } from "express";
import prisma from "../../db/db";
import { redis } from "../server";


export const saveRedisChatToDatabase = async()=>{
    redis.exists("chat" , async(err , res)=>{
        const chat = await (redis.get("chat"))
        if(res === 1 && typeof chat!== null && typeof chat== "string"){
            try{
                const data = JSON.parse(chat)
                await prisma.chat.create({
                    data : {
                        message : data.message,
                        senderId : data.sid,
                        receiverId : data.rid,
                        time : data.time
                    }
                })
                redis.del("chat")
            }
            catch(error){
                console.error("error uploading chat to db " , error)
            }
        } 
    })
}

export const cachedChat = async( req :any , res: Response , next :NextFunction ):Promise<void> => {
    const senderId = req.query.sid;
    const receiverId = req.query.rid;
    try{
        if(typeof senderId === "string" && typeof receiverId === "string"){
            const sid = parseInt(senderId);
            const rid = parseInt(receiverId);
            const key = `users:${sid}:${rid}`;
            
            redis.exists( key , async(err , rep)=>{
                if (err) {
                    console.log("Redis error:", err);
                    req.error = `Redis exists error ${err}` 
                    next()
                }
                if(rep === 1){
                    console.log("inside rep -1")
                    await redis.get(key , (err , data)=>{
                        if (err) {
                            req.error = `Redis get error ${err}` 
                            next()
                        }
                        if(typeof data ==="string"){
                            console.log("from redis")
                            req.data = JSON.parse(data);
                            next();
                        }
                        
                    })
                }
                else{
                    try{
                        const chat = await prisma.chat.findMany({
                            where : {
                                AND : {
                                    senderId: sid,
                                    receiverId: rid
                                }
                            }
                        })
                        console.log(chat)
                        if(chat.length > 0){
                            redis.set(key, JSON.stringify(chat), 'EX', 60 * 15, (err) => {
                                if (err) {  
                                    console.log(err)           
                                    req.error = "redis set error"
                                    next()
                                }
                                console.log("from prisma")
                                req.data = chat;
                                next();
                            });
                        }
                        else{
                            req.data = []               
                            req.error = "no chat found"
                            next()
                        }
                    }
                    catch(error){
                        console.log(error)
                        req.error = ("error in prisma request")
                        next()
                    }
                }
            })
        }
    }
    catch(error){
        console.log("Error in middleware:", error);
        req.error = error;
        next()
    }
}