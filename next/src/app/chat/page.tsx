"use client";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { useEffect, useState } from "react";
import { sendMessage, handleJoinRoom } from "@/src/utils/socket/socket";
import { useSession } from "next-auth/react"
import dotenv from "dotenv";
import { socket } from "@/src/utils/socket/io";
dotenv.config();

export default function ChatArea() {
  const [message, setMessage] = useState<string>("");
  const [receivedMessage, setReceivedMessage] = useState<string>("");
  const {data : session , status} = useSession()
  useEffect(() => {
  console.log(session?.user.email)
    if(session?.user.email){
      socket.io.opts.query = {
        userEmail: session?.user.email,
      };
      socket.connect();
      socket.on("message", (data) => {
        setReceivedMessage(data);
        console.log("Received message",data)
      });
  
      socket.on("joinRoom", (data) => {
        handleJoinRoom(data);
      });
    }
    return () => {
      socket.disconnect()
    };
  }, [status]);

  const sendMessageHandler = () => {
    sendMessage("message" ,message); 
    setMessage("");
  };

  return (
    <div>
      <Input
        type="text"
        placeholder="Enter message here"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <Button variant={"default"} onClick={sendMessageHandler}>
        Submit
      </Button>
      <br />
      Received : {receivedMessage}
    </div>
  );
}
