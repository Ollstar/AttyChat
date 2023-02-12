"use client"
import { PlusIcon } from "@heroicons/react/24/solid";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import ChatInput from "./ChatInput";
import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { Label } from "@mui/icons-material";

type Props = {
  message?: string;
  sendMessage?: (message: string) => void;
};

function NewChat({ message, sendMessage }: Props) {
  const router = useRouter();
  const { data: session } = useSession();
  const pathname = usePathname();
  const [chatId, setChatId] = useState("");

  const createNewChat = async () => {
    const doc = await addDoc(
      collection(db, "users", session?.user?.email!, "chats"),
      {
        userId: session?.user?.email!,
        createdAt: serverTimestamp(),
      }
      
    );
    setChatId(doc.id);
     router.push(`/chat/${doc.id}`)
  };





  return (
    <div onClick={createNewChat} className="chatRow p-2 border border-gray-700">
      <PlusIcon className="h-4 w-4" />
      <h2>New Chat</h2>
    </div>
  );
}

export default NewChat;
