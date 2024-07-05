import { fetchCurrentUrl, messagesprop } from '@/src/components/chat';
import { atom, selector, useSetRecoilState } from 'recoil';
import { socket } from '../socket/io';

export const friendsFetched = atom({
  key: 'friendsFetched',
  default: false,
});
export const notificationFetched = atom({
  key: 'notificationFetched',
  default: false,
});
export const refetchUserData = atom({
  key: 'refetchUserData',
  default: false,
});
export const ProfileSidebar = atom({
  key: 'ProfileSidebar',
  default: false,
});
export const ChatbarBackbtn = atom({
  key: 'ChatbarBackbtn',
  default: true,
});
export const isDialog = atom({
  key: 'isDialog',
  default: false,
});
export const CurrentChatUserId = atom<number>({
  key: 'CurrentChatUserId',
  default : fetchCurrentUrl()
});
interface friends{
  id : number,
  username : string,
  pfp: {
    path : string,
    link : string
  },
  unreadMessageCount : number
}
export const FriendList = atom<[friends] | []>({
  key: 'FriendList',
  default: []
});
export const Messages = atom<messagesprop[]>({
  key: "Messages",
  default: []
})
export const profilePic = atom<File | null>({
  key: 'profilePic',
  default: null,
});

export const getProfilePic = selector({
  key: 'fileLoadableState',
  get: ({ get }) => {
    const file = get(profilePic);
    return file;
  },
});
export interface UserData {
  id: number;
  username: string;
  email: string;
  pfp: {
    path : string,
    link : string
  }
  friends: {
    id: number;
    username: string;
    pfp: {
      path : string,
      link : string
    }
    unreadMessageCount: number;
  }[];
  notifications: number;
  pendingRequests: {
    user : {
      id: number;
      username: string;
      pfp: {
        path : string,
        link : string
      }
    }
    createdAt: string;
  }[];
}
export let undreadmsgcount = 0

export const userData = atom<UserData>({
  key: 'userData',
  default: {
    id : 0,
    username : "",
    email : "",
    pfp : {
      path : "",
      link : ""
    },
    friends : [],
    notifications : 0,
    pendingRequests : []
  }
})
export const refetchFriends = atom({
  key: 'refetchFriends',
  default: false,
});
