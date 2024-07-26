import React from "react";
import { MdDelete } from "react-icons/md";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Message } from "@/models/user.model";
import axios from "axios";
import { useToast } from "./ui/use-toast";
import { format } from 'date-fns';

type MessageCardProps = {
  message: Message;
  deleteMessage: (messageId: string) => void;
};
export default function MessageCard({
  message,
  deleteMessage,
}: MessageCardProps) {
  const formattedDate = format(new Date(message.createdAt), 'PPpp')
  return (
    <Card>
      <CardHeader>
        <CardTitle className=" flex flex-row justify-between">
          {message.content}
          <AlertDialog>
            <AlertDialogTrigger><MdDelete size={20} /></AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your message and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => {deleteMessage(message._id)}}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardTitle>
        <CardDescription>{formattedDate}</CardDescription>
      </CardHeader>
      
      
    </Card>
  );
}
