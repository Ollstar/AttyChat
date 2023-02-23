"use client";

import { PlusIcon } from "@heroicons/react/24/solid";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { Box } from "@mui/material";

function NewChat() {
  const router = useRouter();
  const { data: session } = useSession();

  const createNewChat = async () => {
    const doc = await addDoc(
      collection(db, "users", session?.user?.email!, "chats"),
      {
        userId: session?.user?.email!,
        createdAt: serverTimestamp(),
        bot:
        {_id: "AttyBot",
        name: "AttyBot",
        primer: ""
          },
      }
    );

    router.push(`/chat/${doc.id}`);
  };

  return (
    <Box fontFamily="poppins" fontSize="lg" color="black">
    <div onClick={createNewChat} className="chatRow p-2 border text-black text-center border-black">
      <h2>New Chat</h2>
    </div>
    </Box>
  );
}

export default NewChat;