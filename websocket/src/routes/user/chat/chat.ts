import express, { Request, Response } from 'express';
import { cachedChat } from '../../../redis/redis';

const chat = express.Router();

// const send = (req :any, res: Response):void => {
//     const chat = req.data;
//     if (chat) {
//         res.json(chat);
//     } else {
//         res.send("No chat data available");
//     }
// }

chat.get('/', cachedChat , (req :any, res: Response):void => {
    const chat = req.data;
    const error = req.error
    
    if (req.data) {
        res.json(chat);
    }
    else if(req.error){
        res.json(error)
    }
    else {
        res.send("No chat data available");
    }
    
})

export default chat;