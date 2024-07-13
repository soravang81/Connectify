import prisma from "@/db/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    const { email , password } = await req.json()
    console.log("received")
    const res = await prisma.users.findFirst({
        where : {
            AND : {
                email,
                password
            }
        },
        select : {
            id :true
        }
    })
    console.log(res)
    if(typeof res?.id === "number" ){
        // console.log("succeed")
        return NextResponse.json(res);
    }
    else{
        return NextResponse.json(false)
    }
}