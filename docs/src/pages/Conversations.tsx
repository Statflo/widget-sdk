import ChatWindow from "../containers/ChatWindow";
import ContactPanel from "../containers/ContactPanel";
import Inbox from "../containers/Inbox";

const Conversations = () => {
  return (
    <div className="grid grid-rows-1 h-screen relative bg-background-light dark:bg-darkMode-900 grid-cols-[minmax(0,_1fr)_minmax(0,_2fr)_minmax(0,_1fr)]">
      <Inbox />
      <ChatWindow />
      <ContactPanel />
    </div>
  );
};

export default Conversations;
