"use client";
import { Box, Container } from "@mui/material";
import DrawerSpacer from "../../../components/DrawerSpacer";
import NewChatWithBot from "../../../components/NewChatWithBot";
import { db } from "../../../firebase";
import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import { useState, useEffect } from "react";
import NewBot from "../../../components/NewBot";
import { getSession, signOut, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { sign } from "crypto";
import { FitScreen } from "@mui/icons-material";

type Bot = {
  creatorId: string;
  primer: string;
  botName: string;
  botQuestions: string[];
  botColor: string;
  show: boolean;
  avatar: string;
  textColor: string;
};

type Props = {
  params: {
    botid: string;
  };
};

function BotPage({ params: { botid } }: Props) {
  const { status, data: session } = useSession({
    required: true,
    onUnauthenticated() {
      signOut();
      // The user is not authenticated, handle it here.
    },
  })

  if (status === "loading") {
    return "Loading or not authenticated..."
  }
  
  const router = useRouter();
  const [bot, setBot] = useState<Bot | null>(null);
  const [prevBotId, setPrevBotId] = useState("");
  const [bgcolor, setBgcolor] = useState("#397EF7");
  const [textcolor, setTextcolor] = useState("white");
  useEffect(() => {
    if (!bot) return;
    setBgcolor(bot.botColor);
    setTextcolor(bot.textColor);
  }, [bot]);
 
  useEffect(() => {
    if (!session) {
      getSession();
    }
  
    if (!botid ) return;
  
    const docRef = doc(db, "bots", botid);
    const unsubscribe = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        setBot(doc.data() as Bot);
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    });
  
    setPrevBotId(botid);
  
    // Unsubscribe from listener on unmount
    return () => unsubscribe();
  }, [botid, prevBotId, session]);
  

  if (!bot) {
    return;
  }
  if (!bot.botColor) {
    // console.log("no color");
    setBot({ ...bot, botColor: "#397EF7" });
  }
  if (!bot.textColor) {
    // console.log("no text color");
    setBot({ ...bot, textColor: "white" });
  }

  return (
    <Box
      fontFamily="poppins"
      sx={{
        backgroundColor: bgcolor,
        color: textcolor,
        height: "100vh",
        width: "100vw",
      }}
      className="pb-2"
    >
      <DrawerSpacer />
        <div className={`flex flex-col px-2  items-center bg-[${bgcolor}]`}>
          <h1 className="text-5xl font-bold">{bot.botName}</h1>
          <h1 className={`text-3xl font-bold mb-10`}>Quick Questions</h1>
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 text-center`}
          >
            {bot.botQuestions.map((question, index) => (
              <NewChatWithBot
                key={index}
                messageText={question}
                botid={botid}
              />
            ))}
          </div>

        </div>

    </Box>
  );
}

export default BotPage;
