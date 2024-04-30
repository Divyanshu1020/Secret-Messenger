import { ApiResponse } from '@/types/apiResponse';
import { Resend } from 'resend';
import VerificationEmail from '../../emailTemplate/verification';

export const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(
    userName:string,
    email:string,
    otp:string
): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Verification',
            react: VerificationEmail({userName, otp})
          });
          return {success: true, message: "Email sent successfully"}

    } catch (emailError) {
        console.log("Error sending verification email", emailError);
        return {success: false, message: "Error sending verification email"}
    }
}