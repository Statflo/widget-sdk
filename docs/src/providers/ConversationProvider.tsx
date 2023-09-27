import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { makeData, newMessage } from "../utils/makeData";

type ConversationContextProps = {
  conversations: Conversation[];
  activeConversation?: Conversation;
  setActiveConversation: React.Dispatch<
    React.SetStateAction<Conversation | undefined>
  >;
  messageFeed?: MessageFeed;
  addMessage: (
    conversationId: string,
    action: "send" | "receive",
    content: string
  ) => void;
};

const ConversationContext = createContext<ConversationContextProps>(null!);

export function useConversationContext() {
  return useContext(ConversationContext);
}

const data = makeData(3);

export function ConversationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [conversations, setConversations] = useState(data.conversations);
  const [messageFeeds, setMessageFeeds] = useState(data.messageFeeds);
  const [activeConversation, setActiveConversation] = useState<Conversation>();
  const [messageFeed, setMessageFeed] = useState<MessageFeed>();

  useEffect(() => {
    if (activeConversation) setMessageFeed(messageFeeds[activeConversation.id]);
  }, [activeConversation, messageFeeds]);

  const addMessage = useCallback(
    (conversationId: string, action: "send" | "receive", content: string) => {
      const conversation = conversations.find(
        (conversation) => conversation.id === conversationId
      );

      if (!conversation) return;

      const message: Message = newMessage({
        associatedNumber: conversation.last_message.associated_number,
        id: `${parseInt(conversation.last_message.id) + 1}`,
        conversationId: conversation.id,
        userId: conversation.last_message.user_id,
        action,
        dateAdded: new Date().toLocaleString(),
        content,
      });

      setMessageFeeds((prevState) => ({
        ...prevState,
        [conversation.id]: {
          messages: [...prevState[conversation.id].messages, message],
          total_count: prevState[conversation.id].total_count + 1,
        },
      }));
      setConversations((prevState) =>
        prevState.map((conversation) =>
          conversation.id === conversationId
            ? {
                ...conversation,
                last_message: message,
              }
            : conversation
        )
      );
    },
    [conversations, setMessageFeeds]
  );

  const context = useMemo<ConversationContextProps>(
    () => ({
      conversations,
      activeConversation,
      setActiveConversation,
      messageFeed,
      addMessage,
    }),
    [
      conversations,
      activeConversation,
      setActiveConversation,
      messageFeed,
      addMessage,
    ]
  );

  return (
    <ConversationContext.Provider value={context}>
      {children}
    </ConversationContext.Provider>
  );
}
