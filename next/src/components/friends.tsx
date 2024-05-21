import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export const FriendsList = () => {
  const { data: session } = useSession();
  const [friendList, setFriendList] = useState([]);
  const url = process.env.SOCKET_URL;

  useEffect(() => {
    const getFriends = async () => {
      try {
        const res = await axios.post(url + "/getfriends", {
          email: session?.user.email,
        });
        setFriendList(res.data);
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };

    if (session) {
      getFriends();
    }
  }, [session, url]);

  return (
    <div>
      <h2>Friends List</h2>
      <ul>
        {friendList.map((friend) => (
          <li>{friend}</li>
        ))}
      </ul>
    </div>
  );
};