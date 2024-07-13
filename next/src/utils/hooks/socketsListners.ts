"use client"
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { Messages , userDataState } from '../recoil/state'; 
import { socket } from '../socket/io'; 
import { SocketMessage, messagesprop } from '../types/alltypes';
import { useToast } from '@/src/components/ui/use-toast';
import { UserData } from './userdata';

const useListenMessages = () => {
  const [messages, setMessages] = useRecoilState(Messages);
  const [userData,setUserData] = useRecoilState(userDataState);
  const { toast } = useToast()

  console.log(userData.friends)
  useEffect(() => {
    
    console.log(userData.friends)
    // return(()=>{
    //   socket.off("message");
    // })
  }, [])

  return { messages };
};

export default useListenMessages;
