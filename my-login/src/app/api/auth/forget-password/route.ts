import { NextRequest,NextResponse } from "next/server";
import { Resend } from "resend";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connect } from "http2";
import { connectMongoDB } from "@/app/libs/mongodb";
import User from "@/app/models/User";
import { messages } from "@/app/utils/messages";

const resend = new Resend("re_ebR21Fn4_hMR6kKKC6qeY3RUBJg9GM5L5");

export async function POST(request:NextRequest) {
    
    try {
        const body: { email:string } = await request.json();
        const{email} = body;

        await connectMongoDB();

        const userfind = await User.findOne({email});

        if(!userfind){
            return  NextResponse.json({
                message: messages.error.userNotFund,
            },{
                status: 400,
            });
        }

        const tokendata = {
            email: userfind.email,
            userId: userfind._id
        }
        const token = jwt.sign ({data: tokendata}, "secreto", { expiresIn:86400});

        const forgetUrl = `http://localhost:3000/changed-password?token=${token}`;

        //@ts-ignore
        await resend.emails.send({
            from: "onboarding@resend.dev",
            to:email,
            subject:"Cambio de contraseña",
            //html: "<h1>Holaaa Rodrigoo </h1>"
            html: "<a href= ${forgetUrl}> Cambia tu contraseña </a>"
           //html: "<h1>Holaaa Rodrigoo </h1> <a href= ${forgetUrl} > Cambia tu contraseña </a>"
        });

        return NextResponse.json(
            { message: messages.success.emailSend },
            { status: 200 }
          );


    } catch (error) {
        NextResponse.json(
            { message: messages.error.default, error },
            {status: 400,}
        );
    }
}
