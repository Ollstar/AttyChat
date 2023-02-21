"use client";
import React, { useEffect, useRef, useState } from "react";
import { ArrowDownCircleIcon } from "@heroicons/react/24/solid";
import { query, collection, orderBy, limit, getDocs } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import { db } from "../firebase";
import Message from "./Message";
import { Box, Avatar, Typography } from "@mui/material";
import DrawerSpacer from "./DrawerSpacer";
import Message2 from "./Message2";
import useSWR from "swr";
import toast from "react-hot-toast";
import { Session } from "next-auth";
import mySwrConfig from "../lib/swr-config";

type Props = {
  chatId: string;
  botid?: string;
};

const fetchPrimer = async (session: Session) => {
  if (!session) {
    return Promise.resolve({});
  }

  return fetch("/api/getPrimer", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      session: { user: { email: session?.user?.email! } },
    }),
  }).then((res) => res.json());
};

function Chat2({ chatId, botid }: Props) {
  const [lastMessageIsCurrentUser, setLastMessageIsCurrentUser] =
    useState(false);

  const { data: model } = useSWR("model", {
    fallbackData: "text-davinci-003",
  });
  const { data: session } = useSession();

  const { data: primer, mutate: setPrimer } = useSWR(
    "primer",
    session ? () => fetchPrimer(session) : null,
    {
      ...mySwrConfig,
      fallbackData: "Fallback data",
      revalidateOnFocus: true,
      revalidateOnMount: true,
    }
  );
  const { data: messages, mutate: setMessages } = useSWR("messages", () => {
    if (session && session.user && session.user.email) {
      const messagesQuery = query(
        collection(
          db,
          "users",
          session.user.email,
          "chats",
          chatId,
          "messages"
        ),
        orderBy("createdAt", "asc")
      );
      return getDocs(messagesQuery).then((querySnapshot) =>
        querySnapshot.docs
      );
    }
    return Promise.resolve([]);
  });

  async function askQuestion() {

    if (!session) return;

    const author = session?.user?.name!;
    if (!messages) return;
    if (messages[messages.length - 1].data().user.name !== author) return;
    let msg = messages[messages.length - 1].data().text;
    msg = `${author}: ${msg}`;

    await setPrimer();

    if (!primer.text) return;

    const notification = toast.loading("Thinking...", {
      position: "top-center",
      style: {
        border: "1px solid white",
        padding: "16px",
      },
    });

    await fetch("/api/askQuestion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: msg,
        chatId,
        model,
        primer: primer?.text,
        //map each message so that it displays author: text
        //then join them with a new line
        messages: messages
          .map((doc) => {
            const data = doc.data();
            return `${data.user.name}: ${data.text}\n`;
          })
          .join(""),

        session,
      }),
    }).then(() => {
      setLastMessageIsCurrentUser(false);
      setMessages();
      toast.success("My thoughts on this", {
        id: notification,
        duration: 2000,
      });
    });
  }

  const containerRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
    if (messages && messages.length > 0) {
      const lastMessageAuthor =
        messages[messages.length - 1].data().user.name;
      if (lastMessageAuthor === session?.user?.name && !lastMessageIsCurrentUser) {
        setLastMessageIsCurrentUser(true);

        askQuestion();

      }
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
      {messages?.length === 0 && (
        <Box color="#397EF7">
          <Typography
            fontFamily={"Poppins"}
            variant="subtitle1"
            align="center"
            className="mt-10 text-[#397EF7]"
          >
            Type a prompt in below to get started!
          </Typography>
          <ArrowDownCircleIcon className="h-10 w-10 mx-auto mt-5 animate-bounce" />
        </Box>
      )}
      {messages?.map((message: any) => (
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
