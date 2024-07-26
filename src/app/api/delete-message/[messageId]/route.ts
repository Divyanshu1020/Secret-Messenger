import dbConnect from "@/lib/dbConfig";
import { getServerSession, User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";
import UserModel from "@/models/user.model";

export async function DELETE(req: NextRequest,{params}:{params: {messageId:string}}){
    const messageId = params.messageId
    console.log("messageId from backend", messageId);
    await dbConnect();

    const session = await getServerSession(authOptions)
    const user :User = session?.user as User

    if(!session || !session.user){
        return NextResponse.json({success: false, message: "Unauthorized"}, {status: 401})
    }
    // const userId = new mongoose.Types.ObjectId(user._id)

    try {
        const respons = await UserModel.updateOne(
            {
                _id: user._id
            },
            {
                $pull:{messages:{_id: messageId}}
            }
        )

        if(respons.modifiedCount == 0){
            return NextResponse.json({success: false, message: "Message not found or deleted"},{status : 401})
        }
        return NextResponse.json({success: false, message: "deleted"},{status : 200})
    } catch (error) {
        console.log("Error deleting message", error);
        return NextResponse.json({success: false, message: error})
    }

    
}