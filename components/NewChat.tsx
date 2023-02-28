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
import { use, useEffect, useState } from "react";
import NewChatWithBot from "./NewChatWithBot";
import ChatIcon from '@mui/icons-material/Chat';
type Bot = {
  botName: string;
  primer: string;
  botQuestions: string[];
  creatorId: string;
  botColor: string;
  show: boolean;
  avatar: string;
};

type NewChatProps = {
  bot: Bot;
}

function NewChat({ bot }: NewChatProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const pathname = usePathname();
  const [botQuestions, setBotQuestions] = useState<string[]>(bot.botQuestions);
  const [botid, setBotid] = useState<string>("AttyChat");




  useEffect(() => {
    console.log("botid", botid);
    console.log("currentBot", bot);
    setBotQuestions(bot.botQuestions);
  }, [botid, bot]);

  const createNewChat = async (e: any) => {
    if (!session) {
      return;
    }


    if (!bot) return;
    if (!botid) return;
    console.log("bot", bot, "botid", botid);
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
    if (e.target.value !== "New Chat") {
      if (!bot) return;
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
    if (pathname?.includes("/bot") && pathname?.includes("/chat")) {
      const newPathname = pathname.substring(0, pathname.lastIndexOf("/") + 1);
      router.push(`${newPathname}${docRef.id}`);
    } else if (pathname?.includes("/bot") && !pathname?.includes("/chat")) {
      router.push(`${pathname}/chat/${docRef.id}`);
    } else {
      router.push(`/chat/${docRef.id}`);
    }
  };
  const handleChatSelect = (e: any ) => {
    createNewChat(e);
  };

  return (
    <Box fontFamily="poppins" fontSize="lg" color="black">
      <Select
      IconComponent={ChatIcon}
      value={""}
      inputProps={{ 'aria-label': 'Without label' }}
        sx={{ fontFamily: "poppins", borderRadius: "10px" }}
        onChange={((e) => handleChatSelect(e))}
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
