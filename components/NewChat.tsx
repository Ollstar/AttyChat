"use client";

import { PlusIcon } from "@heroicons/react/24/solid";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { Box, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { useEffect, useState } from "react";
import NewChatWithBot from "./NewChatWithBot";

type Bot = {
  botName: string;
  primer: string;
  botQuestions: string[];
  creatorId: string;
  botColor: string;
  show: boolean;
  avatar: string;
};

function NewChat() {
  const router = useRouter();
  const { data: session } = useSession();
  const pathname = usePathname();
  const [botQuestions, setBotQuestions] = useState<string[]>(["Test"]);
  const [botid, setBotid] = useState<string>("AttyChat");
  const [currentBot, setCurrentBot] = useState<Bot | undefined>(undefined);
  useEffect(() => {
    if (!pathname) return;
    if (!botid) return;

    const getBot = async () => {
      setBotid(pathname.split("/")[2]);
      const docRef = doc(db, "bots", botid);
      const docSnap = await getDoc(docRef);
      console.log("pathname", pathname, "botid", botid);

      setCurrentBot(docSnap.data() as Bot);
      setBotQuestions(docSnap.data()?.botQuestions ?? []);
    };
    getBot();
  }, [pathname,botid]);

  const createNewChat = async (e: any) => {
    if (!session) {
      return;
    }
    const bot = currentBot;

    // create new chat
    const docRef = await addDoc(
      collection(db, "users", session?.user?.email!, "chats"),
      {
        userId: session?.user?.email!,
        createdAt: serverTimestamp(),
        bot: {
          _id: botid,
          name: bot!.botName,
          primer: bot!.primer,
        },
      }
    );
    if (e !== "New Chat") {
      const message: Message2 = {
        text: e.target.value,
        createdAt: serverTimestamp(),
        userPrimer: bot?.primer!,
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
          docRef.id,
          "messages"
        ),
        message
      );
    }
    if (pathname?.includes("/bot")) {
      router.push(`${pathname}/chat/${docRef.id}`);
    } else {
      router.push(`/chat/${docRef.id}`);
    }
  };
  const handleChatSelect = (e: SelectChangeEvent) => {
    createNewChat(e);
    console.log(e);
  };

  return (
    <Box fontFamily="poppins" fontSize="lg" color="black">
      <Select
        size="small"
        defaultValue="New Chat"
        sx={{ fontFamily: "poppins", borderRadius: "10px" }}
        value={"New Chat"}
        onChange={(e) => handleChatSelect(e)}
      >
        <MenuItem
          sx={{ fontFamily: "poppins" }}
          key={"New Chat"}
          value={"New Chat"}
        >
          New Chat
        </MenuItem>

        {botQuestions.map((question) => (
          <MenuItem
            sx={{ fontFamily: "poppins" }}
            key={question.concat(botid)}
            value={question}
          >
            {question}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
}

export default NewChat;
