import { faker } from "@faker-js/faker";

export const newMessage = ({
  associatedNumber,
  conversationId,
  id,
  userId,
  action,
  dateAdded,
  content,
}: {
  associatedNumber: string;
  conversationId: string;
  id: string;
  userId: string;
  action?: "send" | "receive";
  dateAdded?: string;
  content?: string;
}): Message => {
  return {
    action: action ?? (Math.ceil(Math.random() * 2) === 1 ? "send" : "receive"),
    associated_number: associatedNumber,
    associated_number_type: null,
    content: content ?? faker.lorem.sentence(),
    contact_id: null,
    conversation_id: conversationId,
    date_added: dateAdded ?? faker.date.recent().toLocaleString(),
    delivery_status: "ok",
    dnc: false,
    id,
    message_template_id: null,
    templateId: null,
    used_ip_address: null,
    user_id: userId,
  };
};

export const makeMessageFeedData = (lastMessage: Message): MessageFeed => {
  const totalCount = Math.ceil(Math.random() * 5);
  const messages = Array.from({ length: totalCount - 1 }).map((_, i) => ({
    ...newMessage({
      associatedNumber: lastMessage.associated_number,
      conversationId: lastMessage.conversation_id,
      id: `${parseInt(lastMessage.id) - i - 1}`,
      userId: lastMessage.user_id,
    }),
  }));

  messages.push(lastMessage);

  return {
    messages,
    total_count: totalCount,
  };
};

const newConversation = (i: number): Conversation => {
  const id = `${faker.string.numeric(7)}${i}`;

  return {
    id,
    account: {
      activity_type: "10",
      attempt: "1",
    },
    last_message: newMessage({
      associatedNumber: faker.phone.number("+########"),
      id: `${faker.string.numeric(6)}${i}`,
      conversationId: id,
      userId: `${faker.string.numeric(6)}${i}`,
    }),
    recipient: {
      name: `${faker.person.firstName()} ${faker.person.lastName()}`,
      phone_number: faker.phone.number("+1 (###) ###-####"),
      ban_id: `${faker.string.numeric(11)}${i}`,
      id: `${faker.string.numeric(3)}${i}`,
      contact_id: null,
      city: null,
      country: "CA",
      postal_code: null,
      activity_type: null,
      province: "ON",
      street_name: null,
      street_number: null,
    },
    unread_message_count: "0",
  };
};

export const makeConversationData = (length: number) => {
  return Array.from({ length }).map((_, i) => ({
    ...newConversation(i),
  }));
};

export const makeData = (length: number) => {
  const conversations = makeConversationData(length);

  const messageFeeds: {
    [key: string]: MessageFeed;
  } = {};

  conversations.forEach((conversation) => {
    messageFeeds[conversation.id] = makeMessageFeedData(
      conversation.last_message
    );
  });

  return { conversations, messageFeeds };
};
