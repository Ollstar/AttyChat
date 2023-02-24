"use client";
import { Box, Container } from "@mui/material";
import DrawerSpacer from "../../../components/DrawerSpacer";
import NewChatWithBot from "../../../components/NewChatWithBot";
import { db } from "../../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import NewBot from "../../../components/NewBot";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type Bot = {
  creatorId: string;
  primer: string;
  botName: string;
  botQuestions: string[];
  botColor: string;
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
    router.refresh();
  }, [botid]);

  if (!bot) {
    return <div className="bg-[#397EF7] h-screen w-screen text-white "></div>;
  }
  if (!bot.botColor) {
    console.log("no color");
    setBot({ ...bot, botColor: "#397EF7" });


  } else {
    console.log(bot!.botColor);
  }

  return (
    <>
        <Box fontFamily="poppins" sx={{backgroundColor:bot!.botColor, paddingBottom:"14px", height:"100%",width:"100%"}}>
          <div className = "h-screen w-screen">
          <DrawerSpacer />
          <div className="text-white flex flex-col px-2 items-center justify-center">
            <div className="flex flex-row">
            <h1 className="text-5xl font-bold">{bot.botName}</h1>
            {session?.user?.email! === bot.creatorId && <NewBot bot={bot} botid={botid} />}
            </div>
            <h1 className="text-3xl font-bold mb-10">Quick Questions</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 text-center">
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
    </>
  );
}

export default BotPage;
