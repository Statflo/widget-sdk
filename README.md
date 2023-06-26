[![codecov](https://codecov.io/gh/Statflo/widget-sdk/branch/main/graph/badge.svg?token=E2QJ7EUJVZ)](https://codecov.io/gh/Statflo/widget-sdk)
[![npm version](https://badge.fury.io/js/@statflo%2Fwidget-sdk.svg)](https://www.npmjs.com/package/@statflo/widget-sdk)
![CI/CD](https://github.com/statflo/widget-sdk/actions/workflows/main.yml/badge.svg)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/Statflo/widget-sdk/issues)

## Installation

```bash
npm install @statflo/widget-sdk # or yarn add @statflo/widget-sdk
```

Please see our [Examples](https://github.com/Statflo/widget-sdk/tree/main/examples).

## Initializing the widget store

### Native

```javascript
import useWidgetStore from "@statflo/widget-sdk";
```

### React

```typescript
import useWidgetStore from "@statflo/widget-sdk";
import { create } from "zustand";

const useBoundWidgetStore = create(useWidgetStore);
```

## Publishing an event

### Native

```javascript
import { WidgetEvent } from "@statflo/widget-sdk";

const { publishEvent } = useWidgetStore.getState();

publishEvent(new WidgetEvent("MESSAGE_UPDATED", "<YOUR MESSAGE>"));
```

### React

```typescript
import { WidgetEvent } from "@statflo/widget-sdk";

const { publishEvent } = useBoundWidgetStore((state) => state);

useEffect(() => {
  // This event only fires on component initialization
  publishEvent(new WidgetEvent("MESSAGE_UPDATED", "<YOUR MESSAGE>"));
}, []);
```

## Listening to an event

### Native

```javascript
useWidgetStore.subscribe((state) => {
  const latest = state.getLatestEvent();

  if (latest) {
    switch (latest.type) {
      case "MESSAGE_UPDATED":
        // ...
        break;
    }
  }
});
```

### React

```typescript
const { events, getLatestEvent } = useBoundWidgetStore((state) => state);

useEffect(() => {
  const latest = getLatestEvent();

  if (!latest) {
    return;
  }

  switch (latest.type) {
    case "MESSAGE_UPDATED":
      // ...
      break;
  }
}, [events]);
```

## Events API

Below are the details for all the events that are currently supported by Statflo.

### Outgoing Events

The following events can be published from the widget so that the app can trigger certain functionality.

#### Expand Iframe

```
type: "EXPAND_IFRAME"
data: boolean
```

Returns true or false depending on whether the iframe should be considered in an expanded state or not. If true is returned this will trigger the `Container Height` event.

#### Show Alert

```
type: "SHOW_ALERT"
data: AlertDetails
```

Returns details for an alert to be shown by the app. The alert will appear in the bottom right corner of the screen and automatically disappear after 5 seconds.

```typescript
type AlertDetails = {
  status: "info" | "warning" | "dark" | "light" | "white" | "neutral" | "success" | "error";
  text: string;
}
```

#### Append Message

```
type: "APPEND_MESSAGE"
data: string
```

Returns a string that will be appended to the contents of the chat message input. **Used in Sendables**

#### Replace Message

```
type: "REPLACE_MESSAGE"
data: string
```

Returns a string that will replace the contents of the chat message input. **Used in Sendables**

### Incoming Events

The following event types can be listened to by the widget.

#### User Authenticated

```
type: "USER_AUTHENTICATED"
data: User
```

Returns details about the user currently logged into the app. This event is triggered upon initial authentication.

```typescript
type User = {
  carrier_id: number;
  dealer_id: number;
  email: string;
  language: string;
}
```

#### Authentication Token

```
type: "AUTHENTICATION_TOKEN"
data: string
```

Returns the authentication token for the current user. This event is triggered upon initial authentication.

#### Current Account ID (Ban ID)

```
type: "CURRENT_ACCOUNT_ID"
data: string
```

Returns the account ID for the conversation that the user currently has open. This event will trigger every time the user changes which conversation they have open.

#### Container Height

```
type: "CONTAINER_HEIGHT"
data: number
```

Returns a number that represents the height (in px) of the element the widget is contained within. This event is triggered by the widget publishing an `Expand iFrame` event.

## Security

To view all MDN's `window.postMessage()` security concerns [click here](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage#security_concerns).

The primary concern in this package is the target origin of the `window.postMessage()` API as described by MDN:

> Always specify an exact target origin, not \*, when you use postMessage to send data to other windows. A malicious site can change the location of the window without your knowledge, and therefore it can intercept the data sent using postMessage.

By default, the target origin will be the url of the widget you register with the Statflo API.
