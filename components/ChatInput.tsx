"use client"
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import toast from "react-hot-toast";
import ModelSelection from "./ModelSelection";
import useSWR from "swr";
import NewChat from "./NewChat";

type Props = {
  chatId: string;
  initialPrompt?: string;
};

function ChatInput({ chatId, initialPrompt }: Props) {
  const [prompt, setPrompt] = useState(initialPrompt || "");
  const { data: session } = useSession();
  const { data: model } = useSWR("model", {
    fallbackData: "text-davinci-003",
  });

  const sendMessage = async (message: string) => {
    if (!message) return;

    const input = message.trim();
    setPrompt("");

    const newMessage: Message = {
      text: input,
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
        chatId,
        "messages"
      ),
      newMessage
    );

    // Toast notification
    const notification = toast.loading("Thinking...");

    await fetch("/api/askQuestion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: input,
        chatId,
        model,
        session,
      }),
    }).then(() => {
      toast.success("My thoughts on this", {
        id: notification,
      });
    });
  };

  return (
    <div className="bg-gray-700/50 text-gray-400 rounded-lg text-sm">
      <form onSubmit={(e) => {
        e.preventDefault();
        sendMessage(prompt);
      }} className="p-5 space-x-5 flex">
        <input
          className="bg-transparent focus:outline-none flex-1 disabled:cursor-not-allowed disabled:text-gray-300"
          disabled={!session}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          type="text"
          name="message"
          placeholder="Type a message..."
        />
        <button
          disabled={!prompt || !session}
          type="submit"
          className="bg-[#11A37F] hover:opacity-50 text-white font-boldpx-4 py-2 rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
          <PaperAirplaneIcon className="h-4 w-4 -rotate-45" />
          </button>
          </form>
          <NewChat message="Hey write 100 words" sendMessage={sendMessage} />
          </div>
          );
          }
          
          export default ChatInput;
