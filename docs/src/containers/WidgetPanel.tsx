import React, { useEffect, useState } from "react";

import usePublishMainWidgetEvents from "../hooks/usePublishMainWidgetEvents";
import { WidgetEvents, useWidgetContext } from "../providers/WidgetProvider";
import WidgetWrapper from "./WidgetWrapper";
import { Alert } from "@statflo/ui";
import Placeholder from "../components/Placeholder";

type AlertDetails = {
  status: React.ComponentProps<typeof Alert>["status"];
  text: string;
};

const WidgetsPanel = () => {
  const { rightPanelWidgets, events, getLatestEvent } = useWidgetContext();
  const [alert, setAlert] = useState<AlertDetails>();

  usePublishMainWidgetEvents();

  useEffect(() => {
    const latest = getLatestEvent();
    if (latest?.type === WidgetEvents.SHOW_ALERT) {
      setAlert(latest.data);

      setTimeout(() => setAlert(undefined), 5000);
    }
  }, [rightPanelWidgets, events, getLatestEvent]);

  return (
    <>
      <div className="flex flex-col gap-3 bg-blueGrey-50 h-full p-3 overflow-y-auto dark:bg-darkMode-900">
        {rightPanelWidgets.length === 0 ? (
          <Placeholder location="Right Panel" />
        ) : (
          rightPanelWidgets.map((w) => <WidgetWrapper key={w.id} widget={w} />)
        )}
      </div>
      <Alert
        animation="popup"
        isOpen={!!alert}
        text={alert?.text ?? ""}
        status={alert?.status}
        onClose={() => setAlert(undefined)}
        position="absolute bottom-4 right-4"
        className="w-halfScreen"
      />
    </>
  );
};

export default WidgetsPanel;
