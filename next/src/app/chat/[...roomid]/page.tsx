import dotenv from "dotenv";
import { FriendsList } from "@/src/components/friendsArea";
import { Container } from "@/src/components/container";
import { ChatSection } from "@/src/components/chat";
import Navbar from "@/src/components/appbar";
import { ChatBar } from "@/src/components/chatbar";
import { getServerSession } from "next-auth";
dotenv.config();

export default async function ChatPage(){
  return (
    <Container className="flex flex-col min-w-screen max-h-screen mb-0">
      <Navbar />
      <div className="flex justify-center border-2 border-foreground rounded-xl mt-2">
        <FriendsList />
        <div className="flex flex-col w-full">
          <ChatBar />
          <ChatSection />
        </div>
      </div>
    </Container>
  );
}