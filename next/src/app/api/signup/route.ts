import prisma from "@/db/db";
import { NextRequest, NextResponse } from "next/server";

const url = process.env.FRONTEND_URL
export async function POST(req: NextRequest) {
    try {
        console.log("Request received");

        const { email, password, username } = await req.json();
        console.log(email, password, username);

        const user = await prisma.users.create({
            data: {
                email,
                password,
                username,
            },
        });

        if (user) {
            console.log("User creation succeeded");
            console.log(url)
            return NextResponse.json(user)
        } else {
            return NextResponse.json(false)
        }
    } catch (error:any) {
        console.error("Error occurred during user creation:", error);
        return NextResponse.json(false);
    }
}
