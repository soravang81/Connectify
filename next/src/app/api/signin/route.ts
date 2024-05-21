import { NextApiRequest } from "next";
import prisma from "@/db/db";
import { NextResponse } from "next/server";

export async function POST(req:NextApiRequest) {
    const { email , password , username } = req.body;
    console.log("received")
    const res = await prisma.users.findFirst({
        where : {
            email,
            password,
            username
        }
    })
    if(res){
        console.log("succeed")
        NextResponse.redirect("/");
    }
    else{
        NextResponse.json(false)
    }
}