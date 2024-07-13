
import { Container } from "./container"
import { FriendsList } from "./friendsArea"
import { Button } from "./ui/button"

export const DashBoard = () =>{

    return (
        <Container className="">
            {/* <Button variant={"default"} size={"default"} className="px-20 py-4">Chat Now</Button> */}
            <FriendsList/>
        </Container>
    )
}