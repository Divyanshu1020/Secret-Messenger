"use client";
import { useToast } from "@/components/ui/use-toast";
import { signUpSchema } from "@/schema/signUpSchema";
import { ApiResponse } from "@/types/apiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { Axios, AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDebounceValue } from "usehooks-ts";
import { z } from "zod";

export default function Component() {
  const [userName, setUserName] = useState("");
  const [checkingUserName, setCheckingUserName] = useState(false);
  const [backendMessage, setBackendMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const debouncedUserName = useDebounceValue(userName, 500);

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      userName: "",
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    
    try {
      const response = await axios.post<ApiResponse>("/api/sign-up", data);
      toast({
        title: "Success",
        description: response.data.message,
      })

      router.replace(`/verify-email/${userName}`)
    } catch (error) {
      console.log("Error signing up", error);
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: "Error",
        description: axiosError.response?.data.message || "Error signing up",
        variant: "destructive",
      })

      setIsSubmitting(false);
    }

  }

  useEffect(() => {
    const checkUserName = async () => {
      if (debouncedUserName) {
        setCheckingUserName(true);
        setBackendMessage("");
        try {

          const response = await axios.get(
            `/api/check-username-availability?userName=${debouncedUserName}`
          );
  
          setBackendMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>
          setBackendMessage(axiosError.response?.data.message || "Error checking username availability");
        } finally {
          setCheckingUserName(false);
        }
      }
    };
    checkUserName();
  }, [debouncedUserName]);
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  );
}
-