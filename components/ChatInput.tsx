"use client"
import { TextField, InputAdornment, IconButton, CircularProgress, AppBar, Toolbar, Typography, Link, Box } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useSession } from "next-auth/react";
import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import useSWR from "swr";

type Props = {
  chatId: string;
  initialPrompt?: string;
};

function ChatInput({ chatId, initialPrompt }: Props) {
  const [prompt, setPrompt] = useState(initialPrompt || "");
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const { data: model } = useSWR("model", {
    fallbackData: "text-davinci-003",
  });

  const sendMessage = async (e) => {
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

    await fetch("/api/askQuestion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: input,
        chatId,
        model,
        session,
      }),
    });

    setIsLoading(false);
  };

  return (
    <AppBar position="fixed" sx={{zIndex: (theme) => theme.zIndex.drawer + 1, bottom: "0", top: "auto", padding: "5px", backgroundColor: "rgb(240,240,240)" }}>
    <Toolbar>
    <Box sx={{width:"100%"}}>
      <form onSubmit={sendMessage}>
      <TextField
        id="outlined-basic"
        label="Enter message..."
        variant="outlined"
        value={prompt}
        color='primary'
        disabled={!session || isLoading}
        InputLabelProps={{                style: { fontFamily:"poppins" },
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                color="primary"
                aria-label="sendMessage"
                disabled={!prompt || !session || isLoading}
                onClick={sendMessage}
                sx={{ width: "100%", backgroundColor: "white"}}
              
              >
                {isLoading ? <CircularProgress size={24} /> : <SendIcon />}
              </IconButton>
            </InputAdornment>
          ),
        }}            
        sx={{ width: "100%", backgroundColor: "white"}} 
        onChange={e => setPrompt(e.target.value)}
        />
      </form>
        </Box>
        </Toolbar>
          <footer>
            <Typography variant="body2" fontSize={8} fontFamily={"poppins"} color="text.secondary" align="center">
              {'Powered by '}
              <Link color="inherit" href="https://rivaltech.com/">
                Rival
              </Link>{' '}
              {new Date().getFullYear()}
              {'.'}
            </Typography>
          </footer>
        </AppBar>
        );
        }
        
        export default ChatInput;
