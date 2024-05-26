import { Container } from "@/src/components/container";
import Navbar from "../components/navbar";
import { Button } from "../components/ui/button";

export default function Home(){
    return(
      <Container className="flex flex-col">
        <Navbar/>  
        <Button variant={"default"} size={"lg"} href="/chat" className="mx-10 text-xl">Chat with user</Button>
      </Container>
    )
}
