import express, { Request, Response } from 'express';
import { cachedChat, requestt } from '../../../lib/redis';

const chat = express.Router();

const send = (req :any, res: Response):void => {
    const chat = req.data;
    if (chat) {
        res.json(chat);
    } else {
        res.send("No chat data available");
    }
}

chat.get('/', cachedChat , send)

export default chat;