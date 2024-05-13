import dbConnect from "@/lib/dbConfig";
import { User, getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/models/user.model";

export async function POST(req:NextRequest) {
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user :User = session?.user as User

    if(!session || !session.user){
        return NextResponse.json({success: false, message: "Unauthorized"}, {status: 401})
    }
    const userId = user._id
    const {isAcceptingMessage} = await req.json()

    try {
        const updatedUser = await UserModel.findOneAndUpdate({_id: userId}, {isAcceptingMessage}, {new: true})

        if(!updatedUser){
            return NextResponse.json({success: false, message: "faild to update isAcceptingMessage "}, {status: 404})
        }

        return NextResponse.json({success: true, message: "isAcceptingMessage updated successfully"}, {status: 200})
        
    } catch (error) {
        console.log("Error accepting messages", error);
        return NextResponse.json({success: false, message: error})
    }
}

export async function GET(req:NextRequest) {
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user :User = session?.user as User

    if(!session || !session.user){
        return NextResponse.json({success: false, message: "Unauthorized"}, {status: 401})
    }
    const userId = user._id

    try {
        const user = await UserModel.findById(userId)

        if(!user){
            return NextResponse.json({success: false, message: " user not found"}, {status: 404})
        }

        return NextResponse.json({success: true, isAcceptingMessage: user.isAcceptingMessage})
    } catch (error) {
        console.log("Error accepting messages", error);
        return NextResponse.json({success: false, message: error})
    }
}
