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
import create from "zustand";

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

The following events are supported:

TBD

## Security

To view all MDN's `window.postMessage()` security concerns [click here](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage#security_concerns).

The primary concern in this package is the target origin of the `window.postMessage()` API as described by MDN:

> Always specify an exact target origin, not \*, when you use postMessage to send data to other windows. A malicious site can change the location of the window without your knowledge, and therefore it can intercept the data sent using postMessage.

By default, the target origin will be the url of the widget you register with the Statflo API.
