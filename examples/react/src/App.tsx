import React, { useEffect, useState } from "react";
import "iframe-resizer-react";
import { create } from "zustand";
import "./App.css";

import useWidgetStore, { WidgetEvent } from "@statflo/widget-sdk";

const useBoundWidgetStore = create(useWidgetStore);

const App = () => {
  const { events, publishEvent, getLatestEvent } = useBoundWidgetStore(
    (state) => state
  );

  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");

  const fetchUser = (token: string) => {
    fetch("https://app.statflo.com/v2/api/auth/me", {
      headers: { authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((json) => {
        setEmail(json.user.email);
      })
      .catch(() => {});
  };

  useEffect(() => {
    // Simulate a token being emitted from the Statflo UI to this widget.
    // If you'd like to test with a live token it can be acquired
    // at https://app.statflo.com/v2/api/auth/me after first logging in.
    publishEvent(new WidgetEvent("TOKEN_UPDATED", "<YOUR TEST TOKEN>"));
  }, []);

  useEffect(() => {
    const latest = getLatestEvent();

    if (!latest) {
      return;
    }

    switch (latest.type) {
      case "TOKEN_UPDATED":
        setToken(latest.data);
        break;
    }
  }, [events]);

  useEffect(() => {
    if (!token) {
      return;
    }

    fetchUser(token);
  }, [token]);

  return (
    <div className="container g-0 border-top border-2">
      <div className="row justify-content-center no-gutters g-0">
        <h6 className="text-center pt-2">React Widget</h6>

        <form className="col pt-3 mb-4 border-bottom border-2">
          <fieldset disabled>
            <div className="mb-3">
              <label className="form-label visually-hidden" htmlFor="Email">
                Email
              </label>
              <input
                name="email"
                className="form-control form-control-sm"
                id="email"
                value={email}
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
