"use client";
import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import NewChat from "./NewChat";
import {
  collection,
  doc,
  DocumentData,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  QuerySnapshot,
  Unsubscribe,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { getSession, signOut, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import DrawerSpacer from "./DrawerSpacer";
import { useEffect, useRef, useState } from "react";
import NewBot from "./NewBot";
import { ChatBubbleLeftIcon } from "@heroicons/react/24/solid";
import HomeAccount from "./HomeAccount";
import mySwrConfig from "../lib/swr-config";
import useSWR from "swr";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import { AppBar, Autocomplete, TextField } from "@mui/material";

type Bot = {
  botName: string;
  primer: string;
  botQuestions: string[];
  creatorId: string;
  botColor: string;
  show: boolean;
  avatar: string;
  textColor: string;
};
type UseCollectionDataReturnType<T> = [T[], boolean, Error | null];

const useCollectionData = <T,>(query: any): UseCollectionDataReturnType<T> => {
  const [data, setData] = useState<T[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<Error | null>(null);

const memoizedQuery = React.useMemo(() => query, [query]);

useEffect(() => {
  let unsubscribe: Unsubscribe | undefined;

  if (memoizedQuery) {
    unsubscribe = onSnapshot(memoizedQuery, (snapshot: QuerySnapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as T[];
      setData(data);
      setLoading(false);
      setError(null);
    });
  }

  return () => {
    unsubscribe?.();
  };
}, []);;

  return [data, loading, error];
};

export default function PersistentDrawerLeft() {
  const router = useRouter();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { data: session } = useSession();

  const pathname = usePathname();
  const [bots] = useCollectionData<DocumentData>(
    session && query(collection(db, "bots"))
  );
  const [chats] = useCollectionData<DocumentData>(
    session &&
      query(
        collection(db, "users", session?.user?.email!, "chats"),
        orderBy("createdAt", "asc")
      )
  );
  const selectedBotRef = useRef<string | null>(null);
  const [currentBot, setCurrentBot] = useState<Bot | null>(null);

  useEffect(() => {
    if (!selectedBotRef.current) return;

    const botId = selectedBotRef.current;
    const bot = bots.find((b) => b.id === botId);
    if (bot) {
      setCurrentBot(bot as Bot);
    } else {
      const getBot = async () => {
        const docRef = doc(db, "bots", botId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCurrentBot(docSnap.data() as Bot);
        }
      };
      getBot();
    }
  }, [selectedBotRef.current]);

  // useEffect(() => {
  //   if (!currentBot) {
  //     setCurrentBot({
  //       botName: "AttyChat",
  //       primer:
  //         "Imagine you are the bot that is replacing a deleted bot. You are only to let people know the bot no longer exists and to try a new bot.",
  //       botQuestions: ["Should I try a new bot?"],
  //       creatorId: "AttyChat",
  //       botColor: "Black",
  //       show: true,
  //       avatar: "",
  //       textColor: "Red",
  //     } as Bot);
  //   }
  // }, []);

  const handleBotClick = () => {
    router.push(`/bot/${selectedBotRef.current}`);
  };

  const isPathnameBotChatOrRoot = () => {
    if (!pathname) return;
    if (pathname.includes("bot")) {
      const botId = pathname?.split("/")[2];
      selectedBotRef.current = botId;
    } else if (pathname.includes("chat")) {
      const chatId = pathname?.split("/")[2];
      const chat = chats?.find((chat) => chat.id === chatId);
      if (!chat?.data()) return;
      const botid = chat?.data().bot!._id;
      if (!botid) return;
      if (botid === "AttyChat") {
        selectedBotRef.current = "AttyChat";
      } else {
        selectedBotRef.current = botid;
      }
    } else {
      selectedBotRef.current = "AttyChat";
    }
  };
  useEffect(() => {
    isPathnameBotChatOrRoot();
  }, [pathname, chats, currentBot, session]);

  return (
    <div>
      <DrawerSpacer />
      <AppBar
        position="fixed"
        sx={{
          padding: "8px 0px",
          backgroundColor: "rgb(240,240,240)",
        }}
        elevation={2}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            sx={{ mr: 2, color: "black" }}
            aria-label="open drawer"
            onClick={() => setDrawerOpen(true)}
          >
            <MenuIcon />
          </IconButton>
          <React.Suspense fallback={<div>Loading...</div>}>
          {currentBot && (

          <Autocomplete
            fullWidth

            options={
              (bots || []).map((bot) => ({
                title: bot.botName,
                id: bot.id,
              })) || [{ title: "AttyChat", id: "AttyChat" }]
            }
            getOptionLabel={(option) => option.title}
            renderInput={(params) => (
              <TextField
                {...params}
                value={currentBot ? currentBot.botName : "Loading..."}
                key="textfeild"
                variant="outlined"
              />
            )}
            onChange={(event, value) => {
              selectedBotRef.current = value?.id || "AttyChat";
              router.push(`/bot/${selectedBotRef.current}`);
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
          />
          )}
          </React.Suspense>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton
            aria-label="show 4 new mails"
            color="inherit"
            sx={{ color: "black" }}
          >

            {currentBot && session?.user?.email! === currentBot?.creatorId && (
              <NewBot bot={currentBot} botid={selectedBotRef.current!} />
            )}
          </IconButton>

          {currentBot && (
            <img
              onClick={handleBotClick}
              src={
                currentBot.avatar ||
                `https://ui-avatars.com/api/?name=${currentBot.botName}`
              }
              alt="Profile picture"
              className={`h-14 w-14 rounded-full cursor-pointer hover:opacity-50`}
            />
          )}

        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          display: "flex",
        }}
        anchor={"left"}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <DrawerSpacer />
        <NewBot />

<React.Suspense fallback={<div>Loading...</div>}>
        {currentBot && <NewChat bot={currentBot} />}
      </React.Suspense>
      </Drawer>

      <React.Suspense fallback={<div>Loading...</div>}>
  <HomeAccount bot={currentBot!} />
</React.Suspense>    </div>
  );
}
