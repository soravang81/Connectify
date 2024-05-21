
import { AddButton} from "@/src/components/addfriend";
import { Container } from "@/src/components/container";
import Navbar from "../components/navbar";
import { Button } from "../components/ui/button";
import { AddNewContactPopup } from "../components/addpopup";
import { socket } from "../socket";
import { joinRoom } from "../utils/socket/rooms";
import { getSession, useSession } from "next-auth/react";

// const {data :session} = useSession()
// const handleclick = async() =>{
//   const res = 
//   socket.emit("JOIN_ROOM" ,{
//   sender : session?.user.id,
//   receiver : 
// } )
// }
export default function Home(){    
    return(
      <Container className="flex flex-col">
        <Navbar/>  
        <AddButton className="absolute right-[5%] bottom-[15%]">
          <AddNewContactPopup/>
        </AddButton>
        {/* add friends card here */}
        <Button variant={"default"} size={"lg"} href="/chat" className="mx-10 text-xl">Chat with user</Button>
      </Container>
    )
}
