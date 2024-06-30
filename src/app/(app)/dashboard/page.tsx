"use client";
import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Message } from "@/models/user.model";
import { acceptMessageSchema } from "@/schema/acceptMessageSchema";
import { ApiResponse } from "@/types/apiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function Dashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const { toast } = useToast();
  const { data: session } = useSession();

  const { register, watch, setValue } = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });

  const watchIsAccepting = watch("isAccepting");

  // Call's to backend
  const getIsAcceptingInBackend = useCallback(async () => {
    setIsSwitching(true);

    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages");
      setValue("isAccepting", response.data.isAcceptingMessage);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message || "Error accepting messages",
        variant: "destructive",
      });
    } finally {
      setIsSwitching(false);
    }
  }, [setValue, toast]);

  const getAllMessages = useCallback(
    async (refresh = false) => {
      try {
        setIsLoading(true);
        setIsSwitching(false);

        const response = await axios.get<ApiResponse>("/api/get-messages");
        setMessages(response.data.messages || []);

        if (refresh) {
          toast({
            title: "Success",
            description: "Refreshed messages",
            variant: "default",
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: "Error",
          description:
            axiosError.response?.data.message || "Error accepting messages",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [toast, setIsLoading, setMessages]
  );

  useEffect(() => {
    if (!session || !session.user) return;

    getIsAcceptingInBackend();
    getAllMessages();
  }, [getAllMessages, getIsAcceptingInBackend, session]);

  const switchHandler = async () => {
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        isAcceptingMessage: !watchIsAccepting,
      });
      setValue("isAccepting", !watchIsAccepting);
      toast({
        title: response.data.message,
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message || "Error accepting messages",
        variant: "destructive",
      });
    }
  };

  const handleDeleteMessage = (messageId: string) => {};
  return (
    <div className=" my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className=" text-4xl font-bold mb-4"> User Dashboard</h1>

      <div className=" mb-4">
        <h2 className=" text-lg font-semibold mb-2">Copy Your Unique Link</h2>
        <div className=" flex items-center">
          <Input
            type="text"
            value={
              "http://localhost:3000/dashboard?userName=" + session?.user?.name
            }
            disabled
            className=" input input-bordered w-full max-w-lg"
          />
          <Button>Copy</Button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          {...register("isAccepting")}
          checked={watchIsAccepting}
          onCheckedChange={switchHandler}
          disabled={isSwitching}
          id="airplane-mode"
        />
        <Label htmlFor="airplane-mode" className="ml-2 text-lg">
          {" "}
          Accept Messages: {watchIsAccepting ? "On" : "Off"}
        </Label>
      </div>

      <Separator />

      <Button className=" mt-4" variant={"outline"} onClick={() => {}}>
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="mr-2 h-4 w-4" />
        )}
      </Button>

      <div className=" mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ?(messages.map((message) => (
          <MessageCard
            key={message.id}
            message={message}
            deleteMessage={handleDeleteMessage}
          />
        ))):(<><p> No Messages to display </p></>)}
      </div>
    </div>
  );
}
