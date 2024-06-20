import axios from "axios"
import { useSession } from "next-auth/react"
import { useRecoilState, useSetRecoilState } from "recoil";
import { promise } from "zod";
import { useEffect } from "react";
const url = process.env.NEXT_PUBLIC_SOCKET_URL;



// export const getOldChat = async(sid : number,rid : number)=>{
//     const setMessages = useSetRecoilState(allMessages);
//     const res = await axios.get(url +`/user/chat` , {
//       params : {
//         sid,
//         rid 
//       }
//     })
//     console.log(res.data)
//     if(res.data.length > 0){
//       res.data.map((msg:any)=>{
//         msg.senderId === sid
//         ? setMessages((prevmsg:any)=>[
//           ...prevmsg , {
//             message : msg.message,
//             type : "sent",
//             time : new Date(msg.time)
//           }
//         ])
//         : setMessages((prevmsg:any)=>[
//          ...prevmsg , {
//           message : msg.message,
//           type : "received",
//           time : new Date(msg.time)
//          }])
//       })
//     }
//   }