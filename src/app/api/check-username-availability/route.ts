import dbConnect from "@/lib/dbConfig";
import {default as User} from "@/models/user.model";
import { userNameZodValidation } from "@/schema/signUpSchema";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";



const UserNameValidationSchema = z.object({
    userName : userNameZodValidation
})


export async function GET(req: NextRequest) {
    await dbConnect();

    try {

        const searchParams = new URL(req.url).searchParams;
        const userName = searchParams.get("userName");
        const userNameValidation = UserNameValidationSchema.safeParse({userName});

        console.log("userNameValidation", userNameValidation);

        if(!userNameValidation.success){
            const errors = userNameValidation.error.format().userName?._errors || [];
            return NextResponse.json(
                {
                    success: false,
                    message: errors.length > 0 ? errors.join(", ") : "invalid query prameters "
                }
            )
        }

        const userNameAvailable = await User.findOne({userName, isVerified: true});

        if(userNameAvailable){
            return NextResponse.json({
                success: false,
                message: "Username already taken"
            })
        }else{
            return NextResponse.json({ success: true, message: "Username available" })
        }
        
    } catch (error) {
        console.log("Error checking username availability", error);
        return NextResponse.json(
            { success: false, message: "Error checking username availability" }, { status: 500 }
        );
    }
}