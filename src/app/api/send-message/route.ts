import dbConnect from "@/lib/dbConfig";
import UserModel from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import { Message } from "@/models/user.model";

export async function POST(req:NextRequest) {
    await dbConnect()

    try {
        const {userName, content} = await req.json();

        const user = await UserModel.findOne({userName})

        if(!user) {
            return NextResponse.json({success: false, message: "User not found"})
        }

        if(!user.isAcceptingMessage) {
            return NextResponse.json({success: false, message: "User is not accepting messages"})
        }

        user.messages.push({content, createdAt: new Date()} as Message)
        await user.save()

        return NextResponse.json({success: true, message: "Message sent"})

    } catch (error) {
        console.log("Error sending message", error);
        return NextResponse.json({success: false, message: error})
    }
}    