"use client";
import { Box, Container } from "@mui/material";
import DrawerSpacer from "../../../components/DrawerSpacer";
import NewChatWithBot from "../../../components/NewChatWithBot";
import { db } from "../../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import NewBot from "../../../components/NewBot";
import { getSession, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

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
  const { data: session } = useSession();
  const router = useRouter();
  const [bot, setBot] = useState<Bot | null>(null);
  const [prevBotId, setPrevBotId] = useState("");
  const [bgcolor, setBgcolor] = useState("#397EF7");
  const [textcolor, setTextcolor] = useState("white");

  useEffect(() => {
    if(!bot) return;
    setBgcolor(bot.botColor);
    setTextcolor(bot.textColor);
  }, [bot])
  useEffect (() => {
    if (!router) return;
  }, [router])
  useEffect(() => {
    if (!session) 
      {
        getSession();
      }
    // console.log("prevBotId", prevBotId);

    if (!botid) return;
    if (botid === prevBotId) return;
    // console.log("PotPage prevBotId", prevBotId);
    // console.log("BotPage botid", botid);
    const getBot = async () => {
      const docRef = doc(db, "bots", botid);
      const docSnap = await getDoc(docRef);
      setBot(docSnap.data() as Bot);
    };

    getBot();
    setPrevBotId(botid);
  }, [botid, prevBotId, session]);

  if (!bot) {
    return;
  }
  if (!bot.botColor) {
    // console.log("no color");
    setBot({ ...bot, botColor: "#397EF7"});
  }
  if (!bot.textColor) {
    // console.log("no text color");
    setBot({ ...bot, textColor: "white"});
  }

  return (
    <Box
      fontFamily="poppins"
      sx={{ backgroundColor: bgcolor, color:textcolor, height: "100vhw", width: "100vhw" }}
    >


      <div className={`text-[${textcolor}] h-screen w-screen bg-[${bgcolor}]`}>

          <DrawerSpacer />
        <div className={`flex flex-col px-2 pb-4 items-center bg-[${bgcolor}]`}>
          <div className="flex flex-row">
            <h1 className="text-5xl font-bold">{bot.botName}</h1>

          </div>
          <h1 className={`text-3xl font-bold mb-10`}>Quick Questions</h1>
          <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 text-center `}>
            {Array.isArray(bot.botQuestions) ? (
              bot.botQuestions.map((question, index) => (
                <NewChatWithBot
                  key={index}
                  messageText={question}
                  botid={botid}
                />
              ))
            ) : (
              <NewChatWithBot messageText={bot.botQuestions} botid={botid} />
            )}
          </div>
        </div>
      </div>
    </Box>
  );
}

export default BotPage;
