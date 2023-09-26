type Recipient = {
  name: string;
  phone_number: string;
  ban_id: string;
  id: string;
  contact_id: string | null;
  city: string | null;
  country: string | null;
  postal_code: string | null;
  activity_type: string | null;
  province: string | null;
  street_name: string | null;
  street_number: string | null;
};

type Message = {
  action: "send" | "receive";
  associated_number: string;
  associated_number_type: string | null;
  content: string;
  contact_id: string | null;
  conversation_id: string;
  date_added: string;
  delivery_status:
    | "new"
    | "in-progress"
    | "ok"
    | "error"
    | "failed"
    | "retry"
    | "profanity"
    | "dnc";
  dnc?: boolean;
  id: string;
  message_template_id: string | null;
  templateId: string | null;
  used_ip_address: string | null;
  user_id: string;
};

type Conversation = {
  id: string;
  account: {
    activity_type: string;
    attempt: string;
  };
  last_message: Message;
  recipient: Recipient;
  unread_message_count: string;
};

type MessageFeed = {
  messages: Message[];
  total_count: number;
};
