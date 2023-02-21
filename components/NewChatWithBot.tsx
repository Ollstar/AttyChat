"use client"
import { PlusIcon } from "@heroicons/react/24/solid";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { addDoc, collection, doc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import useSWR from "swr";
interface NewChatWithBotProps {
  messageText: string;
  botid: string;
}

function NewChatWithBot({ messageText, botid }: NewChatWithBotProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const { data: primer } = useSWR("primer", {
    fallbackData:
    "",
});
  const createNewChatWithBot = async () => {
    const bot = (await getDoc(doc(db, "bots", botid))).data();

    // create new chat
    const chatDoc = await addDoc(
      collection(db, "users", session?.user!.email!, "chats"),
      {
        userId: session?.user?.email!,
        createdAt: serverTimestamp(),
        bot: {
            _id: bot!.creatorId,
            name: bot!.botName,
            primer: bot!.primer
        }
      }
    );
    const message: Message2 = {
      text: messageText,
      createdAt: serverTimestamp(),
      userPrimer: primer!,
      user: {
        _id: session?.user?.email!,
        name: session?.user?.name!,
        avatar:
          session?.user?.image! ||
          `https://ui-avatars.com/api/?name=${session?.user?.name}`,
      },
    };
    // add message to new chat
    await addDoc(
        collection(
          db,
          "users",
          session?.user?.email!,
          "chats",
          chatDoc.id,
          "messages"
        ),
        message
      );

    router.push(`bot/${botid}/chat/${chatDoc.id}`);
  };

  return (
    <div
      onClick={createNewChatWithBot}
      className="chatRow p-2 border border-gray-700"
    >
      <PlusIcon className="h-4 w-4" />
      <h2>{messageText}</h2>
    </div>
  );
}

export default NewChatWithBot;
