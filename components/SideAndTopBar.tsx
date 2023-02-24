"use client";
import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import NewChat from "./NewChat";
import ChatRow from "./ChatRow";
import { collection, orderBy, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { signOut, useSession } from "next-auth/react";
import { useCollection } from "react-firebase-hooks/firestore";
import NewChatWithMessage from "./NewChatWithMessage";
import {
  Button,
  useMediaQuery,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import useSWR from "swr";
import mySwrConfig from "../lib/swr-config";
import { Session } from "next-auth";
import { usePathname, useRouter } from "next/navigation";
import DrawerSpacer from "./DrawerSpacer";
import NewBot from "./NewBot";
import { useEffect, useState } from "react";

const drawerWidth = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export default function PersistentDrawerLeft(this: any) {
  const router = useRouter();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();
  const [bots] = useCollection(session && query(collection(db, "bots")));
  const [chats, loading, error] = useCollection(
    session &&
      query(
        collection(db, "users", session?.user?.email!, "chats"),
        orderBy("createdAt", "asc")
      )
  );

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const isPathnameBotChatOrRoot = () => {
    if (!pathname) return
    if (pathname.includes("bot")) {
      console.log(`pathname includes bot`);
      const botId = pathname?.split("/")[2];
      selectedBotRef.current = botId;
    } else if (pathname.includes("chat")) {
      console.log(`pathname includes chat`);
      const chatId = pathname?.split("/")[2];
      const chat = chats?.docs?.find((chat) => chat.id === chatId);
      if (!chat?.data()) return;
      console.log(`botid: ${chat?.data().bot!._id} \n botname: ${chat?.data().bot?.name}`);
      const botid = chat?.data().bot!._id
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


  // Declare a ref for the selected bot
const selectedBotRef = React.useRef<string | null>("root");
// Update the selected bot ref when the bot is changed
const handleBotSelect = (event: SelectChangeEvent<string | null>) => {
  selectedBotRef.current = event.target.value;
  if (selectedBotRef.current === "root") {
    router.push("/");
  } else router.push(`/bot/${selectedBotRef.current}`);
};

// Update the selected bot ref when the pathname changes
useEffect(() => {
  isPathnameBotChatOrRoot();
  router.refresh();
}, [pathname, chats]);






  return (
    <Box sx={{ backgroundColor: "rgb(240,240,240)" }}>
      <CssBaseline />
      <Drawer
        ModalProps={{ onBackdropClick: handleDrawerClose }}
        id="drawer"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="temporary"
        anchor="left"
        open={open}
      >
        <Box className="bg-[rgb(240,240,240)] h-screen">
          <DrawerHeader className="p-2 mt-2">
            <NewChat />
            <NewBot />
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "ltr" ? (
                <ChevronLeftIcon />
              ) : (
                <ChevronRightIcon />
              )}
            </IconButton>
          </DrawerHeader>
          <div>
            <div className="flex flex-col space-y-2 my-2 mb-10">
              {loading && (
                <div className="animate-pulse text-center text-white"></div>
              )}

              {/* Map through the ChatRows */}
              {chats?.docs.map((chat) => (
                <ChatRow key={chat.id} id={chat.id} />
              ))}
            </div>
          </div>
          <DrawerSpacer />
        </Box>
      </Drawer>
      <DrawerHeader />
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "rgb(240,240,240)",
        }}
        open={open}
        elevation={2}
      >
        <Toolbar>
          <IconButton
            className={`${open ? "hidden" : "block"}`}
            aria-label="open drawer"
            onClick={open ? handleDrawerClose : handleDrawerOpen}
            edge="start"
            sx={{ display: open ? "none" : "block", mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          <Select
            size="small"
            className={`mt-4 mb-4 flex-1 ${open ? "" : "" }  inline-flex truncate`}
            defaultValue="root"
            sx={{ fontFamily: "poppins", borderRadius: "10px" }}
            value={selectedBotRef.current}
            onChange={(e) => handleBotSelect(e)}
          >
            <MenuItem
              sx={{ fontFamily: "poppins" }}
              key={"root"}
              value={"root"}
            >
              AttyChat
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

          {session && (
            <img
              onClick={() => signOut()}
              src={session?.user?.image!}
              alt="Profile picture"
              className={`h-12 w-12 rounded-full cursor-pointer hover:opacity-50`}
            />
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
