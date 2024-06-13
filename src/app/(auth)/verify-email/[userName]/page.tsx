"use client";
import { useToast } from "@/components/ui/use-toast";
import { verifySchema } from "@/schema/verifySchema";
import { ApiResponse } from "@/types/apiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function Verify() {
  const params = useParams<{ userName: string }>();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const response = await axios.post("/api/verify-code", {
        userName: params.userName,
        code: data.code,
      });

      toast({
        title: "Success",
        description: response.data.message,
      });

      router.replace("/sign-in");
    } catch (error) {
      console.log("Error verifying", error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message || "Error verifying",
        variant: "destructive",
      });
    }
  };
  return (
    <div className=" flex justify-center items-center min-h-screen bg-gray-100">
      <div className=" w-full max-w-md p-8 space-y-3 bg-white rounded-lg shadow-md">
        <div className=" text-center">
          <h1 className=" text-4xl font-extrabold tracking-tight lg:text-5xl">
            Verify your Account
          </h1>
          <p className=" mb-4">Enter the verification code send to your email</p>
        </div>
        <div>
               
        </div>
      </div>
    </div>
  );
}
