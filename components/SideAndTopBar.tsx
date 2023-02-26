"use client";
import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import NewChat from "./NewChat";
import { collection, orderBy, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { useSession } from "next-auth/react";
import { useCollection } from "react-firebase-hooks/firestore";
import { Select, MenuItem, SelectChangeEvent, AppBar } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import DrawerSpacer from "./DrawerSpacer";
import { useEffect, useState } from "react";
import NewBot from "./NewBot";
import { ChatBubbleLeftIcon } from "@heroicons/react/24/solid";
import HomeAccount from "./HomeAccount";

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
  const selectedBotRef = React.useRef<string | null>("root");

  const currentBot = bots?.docs?.find(
    (bot) => bot.id === selectedBotRef.current
  );
  const handleBotClick = () => {
    router.push(`/bot/${currentBot?.id}`);
  };
  const isPathnameBotChatOrRoot = () => {
    console.log("pathname", pathname);
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
      if (botid === "AttyBot") {
        selectedBotRef.current = `root`;
      } else {
        selectedBotRef.current = botid;
      }
    } else {
      selectedBotRef.current = `root`;
    }
  };
  const handleCloseNewBot = () => {
    console.log("handleCloseNewBot");
    setShowEdit(false);
  };
  
  // Declare a ref for the selected bot
  // Update the selected bot ref when the bot is changed
  const handleBotSelect = (event: SelectChangeEvent<string | null>) => {
    selectedBotRef.current = event.target.value;
    console.log("event.target.value", event.target.value);
    console.log("selectedBotRef.current", selectedBotRef.current);
    if (selectedBotRef.current === "root") {
      console.log("root");
      setShowEdit(true);
    } else router.push(`/bot/${selectedBotRef.current}`);
  };

  // Update the selected bot ref when the pathname changes
  useEffect(() => {
    isPathnameBotChatOrRoot();
  }, [pathname, chats, currentBot]);

  return (
    <>
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
            <NewChat />
          </Box>
          <Select
            defaultValue="root"
            value="root"
            sx={{ fontFamily: "poppins", borderRadius: "10px" }}
            onChange={(e) => handleBotSelect(e)}

          >
            <MenuItem
              sx={{ fontFamily: "poppins" }}
              key={"root"}
              value={"root"}
            >
              New Bot
            </MenuItem>

            {bots?.docs.map((bot) => (
              <MenuItem
                sx={{ fontFamily: "poppins" }}
                key={bot.id}
                value={bot.id}
              >
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
            <MoreHorizIcon />
          </IconButton>
          {currentBot && (
            <img
              onClick={handleBotClick}
              src={
                currentBot?.data().avatar ||
                `https://ui-avatars.com/api/?name=${currentBot?.data().botName}`
              }
              alt="Profile picture"
              className={`h-12 w-12 rounded-full cursor-pointer hover:opacity-50`}
            />
          )}
        </Toolbar>
      </AppBar>
      <>
        <HomeAccount />
      </>
      {}
      {showEdit &&
        (console.log("showEdit", showEdit), (<NewBot autoOpen={true} onClose={handleCloseNewBot} />
        ))}
    </>
  );
}
