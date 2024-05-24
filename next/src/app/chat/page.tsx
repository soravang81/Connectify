"use client";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { useEffect, useState } from "react";
import { sendMessagz, handleJoinRoom } from "@/src/utils/socket/socket";
import { useSession } from "next-auth/react"
import dotenv from "dotenv";
import { socket } from "@/src/utils/socket/io";
dotenv.config();

export default function ChatArea() {
  const [message, setMessage] = useState<string>("");
  const [receivedMessage, setReceivedMessage] = useState<string>("");
  const {data : session} = useSession()

  useEffect(() => {
    socket.io.opts.query = {
      userId: session?.user.id,
  };
    socket.connect();
    socket.on("message", (data) => {
      setReceivedMessage(data);
      console.log("Received message",receivedMessage)
    });

    socket.on("joinRoom", (data) => {
      handleJoinRoom(data);
    });

    return () => {
      // socket.disconnect();
      socket.off("message");
      socket.off("joinRoom");
    };
  }, []);

  const sendMessageHandler = () => {
    sendMessagz("message" ,message); 
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
