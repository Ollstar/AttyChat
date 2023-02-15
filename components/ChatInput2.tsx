"use client"
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
import { useSession } from "next-auth/react";
import { FormEvent, useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import toast from "react-hot-toast";
import ModelSelection from "./ModelSelection";
import useSWR from "swr";
import PrimerFeild from "./PrimerFeild";
import PrimerField from "./PrimerFeild";

type Props = {
  chatId: string;
};

function ChatInput2({ chatId }: Props) {
  const [prompt, setPrompt] = useState("");
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const { data: model } = useSWR("model", {
    fallbackData: "text-davinci-003",
  });
  const { data: primer } = useSWR("primer", {
    fallbackData: "Imagine your a chatbot for AttyChat and you like to get people to leave reveiws about how the bot is in keeping up a conversation.",
  });


  // TODO useswr toget model.

  const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!prompt) return;
  
    const input = prompt.trim();
    setPrompt("");
  
    const message: Message = {
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
  
    //Toast notification
    const notification = toast.loading("Thinking...");
  
    let primerValue = "default"; // default primer value
    if (primer) {
      primerValue = primer.text || "defo";
    }
  
    console.log("primer value: ", primerValue);
  
    await fetch("/api/askQuestion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: input,
        chatId,
        model,
        primer: primerValue,
        session,
      }),
    }).then(() => {
      toast.success("My thoughts on this", {
        id: notification,
      });
    });
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
                    <PrimerField />
                    <IconButton
                        type="submit"
                        disabled={!session || isLoading}
                        sx={{ color: "primary.main" }}
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

export default ChatInput2;
