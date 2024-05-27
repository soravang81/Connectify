"use client";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { useEffect, useState } from "react";
import { sendMessage, handleJoinRoom } from "@/src/utils/socket/socket";
import { useSession } from "next-auth/react"
import dotenv from "dotenv";
import { connect, socket } from "@/src/utils/socket/io";
dotenv.config();

export default function ChatArea() {
  const [message, setMessage] = useState<string>("");
  const [receivedMessage, setReceivedMessage] = useState<string>("");
  
  const sendMessageHandler = () => {
    sendMessage("message" ,message); 
    setMessage("");
  };
  socket.on("message", (data) => {
    setReceivedMessage(data);
  });
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
