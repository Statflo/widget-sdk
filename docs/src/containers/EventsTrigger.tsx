import { useWidgetContext } from "../providers/WidgetProvider";
import { useMemo, useState } from "react";
import { useConversationContext } from "../providers/ConversationProvider";
import { WidgetEvent } from "@statflo/widget-sdk";
import { Icon, IconButton, Toggle, Tooltip } from "@statflo/ui";

const EventsTrigger = () => {
  const { publishEvent } = useWidgetContext();
  const { activeConversation } = useConversationContext();

  const [darkMode, setDarkMode] = useState(false);

  const events = useMemo(
    () => [
      {
        name: "AUTHENTICATION_TOKEN",
        info: "Returns the authentication token for the current user. This event is triggered upon initial authentication. The data that is used for this event can be updated on the Settings page.",
        payload: localStorage?.token ?? "1234567",
      },
      {
        name: "CONTAINER_HEIGHT",
        info: "Returns a number that represents the height (in px) of the element the widget is contained within. This event is triggered by the widget publishing an <Expand iFrame> event.",
        payload: window.innerHeight,
      },
      {
        name: "CURRENT_ACCOUNT_ID",
        info: "Returns the account ID for the conversation that the user currently has open. This event will trigger every time the user changes which conversation they have open.",
        payload: activeConversation?.recipient.ban_id,
      },
      {
        name: "DARK_MODE",
        info: "Returns whether the user has their preferences set to view the app in dark mode or not. This event is triggered upon initial authentication.",
        payload: darkMode,
        input: (
          <div className="flex gap-2 items-center">
            <Icon icon="sun" color="blueGrey" />
            <Toggle
              enabled={darkMode}
              setEnabled={setDarkMode}
              name="darkMode"
            />
            <Icon icon="moon" color="blueGrey" />
          </div>
        ),
      },
      {
        name: "USER_AUTHENTICATED",
        info: "Returns details about the user currently logged into the app. This event is triggered upon initial authentication. The data that is used for this event can be updated on the Settings page.",
        payload: {
          carrier_id: localStorage?.user?.carrier_id ?? 1,
          dealer_id: localStorage?.user?.dealer_id ?? 1,
          email: localStorage?.user?.email ?? "email@statflo.com",
          language: localStorage?.user?.language ?? "en",
        },
      },
    ],
    [activeConversation, darkMode]
  );

  return (
    <div>
      <h3 className="text-18 font-bold mb-2">Events</h3>
      <div>
        {events.map((event) => (
          <div className="flex justify-between items-center" key={event.name}>
            <div className="flex gap-2 items-center">
              <p className="font-semi">{event.name}</p>
              <Tooltip text={event.info} position="right">
                <div>
                  <Icon
                    className="stroke-blue-400 fill-blue-50 dark:stroke-blue-300 dark:fill-transparent"
                    color="custom"
                    icon="info"
                  />
                </div>
              </Tooltip>
            </div>
            <div className="flex gap-4">
              {event?.input}
              <IconButton
                ariaLabel="Trigger Event"
                color="success"
                icon="control-play"
                onClick={() =>
                  publishEvent(new WidgetEvent(event.name, event.payload))
                }
                plain
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsTrigger;
