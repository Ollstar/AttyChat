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
  getDoc,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { getSession, useSession } from "next-auth/react";
import { useCollection } from "react-firebase-hooks/firestore";
import {
  Select,
  MenuItem,
  SelectChangeEvent,
  AppBar,
  Autocomplete,
  TextField,
  ListItemButton,
} from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import DrawerSpacer from "./DrawerSpacer";
import { useEffect, useState } from "react";
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

export default function PersistentDrawerLeft(this: any) {
  const router = useRouter();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { data: session } = useSession();
  const [showEdit, setShowEdit] = useState(false);
  const pathname = usePathname();
  const [bots] = useCollection(session && query(collection(db, "bots")));
  const [chats, loading, error] = useCollection(
    session &&
      query(
        collection(db, "users", session?.user?.email!, "chats"),
        orderBy("createdAt", "asc")
      )
  );
  const selectedBotRef = React.useRef<string | null>("AttyChat");
  


  const [currentBot, setCurrentBot] = useState<Bot>({
    botName: "AttyChat",
    primer: "",
    botQuestions: [],
    creatorId: "",
    botColor: "",
    show: true,
    avatar: "",
    textColor: "",
  } as Bot);
  useEffect(() => {
    if (!session) getSession();
    if (!pathname) return;
    if (!selectedBotRef.current) return;
    const botid = selectedBotRef.current;
    const getBot = async () => {
      const docRef = doc(db, "bots", botid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setCurrentBot(docSnap.data() as Bot);
      }
    };
    getBot();
  }, [pathname, selectedBotRef.current, session]);
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
      const chat = chats?.docs?.find((chat) => chat.id === chatId);
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

  useEffect(() => {
    console.log("currentBotSideBar", currentBot);
    if (currentBot === undefined)
      setCurrentBot({
        botName: "AttyChat",
        primer:
          "Imagine you are the bot that is replacing a deleted bot. You are only to let people know the bot no longer exists and to try a new bot.",
        botQuestions: ["Should I try a new bot?"],
        creatorId: "AttyChat",
        botColor: "Black",
        show: true,
        avatar: "",
        textColor: "Red",
      } as Bot);
  }, [currentBot]);

  const handleCloseNewBot = () => {
    setShowEdit(false);
  };

  const handleBotSelect = (event: any) => {
    selectedBotRef.current = event.target.value;
    router.push(`/bot/${selectedBotRef.current}`);
  };

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


          <Select
            value={
              bots?.docs?.length! > 0 ? selectedBotRef.current : "AttyChat"
            }
            sx={{ fontFamily: "poppins", borderRadius: "10px" }}
            onChange={(e) => handleBotSelect(e)}
          >
            {!bots && (
              <MenuItem key="AttyChat" value="AttyChat">
                Loading...
                </MenuItem>
                )}
            {bots?.docs?.map((bot) => (
              <MenuItem key={bot.id} value={bot.id}>
                {bot.data().botName}
              </MenuItem>
            ))}
          </Select>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton
            aria-label="show 4 new mails"
            color="inherit"
            sx={{ color: "black" }}
          >
            {session?.user?.email! === currentBot.creatorId && (
              <NewBot bot={currentBot} botid={selectedBotRef.current!} />
            )}
          </IconButton>
          {currentBot && (
            <img
              onClick={handleBotClick}
              src={
                currentBot?.avatar ||
                `https://ui-avatars.com/api/?name=${currentBot?.botName}`
              }
              alt="Profile picture"
              className={`h-14 w-14 rounded-full cursor-pointer hover:opacity-50`}
            />
          )}
        </Toolbar>
      </AppBar>
      <Drawer
        anchor={"left"}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >

{/* currentbot and newbot currentbot */}
        <DrawerSpacer />
        {currentBot && (
          <NewChat bot={currentBot} />)}
      </Drawer>

      <>
        <HomeAccount bot={currentBot!} />
      </>

      {showEdit && <NewBot autoOpen={true} onClose={handleCloseNewBot} />}
    </div>
  );
}
