import { Icon } from "@statflo/ui";
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
        <div className="flex justify-center gap-2 flex-col items-center pb-8">
          <div className="text-center text-blueGrey-600 dark:text-blueGrey-300 max-w-md">
            {"Use "}
            <div className="rounded-full bg-blue-500 inline-flex w-6 h-6 items-center justify-center">
              <Icon color="white" icon="send-email" size="small" />
            </div>
            {" to simulate sending a message to the contact and "}
            <div className="rounded-full border border-blue-200 dark:border-blueGrey-600 inline-flex w-6 h-6 items-center justify-center">
              <Icon color="blueGrey" icon="envelope-incoming" size="small" />
            </div>
            {" to simulate receiving a message from the contact."}
          </div>
          <div className="text-center text-blueGrey-600 dark:text-blueGrey-300 max-w-md">
            {"Use "}
            <div className="rounded-full border border-blue-200 dark:border-blueGrey-600 inline-flex w-6 h-6 items-center justify-center">
              <Icon color="blueGrey" icon="add" size="small" />
            </div>
            {" to open a menu of Sendable Widgets."}
          </div>
        </div>
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
