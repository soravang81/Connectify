"use client"

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation"; 
import { signIn, useSession } from "next-auth/react";
import { SignupSchema } from "@/src/utils/zod/schema";
import { connect, socket } from "@/src/utils/socket/io";



export default function SignupComp() {
  const [email,setcurEmail] = useState<string>("")
  const [username, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);
  const { data: session , status } = useSession();

  const router = useRouter();

  // useEffect(()=>{
  //   socket.disconnect()

  //   return(()=>{
  //     if(!socket.connected){
  //       connect()
  //     }
  //   })
  // },[])
  
  const handleClick = async (e:FormEvent) => {
    e.preventDefault()
    try {
      const parsedData = SignupSchema.safeParse({
        email,
        username,
        password,
      });
      if (!parsedData.success) {
        setError(parsedData.error.issues[0].message);
        setIsError(true)
      }
      else{
        const res = await signIn('credentials', {
          email,
          password,
          username,
          action : "signup",
          redirect : false
        });
        
        if (res?.ok) {
          console.log("Signup successful");
          router.push("/");
          connect()
        }
        else{
          console.error("Signup failed");
        }
      }
    } catch (error) {
      console.error("Error:", error); 
    }
  };

  return (
    <div className="flex justify-center align-middle pt-20 ">
      <div className="flex flex-col justify-center align-middle border shadow-2xl p-8 lg:w-96 md:w-80 w-72  gap-8 ">
        <h1 className=" text-4xl font-semibold text-center">Signup</h1>
        <p className=" text-lg font-medium text-center">Please sign up to continue.</p>
        <form onChange={()=>setIsError(false)}>
        <div className="flex flex-col justify-center align-middle gap-8">
          <div className="flex justify-between">
            <input className=" p-4 border-b w-[45%] rounded-lg" type="text" placeholder="Email" onChange={(e) => {setcurEmail(e.target.value)}} />
            <input className=" p-4 border-b w-[45%] rounded-lg" type="text" placeholder="Name" onChange={(e) => setName(e.target.value)} />
          </div>
          <input className=" p-4 border-b w-80% rounded-lg" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {isError ? <div className="text-sm text-red-500 text-start pl-2">{`* ${error}`}</div> : null}
          <button 
            className=" bg-blue-500 p-4 rounded-lg hover:bg-blue-800" 
            onClick={(e)=>handleClick(e)}>Submit
          </button>
          
        </div>
        <br/>
        <div className="flex justify-end">
            <button className="px-6 text-blue-800 text-base font-semibold" onClick={()=>router.push("/signin")}>Signin</button>
        </div>
        </form>
      </div>
    </div>
  );
};