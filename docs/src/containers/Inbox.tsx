import { Search, Tabs } from "@statflo/ui";
import ContactCard from "../components/ContactCard";
import { useConversationContext } from "../providers/ConversationProvider";

const Inbox = () => {
  const { conversations, activeConversation, setActiveConversation } =
    useConversationContext();

  return (
    <div className="flex flex-col h-screen shadow-navigation dark:shadow-transparent dark:border-r dark:border-blueGrey-800">
      <div className="relative">
        <div className="bg-background-light dark:bg-blueGrey-900">
          <div className="flex items-center justify-between h-[5.5rem] py-4 pl-6 pr-4">
            <h1 className="flex-1 font-bold">Conversations</h1>
          </div>
          <Tabs
            id="inbox"
            onTabSelect={() => {}}
            selectedIndex={0}
            tabOptions={[
              {
                name: "Inbox",
                label: "inbox",
              },
              {
                name: "Smart Lists",
                label: "smartLists",
                disabled: true,
              },
            ]}
          />
          <div className="flex gap-1 p-4">
            <Search className="flex-1" onChange={() => {}} value="" />
          </div>
        </div>
        <div className="flex flex-col items-center gap-4 pt-4 px-4 pb-8 bg-blueGrey-50 shadow-inner h-full relative w-full dark:bg-darkMode-900 overflow-y-auto">
          {conversations.map((conversation) => (
            <ContactCard
              active={conversation.id === activeConversation?.id}
              contactName={conversation.recipient.name}
              content={conversation.last_message.content}
              date={conversation.last_message.date_added}
              id={conversation.id}
              key={conversation.id}
              messageStatus={conversation.last_message.action}
              onClick={() => setActiveConversation(conversation)}
              unread={parseInt(conversation.unread_message_count)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Inbox;
