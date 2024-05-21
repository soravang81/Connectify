import NextAuth, { DefaultSession , User } from "next-auth"
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from "axios";

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
const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'text', placeholder: '' },
                password: { label: 'Password', type: 'password' },
                username: { label: 'Username', type: 'text' },
                action: { label: 'action', type: 'text' },
            },
            async authorize(credentials: Record<"email" | "password" | "username" | "action", string> | undefined) {
                if (!credentials) {
                    return null;
                }
                if (credentials.action === "signin") {
                    const { email, password , username } = credentials;
                    const user = await axios.post(`${backendUrl}/api/signin` ,
                    { 
                        email : email ,
                        password :password ,
                        username : username  
                    }) as userr | false;
                    if (user) {
                        const res = user.data
                        return res as User | null;
                    } else {
                        return null;
                    }
                }
                else if (credentials.action === "signup") {
                    const { email, password , username } = credentials;
                    console.log(email , password , username)
                    const user = await axios.post(`${backendUrl}/api/signup` ,{ 
                        email : email ,
                        password :password ,
                        username : username  
                    }) as userr | false;
                    if (user) {
                        const res = user.data
                        console.log("user : ",user)
                        return user as User | null;
                    } else {
                        return null;
                    }
                }
                return null;
            },
            
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({ token, user }) {
            if (user && user.data && user.data.id) {
                token.id = user.data.id;
                token.username = user.data.username;
                token.email = user.data.email;
                token.pfp = user.data.pfp;
            }
            return token;
        },
        async session({ session, token }) {
            if (token && token.id) {
                session.user.id = token.id
                session.user.username = token.username;
                session.user.email = token.email;
                session.user.pfp = token.pfp;
            }
            console.log(session)
            return session;
        },
    },
    pages :{
        signIn : "/signin" && "/signup", 
    }
})

export { handler as GET, handler as POST }