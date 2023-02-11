import { PlusIcon } from "@heroicons/react/24/solid";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import ChatInput from "./ChatInput";
import { useState } from "react";

type Props = {
  message?: string;
};

function NewChat({ message }: Props) {
  const router = useRouter();
  const { data: session } = useSession();
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
    router.push(`/chat/${doc.id}`);
  };

  return (
    <div onClick={createNewChat} className="chatRow p-2 border border-gray-700">
      <PlusIcon className="h-4 w-4" />
      <h2>New Chat</h2>
      {message ? <ChatInput chatId={chatId} initialPrompt={message} /> : null}
    </div>
  );
}

export default NewChat;
