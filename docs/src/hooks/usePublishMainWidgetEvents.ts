import { useEffect } from "react";
import { WidgetEvent } from "@statflo/widget-sdk";

import { WidgetEvents, useWidgetContext } from "../providers/WidgetProvider";
import { useConversationContext } from "../providers/ConversationProvider";

const usePublishMainWidgetEvents = (isWidgetOpen?: boolean) => {
  const { activeConversation } = useConversationContext();
  const { publishEvent } = useWidgetContext();

  const darkMode =
    localStorage?.theme === "dark" ||
    (!("theme" in localStorage) &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  useEffect(() => {
    publishEvent(
      new WidgetEvent<string>(
        WidgetEvents.AUTHENTICATION_TOKEN,
        localStorage?.token ?? "1234567"
      )
    );
    publishEvent(
      new WidgetEvent<User>(WidgetEvents.USER_AUTHENTICATED, {
        carrier_id: localStorage?.user?.carrier_id ?? 1,
        dealer_id: localStorage?.user?.dealer_id ?? 1,
        email: localStorage?.user?.email ?? "email@statflo.com",
        language: localStorage?.user?.language ?? "en",
      })
    );
    publishEvent(new WidgetEvent<boolean>(WidgetEvents.DARK_MODE, darkMode));
  }, [publishEvent, isWidgetOpen, darkMode]);

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
