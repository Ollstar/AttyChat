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
      <Box fontFamily="poppins" className="bg-[#397EF7]" width="100%">
        <DrawerSpacer />

        <div className="text-white flex flex-col px-2 items-center justify-center">
          <h1 className="text-5xl font-bold mb-10">AttyChat</h1>
          <h1 className="text-3xl font-bold mb-10">Quick Questions</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 w-2/3 h-screen text-center">
            <div>
              <div className="flex justify-center flex-col items-center mb-5">
                <SunIcon className="h-8 w-8" />
                <h2>Examples</h2>
                <div className="space-y-2">
                  <NewChatWithMessage messageText="What is ChatGPT?" />
                  <NewChatWithMessage messageText="Can you pretend to be like Elvis for the rest of our conversation?" />
                  <NewChatWithMessage messageText="Can you use lots of emojis in the rest of our conversation?" />
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
                  <NewChatWithMessage messageText="Who should use Atty Chat?" />
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-center flex-col items-center mb-5">
                <BoltIcon className="h-8 w-8" />
                <h2>Features</h2>
                <div className="space-y-2">
                  <NewChatWithMessage messageText="Can you imagine yourself as the president of the USA for the rest of the conversation?" />
                  <NewChatWithMessage messageText="Can you write in exclamation for the rest of our conversation?" />
                  <NewChatWithMessage messageText="Will you pretend to be my freind?" />
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
