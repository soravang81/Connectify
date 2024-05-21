"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; 
import { useRecoilState, useSetRecoilState } from "recoil";
import { currentUserEmail, loggedin} from "@/src/utils/recoil/state";
import { signIn } from "next-auth/react";

export default function SigninComp() {
  const [email , setEmail] = useState("")
  const [isLoggedin , setisLoggedin] = useRecoilState(loggedin)
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleClick = async () => {
    try {
      const result = await signIn('credentials', {
        email,
        password,
        action : "signin",
        redirect : false
      });

      if (result?.error) {
        console.error("Authentication failed:", result.error);
      } else {
        console.log("Authentication successful");
        setisLoggedin(true);
        // router.push("/");
      }
    } catch (error) {
      console.error("Authentication failed:", error);
    }
  }
  return (
    <div className="flex justify-center align-middle pt-20 ">
      <div className="flex flex-col justify-center align-middle border shadow-2xl p-8 lg:w-96 md:w-80 w-72  gap-8">
        <h1 className=" text-4xl font-semibold text-center">Sign in</h1>
        <p className=" text-lg font-medium text-center">Please sign in to continue.</p>
        <div className="flex flex-col justify-center align-middle gap-8">
          <input className=" p-4 border-b w-80%" type="text" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
          <input className=" p-4 border-b w-80%" type="password" placeholder="Password"  onChange={(e) => setPassword(e.target.value)} />
          <button 
            className=" bg-blue-500 p-4 rounded-lg hover:bg-blue-800" 
            onClick={handleClick}>Submit
          </button>
        </div>
        <div className="flex justify-end">
            <button className="px-6 text-blue-800 text-base font-semibold" onClick={()=>router.push("/signup")}>Signup</button>
        </div>
      </div>
    </div>
  );
};