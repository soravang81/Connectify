import NextAuth, { DefaultSession , User } from "next-auth"
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from "axios";
import { authOptions } from "@/src/utils/authOptions/auth";

export interface userr {
    data : {
        id: string
        email?: string 
        username?: string
        action?: string
        pfp?: string
    }
    
}

const backendUrl = process.env.BACKEND_URL || "http://localhost:3000"
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }