import axios from "axios"
import { useSession } from "next-auth/react"
import { useRecoilState } from "recoil";
import { userData } from "../recoil/state";
import { promise } from "zod";
import { useEffect } from "react";


export function useFetchData() {
    return async () => {
        const { data: session } = useSession();
        const [userDataState, setUserData] = useRecoilState(userData);

        useEffect(() => {
             // Call the fetchData function when the component mounts
        }, [session, setUserData]); // Dependency array includes session and setUserData
    };
}