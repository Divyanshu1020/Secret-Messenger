import dbConnect from "@/lib/dbConfig";
import { sendVerificationEmail } from "@/lib/resendConfig";
import { default as User, default as UserModel } from "@/models/user.model";
import  bcrypt  from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    await dbConnect();
    try {
        const body = await req.json();
        const {userName, email, password} = body;
        
        const userNameTaken = await User.findOne({userName, isVerified: true});
        if(userNameTaken){
            return NextResponse.json(
                {
                    success: false,
                    message: "Username already taken"
                },
                {
                    status: 400

                }
            )
        }

        const emailTaken = await User.findOne({email});
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        if(emailTaken){
            if(emailTaken.isVerified){
                return NextResponse.json({
                    success: false,
                    message: "Email already taken"
                },{status: 400})
            }else{

                const hashPassword = await bcrypt.hash(password, 10)
        
                emailTaken.verifyCode = verifyCode;
                emailTaken.password = hashPassword;
                emailTaken.verifyCodeExpiry = new Date( Date.now() + 3600000)

                await emailTaken.save();
            }
        }else{
            const hashPassword = await bcrypt.hash(password, 10)
            const verifyCodeExpiry = new Date().setHours( new Date().getHours() + 1);
            const newUser = new UserModel({
                
                userName,
                email,
                password: hashPassword,
                isVerified: false,
                verifyCode,
                verifyCodeExpiry,
                isAcceptingMessage: false,
                messages: []
            })

            await newUser.save();
        }

        // const emailResponsce = await sendVerificationEmail(userName, email, verifyCode);
        // console.log("email response", emailResponsce);

        // if(!emailResponsce.success){
        //     return NextResponse.json(
        //         {
        //             success: false,
        //             message: emailResponsce.message
        //         },
        //         {
        //             status: 500

        //         }
        //     )
        // }

        return NextResponse.json(
            {
                success: true,
                message: "user register successfully"
            },
            {
                status: 200

            }
        )
    } catch (error) {
        console.log("Something went wrong in api/sign-up route", error);
        return NextResponse.json({success: false, message: "Something went wrong"}, {status: 500})
    }
}