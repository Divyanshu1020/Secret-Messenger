
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
import { signInSchema } from "@/schema/signInSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function Component() {
  const [backendMessage, setBackendMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    // setIsSubmitting(true);
    const result = await signIn("credentials", {
        redirect: false,
        identifier: data.identifier,
        password: data.password,
    })

    if(result?.error){
        toast({
            title: "Error",
            description: result.error,
            variant: "destructive",
        })
    }

    if(result?.url){
        router.replace("/dashboard")
    
     };

    }
  return (
    <>
      <div className=" flex justify-center items-center min-h-screen bg-gray-100">
        <div className=" w-full max-w-md p-8 space-y-3 bg-white rounded-lg shadow-md">
          <div className=" text-center">
            <h1 className=" text-4xl font-extrabold tracking-tight lg:text-5xl">
              Anonymous Messageing App
            </h1>
            <p className=" mb-4">Sign In with your account</p>
          </div>
          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="identifier"
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
                        <Input type="text" placeholder="Password" {...field} />
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
                if you don&apos;t have an account? <Link href={"/sign-up"} className=" text-blue-500 hover:text-blue-800">Sign Up</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}