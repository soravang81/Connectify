"use client";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { useEffect, useState } from "react";
import { socket } from "@/src/socket"; // Assuming socket instance is exported from "@/src/socket"
import { sendMessagz, handleJoinRoom } from "@/src/utils/socket/socket"; // Assuming these functions are defined for sending messages and joining rooms
import dotenv from "dotenv";
dotenv.config();

export default function ChatArea() {
  const [message, setMessage] = useState<string>("");
  const [receivedMessage, setReceivedMessage] = useState<string>("");

  useEffect(() => {
    // Set up event listener for incoming messages
    socket.on("message", (data) => {
      setReceivedMessage(data);
      console.log("Received message",receivedMessage)
    });

    // Set up event listener for joining rooms
    socket.on("joinRoom", (data) => {
      handleJoinRoom(data); // Assuming this function handles joining rooms
    });

    return () => {
      // Clean up event listeners on unmount
      socket.off("message");
      socket.off("joinRoom");
    };
  }, []); // Empty dependency array ensures this effect runs only once after the initial render

  const sendMessageHandler = () => {
    sendMessagz("message" ,message); // Assuming this function sends the message to the server
    setMessage(""); // Clear the input field after sending the message
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
