"use client"

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation"; 
import { getSession, signIn } from "next-auth/react";
import { SigninSchema } from "@/src/utils/zod/schema";
import { connect } from "@/src/utils/socket/io";
import { toast } from "sonner";

export default function SigninComp() {
  const [email,setcurEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);

  const router = useRouter();
  
  const handleClick = async (e:FormEvent) => {
    e.preventDefault()
    try {
      const parsedData = SigninSchema.safeParse({
        email,
        password,
      });
      if (!parsedData.success) {
        setError(parsedData.error.issues[0].message);
        setIsError(true)
      }
      else{
        console.log(email,
          password,)
        const res = await signIn('credentials', {
          email,
          password,
          action : "signin",
          redirect : false
        });
        if (res?.ok) {
          // const session = await getSession();
          console.log("Signup successful");
          console.log(res)
          router.push("/");
          connect()
          toast.success("Signed successfully")
        } else {
          console.error("Signup failed");
      }
      }
    } catch (error) {
      console.error("Error:", error); 
    }
  };
  return (
    <div className="flex justify-center align-middle pt-20 ">
      <div className="flex flex-col justify-center align-middle border shadow-2xl p-8 lg:w-96 md:w-80 w-72  gap-8">
        <h1 className=" text-4xl font-semibold text-center">Sign in</h1>
        <p className=" text-lg font-medium text-center">Please sign in to continue.</p>
        <div className="flex flex-col justify-center align-middle gap-8">
          <input className=" p-4 border-b w-80%" type="text" placeholder="Email" onChange={(e) => setcurEmail(e.target.value)} />
          {isError ? <div className="text-sm text-red-500 text-start pl-2">{`* ${error}`}</div> : null}
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