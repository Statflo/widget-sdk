import { useWidgetContext } from "../providers/WidgetProvider";
import { useMemo, useState } from "react";
import { useConversationContext } from "../providers/ConversationProvider";
import { WidgetEvent } from "@statflo/widget-sdk";
import { Icon, IconButton, Toggle } from "@statflo/ui";

const EventsTrigger = () => {
  const { publishEvent } = useWidgetContext();
  const { activeConversation } = useConversationContext();

  const [darkMode, setDarkMode] = useState(false);

  const events = useMemo(
    () => [
      {
        name: "AUTHENTICATION_TOKEN",
        payload: "1234567",
      },
      {
        name: "CONTAINER_HEIGHT",
        payload: window.innerHeight,
      },
      {
        name: "CURRENT_ACCOUNT_ID",
        payload: activeConversation?.recipient.ban_id,
      },
      {
        name: "DARK_MODE",
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
        payload: {
          carrier_id: 1,
          dealer_id: 1,
          email: "email@statflo.com",
          language: "en",
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
            <p className="font-semi">{event.name}</p>
            <div className="flex gap-4">
              {event?.input}
              <IconButton
                ariaLabel="Trigger Event"
                color="success"
                icon="control-play"
                onClick={() =>
                  publishEvent(new WidgetEvent(event.name, event.payload))
                }
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsTrigger;
