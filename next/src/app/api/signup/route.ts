import prisma from "@/db/db";
import { NextRequest, NextResponse } from "next/server";

const url = process.env.FRONTEND_URL
export async function POST(req: NextRequest) {
    try {
        console.log("Request received");

        const { email, password, username } = await req.json();
        console.log(email, password, username);

        const res = await prisma.users.create({
            data: {
                email,
                password,
                username,
            },
            select : {
                id : true
            }
        });

        if(res){
            await prisma.profilePics.create({
                data: {
                  uid: res.id,
                },
            });
            return NextResponse.json(res);
        }
        else {
            console.error("User id is null")
        }

    }
    catch(e:any){
        console.error("Error while creating user",e.message)
        return NextResponse.json(false)
    }
}
