import { NextApiRequest } from "next";
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
    if(res){
        // console.log("succeed")
        return NextResponse.json(res);
    }
    else{
        return NextResponse.json(false)
    }
}