import { Container } from "./container";
import { Friends } from "./friends";

console.log("where am i")
export const FriendsList = () => {

  return (
    <Container className="overflow-hidden hover:overflow-auto h-[75vh] w-full">
      <h2 className="text-2xl">Friends List</h2>
      <Friends/>
    </Container>
  );
};
