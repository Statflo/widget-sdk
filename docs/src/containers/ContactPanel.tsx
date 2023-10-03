import { Button, ContactInfo } from "@statflo/ui";
import { useConversationContext } from "../providers/ConversationProvider";
import WidgetsPanel from "./WidgetPanel";

const ContactPanel = () => {
  const { activeConversation } = useConversationContext();

  if (!activeConversation) return null;

  return (
    <div className="bg-background-light h-screen flex flex-col w-full relative shadow-navigation dark:border-l dark:border-blueGrey-800 dark:bg-blueGrey-900">
      <div className="flex flex-col items-center">
        <div className="min-h-[8rem] h-full flex flex-col gap-1 justify-center items-center py-4 px-8">
          <h2 className="text-24 font-bold text-center">
            {activeConversation.recipient.name}
          </h2>
          <Button
            disabled
            trailingIcon="chevron-right"
            size="small"
            variant="secondary"
          >
            Back to Account
          </Button>
        </div>
        <div className="flex flex-col gap-3 py-4 pl-6 pr-4 w-full">
          <ContactInfo
            content={activeConversation.recipient.phone_number}
            copy
            title="Phone Number"
            iconName="phone"
          />
          <ContactInfo
            content={activeConversation.recipient.ban_id}
            copy
            title="BAN ID"
            iconName="identifier"
          />
        </div>
      </div>
      <div className="flex justify-center p-6">
        <Button leadingIcon="stickynote-add" disabled variant="secondary">
          Log An Activity
        </Button>
      </div>
      <WidgetsPanel />
    </div>
  );
};

export default ContactPanel;
