"use client"
import { Box } from "@mui/material";
import DrawerSpacer from "../../../components/DrawerSpacer";
import NewChatWithBot from "../../../components/NewChatWithBot";
import { db } from "../../../firebase";
import { doc, getDoc } from "firebase/firestore";

type Props = {
  params: {
    botid: string;
  };
};

function BotPage({ params: { botid } }: Props) {

  const getBot = async () => {
    const docRef = doc(db, "bots", botid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  };

  getBot();

  return (
    <>
      <Box fontFamily="poppins" className="bg-[#397EF7]" width="100%">
        <DrawerSpacer />

        <div className="text-white flex flex-col px-2 items-center justify-center">
          <h1 className="text-5xl font-bold mb-10">AttyChat</h1>
          <h1 className="text-3xl font-bold mb-10">Quick Questions</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 w-2/3 h-screen text-center">
            <NewChatWithBot messageText="Hello" botid={botid} />
          </div>
        </div>
      </Box>
    </>
  );
}

export default BotPage;
