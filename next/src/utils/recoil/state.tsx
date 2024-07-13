// import { fetchCurrentUrl } from '@/src/components/chat';
import { atom, selector, useSetRecoilState } from 'recoil';
import { socket } from '../socket/io';
import { UserData } from '../hooks/userdata';
import { messagesprop } from '../types/alltypes';

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
  default : 0
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
export const selectFriends = atom<number[]>({
  key: 'selectFriends',
  default: []
});
export const getSelectedFriends = selector({
  key: 'getSelectedFriends',
  get: ({ get }) => {
    return get(selectFriends);
  },
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

export let undreadmsgcount = 0

export const userDataState = atom<UserData>({
  key: "userDataState",
  default: {
    id: 0,
    username: "",
    email: "",
    pfp: {
      path: "",
      link: "",
    },
    friends: [],
    notifications: 0,
    pendingRequests: [],
  },
});

export const refetchFriends = atom({
  key: 'refetchFriends',
  default: false,
});
