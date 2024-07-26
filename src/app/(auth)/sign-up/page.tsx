"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { signUpSchema } from "@/schema/signUpSchema";
import { ApiResponse } from "@/types/apiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { Axios, AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDebounceCallback } from "usehooks-ts";
import { z } from "zod";

export default function Component() {
  const [userName, setUserName] = useState("");
  const [checkingUserName, setCheckingUserName] = useState(false);
  const [backendMessage, setBackendMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const debouncedUserName = useDebounceCallback(setUserName, 500);

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      userName: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);

    try {
      const response = await axios.post<ApiResponse>("/api/sign-up", data);
      toast({
        title: "Success",
        description: response.data.message,
      });

      router.replace(`/verify-email/${userName}`);
    } catch (error) {
      console.log("Error signing up", error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message || "Error signing up",
        variant: "destructive",
      });

      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const checkUserName = async () => {
      if (userName) {
        setCheckingUserName(true);
        setBackendMessage("");
        try {
          const response = await axios.post(
            `/api/check-username-availability?userName=${userName}`,{userName}
          );

          setBackendMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setBackendMessage(
            axiosError.response?.data.message ||
              "Error checking username availability"
          );
        } finally {
          setCheckingUserName(false);
        }
      }
    };
    checkUserName();
  }, [userName]);
  return (
    <>
      <div className=" flex justify-center items-center min-h-screen bg-gray-100">
        <div className=" w-full max-w-md p-8 space-y-3 bg-white rounded-lg shadow-md">
          <div className=" text-center">
            <h1 className=" text-4xl font-extrabold tracking-tight lg:text-5xl">
              Anonymous Messageing App
            </h1>
            <p className=" mb-4">Sign Up to start your journey</p>
          </div>
          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="userName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Username"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            debouncedUserName(e.target.value);
                          }}
                        />
                      </FormControl>
                      {
                        checkingUserName && <Loader2 className=" animate-spin"/>
                      }
                      <p className={` text-sm ${backendMessage === "Username available" ? "text-green-500" : "text-red-500"}`}>
                        {backendMessage}
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <><Loader2 className=" animate-spin mr-2 h-4 w-4"/>Please wait</> : "Submit"}
                </Button>
              </form>
            </Form>
            <div className=" text-center m-4">
              <p>
                Already a have account? <Link href={"/sign-in"} className=" text-blue-500 hover:text-blue-800">Sign In</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
