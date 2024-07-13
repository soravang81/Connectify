"use client"

import { useEffect } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import dotenv from "dotenv"
import { userDataState } from "../recoil/state";

export interface UserData {
    id: number;
    username: string;
    email: string;
    pfp : {
        path : string,
        link : string
    }
    friends: {
      id: number;
      email : string
      username: string;
      pfp : {
        path : string,
        link : string
      },
      unreadMessageCount: number;
    }[]
    notifications: number;
    pendingRequests: {
      user : {
        id: number;
        username: string;
        pfp: {
          path : string,
          link : string
        }
      },
      createdAt: string | Date;
    }[];
  }


  export const useUserData = () => {
    // console.log("inside useerdata")
    const [fetchedUserData,setUserData] = useRecoilState(userDataState); // Fetch user data using the selector
  
    useEffect(() => {
      setUserData(fetchedUserData); // Set the fetched user data into the userDataState atom
    }, [fetchedUserData, setUserData]);
  
    const updateUser = async (updatedUserData: UserData) => {
      try {
        setUserData(updatedUserData);
      } catch (error) {
        console.error('Error updating user data:', error);
      }
    };
  
    return { userData: fetchedUserData, updateUser };
  };