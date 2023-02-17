"use client";
import React, { useEffect, useRef, useState } from "react";
import { ArrowDownCircleIcon } from "@heroicons/react/24/solid";
import { query, collection, orderBy } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../firebase";
import Message from "./Message";
import { Box, Avatar, Typography } from "@mui/material";
import DrawerSpacer from "./DrawerSpacer";
import Message2 from "./Message2";
import useSWR from "swr";
import toast from "react-hot-toast";

type Props = {
  chatId: string;
};

function Chat2({ chatId }: Props) {
  const { data: model } = useSWR("model", {
    fallbackData: "text-davinci-003",
  });
  const primer: string =
    "Imagine your a chatbot for AttyChat and Atty chat is software as a prompt service. You representing Atty Chat in a conversation with someone who has just came to the website. Atty Chat lets you customize your messages into ChatGPT eliminating needless boilerplate. Atty Chat also lets you control the brain in every message. Make ChatGPT work for you. Tell peopple who ask anything about how to use AttyChat that if they want to use AttyChat they click the settings button in the text feild. Use lots of emojis.";

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

  async function askQuestion() {
    const notification = toast.loading("Thinking...");
    await fetch("/api/askQuestion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: messages?.docs[0].data().text,
        chatId,
        model,
        primer: primer,
        messages: [],
        session,
      }),
    }).then(() => {
      toast.success("My thoughts on this", {
        id: notification,
      });
    });
  }

  const containerRef = useRef<HTMLInputElement>(null);
  const askQuestionCalled = useRef(false);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
    if (
      messages &&
      messages.docs.length === 1 &&
      messages.docs[0].data().user._id === session?.user?.email! &&
      !askQuestionCalled.current

    ) {
      askQuestion();
      askQuestionCalled.current = true;

    }
  }, [messages]);

  return (
    <Box
      ref={containerRef}
      sx={{
        position: "absolute",
        display: "flex",
        width: "100%",
        padding: "10px",
        marginBottom: "auto",
        flexDirection: "column",
        backgroundColor: "white",
        overflow: "scroll",

        bottom: "0",
        top: "0",
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
          <ArrowDownCircleIcon className="h-10 w-10 mx-auto mt-5 text-black animate-bounce" />
        </>
      )}
      {messages?.docs.map((message) => (
        <Box
          key={message.id}
          sx={{ marginBottom: "20px", width: "100%", backgroundColor: "white" }}
        >
          <Message2 key={message.id} message={message.data()} />
        </Box>
      ))}
      <DrawerSpacer />
    </Box>
  );
}

export default Chat2;
