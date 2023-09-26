import { classNames, formatTimestamp } from "@statflo/ui";

type MessageBubbleProps = {
  action: "receive" | "send";
  content: string;
  date: string;
  id: string;
};

const MessageBubble = ({ action, content, date, id }: MessageBubbleProps) => {
  return (
    <div
      className={classNames(
        "flex w-full",
        action === "receive" ? "justify-start" : "justify-end"
      )}
      id={id}
    >
      <div className="flex flex-col gap-1 max-w-[52%]">
        <div
          className={classNames(
            "p-4 leading-[140%] break-words rounded-2xl flex items-center gap-2",
            action === "receive"
              ? "bg-blueGrey-100 text-blueGrey-800 dark:bg-blueGrey-200"
              : "bg-blue text-white"
          )}
        >
          {content}
        </div>
        <div className="flex gap-4 w-full px-2 justify-end">
          <span className="text-12 font-semibold text-blueGrey-600">
            {formatTimestamp(date)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
