"use client";
import {
  BoltIcon,
  ExclamationTriangleIcon,
  SunIcon,
} from "@heroicons/react/24/outline";
import { Box } from "@mui/material";
import DrawerSpacer from "../components/DrawerSpacer";

import NewChatWithMessage from "../components/NewChatWithMessage";

function HomePage() {
  return (
<>
      <Box fontFamily="poppins" className="bg-[#397EF7] h-screen fixed" width="100%" height="100%">
        <DrawerSpacer />

        <div className="text-white flex flex-col px-2 items-center justify-center">
          <h1 className="text-5xl font-bold mb-10">AttyChat</h1>
          <h1 className="text-3xl font-bold mb-5">Quick Questions</h1>

          <div className="flex space-x-2 text-center">
            <div>
              <div className="flex justify-center flex-col items-center mb-5">
                <SunIcon className="h-8 w-8" />
                <h2>Examples</h2>
                <div className="space-y-2">
                  <NewChatWithMessage messageText="Remembers what user said earlier in the conversation" />
                  <NewChatWithMessage messageText="Distinguishes between different entities and their attributes" />
                  <NewChatWithMessage messageText="Generates human-like responses" />
                </div>
              </div>
            </div>


            <div>
              <div className="flex justify-center flex-col items-center mb-5">
                <ExclamationTriangleIcon className="h-8 w-8" />
                <h2>Limitations</h2>
                <div className="space-y-2">
                  <NewChatWithMessage messageText="What can Atty Chat do?" />
                  <NewChatWithMessage messageText="How do I use Atty Chat?" />
                  <NewChatWithMessage messageText="Who are your customers?" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Box>
    </>
  );
}

export default HomePage;
