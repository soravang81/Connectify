// import CredentialsProvider from 'next-auth/providers/credentials';
// import NextAuth, { DefaultSession , Session, User , NextAuthOptions} from "next-auth"
// import axios from "axios";

// const backendUrl = process.env.BACKEND_URL || "http://localhost:3000"
// export interface userr {
//     id: string
//         email?: string | null
//         username?: string | null
//         action?: string | null
//         pfp?: string | null
//     data? : {
//         id: string
//         email?: string | null
//         username?: string | null
//         action?: string | null
//         pfp?: string | null
//     }
    
// }
// export const authOptions:NextAuthOptions = {
//     providers: [
//         CredentialsProvider({
//             name: 'Credentials',
//             credentials: {
//                 email: { label: 'Email', type: 'text', placeholder: '' },
//                 password: { label: 'Password', type: 'password' },
//                 username: { label: 'Username', type: 'text' },
//                 action: { label: 'action', type: 'text' },
//             },
//             async authorize(credentials: Record<"email" | "password" | "username" | "action", string> | undefined) {
//                 if (!credentials) {
//                     return null;
//                 }
//                 if (credentials.action === "signin") {
//                     const { email, password , username } = credentials;
//                     const user = await axios.post(`${backendUrl}/api/signin` ,
//                     { 
//                         email : email ,
//                         password :password ,
//                         username : username  
//                     }) as userr | false;
//                     if (user) {
//                         const res = user.data
//                         return res as User | null;
//                     } else {
//                         return null;
//                     }
//                 }
//                 else if (credentials.action === "signup") {
//                     const { email, password , username } = credentials;
//                     console.log(email , password , username)
//                     const user = await axios.post(`${backendUrl}/api/signup` ,{ 
//                         email : email ,
//                         password :password ,
//                         username : username  
//                     }) as userr | false;
//                     if (user) {
//                         const res = user.data
//                         console.log("user : ",user)
//                         return res as User | null;
//                     } else {
//                         return null;
//                     }
//                 }
//                 return null;
//             },
            
//         }),
//     ],
//     secret: process.env.NEXTAUTH_SECRET,
//     callbacks: {
//         async jwt({ token, user }) {
//             if (user && user.data && user.data.id) {
//                 token.id = user.data.id;
//             }
//             return token;
//         },
//         async session({ session, token }) {
//             if (token && token.id) {
//                 session.user.id = token.id;
//             }
//             console.log(session)
//             return session as Session;
//         },
//     },
//     pages :{
//         signIn : "/signin" && "/signup", 
//     }
// }