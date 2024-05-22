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
        }
    })
    if(res){
        // console.log("succeed")
        NextResponse.json(res);
    }
    else{
        NextResponse.json(false)
    }
}