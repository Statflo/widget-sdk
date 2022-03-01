[![codecov](https://codecov.io/gh/Statflo/widget-sdk/branch/main/graph/badge.svg?token=E2QJ7EUJVZ)](https://codecov.io/gh/Statflo/widget-sdk)
[![npm version](https://badge.fury.io/js/@statflo%2Fwidget-sdk.svg)](https://www.npmjs.com/package/@statflo/widget-sdk)
![CI/CD](https://github.com/statflo/widget-sdk/actions/workflows/main.yml/badge.svg)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/Statflo/widget-sdk/issues)


# [View documentation](https://github.com/Statflo/widget-sdk/wiki)



## Installation
---
- NPM `npm i @statflo/widget-sdk`
- YARN `yarn @statflo/widget-sdk`

<br>

## Initializing clients
----
It's recommended to initialize a single instance of a widget or container client then export that instance for the rest of your application to consume. See below.


### Widget initialization

```
import { WidgetClient } from "@statflo/widget-sdk";

export const client = new WidgetClient({ 
  id: "my widget",
  window,
  createWidgetState: (id) => ({ id }),
});
```

### Container initialization
```
import { ContainerClient } from "@statflo/widget-sdk";

export const widgetContainerClient = new ContainerClient({window});
```

<br>

## Managing widget state as the container client

```
import { widgetContainerClient } from "../local/example/path"
import { WidgetMethods } from "@statflo/widget-sdk/dist/shared";


// step 1 - initialize widget state
const initialWidgetState = { id: "my_widget" }

// step 2 - initialize widget representation within container
widgetContainerClient.createWidget(initialWidgetState)

// step 3 - update widget state
widgetContainerClient.setState("my_widget", "someProperty", 50)

// Step 4 - subscribe to state changes from the remote widget
widgetContainerClient.on(WidgetMethods.setState, (e) => {
  const { property, value } = e

  // do something with property and value
  ... 
})


// Optional - access state directly
widgetContainerClient.states.get("myWidget).someProperty // returns 50
```

## Managing widget state as the widget client

```
import { client } from "../local/example/path"
import { ContainerMethods } from "@statflo/widget-sdk/dist/shared";


// step 1 - state was initialized with the creation of the new widgetClient(...)

// step 2 - update widget state
client.setState("my_widget", "someProperty", 50)

// Step 3 - subscribe to state changes from the remote container
widget.on(ContainerMethods.setState, (e) => {
  const { property, value } = e

  // do something with property and value
  ... 
})


// Optional - access state directly
client.state.someProperty // returns 50
```

<br>


## Security 
---
To view all MDN's `window.postMessage()` security concerns [click here](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage#security_concerns).

The primary concern in this package is the target origin of the `window.postMessage()` API as described by MDN: 

> Always specify an exact target origin, not *, when you use postMessage to send data to other windows. A malicious site can change the location of the window without your knowledge, and therefore it can intercept the data sent using postMessage.

By default, the target origin will be `"*"`. To set a secure target origin, set the following two properties within the widget state:

- `widgetDomain` - the domain where the widget app is hostest on the web.

- `containerDomain` - the domain of where container app is hosted on the web.

**Final Caveats**

- The `.on()` method for both clients only supports a single registered callback. Calling `.on()` on the same event or method will overwrite a previous callback with the newer one.
  - Multiple callback tenants can be implemented via one callback like so:
  ```
     client.on(ContainerMethods.setState, e => {
       callbackOne(e)
       callbackTwo(e)
       ...
     })
  ```