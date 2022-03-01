[![codecov](https://codecov.io/gh/Statflo/widget-sdk/branch/main/graph/badge.svg?token=E2QJ7EUJVZ)](https://codecov.io/gh/Statflo/widget-sdk)
[![npm version](https://badge.fury.io/js/@statflo%2Fwidget-sdk.svg)](https://www.npmjs.com/package/@statflo/widget-sdk)
![CI/CD](https://github.com/statflo/widget-sdk/actions/workflows/main.yml/badge.svg)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/Statflo/widget-sdk/issues)


# [View documentation](https://github.com/Statflo/widget-sdk/wiki)



## Installation
---
NPM

`npm i @statflo/widget-sdk`

YARN 

`yarn @statflo/widget-sdk`


<br>
<br>

## Initializing clients
----
It's recommended to initialize a single instance of a widget or container client then export that instance for the rest of your application to consume. See below.

<br>

### Widget initialization

```
import { WidgetClient } from "@statflo/widget-sdk";

export const client = new WidgetClient({ 
  id: "my widget",
  window,
  createWidgetState: (id) => ({ id }),
});
```

<br>

### Container initialization
```
import { ContainerClient } from "@statflo/widget-sdk";

export const widgetContainerClient = new ContainerClient({window});
```

<br>
<br>

## Security 
---
To view all MDN's `window.postMessage()` security concerns [click here](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage#security_concerns).

The primary concern in this package is the target origin of the `window.postMessage()` API as described by MDN: 

> Always specify an exact target origin, not *, when you use postMessage to send data to other windows. A malicious site can change the location of the window without your knowledge, and therefore it can intercept the data sent using postMessage.

By default, the target origin will be `"*"`. To set a secure target origin, set the following two properties within the widget state:

- `widgetDomain` - the domain where the widget app is hostest on the web.

- `containerDomain` - the domain of where container app is hosted on the web.

