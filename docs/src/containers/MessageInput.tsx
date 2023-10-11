import { IconButton, Tabs, classNames } from "@statflo/ui";
import Sendables from "./Sendables";
import { useEffect, useRef, useState } from "react";
import ReactTextareaAutosize from "react-textarea-autosize";
import { useConversationContext } from "../providers/ConversationProvider";
import { WidgetEvents, useWidgetContext } from "../providers/WidgetProvider";

const MessageInput = () => {
  const { activeConversation, addMessage } = useConversationContext();
  const { events, getLatestEvent } = useWidgetContext();
  const [message, setMessage] = useState("");
  const inputRef = useRef<any>(null);

  useEffect(() => {
    const latest = getLatestEvent();
    if (latest?.type === WidgetEvents.APPEND_MESSAGE) {
      setMessage((prevState) => `${prevState} ${latest.data}`);
    }
    if (latest?.type === WidgetEvents.REPLACE_MESSAGE) {
      setMessage(latest.data);
    }
  }, [events, getLatestEvent]);

  if (!activeConversation) return null;

  return (
    <div className="w-full">
      <Tabs
        id="messageInput"
        onTabSelect={() => {}}
        selectedIndex={0}
        tabOptions={[
          {
            name: "Message",
            label: "message",
          },
          {
            name: "Chat Starter",
            label: "chatStarter",
            disabled: true,
          },
        ]}
      />
      <div className="flex p-4 flex-1 items-center gap-4 bg-background-light dark:bg-blueGrey-900">
        <Sendables />
        <div className="flex-1">
          <div className="group relative w-full flex items-center justify-center bg-blueGrey-100 rounded-2xl min-h-[44px] border-2 dark:bg-darkMode-600 focus-within:border-blue-400 border-transparent">
            <ReactTextareaAutosize
              ref={inputRef}
              className={classNames(
                "w-full border-none bg-transparent pl-4 pr-20 text-16 placeholder:text-blueGrey-400 text-blueGrey-800 resize-none focus:outline-none focus:ring-0 dark:text-blueGrey-100 dark:placeholder:text-blueGrey-400",
                inputRef.current?.clientHeight > 40 && message.length > 1
                  ? "pt-2 pb-7"
                  : "py-2"
              )}
              placeholder="Write a Message"
              value={message}
              onChange={(e) => {
                const val = e.currentTarget.value;
                if (val.length === 1 && val === " ") {
                  return;
                }
                setMessage(e.currentTarget.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (
                    message.length === 0 ||
                    (message.length === 1 && message === " ")
                  ) {
                    return;
                  }
                  addMessage(activeConversation.id, "send", message);
                  setMessage("");
                }
              }}
              rows={1}
            />
          </div>
        </div>
        <IconButton
          ariaLabel="Send Message"
          icon="send-email"
          onClick={() => {
            addMessage(activeConversation.id, "send", message);
            setMessage("");
          }}
          variant="primary"
        />
        <IconButton
          ariaLabel="Receive Message"
          icon="envelope-incoming"
          onClick={() => {
            addMessage(activeConversation.id, "receive", message);
            setMessage("");
          }}
          variant="secondary"
        />
      </div>
    </div>
  );
};

export default MessageInput;
