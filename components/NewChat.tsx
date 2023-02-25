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
  const [bot, setBot] = useState<Bot>();
  const [botQuestions, setBotQuestions] = useState<string[]>(
    bot?.botQuestions ?? ["Test"]
  );
  const [botid, setBotid] = useState<string>("AttyChat");
  useEffect(() => {
    if (botid) {
      getDoc(doc(db, "bots", botid)).then((doc) => {
        setBot(doc.data() as Bot);
      });
    }
    if (bot) {
      setBotQuestions(bot.botQuestions);
    }
    if (pathname?.includes("/bot")) {
      setBotid(pathname.split("/")[2]);
      getDoc(doc(db, "bots", botid)).then((doc) => {
        setBot(doc.data() as Bot);
      });
    }
  }, [pathname,botid]);

  const createNewChat = async () => {

    if (!session) {
      return;
    }
    if (pathname?.includes("/bot")) {
      const botInPath = (await getDoc(doc(db, "bots", botid))).data();
      setBot(botInPath as Bot);

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
  const handleChatSelect = (e: SelectChangeEvent) => {
console.log(e)
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
          onClick={createNewChat}
        >
          New Chat
        </MenuItem>

        {botQuestions.map((question) => (
          <NewChatWithBot
            messageText={question}
            botid={botid}
            useClient={true}
          />
        ))}
      </Select>
    </Box>
  );
}

export default NewChat;
