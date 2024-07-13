"use client"
import { useEffect, useState } from "react";
import axios from "axios";
import { useRecoilState, useRecoilValue } from "recoil";
import  { userDataState } from "../../utils/recoil/state";
import { getSession } from "next-auth/react";
import { UserData } from "./userdata";


export const useFriends = () => {
  const [friends, setFriends] = useState<UserData['friends']>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const userdata = useRecoilValue(userDataState);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const session = await getSession();
        if (session?.user.id) {
          setFriends(userdata.friends);
        } else {
          console.error('Session error: user is not authenticated');
          setFriends([]);
        }
      } catch (error) {
        console.error('Error fetching session:', error);
        setFriends([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, [userdata]);

  return { friends , loading };
};