import { connectMongoDB } from "@/app/libs/mongodb";
import { messages } from "@/app/utils/messages";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "@/app/models/User";

interface BodyProps{
    newPassword: string,
    confirmPassword: string
}

export async function POST(request: NextRequest) {
    try {
        const body: BodyProps = await request.json();

        const {newPassword, confirmPassword} = body;

        if(!newPassword || !confirmPassword ){
            return  NextResponse.json(
                { message: messages.error.needProp,},
                { status: 400, }
            );
        }

        if(newPassword !== confirmPassword ){
            return  NextResponse.json(
                { message: messages.error.passwordNotMatch,},
                { status: 400, }
            );
        }


        await connectMongoDB();

        const headersList = headers();
        const token = (await headersList).get('token');

        if(!token){
            return  NextResponse.json(
                { message: messages.error.notAuthoprized,},
                { status: 400, }
            );
        }

        try {
            const isTokenValid = jwt.verify(token, "secreto");
            //@ts-ignore
            const {data} = isTokenValid;
            const userfind = await User.findOne(data.userId);

            if(!userfind){
                return  NextResponse.json(
                    { message: messages.error.userNotFund},
                    { status: 400, }
                );
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);

            userfind.password = hashedPassword;

            await userfind.save();

            return  NextResponse.json(
                { message: messages.success.passwordChanged,},
                { status: 200, }
            );

        } catch (error) {
            return  NextResponse.json(
                { message: messages.error.tokenNotValid, error},
                { status: 400, }
            );
        }


        
    } catch (error) {
         return  NextResponse.json(
                { message: messages.error.default, error},
                { status: 400, }
            );
    }
}