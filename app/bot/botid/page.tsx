"use client";
import {
  BoltIcon,
  ExclamationTriangleIcon,
  SunIcon,
} from "@heroicons/react/24/outline";
import { Box } from "@mui/material";
import DrawerSpacer from "../../../components/DrawerSpacer";
import NewChatWithBot from "../../../components/NewChatWithBot";

type Props = {
    params: {
      botId: string;
    };
  };
  function BotPage({ params: { botId } }: Props) {
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
                    <NewChatWithBot messageText="What is ChatGPT?" botId={botId} />
                    <NewChatWithBot messageText="Can you pretend to be like Elvis for the rest of our conversation?" botId={botId} />
                    <NewChatWithBot messageText="Can you use lots of emojis in the rest of our conversation?" botId={botId} />
                  </div>
              </div>
            </div>

            <div>
              <div className="flex justify-center flex-col items-center mb-5">
                <ExclamationTriangleIcon className="h-8 w-8" />
                <h2>Limitations</h2>
                <div className="space-y-2">
                    <NewChatWithBot messageText="What can Atty Chat do?" botId={botId} />
                    <NewChatWithBot messageText="How do I use Atty Chat?" botId={botId} />
                    <NewChatWithBot messageText="Who should use Atty Chat?" botId={botId} />
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-center flex-col items-center mb-5">
                <BoltIcon className="h-8 w-8" />
                <h2>Features</h2>
                <div className="space-y-2">
                    <NewChatWithBot messageText="Can you imagine yourself as the president of the USA for the rest of the conversation?" botId={botId} />
                    <NewChatWithBot messageText="Can you write in exclamation for the rest of our conversation?" botId={botId} />
                    <NewChatWithBot messageText="Will you pretend to be my freind?" botId={botId} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Box>
    </>
  );
}

export default BotPage;
