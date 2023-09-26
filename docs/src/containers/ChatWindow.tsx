import MessageBubble from "../components/MessageBubble";
import { useConversationContext } from "../providers/ConversationProvider";
import MessageInput from "./MessageInput";

const ChatWindow = () => {
  const { activeConversation, messageFeed } = useConversationContext();

  if (!activeConversation) return null;

  return (
    <div className="relative flex h-screen flex-col overflow-hidden">
      <div className="relative p-4 flex items-center w-full h-22 shadow-convoCard dark:bg-blueGrey-900 dark:border-b dark:border-blueGrey-800 dark:shadow-transparent">
        <div className="flex-1 flex items-center gap-2">
          <h2 className="text-18 font-bold">
            {activeConversation?.recipient.name}
          </h2>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto flex flex-col justify-end gap-4 p-6">
        {messageFeed?.messages.map((message) => (
          <MessageBubble
            action={message.action}
            content={message.content}
            date={message.date_added}
            id={message.id}
            key={message.id}
          />
        ))}
      </div>
      <MessageInput />
    </div>
  );
};

export default ChatWindow;
