"use client";
import {
  TextField,
  InputAdornment,
  IconButton,
  CircularProgress,
  AppBar,
  Toolbar,
  Typography,
  Link,
  Box,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { signOut, useSession } from "next-auth/react";
import { FormEvent, useState, useEffect, useRef } from "react";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import toast from "react-hot-toast";
import ModelSelection from "./ModelSelection";
import useSWR from "swr";
import PrimerField from "./PrimerFeild";
import mySwrConfig from "../lib/swr-config";
import { useCollection } from "react-firebase-hooks/firestore";
import { Session } from "next-auth";
import { margin } from "@mui/system";
import Account from "./Account";
import { Padding } from "@mui/icons-material";

type Props = {
  chatId: string;
  botid?: string;
};
const fetchPrimer = async (session: Session) => {
  if (!session) {
    return;
  }

  return fetch("/api/getPrimer", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      session: { user: { email: session?.user?.email! } },
    }),
  })
    .then((res) => res.json())
    .catch((err) => {
      console.log(err);
      return { text: "fallback data" };
    });
};



function ChatInput2({ chatId, botid }: Props) {
  const [prompt, setPrompt] = useState("");
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const { data: model } = useSWR("model", {
    fallbackData: "text-davinci-003",
  });
  const { data: primer, mutate: setPrimer } = useSWR(
    "primer",
    session ? () => fetchPrimer(session) : null,
    {
      ...mySwrConfig,
      fallbackData: "Fallback data",
      revalidateOnFocus: true,
    }
  );

  const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!prompt) return;
    let input = prompt.trim();
    setPrompt("");

    const bot = botid ? (await getDoc(doc(db, "bots", botid))).data() : null;

    const message: Message2 = {
      text: input,
      createdAt: serverTimestamp(),
      userPrimer: primer,
      user: {
        _id: session?.user?.email!,
        name: session?.user?.name!,
        avatar:
          session?.user?.image! ||
          `https://ui-avatars.com/api/?name=${session?.user?.name}`,
      },
    };

    setIsLoading(true);
    await addDoc(
      collection(
        db,
        "users",
        session?.user?.email!,
        "chats",
        chatId,
        "messages"
      ),
      message
    );

    setIsLoading(false);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        bottom: "0",
        top: "auto",
        padding: "5px",
        backgroundColor: "rgb(240,240,240)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          width: "100%",
        }}
      >
        {session && (
          <div className="h-12 w-12 mr-1">
          <Account />
          </div>
        )}
        <Box sx={{ flexGrow: 1 }}>
          <form ref={formRef} onSubmit={sendMessage}>
            <TextField
              fullWidth
              id="outlined-basic"
              label="Enter message..."
              variant="outlined"
              value={prompt}
              color="primary"
              disabled={!session || isLoading}
              InputLabelProps={{ style: { fontFamily: "poppins" } }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <PrimerField />
                    <IconButton
                      type="submit"
                      disabled={!session || isLoading}
                      sx={{ color: "black"}}
                    >
                      {isLoading ? (
                        <CircularProgress size={24} />
                      ) : (
                        <SendIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{  backgroundColor: "white"}}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </form>
        </Box>
      </Box>
      
    </AppBar>
  );
}

export default ChatInput2;
