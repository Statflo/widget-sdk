import { useEffect } from "react";
import { WidgetEvent } from "@statflo/widget-sdk";

import { WidgetEvents, useWidgetContext } from "../providers/WidgetProvider";
import { useConversationContext } from "../providers/ConversationProvider";

type User = {
  carrier_id: number;
  dealer_id: number;
  email: string;
  language: string;
};

const usePublishMainWidgetEvents = (isWidgetOpen?: boolean) => {
  const { activeConversation } = useConversationContext();
  const { publishEvent } = useWidgetContext();

  useEffect(() => {
    publishEvent(
      new WidgetEvent<string>(WidgetEvents.AUTHENTICATION_TOKEN, "1234567")
    );
    publishEvent(
      new WidgetEvent<User>(WidgetEvents.USER_AUTHENTICATED, {
        carrier_id: 1,
        dealer_id: 1,
        email: "email@statflo.com",
        language: "en",
      })
    );
    publishEvent(new WidgetEvent<boolean>(WidgetEvents.DARK_MODE, true));
  }, [publishEvent, isWidgetOpen]);

  useEffect(() => {
    if (activeConversation?.recipient.ban_id) {
      publishEvent(
        new WidgetEvent<string>(
          WidgetEvents.CURRENT_ACCOUNT_ID,
          activeConversation?.recipient.ban_id
        )
      );
    }
  }, [activeConversation?.recipient.ban_id, publishEvent, isWidgetOpen]);
};

export default usePublishMainWidgetEvents;
