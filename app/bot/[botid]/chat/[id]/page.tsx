import React from 'react';
import { useSession } from 'next-auth/react';
import Chat2 from '../../../../../components/Chat2';
import ChatInput2 from '../../../../../components/ChatInput2';
import DrawerSpacer from '../../../../../components/DrawerSpacer';


type Props = {
  params: {
    id: string;
    botid: string;
  };
};
function ChatPage({ params: { id, botid } }: Props) {
  return (
    <>
    <div className="flex bg-red-500 flex-col overflow-x-hidden overflow-y-scroll">
      <Chat2 chatId={id} botid={botid} />
      <ChatInput2 chatId={id} botid={botid} />

    </div>
    <DrawerSpacer />

    </>
  );
}

export default ChatPage;