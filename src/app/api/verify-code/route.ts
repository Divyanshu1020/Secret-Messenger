import dbConnect from "@/lib/dbConfig";
import {default as User} from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import { date } from "zod";

export async function POST(req: NextRequest){
    await dbConnect()

    try {
        
        const {userName, code} = await req.json();
        if(!userName || !code){
            return NextResponse.json(
                { success: false, message: "Invalid request parameters is missing" }, { status: 400 }
            )
        }

        const user = await User.findOne({userName});

        if(!user){
            return NextResponse.json(
                { success: false, message: "User not found" }, { status: 404 }
            )
        }

        if(user.verifyCode !== code){
            return NextResponse.json(
                { success: false, message: "Invalid code" }, { status: 400 }
            )
        }

        const verifyCodeExpiry = new Date(user.verifyCodeExpiry) < new Date()
        if(verifyCodeExpiry){
            return NextResponse.json(
                { success: false, message: "code is Expired" }, { status: 400 }
            )    
        }

        user.isVerified = true;

        await user.save();

        return NextResponse.json(
            { success: true, message: "user is verified" }, { status: 200 }
        )    
    } catch (error) {
        console.log("Error checking username availability", error);
        return NextResponse.json(
            { success: false, message: "Error checking code" }, { status: 500 }
        );
    }
}