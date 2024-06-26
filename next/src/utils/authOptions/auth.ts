import CredentialsProvider from 'next-auth/providers/credentials';
import NextAuth, { DefaultSession , Session, User , NextAuthOptions} from "next-auth"
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const backendUrl = process.env.BACKEND_URL
export interface userr {
    data : {
        id: number
        action?: string
    } | false
    
}

export const authOptions:NextAuthOptions = {
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
                    console.log(credentials)
                    const { email, password } = credentials;
                    const user:userr  = await axios.post(`${backendUrl}/api/signin` ,
                    { 
                        email : email ,
                        password :password ,
                    })
                    if(user.data === false){
                        return null
                    } 
                    else{
                        console.log("userdata is : " ,user.data)
                        return user as User;
                    }
                }
                else if (credentials.action === "signup") {
                    try{
                        const { email, password , username } = credentials;
                    console.log(email , password , username)
                    const user = await axios.post(`${backendUrl}/api/signup` ,{ 
                        email : email ,
                        password :password ,
                        username : username  
                    }) as userr
                    console.log(user)
                    if(user.data === false){
                        return null
                    } 
                    else{
                        console.log("userdata is : " ,user.data)
                        return user as User;
                    }
                    }
                    catch(e){
                        console.log(e)
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
                // token.username = user.data.username;
                // token.email = user.data.email;
                // token.pfp = user.data.pfp;
            }
            return token;
        },
        async session({ session, token }) {
            if (token && token.id) {
                session.user.id = token.id
                // session.user.username = token.username;
                // session.user.email = token.email;
                // session.user.pfp = token.pfp;
            }
            console.log("logged in as userid : ",session.user.id)
            return session;
        },
    },
    pages :{
        signIn : "/signin" && "/signup", 
    }
}