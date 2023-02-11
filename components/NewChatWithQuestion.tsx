"use client"
import { Button } from "@mui/material";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { db } from "../firebase";
import useSWR from "swr";

function NewChatWithQuestion({ text:} }) {
    const router = useRouter();
    const { data: session } = useSession();
    const [prompt, setPrompt] = useState(text);
    const { data: model } = useSWR("model", {
      fallbackData: "text-davinci-003",
    });
  
    const createNewChat = async (prompt) => {
      const doc = await addDoc(
        collection(db, "users", session?.user?.email!, "chats"),
        {
          userId: session?.user?.email!,
          createdAt: serverTimestamp(),
        }
      );
  
      const message: Message = {
        text: prompt.trim(),
        createdAt: serverTimestamp(),
        user: {
          _id: session?.user?.email!,
          name: session?.user?.name!,
          avatar:
            session?.user?.image! ||
            `https://ui-avatars.com/api/?name=${session?.user?.name}`,
        },
      };
  
      await addDoc(
        collection(
          db,
          "users",
          session?.user?.email!,
          "chats",
          doc.id,
          "messages"
        ),
        message
      );
  
      // Toast notification
      const notification = toast.loading("Thinking...");
  
      await fetch("/api/askQuestion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          chatId: doc.id,
          model,
          session,
        }),
      }).then(() => {
        toast.success("My thoughts on this", {
          id: notification,
        });
      });
  
      router.push(`/chat/${doc.id}`);
    };
  
    return (
        <>
        <Button variant="contained" color="primary" onClick={() => createNewChat(text)}>
          {text}
        </Button>
      </>

    );
  }

export default NewChatWithQuestion;
