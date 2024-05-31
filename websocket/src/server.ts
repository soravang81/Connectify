import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import { createClient } from 'redis';
import cors from "cors"
import user from './routes/user/user';
import admin from './routes/admin/admin';

dotenv.config(); 

export const app = express();
export const redis = createClient();
const httpServer = createServer(app);
const router = express.Router();

app.use('/user', user);
app.use('/admin', admin);
app.use(express.json())
app.use(cors())

export const url = process.env.FRONTEND_URL;
export const port = process.env.SOCKET_PORT || 8080;
console.log(url)
export const io = new Server(httpServer, {
  cors: {
    origin: url || "http://localhost:3000",
    // origin : "*",
    credentials: true,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  },
});

export async function startServer() {
    try {
      await redis.connect();
      console.log("Connected to Redis");
  
      httpServer.listen(port, () => {
        console.log(`Server is running on port ${port}`);
      });
      
    } catch (error) {
        console.error("Failed to connect to Redis", error);
    }
  }