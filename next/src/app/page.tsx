
import { AddButton} from "@/src/components/addfriend";
import { Container } from "@/src/components/container";
import Navbar from "../components/navbar";
import { Button } from "../components/ui/button";
import { AddNewContactPopup } from "../components/addpopup";


export default function Home(){    
    return(
      <Container className="flex flex-col">
        <Navbar/>  
        <AddButton className="absolute right-[5%] bottom-[15%]">
          <AddNewContactPopup/>
        </AddButton>
        <Button variant={"default"} size={"lg"} href="/chat" className="mx-10 text-xl">Chat with user</Button>
      </Container>
    )
}
