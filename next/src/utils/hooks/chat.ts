import axios from "axios";
import { getSession } from "next-auth/react";
import { useRecoilState } from "recoil";
import { CurrentChatUserId, Messages } from "../recoil/state";
import { useEffect, useState } from "react";
import { fetchCurrentUrl } from "../functions/lib";
import { messagesprop } from "../types/alltypes";
import { emitOnChatStatus } from "../socket/socket";

const url = process.env.NEXT_PUBLIC_SOCKET_URL;

export const useChatData = () => {
  // const ridd = fetchCurrentUrl();
  // const rid = ridd as number;
  const [messages, setMessages] = useRecoilState<messagesprop[]>(Messages);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchChatData = async () => {
      // const currentUrl = window.location.href;
      // const urlParts = currentUrl.split('/');
      const rid = fetchCurrentUrl()
      const session = await getSession();
      console.log(session?.user.id);
      if (!Number.isNaN(rid) && session && rid !== 0) {
        emitOnChatStatus(session?.user.id, (rid as number));
        setLoading(true);
        try {
          const res = await axios.get(`${url}/user/chat`, {
            params: {
              sid: session.user.id,
              rid,
            },
          });
          console.log(res.data);
          if (res.data.length > 0) {
            const newMessages = res.data.map((msg: any) => ({
              message: msg.message,
              type: msg.sid === session.user.id ? "sent" : "received",
              time: new Date(msg.time),
            }));
            setMessages(newMessages);
            setLoading(false);
          }
        } catch (error) {
          console.error("Error fetching chat data:", error);
        } finally {
        }
      }
    };
    fetchChatData();
  }, [ setMessages]);

  return { messages, setMessages, loading };
};
