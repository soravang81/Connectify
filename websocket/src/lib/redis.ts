import { NextFunction, Request, Response , RequestParamHandler } from "express";
import prisma from "../../db/db";
import { redis } from "../server";

export interface requestt extends Request{
    sid : number,
    rid : number,
    data : any[]
}

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
                    console.error("Redis error:", err);
                    res.status(500).send("Server error");
                    return;
                }
                if(rep === 1){
                    await redis.get(`user${sid}` , (err , data)=>{
                        if (err) {
                            console.error("Redis get error:", err);
                            res.status(500).send("Server error");
                            return;
                        }
                        if(typeof data ==="string"){
                            req.data = JSON.parse(data);
                            next();
                        }
                        
                    })
                }
                else{
                    const chat = await prisma.chat.findMany({
                        where : {
                            AND: [
                                { senderId: sid, receiverId: rid },
                                { senderId: rid, receiverId: sid }
                            ]
                        }
                    })
                    if(chat.length > 0){
                        redis.set(key, JSON.stringify(chat), 'EX', 60 * 15, (err) => {
                            if (err) {
                                console.error("Redis set error:", err);
                                res.status(500).send("Server error");
                                return;
                            }
                            req.data = chat;
                            next();
                        });
                    }
                    else{
                        req.data = []               
                        console.error("no chat found")
                    }
                }
            })
        }
    }
    catch(error){
        console.error("Error in middleware:", error);
        res.status(500).send("Server error");
    }
}