"use client";
import { ArrowDownCircleIcon } from "@heroicons/react/24/solid";
import { query, collection, orderBy } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../firebase";
import Message from "./Message";
import { Box, Avatar, Typography, makeStyles, Container } from "@mui/material";

type Props = {
  chatId: string;
};

function Chat({ chatId }: Props) {
  const { data: session } = useSession();
  const [messages] = useCollection(
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

  return (
    <Container>
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
      )}{" "}
      {messages?.docs.map((message) => (
        <Message key={message.id} message={message.data()} />
      ))}
    </Container>
  );
}

export default Chat;
