"use client";
import React, { useEffect, useRef, useState } from "react";
import { ArrowDownCircleIcon } from "@heroicons/react/24/solid";
import { query, collection, orderBy, limit, onSnapshot, doc } from "firebase/firestore";
import { getSession, useSession } from "next-auth/react";
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
    await getSession();
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
      // console.log(`error: ${err}`);
      return { text: "fallback data" };
    });
};

function Chat2({ chatId, botid }: Props) {
  const { data: session } = useSession();

  const [lastMessageIsCurrentUser, setLastMessageIsCurrentUser] =
    useState(Boolean);

  const { data: model } = useSWR("model", {
    fallbackData: "text-davinci-003",
  });

  const { data: primer, mutate: setPrimer } = useSWR(
    "primer",
    session ? () => fetchPrimer(session) : null,
    {
      ...mySwrConfig,
      fallbackData: "Fallback data",
      revalidateOnMount: true,
      revalidateOnFocus: true,
    }
  );


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
    // if no session get session
    if (!session) {
      await getSession();
    }
    // print out the variable name a : and then the value then a new line for the vars in this function
    console.log(`session: ${session}
    messages: ${messages}
    primer: ${primer}
    model: ${model}
    chatId: ${chatId}
    `);
    if (!session) return;

    const author = session?.user?.name!;
    if (!messages) return;

    if (messages?.docs[messages?.docs.length - 1].data().user.name !== author)
      return;
    let msg = messages?.docs[messages?.docs.length - 1].data().text;
    msg = `${author}: ${msg}`;


    if (!primer) return;

    const notification = toast.loading("Thinking...", {
      position: "bottom-left",
      style: {
        border: "1px solid white",
        // position this in the center of the screen
        margin: "60px 0",
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
        messages: messages?.docs
          .map((doc) => {
            const data = doc.data();
            return `${data.user.name}: ${data.text}\n`;
          })
          .join(""),

        session,
      }),
    })
      .then(() => {
        setLastMessageIsCurrentUser(false);
        toast.success("My thoughts on this", {
          id: notification,
          duration: 500,
        });
      })
      .catch((err) => {
        toast.error("Something went wrong", {
          id: notification,
          duration: 2000,
        });
      });
      
  }

  const containerRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!session) return;
    if (!messages) return;
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
    const lastMessage = messages?.docs[messages?.docs.length - 1];
    if (lastMessage) {
      const lastMessageAuthor = lastMessage.data().user.name;
      const currentUser = session.user?.name!;
      if (
        (lastMessageAuthor === currentUser &&
          lastMessageIsCurrentUser === false) ||
        lastMessageIsCurrentUser === undefined
      ) {
        setLastMessageIsCurrentUser(true);
      }
      if (lastMessageAuthor === currentUser && lastMessageIsCurrentUser) {
        setLastMessageIsCurrentUser(false);
      }
    }
  }, [messages, session]);

  useEffect(() => {
    if (!session) return;
    // console.log("Last message is current user? : ", lastMessageIsCurrentUser);
    if (!lastMessageIsCurrentUser) return;
    askQuestion();
  }, [session, lastMessageIsCurrentUser]);

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
        marginTop: "20px",
        scrollBehavior: "smooth",

        bottom: "0",
        top: "0",
      }}
    >
      <DrawerSpacer />
      {messages?.empty && (
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
