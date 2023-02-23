"use client";

import { PlusIcon } from "@heroicons/react/24/solid";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { addDoc, collection, doc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { Box } from "@mui/material";

function NewChat() {
  const router = useRouter();
  const { data: session } = useSession();
  const pathname = usePathname();

  const createNewChat = async () => {
    if (!session) {
      return;
    }
    if (pathname?.includes("/bot")) {
      const botid = pathname.split("/")[2];
      const bot = (await getDoc(doc(db, "bots", botid))).data();

      // create new chat
      const docRef = await addDoc(
        collection(db, "users", session?.user!.email!, "chats"),
        {
          userId: session?.user?.email!,
          createdAt: serverTimestamp(),
          bot: {
            _id: bot!.creatorId,
            name: bot!.botName,
            primer: bot!.primer,
          },
        }
      );
      router.push(`${pathname}/chat/${docRef.id}`);
    } else {
      const docRef = await addDoc(
        collection(db, "users", session?.user?.email!, "chats"),
        {
          userId: session?.user?.email!,
          createdAt: serverTimestamp(),
          bot: { _id: "AttyBot", name: "AttyBot", primer: "" },
        }
      );
      router.push(`/chat/${docRef.id}`);
    }
  };

  return (
    <Box fontFamily="poppins" fontSize="lg" color="black">
      <div
        onClick={createNewChat}
        className="chatRow p-2 border text-black text-center border-black"
      >
        <h2>New Chat</h2>
      </div>
    </Box>
  );
}

export default NewChat;
