"use client";

import { useEffect } from 'react';
import { useRecoilState, useRecoilStateLoadable, useSetRecoilState } from 'recoil';
import { getSession, useSession } from 'next-auth/react';
import { fetchUserData } from './actions/userData';
import { CurrentChatUserId, Messages, userDataState } from '../utils/recoil/state';
import { toast } from 'sonner';
import { fetchFid } from '../utils/functions/lib';

const ClientWrapper = ({ children }: { children: React.ReactNode }) => {
  const [userData,setUserData] = useRecoilState(userDataState);
  const setFriendId = useSetRecoilState(CurrentChatUserId)
  const {data : session , status }= useSession()

  // useListenMessages()
  useEffect(() => {
    const url = fetchFid()
    const initializeUserData = async () => {
      try {
        setFriendId(url as number)
        const session = await getSession();

        if (session) {
          const response = await fetchUserData(session.user.id);
          if (response) {
            console.log(response)
            setUserData(response);
          }
        } 
        else {
          console.error('User session not found');
        }
      } catch (error) {
        console.error('Error initializing user data:', error);
      }
    };

    status === "authenticated" ? initializeUserData() :
    status === "unauthenticated" ? 
    url !== `signin` && `signup`
    ? 
    toast.error('You are not signed in !' , {
      action : ({
        label: 'Signin',
        onClick: () => {
          window.location.href = '/signin';
        }
      })
    }) 
    : null : null

  }, [setUserData,status]);

  return <>{children}</>;
};

export default ClientWrapper;
