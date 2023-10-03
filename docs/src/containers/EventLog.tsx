import { useEffect, useRef } from "react";
import { useWidgetContext } from "../providers/WidgetProvider";

const EventLog = () => {
  const { getEvents } = useWidgetContext();
  const ref = useRef<HTMLDivElement>(null);

  const events = getEvents();

  useEffect(() => {
    if (!ref.current) return;

    ref.current.scrollTop = ref.current.scrollHeight;
  }, [events]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <h3 className="text-18 font-bold mb-2">Event Log</h3>
      <div
        className="break-words rounded-md bg-blueGrey-50 border border-blueGrey-200 dark:bg-darkMode-600 dark:border-darkMode-500 p-3 overflow-y-auto font-mono"
        ref={ref}
      >
        {events.map((event) => (
          <p className="text-12" key={event.id}>
            {JSON.stringify(event)}
          </p>
        ))}
      </div>
    </div>
  );
};

export default EventLog;
