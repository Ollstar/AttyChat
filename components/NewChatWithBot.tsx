import { PlusIcon } from "@heroicons/react/24/solid";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

interface NewChatWithBotProps {
  messageText: string;
  botId: string;
}

function NewChatWithBot({ messageText, botId }: NewChatWithBotProps) {
  const router = useRouter();
  const { data: session } = useSession();

  const createNewChatWithBot = async () => {
    // create new chat
    const chatDoc = await addDoc(
      collection(db, "users", session?.user?.email!, "bots", botId, "chats"),
      {
        userId: session?.user?.email!,
        createdAt: serverTimestamp(),
      }
    );
    const message: Message2 = {
      text: messageText,
      createdAt: serverTimestamp(),
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
        "bots",
        botId,
        "chats",
        chatDoc.id,
        "messages"
      ),
      message
    );

    router.push(`bots/${botId}/chat/${chatDoc.id}`);
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
