"use client"
import React, { useEffect, useRef } from 'react';
import { ArrowDownCircleIcon } from "@heroicons/react/24/solid";
import { query, collection, orderBy } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../firebase";
import Message from "./Message";
import { Box, Avatar, Typography } from "@mui/material";
import DrawerSpacer from './DrawerSpacer';

type Props = {
  chatId: string;
};

function Chat({ chatId }: Props) {
  const { data: session } = useSession();
  const [messages, loading, error] = useCollection(
    session &&
      query(
        collection(
          db,
          "users",
          session?.user?.email!,
          "chats",
          chatId,
          "messages"
        ),
        orderBy("createdAt", "asc")
      )
  );

  const containerRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop =
        containerRef.current.scrollHeight;
    }
  

  }, [messages]);

  return (

    <Box
      ref={containerRef}
      sx={{
        padding: '10px',
        position: 'absolute',
        display:"flex", 
        width:"100%",
        marginBottom:"10px",
        flexDirection:"column",
        backgroundColor:"purple", 
                overflow: 'scroll',
        bottom: '0',
        top: '0',
      }}
    >
      <DrawerSpacer />
      {messages?.empty && (
        <>
          <Typography
            variant="subtitle1"
            align="center"
            className="mt-10 text-black"
          >
            Type a prompt in below to get started!
          </Typography>
          <ArrowDownCircleIcon
            className="h-10 w-10 mx-auto mt-5 text-black animate-bounce"
          />
        </>
      )}
      {messages?.docs.map((message) => (
    <Box key={message.id} sx={{backgroundColor:"teal", padding:"10px"}}>
          <Message key={message.id} message={message.data()} />
          </Box>


    ))}
          <DrawerSpacer />

        </Box>


  );
}

export default Chat;
