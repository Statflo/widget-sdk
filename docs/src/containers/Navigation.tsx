import { Icon, Logo, Tooltip, classNames } from "@statflo/ui";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import EventManager from "./EventManager";

type NavItemProps = {
  icon: React.ComponentProps<typeof Icon>["icon"];
  label: string;
  path: string;
};

const NavItem = ({ icon, label, path }: NavItemProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Tooltip text={label} position="right">
      <motion.button
        aria-label={label}
        className={classNames(
          location.pathname === path && "active",
          "group flex justify-center items-center py-4 pl-1 w-15 border-r-4 border-transparent hover:cursor-pointer hocus-not-disabled:bg-blue-200 hocus-not-disabled:border-blue-400 dark:hocus-not-disabled:bg-blue-500/75 dark:hocus-not-disabled:border-blue-300 active:bg-blue-100 active:border-blue-500 dark:active:bg-blue-500/50 dark:active:border-blue-400"
        )}
        onClick={() => navigate(path)}
        whileTap="tap"
        whileHover="hover"
      >
        <motion.div variants={{ tap: { scale: 0.9 }, hover: { scale: 1.1 } }}>
          <Icon
            className="stroke-blueGrey-800 fill-blueGrey-50 dark:stroke-blueGrey-50 dark:fill-background-dark group-hocus-not-disabled:stroke-blue-400 group-hocus-not-disabled:fill-blue-50 group-active:stroke-blue-500 group-active:fill-blue-50 dark:group-active:stroke-blue-50 dark:group-active:fill-transparent dark:group-hocus-not-disabled:stroke-blue-50 dark:group-hocus-not-disabled:fill-transparent"
            color="custom"
            icon={icon}
            size="large"
            strokeWidth={1.2}
          />
        </motion.div>
      </motion.button>
    </Tooltip>
  );
};

const Navigation = () => {
  return (
    <>
      <div className="h-screen w-15 flex flex-col gap-12 bg-background-light shadow-navbar dark:bg-background-dark dark:border-r dark:border-blueGrey-800">
        <div className="px-[0.625rem] py-5 h-[6.125rem]">
          <Logo className="h-full" />
        </div>
        <NavItem
          icon="chat-reply"
          label="Conversations"
          path="/conversations"
        />
        <NavItem
          icon="application-setting"
          label="Widget Manager"
          path="/widget-manager"
        />
        <EventManager />
      </div>
    </>
  );
};

export default Navigation;
