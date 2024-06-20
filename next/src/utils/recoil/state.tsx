import { atom, useSetRecoilState } from 'recoil';

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
export const mountMsgBox = atom({
  key: 'mountMsgBox',
  default: false,
});
export const CurrentChatUserId = atom({
  key: 'CurrentChatUserId',
  default: "",
});
interface friends{
  id : number,
  username : string,
  pfp : string | null,
  unreadMessageCount : number
}
export const FriendList = atom<[friends] | []>({
  key: 'FriendList',
  default: []
});
export interface UserData {
  id: number;
  username: string;
  email: string;
  pfp: string;
  friends: {
    id: number;
    username: string;
    pfp: string;
    unreadMessageCount: number;
  }[];
  notifications: number;
  pendingRequests: {
    id: number;
    username: string;
    pfp: string;
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
    pfp : "",
    friends : [],
    notifications : 0,
    pendingRequests : []
  }
})

export const refetchFriends = atom({
  key: 'refetchFriends',
  default: false,
});
