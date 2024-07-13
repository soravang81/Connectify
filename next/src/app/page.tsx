"use client"

import { Container } from "@/src/components/container";
import Navbar from "../components/appbar";
import { FriendsList } from "../components/friendsArea";


import dynamic from 'next/dynamic';
// Dynamically import client-side components
const ClientSideComponent = dynamic(() => import('./home'), { ssr: false });

export default function MainPage() {
  return (
    <Container className="flex flex-col min-w-screen min-h-[92.9vh] mt-0">
      <Navbar />
      <div className="flex justify-between border-2 border-foreground rounded-xl mt-2 min-h-[87vh]">
        <FriendsList />
        <div className="border-2 border-slate-500 w[1px] m-4"></div>
        <Container className="w-full h-[80vh] flex flex-col gap-4 text-2xl">
          <ClientSideComponent />
        </Container>
      </div>
    </Container>
  );
}
