import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
    interface Session extends DefaultSession{
        user: {
            id: number
            // email: string
            // username: string
            // pfp?: string | null
        };
    }

    interface User extends DefaultUser {
        data : {
            id: number
            // email: string
            // username: string
            action: string
            // pfp?: string | null
        }
    }
}

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        id: number
        // email: string
        // username: string
        // pfp?: string | null
    }
}
