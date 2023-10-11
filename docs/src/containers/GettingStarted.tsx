import { motion } from "framer-motion";
import { useState } from "react";
import { Dialog, Icon, Link, Tooltip, classNames } from "@statflo/ui";

const Documentation = () => {
  return (
    <div className="flex flex-col gap-8 w-[34vw] whitespace-pre-wrap px-4">
      <div>
        <h2 className="font-bold text-24 mb-2">Getting Started</h2>
        <p>
          This playground is meant as a way to test out new widgets easily,
          without having to go through the process of fully integrating into the
          main Statflo app.{" "}
          <span className="text-blueGrey-600 dark:text-blueGrey-300">
            Note: Some functionality has been disabled as it is not required
            when creating widgets.
          </span>
        </p>
      </div>
      <p className="">
        {"Create an application using the "}
        <Link
          className="!inline"
          href="https://www.npmjs.com/package/@statflo/widget-sdk"
        >
          Statflo Widget SDK
        </Link>
        {" to hook into the event system."}
      </p>
      <p className="">
        <span className="text-blueGrey-600 dark:text-blueGrey-300">
          (Optional)
        </span>
        {" Install the "}
        <Link
          className="!inline"
          href="https://www.npmjs.com/package/@statflo/ui"
        >
          Statflo UI Library
        </Link>
        {" - a library of react components that fit the Statflo theme."}
      </p>
      <p>
        Create a new widget using the Widget Manager{" "}
        <Icon
          className="inline mb-1"
          color="blueGrey"
          icon="application-setting"
        />{" "}
        and begin testing!
      </p>
      <p>
        Events will be automatically triggered but they can also be manually
        triggered using the Event Manager{" "}
        <Icon className="inline mb-1" color="blueGrey" icon="script" />. A log
        of all the events that have been published can be viewed there.
      </p>
    </div>
  );
};

const GettingStarted = () => {
  const [isOpen, setOpen] = useState(false);
  return (
    <Dialog
      closeButton="Close"
      isOpen={isOpen}
      setOpen={setOpen}
      render={({ onClose, labelId, descriptionId }) => <Documentation />}
    >
      <div>
        <Tooltip text="Getting Started" position="right">
          <motion.button
            aria-label="Getting Started"
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
                icon="help"
                size="large"
                strokeWidth={1.2}
              />
            </motion.div>
          </motion.button>
        </Tooltip>
      </div>
    </Dialog>
  );
};

export default GettingStarted;
