"use client"
import React, { useEffect } from 'react'
import { useFriends } from '../utils/hooks/friends'
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { UserData, useUserData } from '../utils/hooks/userdata';
import { socket } from '../utils/socket/io';
import { useSetRecoilState } from 'recoil';
import { CurrentChatUserId } from '../utils/recoil/state';
import { useRouter } from 'next/navigation';
import { Skeleton } from './ui/skeleton';

export const Friends = () => {
    const { friends, loading } = useFriends();
    const {userData,updateUser} = useUserData()
    const setFid = useSetRecoilState(CurrentChatUserId)
    const router = useRouter()

    if (loading) {
        return <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    }

    if (!friends) {
        return <div>No friends data available</div>;
    }
    const handleCardClick =(id:number)=>{
        setFid(id)
        const updatedFriends = (userData as UserData).friends.map((friend) => {
            if (friend.id === id) {
                socket.emit("MSG_SEEN", {
                    sid: userData.id,
                    rid: friend.id,
                    seen: true,
                });
                console.log("emitted seen")
                return {...friend, unreadMessageCount: 0 };
            }
            return friend;
        }
    )
        updateUser({ ...userData, friends: updatedFriends });
        console.log(id)
        router.push(`/chat/${id}`)
    }
    
    return (
        <div className="flex flex-col gap-2">
        {(friends as UserData["friends"])?.map((friend) => (
          <Card
            key={friend.id}
            className="rounded-2xl border-slate-600 border-2 h-18 flex hover:cursor-pointer"
            onClick={()=>handleCardClick(friend.id)}
          >
            <img src={userData.pfp.link} alt="img" className="aspect-square size-14 rounded-full p-1" />
            <div className="p-2 w-full">
              <h5 className="font-semibold text-2xl">{friend.username}</h5>
            </div>
            {friend.unreadMessageCount > 0 && (
                <Badge variant={"default"} className="bg-red-500 p-2 rounded-full h-6  self-center mr-4">
                  {friend.unreadMessageCount}
                </Badge>
              )}
          </Card>
        ))}
      </div>
    ); 
}
