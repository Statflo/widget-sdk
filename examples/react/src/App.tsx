import React, { useEffect, useState } from "react";
import "iframe-resizer-react";
import { useStore } from "zustand";
import "./App.css";

import useWidgetStore, {WidgetEvent, WidgetState} from "@statflo/widget-sdk";


const App = () => {
  const events = useStore(useWidgetStore, (state: WidgetState) => state.events)
  const publishEvent = useStore(useWidgetStore, (state: WidgetState) => state.publishEvent)
  const getLatestEvent = useStore(useWidgetStore, (state: WidgetState) => state.getLatestEvent)

  const [account, setAccount] = useState("");
  const [device, setDevice] = useState("");

  const getDevice = () => {
    const devices = [
      'Samsung Galaxy S25 Ultra',
      'Apple iPhone 16 Pro Max',
      'Google Pixel 9a',
    ];

    return devices[Math.floor(Math.random() * devices.length)];
  }

  useEffect(() => {
    const latest = getLatestEvent();

    if (!latest) {
      return;
    }

    switch (latest.type) {
      case "CURRENT_ACCOUNT_ID":
        setAccount(latest.data);
        setDevice(getDevice());

        publishEvent(new WidgetEvent("REPLACE_MESSAGE", `Hi, how are you enjoying your ${device}?`));
        break;
    }
  }, [device, events, getLatestEvent, publishEvent]);

  return (
    <div className="container g-0 border-top border-2">
      <div className="row justify-content-center no-gutters g-0">
        <h6 className="text-center pt-2">
          React Inventory Widget
        </h6>

        <form
          className="col pt-3 mb-4 border-bottom border-2"
        >
          <fieldset disabled>
            <div className="mb-3">
              <label className="form-label" htmlFor="account">
                Account
              </label>
              <input
                name="account"
                className="form-control form-control-sm"
                id="account"
                value={account}
                readOnly={true}
                placeholder="..."
              />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="device">
                Device
              </label>
              <input
                name="device"
                className="form-control form-control-sm"
                id="device"
                value={device}
                readOnly={true}
                placeholder="..."
              />
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  );
};

export default App;
