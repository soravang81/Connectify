"use client"
import { Container } from "@/src/components/container";
import Navbar from "../components/navbar";
import { Button } from "../components/ui/button";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { socket } from "../utils/socket/io";

export default function Home(){
  const {data : session , status} = useSession()
  useEffect(() => { 
    //use only session id remove sessiongmail from all places also correct the server
  console.log(session?.user.email)
    if(session?.user.email){
      socket.io.opts.query = {
        userEmail: session?.user.email,
      };
      socket.connect();
    }
    return () => {
      socket.disconnect()
    };
  }, [status]);
    return(
      <Container className="flex flex-col">
        <Navbar/>  
        <Button variant={"default"} size={"lg"} href="/chat" className="mx-10 text-xl">Chat with user</Button>
      </Container>
    )
}
