import { NextFunction, Request, Response , RequestParamHandler } from "express";
import prisma from "../../db/db";
import { redis } from "../server";
// import { getAllUserData } from "../lib/functions";

export interface roomprop {
    [key : string] : [number, number]
}

export const room :roomprop = {}
export const saveRedisChatToDatabase = async(key:string)=>{
    redis.exists(key , async(err , res)=>{
        if(err){
            console.log("error checking  redis exist")
        }
        const chat = await redis.get(key)
        if(res === 1 && typeof chat== "string"){
            try{
                const data = JSON.parse(chat)
                const latestMsg = data[data.length - 1];
                console.log(latestMsg)
                await prisma.chat.create({
                    data: {
                      message: latestMsg.message,
                      senderId: latestMsg.senderId,
                      receiverId: latestMsg.receiverId,
                      time: latestMsg.time,
                    },
                  });
            }
            catch(error){
                console.error("error uploading chat to db " , error)
            }
        }
        else {

        }
        {}
    })
}

export const cachedChat = async( req :any , res: Response , next :NextFunction ):Promise<void> => {
    const senderId = req.query.sid;
    const receiverId = req.query.rid;
    try{
        if(typeof senderId === "string" && typeof receiverId === "string"){
            const sid = parseInt(senderId);
            const rid = parseInt(receiverId);
            const key = `chat:${sid}:${rid}`;
            const reversedKey = `chat:${rid}:${sid}`;
            
            redis.exists( key , async(err , rep)=>{
                // console.log("inside 1st")
                if (err) {
                    console.log("Redis error:", err);
                    req.error = `Redis exists error ${err}` 
                    next()
                }
                if(rep === 1){
                    // console.log("inside rep -1")
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
                    console.log("inside else if")
                    redis.exists( reversedKey , async(err , rep)=>{
                        if (err) {
                            console.log("Redis error:", err);
                            req.error = `Redis exists error ${err}` 
                            next()
                        }
                        if(rep === 1){
                            await redis.get(reversedKey , (err , data)=>{
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
                        else {
                            try{
                                const chat = await prisma.chat.findMany({
                                    where : {
                                        OR : [{
                                            senderId: sid,
                                            receiverId: rid,
                                        },{
                                            senderId : rid,
                                            receiverId : sid
                                        }]
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
            })
        }
    }
    catch(error){
        console.log("Error in middleware:", error);
        req.error = error;
        next()
    }
}