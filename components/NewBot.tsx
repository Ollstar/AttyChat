"use client";

import { PlusIcon } from "@heroicons/react/24/solid";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

function NewBot() {
  const router = useRouter();
  const { data: session } = useSession();

  const createNewBot = async () => {
    const doc = await addDoc(
      collection(db, "users", session?.user?.email!, "bots"),
      {
        userId: session?.user?.email!,
        createdAt: serverTimestamp(),
        primer: "Imagine, you're a generic new bot and someone will custsomize you to be their bot",
      }
    );

    router.push(`/bot/${doc.id}`);
  };

  return (
    <div onClick={createNewBot} className="chatRow p-2 border border-gray-700">
      <PlusIcon className="h-4 w-4" />
      <h2>New Bot</h2>
    </div>
  );
}

export default NewBot;