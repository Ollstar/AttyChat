"use client"
import { Box, Container } from "@mui/material";
import DrawerSpacer from "../../../components/DrawerSpacer";
import NewChatWithBot from "../../../components/NewChatWithBot";
import { db } from "../../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react";

type Bot = {
  botName: string;
  botQuestions: string | string[];
};

type Props = {
  params: {
    botid: string;
  };
};

function BotPage({ params: { botid } }: Props) {
  const [bot, setBot] = useState<Bot | null>(null);

  useEffect(() => {
    const getBot = async () => {
      const docRef = doc(db, "bots", botid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setBot(docSnap.data() as Bot);
      } else {
        console.log("No such document!");
        setBot(null);
      }
    };

    getBot();
  }, [botid]);

  if (!bot) {
    return <div>Loading...</div>;
  }

  return (
    <>
    <div className="bg-[#397EF7] h-screen w-screen">
      <Box fontFamily="poppins" className="bg-[#397EF7]"  >
        <DrawerSpacer />

        <div className="text-white flex flex-col px-2 items-center justify-center">
          <h1 className="text-5xl font-bold mb-10">{bot.botName}</h1>
          <h1 className="text-3xl font-bold mb-10">Quick Questions</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 text-center">
  {Array.isArray(bot.botQuestions) ? (
    bot.botQuestions.map((question, index) => (
      <NewChatWithBot key={index} messageText={question} botid={botid} />
    ))
  ) : (
    <NewChatWithBot messageText={bot.botQuestions} botid={botid} />
  )}
</div>

        </div>
      </Box>
      </div>
    </>
  );
}

export default BotPage;
