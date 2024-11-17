import { messages } from "@/app/utils/messages";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "@/app/models/User";
import { connectMongoDB } from "@/app/libs/mongodb";

export async function GET(){
    try {
        const headersList = headers();
        const token = (await headersList).get('token');
        if(!token){
            return  NextResponse.json(
                { message: messages.error.tokenNotValid},
                { status: 400, }
            );
        }

        try {
            const isTokenValid = jwt.verify(token, "secreto");
            //@ts-ignore
            const {data} = isTokenValid;
            await connectMongoDB();
            
            const userfind = await User.findById(data._id);
            if(!userfind){
                return  NextResponse.json(
                    { message: messages.error.userNotFund},
                    { status: 400, }
                );
            }

            return  NextResponse.json(
                { isAuthorized: true,  message: messages.success.userAuthoprized},
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