import { Counter, Icon, classNames, formatTimestamp } from "@statflo/ui";
import { motion } from "framer-motion";

type ContactCardProps = {
  active?: boolean;
  contactName: string;
  content: string;
  date: string;
  id: string;
  messageStatus: "receive" | "send";
  onClick: (e: React.MouseEvent) => void;
  unread?: number;
};

const ContactCard = ({
  active = false,
  contactName,
  content,
  date,
  id,
  messageStatus,
  onClick,
  unread = 0,
}: ContactCardProps) => {
  return (
    <motion.button
      className={classNames(
        active && "selected",
        "flex flex-col gap-2 p-4 rounded-xl shadow-convoCard w-full text-left selected:bg-blue-50 selected:outline selected:outline-2 selected:outline-blue-400 hocus-not-disabled:bg-blue-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-300 selected:focus-visible:outline-blue-300 bg-background-light dark:bg-blueGrey-900 dark:border dark:border-darkMode-800 dark:hocus-not-disabled:bg-blueGrey-800 dark:selected:bg-darkMode-600 dark:shadow-transparent"
      )}
      onClick={onClick}
      whileTap={{ scale: 0.99 }}
    >
      <div className="flex flex-col gap-1 w-full">
        <div className="items-center flex gap-2 w-full">
          {messageStatus === "receive" ? (
            <Icon color="magenta" icon="arrow-bottom-left" />
          ) : (
            <Icon color="teal" icon="arrow-top-right" />
          )}
          <p className="flex-1 truncate text-blueGrey-800 dark:text-blueGrey-50">
            {contactName}
          </p>
          <span className="text-14 leading-6 text-blueGrey-600 dark:text-blueGrey-300">
            {formatTimestamp(date)}
          </span>
        </div>
      </div>
      <div className="pl-6 pr-4 h-9">
        <p className="text-14 leading-[120%] tracking-[0.012em] text-blueGrey-600 line-clamp-2 break-words dark:text-blueGrey-200">
          {content}
        </p>
      </div>
      <div className="flex h-6 w-full justify-end">
        {unread > 0 && (
          <Counter color="darkBlue" count={unread} type="inversed" />
        )}
      </div>
    </motion.button>
  );
};

export default ContactCard;
