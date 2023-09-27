import { Icon, Popover, Tooltip, classNames } from "@statflo/ui";
import { motion } from "framer-motion";

import EventsTrigger from "./EventsTrigger";
import EventLog from "./EventLog";

const EventManager = () => {
  return (
    <Popover
      className="rounded-xl h-[98vh] w-[30vw] overflow-hidden flex flex-col gap-4 p-4"
      render={({ onClose, isOpen, labelId, descriptionId }) => (
        <>
          <h2 className="font-bold text-24">Event Manager</h2>
          <EventsTrigger />
          <EventLog />
        </>
      )}
      position="right"
    >
      <div>
        <Tooltip text="Event Manager" position="right">
          <motion.button
            aria-label="Event Manager"
            className={classNames(
              "group flex justify-center items-center py-4 pl-1 w-15 border-r-4 border-transparent hover:cursor-pointer hocus-not-disabled:bg-blue-200 hocus-not-disabled:border-blue-400 dark:hocus-not-disabled:bg-blue-500/75 dark:hocus-not-disabled:border-blue-300 active:bg-blue-100 active:border-blue-500 dark:active:bg-blue-500/50 dark:active:border-blue-400"
            )}
            whileTap="tap"
            whileHover="hover"
          >
            <motion.div
              variants={{ tap: { scale: 0.9 }, hover: { scale: 1.1 } }}
            >
              <Icon
                className="stroke-blueGrey-800 fill-blueGrey-50 dark:stroke-blueGrey-50 dark:fill-background-dark group-hocus-not-disabled:stroke-blue-400 group-hocus-not-disabled:fill-blue-50 group-active:stroke-blue-500 group-active:fill-blue-50 dark:group-active:stroke-blue-50 dark:group-active:fill-transparent dark:group-hocus-not-disabled:stroke-blue-50 dark:group-hocus-not-disabled:fill-transparent"
                color="custom"
                icon="script"
                size="large"
                strokeWidth={1.2}
              />
            </motion.div>
          </motion.button>
        </Tooltip>
      </div>
    </Popover>
  );
};

export default EventManager;
