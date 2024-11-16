import { connectMongoDB } from "@/app/libs/mongodb";
import User, { IUser } from "@/app/models/User";
import { messages } from "@/app/utils/messages";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest){
    try {
        await connectMongoDB;

        const body: IUser = await request.json();
        const { email, password} = body;

        if(!email || !password){
            return NextResponse.json(
                {
                    message: messages.error.needProps,
                },
                {
                    status: 400,
                }
            );
        }
        
        const userFind = await User.findOne({email});

        if(!userFind){
            return NextResponse.json(
                {
                    message: messages.error.userNotFund,
                },
                {
                    status: 400,
                }
            );
        }

        const isCorrect: boolean = await bcrypt.compare(
            password, 
            userFind.password
        );

        if(!isCorrect){
            return NextResponse.json(
                {
                    message: messages.error.passwordNotCorrect,
                },
                {
                    status: 400,

                }
            );
        }

         const {password: userPass, ...rest} = userFind._doc; 
         const token = jwt.sign({data:rest}, 'secreto',{expiresIn:86400}); //poner en un archivo .end
 
         const response = NextResponse.json(
            { newUser: rest, message: messages.success.userLogged,},
            { status: 200,}
        );

        response.cookies.set("auth_cookie",token,{
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 86400,
            path:"/",
        });

        return response;

    } catch (error) {
        NextResponse.json({
            message: messages.error.default,
        },{
            status: 400,
        });
        
    }

}