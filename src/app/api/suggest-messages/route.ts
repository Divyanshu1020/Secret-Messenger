import {GoogleGenerativeAI} from '@google/generative-ai'
import { GoogleGenerativeAIStream, OpenAIStream, StreamingTextResponse } from 'ai';
import { NextResponse } from 'next/server';


export async function POST(req: Request) {

  const genAI = new GoogleGenerativeAI(process.env.OPENAI_API_KEY!);

  const prompt = "Create a list of three open—ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous feedback social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you recently started? || lf you could have dinner with any historical figure, who would it be? || What's a simple thing that makes you happy?' .Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment."

  try {
    const geminiStream = await genAI
    .getGenerativeModel({ model: "gemini-1.5-flash" })
    .generateContentStream(prompt);

    const stream = GoogleGenerativeAIStream(geminiStream);

    return new StreamingTextResponse(stream);
  } catch (error) {
    return NextResponse.json({success: false, message: error})
  }
}