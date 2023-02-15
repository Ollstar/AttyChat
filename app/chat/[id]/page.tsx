import Chat from "../../../components/Chat";
import Chat2 from "../../../components/Chat2";
import ChatInput from "../../../components/ChatInput";
import ChatInput2 from "../../../components/ChatInput2";
import DrawerSpacer from "../../../components/DrawerSpacer";

type Props = {
  params: {
    id: string;
  };
};
function ChatPage({ params: { id } }: Props) {
  return (
    <>
    <div className="flex bg-red-500 flex-col overflow-x-hidden overflow-y-scroll">
      <Chat2 chatId={id} />
      <ChatInput2 chatId={id} />

    </div>
    <DrawerSpacer />

    </>
  );
}

export default ChatPage;