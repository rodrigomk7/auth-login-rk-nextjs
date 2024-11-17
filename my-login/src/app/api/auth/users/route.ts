import { connectMongoDB } from "@/app/libs/mongodb";
import User from "@/app/models/User";
import { messages } from "@/app/utils/messages";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest){
    try {
        await connectMongoDB();
        //const users = await User.find();
        // Excluye el campo 'password' con `-password`
        const users = await User.find().select('-password -_id');
        return NextResponse.json ({users}, {status: 200});
        
    } catch (error) {
        return  NextResponse.json(
            { message: messages.error.userNotFund, error},
            { status: 400, }
        );
        
    }
    
}