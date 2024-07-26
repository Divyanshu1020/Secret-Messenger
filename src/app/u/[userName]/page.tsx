"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { ApiResponse } from "@/types/apiResponse";
import { useCompletion } from "ai/react";
import axios, { AxiosError } from "axios";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";



export default function User() {
  const [sendToUserUrl, setSendToUserUrl] = React.useState("");
  const [sugestMessages, setSugestMessages] = React.useState([
    "What are doing?",
    "What are you doing?",
    "I am doing great! How are you?",
  ]);
  const { toast } = useToast();
  const {
    completion,
    input,
    setInput,
    stop,
    isLoading,
    handleInputChange,
    handleSubmit,
  } = useCompletion({ api: "/api/suggest-messages" });

  const form = useForm();
  const message = form.watch("message", "");
  const onSubmit = async (data: any) => {
    const { message } = data;
    const dataToSend = {
      userName: sendToUserUrl,
      content: message,
    };
    try {
      const response = await axios.post("/api/send-message", dataToSend);
      toast({
        title: "Success",
        description: response.data.message,
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message || "Error sending messages",
        variant: "destructive",
      });
    }
  };

  const suggestMessageHandler = (message: string) => {
    form.setValue("message", message);
  };
  const aiSuggestMessage = async (event: any) => {


      
    setInput("fsf")
     handleSubmit(event);
  
    console.log("completion", completion);
  
    // try {
    //   const response = await axios.post("/api/suggest-messages")
    //   console.log(response.data);
    // } catch (error) {
    //   console.log(error);
    // }
    toast({
      title: "Error",
      description: "AI is not available",
      variant: "destructive",
    });
  };

  useEffect(() => {
    // const profileLink = `${window.location.protocol}//${window.location.host}${window.location.pathname}`;
    setInput("k")
    const userId = `${window.location.pathname.split("/").pop()}`;
    setSendToUserUrl(userId);
  }, [setSendToUserUrl, setInput]);

  useEffect(() => {
    if (completion) {
      setSugestMessages(completion.split('||'));
    }
  }, [completion]);
  return (
    <div className=" my-8 mx-4 md:mx-8 lg:mx-auto p-6  rounded w-full max-w-6xl">
      <h1 className=" text-center text-4xl font-bold mb-4">
        {" "}
        Public Profile Link
      </h1>
      <div className=" mb-16">
        <h2 className=" text-lg font-semibold mb-2">
          Send Anonymous Message to @{sendToUserUrl}
        </h2>
        <div className=" flex items-center flex-col w-full">
          <Form {...form}>
            <form className=" w-full" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        className=" resize-none text-xl mb-3 "
                        maxLength={150}
                        rows={2}
                        {...field}
                        placeholder="Write your anonymous message here"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                className=" w-full  text-xl font-semibold"
                disabled={!message.trim()}
                type="submit"
              >
                Send
              </Button>
            </form>
          </Form>
        </div>
      </div>
      <div>
        
        <Button onClick={aiSuggestMessage} disabled={isLoading}>
          Suggest Messages
        </Button>
        <h2 className="my-4 text-gray-500 text-lg font-semibold mb-2">
          Click on any message below to select it.
        </h2>
        <div>
          <Card className="p-5">
            <p className="text-2xl font-semibold">Message</p>
            <div className="text-center">
              {sugestMessages.map((message, index) => (
                  <Card
                    key={index}
                    onClick={() => suggestMessageHandler(message)}
                    className="my-2 py-2 cursor-pointer"
                  >
                    <p className="w-full text-xl font-semibold">{message}</p>
                  </Card>
                ))}
            </div>
          </Card>
        </div>
      </div>
  </div>
  );
}
