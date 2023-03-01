"use client";
import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import NewChat from "./NewChat";
import { collection, doc, getDoc, orderBy, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { useSession } from "next-auth/react";
import { useCollection } from "react-firebase-hooks/firestore";
import { Select, MenuItem, SelectChangeEvent, AppBar, Autocomplete, TextField } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import DrawerSpacer from "./DrawerSpacer";
import { useEffect, useState } from "react";
import NewBot from "./NewBot";
import { ChatBubbleLeftIcon } from "@heroicons/react/24/solid";
import HomeAccount from "./HomeAccount";

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

  const [currentBot, setCurrentBot] = useState<Bot>(
    {
      botName: "AttyChat",
      primer: "",
      botQuestions: [],
      creatorId: "",
      botColor: "",
      show: true,
      avatar: "",
      textColor: "",
    } as Bot
  );
  useEffect(() => {
    if(!session) return;
    if (!pathname) return;
    if (!selectedBotRef.current) return;

    const botid = selectedBotRef.current;
    const getBot = async () => {
      const docRef = doc(db, "bots", botid);
      const docSnap = await getDoc(docRef);

      setCurrentBot(docSnap.data() as Bot);
    };
    getBot();
  }, [pathname, selectedBotRef.current,session]);
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
      // console.log("botid in chat", botid);
      if (!botid) return;
      if (botid === "AttyChat") {
        selectedBotRef.current = `AttyChat`;
      } else {
        selectedBotRef.current = botid;
      }
    } else {
      selectedBotRef.current = `AttyChat`;
    }
    // console.log("selectedBotRef.current", selectedBotRef.current);
  };
  useEffect(() => {
    isPathnameBotChatOrRoot();
  }, [pathname, chats, currentBot, session]);

  useEffect(() => {
    // console.log("currentBotSideBar", currentBot);
  }, [currentBot]);
  const handleCloseNewBot = () => {
    // console.log("handleCloseNewBot");
    setShowEdit(false);
  };

  // Declare a ref for the selected bot
  // Update the selected bot ref when the bot is changed
  const handleBotSelect = (event: any) => {
    // selectedBotRef.current = event.target.value;
    // router.push(`/bot/${selectedBotRef.current}`);
    console.log("event", event);
  };

  // Update the selected bot ref when the pathname changes

  return (

    <div>
      <DrawerSpacer />
      <AppBar
        position="fixed"
        sx={{
          padding: "10px 0px",
          backgroundColor: "rgb(240,240,240)",
        }}
        elevation={2}
      >
        <Toolbar>
          <Box className="mr-2">
            {currentBot && (
            <NewChat bot={currentBot} />
            )}
          </Box>
 
  
          
          {/* <Select
            value={selectedBotRef.current }
            sx={{ fontFamily: "poppins", borderRadius: "10px" }}
            onChange={(e) => handleBotSelect(e)}
          >
            {!bots && <MenuItem value="AttyChat">Loading...</MenuItem>}
    

            {bots?.docs.map((bot) => (
              <MenuItem
                sx={{ fontFamily: "poppins" }}
                key={bot.id}
                value={bot.id}
              >
                {bot.data().botName}
              </MenuItem>
            ))}
          </Select> */}

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
              className={`h-12 w-12 rounded-full cursor-pointer hover:opacity-50`}
            />
          )}
        </Toolbar>
      </AppBar>
      <>
        <HomeAccount bot={currentBot!} />
      </>
      {}
      {showEdit &&
        (// console.log("showEdit", showEdit),
        (<NewBot autoOpen={true} onClose={handleCloseNewBot} />))}
</div>
  );
}
