import { connectMongoDB } from "@/app/libs/mongodb";
import User, { IUserSchema } from "@/app/models/User";
import { isValidEmail } from "@/app/utils/isValidEmail";
import { messages } from "@/app/utils/messages";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
    try {
        await connectMongoDB();

        const body = await request.json();
        const { email, password, confirmPassword } = body;

        if (!email || !password || !confirmPassword) {
            return NextResponse.json(
                { message: messages.error.needProps, },
                { status: 400, }
            );
        }

        if (!isValidEmail(email)) {
            return NextResponse.json(
                { message: messages.error.emailNotValid, },
                { status: 400, }
            );
        }

        if (password != confirmPassword) {
            return NextResponse.json(
                { message: messages.error.passwordNotMatch, },
                { status: 400, }
            );
        }

        const userFind = await User.findOne({ email });

        if (userFind) {
            return NextResponse.json(
                { message: messages.error.emailExists, },
                { status: 400, }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser: IUserSchema = new User({
            email, password: hashedPassword,
        });

        //@ts-ignore
        const { password: userPass, ...rest } = newUser._doc;

        await newUser.save();

        const token = jwt.sign({ data: rest }, 'secreto', { expiresIn: 86400 }); //poner en un archivo .end

        const response = NextResponse.json(
            {
                newUser: rest,
                message: messages.success.userCreate,
            },
            { status: 200, }
        );

        response.cookies.set("auth_cookie", token, {
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 86400,
            path: "/",
        });

        return response;

    } catch (error) {
        NextResponse.json(
            { message: messages.error.default, },
            { status: 400, }
        );
    }
}