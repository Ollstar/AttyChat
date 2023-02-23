"use client";
import {
  BoltIcon,
  ExclamationTriangleIcon,
  SunIcon,
} from "@heroicons/react/24/outline";
import { Box, Pagination } from "@mui/material";
import { collection } from "firebase/firestore";
import { useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import DrawerSpacer from "../components/DrawerSpacer";
import NewChatWithBot from "../components/NewChatWithBot";

import NewChatWithMessage from "../components/NewChatWithMessage";
import { db } from "../firebase";

function HomePage() {
  const [botsSnapshot] = useCollection(collection(db, "bots"));
  const [page, setPage] = useState(0); // Current page
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const numPages =
    botsSnapshot?.docs?.length! > 0
      ? Math.ceil(botsSnapshot?.docs?.length! / itemsPerPage)
      : 1;
  const paginatedBots = botsSnapshot?.docs.slice(
    page * itemsPerPage,
    page * itemsPerPage + itemsPerPage
  );

  // Number of items per page
  return (
    <>
      <Box fontFamily="poppins" className="bg-[#397EF7] h-screen w-screen">
        <DrawerSpacer />

        <div className="text-white flex flex-col px-2 items-center justify-center bg-[#397EF7]">
          <h1 className="text-3xl font-bold mb-2">Bot List</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-xl mb-2 text-center">
            {paginatedBots?.map((doc) => (
              <NewChatWithBot
                key={doc.id}
                messageText={`${doc.data().botName}`}
                botid={doc.id}
                useClient={true}
              />
            ))}
          </div>
          <Pagination
            count={numPages}
            page={page + 1}
            onChange={(event, value) => {
              setPage(value - 1);
            }}
            color="primary"
          />
          <h1 className="text-3xl font-bold mb-2">Quick Questions</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-xl mb-2 text-center">
            <NewChatWithMessage messageText="What can Atty Chat do?" />
            <NewChatWithMessage messageText="How do I use Atty Chat?" />
            <NewChatWithMessage messageText="Who should use Atty Chat?" />
            <NewChatWithMessage messageText="What is ChatGPT?" />
            <NewChatWithMessage messageText="Can you pretend to be like Elvis for the rest of our conversation?" />
            <NewChatWithMessage messageText="Can you use lots of emojis in the rest of our conversation?" />
            <NewChatWithMessage messageText="Can you imagine yourself as the president of the USA for the rest of the conversation?" />
            <NewChatWithMessage messageText="Can you write in exclamation for the rest of our conversation?" />
            <NewChatWithMessage messageText="Will you pretend to be my freind?" />
          </div>
        </div>
      </Box>
    </>
  );
}

export default HomePage;
