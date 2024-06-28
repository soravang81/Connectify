import axios from "axios"
import { useSession } from "next-auth/react"
import { useRecoilState, useSetRecoilState } from "recoil";
import { promise } from "zod";
import { useEffect } from "react";
const url = process.env.NEXT_PUBLIC_SOCKET_URL;



export const getUserData = async(sid : number,rid : number)=>{
    
}