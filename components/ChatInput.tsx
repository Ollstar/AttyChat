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
import { useSession } from "next-auth/react";
import { FormEvent, useEffect, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import useSWR from "swr";
import { Settings } from "./Settings";
import { useCollection } from "react-firebase-hooks/firestore";
import { request } from "http";

type Props = {
  chatId: string;
};

function ChatInput({ chatId }: Props) {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  // const { data: model } = useSWR("model", {
  //   fallbackData: "text-davinci-003",
  // });



  const sendMessage = async (e: FormEvent) => {
    e.preventDefault();


    if (!prompt) return;

    setIsLoading(true);
    const input = prompt.trim();
    setPrompt("");

    const newMessage: Message = {
      text: input,
      createdAt: serverTimestamp(),
      user: {
        _id: session?.user?.email!,
        name: session?.user?.name!,
        avatar:
          session?.user?.image! ||
          `https://ui-avatars.com/api/?name=${session?.user?.name}`,
      },
    };
    try {
      await addDoc(
        collection(
          db,
          "users",
          session?.user?.email!,
          "chats",
          chatId,
          "messages"
        ),
        newMessage
      );
    } catch (error) {
      console.error("Error adding document: ", error);
    }
    
    try {
      const response = await fetch("/api/askQuestion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: input,
          chatId: chatId,
          session: session,
        }),
      });
    
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error sending message: ", request);
    }
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
      <Toolbar>
        <Box sx={{ width: "100%" }}>
          <form onSubmit={sendMessage}>
            <TextField
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
                    <Settings/>
                    <IconButton
                      color="primary"
                      aria-label="sendMessage"
                      disabled={!prompt || !session || isLoading}
                      onClick={sendMessage}
                      sx={{ backgroundColor: "white" }}
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
              sx={{ width: "100%", backgroundColor: "white" }}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </form>
        </Box>
      </Toolbar>
      <footer>
        <Typography
          variant="body2"
          fontSize={8}
          sx={{ fontFamily: "poppins" }}
          color="text.secondary"
          align="center"
        >
          {"Powered by "}
          <Link color="inherit" href="https://rivaltech.com/">
            Rival
          </Link>{" "}
          {new Date().getFullYear()}
          {"."}
        </Typography>
      </footer>
    </AppBar>
  );
}

export default ChatInput;
