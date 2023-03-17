"use client";
import React, { use, useEffect, useRef, useState } from "react";
import { ArrowDownCircleIcon } from "@heroicons/react/24/solid";
import {
  query,
  collection,
  orderBy,
  limit,
  onSnapshot,
  doc,
  QueryDocumentSnapshot,
  QuerySnapshot,
  DocumentData,
  Unsubscribe,
  getDoc,
  where,
} from "firebase/firestore";
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
type Bot = {
  botName: string;
  primer: string;
  botQuestions: string[];
  creatorId: string;
  botColor: string;
  show: boolean;
  avatar: string;
  textColor: string;
};
type UseCollectionDataReturnType<T> = [T[], boolean, Error | null];

const useCollectionData = <T,>(query: any): UseCollectionDataReturnType<T> => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const memoizedQuery = React.useMemo(() => query, [query]);

  useEffect(() => {
    let unsubscribe: Unsubscribe | undefined;

    if (memoizedQuery) {
      unsubscribe = onSnapshot(memoizedQuery, (snapshot: QuerySnapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as T[];
        setData(data);
        setLoading(false);
        setError(null);
      });
    }

    return () => {
      unsubscribe?.();
    };
  }, []);

  return [data, loading, error];
};
 function Chat2({ chatId, botid }: Props) {
  const { data: session } = useSession();

  const [bot, setBot] = useState<Bot>();
  useEffect(() => {
    if (botid) {
      const botRef = doc(db, "bots", botid);
      getDoc(botRef).then((doc) => {
        if (doc.exists()) {
          setBot(doc.data() as Bot);
        } else {
          toast.error("Bot not found");
        }
      });
    }
  }, []);
  const messagesQuery =
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
    );

  const [messages, loading, error] =
    useCollectionData<DocumentData>(messagesQuery);

  const [lastMessageIsCurrentUser, setLastMessageIsCurrentUser] =
    useState(Boolean);

  const { data: model } = useSWR("model", {
    fallbackData: "gpt-4",
  });

  const fetcher = (url: string) => {
    if (!session) getSession();
    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: session?.user?.email!,
      }),
    }).then((res) => res.json());
  };

  const { data: primer, mutate: setPrimer } = useSWR(
    `/api/getPrimer`,
    session && fetcher,
    {
      ...mySwrConfig,
      fallbackData: "Fallback data",
    }
  );

  useEffect(() => {
    if (primer.text === undefined) return;
    console.log(`primer: ${primer.text}`);
  }, [primer]);

  async function askQuestion() {
    // if no session get session
    if (!session) {
      return;
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
    if (messages?.length === 0) return;

    if (messages[messages.length - 1].user.name !== author) {
      return;
    }

    if (primer.text === undefined) return;

    await fetch("/api/askQuestion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chatId,
        model,
        primer: primer?.text,
        session,
      }),
    }).then(() => {
      setLastMessageIsCurrentUser(false);
    });
  }

  const containerRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!session) return;
    if (!messages) return;
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
    const lastMessage = messages[messages.length - 1];
    if (lastMessage) {
      const lastMessageAuthor = lastMessage.user.name;
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
    if (!primer) return;
    // console.log("Last message is current user? : ", lastMessageIsCurrentUser);
    if (!lastMessageIsCurrentUser) return;
    if (primer.text === undefined) return;
    askQuestion();
  }, [session, lastMessageIsCurrentUser, primer]);

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
      {messages?.map((message) => {
        return (
          <Box
            key={message.id}
            sx={{
              marginBottom: "20px",
              width: "100%",
              backgroundColor: "white",
            }}
          >
            <Message2
              key={message.id}
              message={message}
              botColor={bot ? bot.botColor : undefined}
              textColor={bot ? bot.textColor : undefined}
            />
          </Box>
        );
      })}

      <DrawerSpacer />
    </Box>
  );
}

export default Chat2;
