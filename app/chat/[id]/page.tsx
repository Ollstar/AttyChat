import Chat from "../../../components/Chat";
import ChatInput from "../../../components/ChatInput";
import DrawerSpacer from "../../../components/DrawerSpacer";

type Props = {
  params: {
    id: string;
  };
};
function ChatPage({ params: { id } }: Props) {
  return (
    <>
    <div className="flex bg-red-500 flex-col overflow-y-scroll">
      <Chat chatId={id} />
      <ChatInput chatId={id} />

    </div>
    <DrawerSpacer />
    </>
  );
}

export default ChatPage;