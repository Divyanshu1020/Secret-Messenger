import dbConnect from "@/lib/dbConfig"
import { User, getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/options"
import { NextRequest, NextResponse } from "next/server"
import mongoose from "mongoose"
import UserModel from "@/models/user.model"

export async function GET() {
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user :User = session?.user as User

    if(!session || !session.user){
        return NextResponse.json({success: false, message: "Unauthorized"}, {status: 401})
    }
    const userId = new mongoose.Types.ObjectId(user._id)

    try {
        const user = await UserModel.aggregate(
            [
                {
                    $match: {
                        _id: userId
                    }
                },
                {
                    $unwind: "$messages"
                },
                {
                    $sort: {
                        "messages.createdAt": -1
                    }
                },
                {
                    $group: {
                        _id: "$_id", 
                        messages: {
                            $push: "$messages"
                        }
                    }
                }
            ]
        )

        if(!user || user.length === 0){
            return NextResponse.json({success: false, message: "user not found"}, {status: 404})
        }
        
        return NextResponse.json({success: true, messages: user[0].messages})
    } catch (error) {
        console.log("Error geting messages", error);
        return NextResponse.json({success: false, message: error})
    }

    
    
}