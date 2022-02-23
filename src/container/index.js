"use strict";
exports.__esModule = true;
var shared_1 = require("../shared");
var shared_2 = require("../shared");
var misc_1 = require("./misc");
var ContainerClient = /** @class */ (function () {
    function ContainerClient(opts) {
        var _this = this;
        var _a;
        this.postEvent = function (id, event) {
            var widgetIframeElement = _this.widgets.get(id);
            if (!widgetIframeElement) {
                widgetIframeElement = document.getElementById(id);
                if (!widgetIframeElement) {
                    throw new Error("Unable to post(). Could not find Iframe element for widget id '".concat(id, "'"));
                }
                _this.widgets.set(id, widgetIframeElement);
            }
            var widgetDomain = _this.states.get(id).widgetDomain;
            widgetIframeElement.contentWindow.postMessage(event, widgetDomain);
        };
        this.createWidget = function (state) {
            var id = state.id;
            if (!id) {
                throw new Error("Unable to create widget. Expected an id to exist in initial widget state but '".concat(id, "' was given."));
            }
            if (_this.states.get(id)) {
                throw new Error("Unable to create widget. A widget with the id '".concat(id, "' already exists."));
            }
            var widgetElement = document.getElementById(id);
            if (widgetElement) {
                _this.widgets.set(id, widgetElement);
            }
            else if (_this.logLevel === shared_1.DebugLogLevel.Debug) {
                console.log("ContainerClient: widget iframe element not found with id: ", id);
            }
            _this.states.set(id, (0, shared_1.createWidgetObj)(state));
        };
        /**
         *  Updates local widget state and forwards the event to an event handler
        */
        this.handleEvent = function (e) {
            var _a, _b;
            var method = e.method, name = e.name, payload = e.payload, id = e.id;
            if (method === shared_2.WidgetMethods.postForward) {
                var recipientId = e.recipientId;
                _this.post(recipientId, name, payload);
                if (_this.logLevel === shared_1.DebugLogLevel.Debug) {
                    console.log("ContainerClient: postForward invoked with with: ", recipientId, name, payload);
                }
                return;
            }
            var state = _this.states.get(id);
            if (!state) {
                throw new Error("Unable to handle event. Receiving event for widget id '".concat(id, "' which has not yet been initialized within the container"));
            }
            if (method === shared_2.WidgetMethods.setState) {
                var property = payload.property, value = payload.value;
                if (_this.logLevel === shared_1.DebugLogLevel.Debug) {
                    console.log("ContainerClient: updating local widget state for: ".concat(property, " = ").concat(value, " in widget ").concat(id));
                }
                _this.states.get(id)[property] = value;
            }
            (_a = _this.subscribers.get(name)) === null || _a === void 0 ? void 0 : _a(e);
            (_b = _this.subscribers.get(method)) === null || _b === void 0 ? void 0 : _b(e);
        };
        /**
         * Assigns value to property for this widget's state. This will be syncronized with the container's widget state.
         *
         * Valid widgets: (all widgets)
         *
        */
        this.setState = function (id, property, value) {
            var state = _this.states.get(id);
            if (!state) {
                throw new Error("Unable to setState(). Widget state has not yet been created for widget id '".concat(id, " ").concat(property, " = ").concat(value, "'"));
            }
            if (_this.states.get(id)[property] === value) {
                return;
            }
            var setStateEvent = {
                method: shared_1.ContainerMethods.setState,
                name: shared_1.ContainerMethods.setState,
                payload: {
                    property: property,
                    value: value
                }
            };
            _this.postEvent(id, setStateEvent);
            if (_this.logLevel === shared_1.DebugLogLevel.Debug) {
                console.log("ContainerClient: invoking setState() with event: ".concat(JSON.stringify(setStateEvent)));
            }
            state[property] = value;
            // triggers callback for setState subscriber
            var cb = _this.subscribers.get(shared_2.WidgetMethods.setState);
            if (cb) {
                var syntheticEvent = {
                    method: shared_2.WidgetMethods.setState,
                    name: shared_2.WidgetMethods.setState,
                    id: id,
                    payload: {
                        property: property,
                        value: value
                    }
                };
                cb(syntheticEvent);
            }
        };
        /**
         * Posts event to container
         *
        */
        this.post = function (id, eventName, value) {
            if (!_this.states.get(id)) {
                console.log("Unable to post(). Widget not yet been created for widget id '".concat(id, "'"));
                return;
            }
            var event = {
                method: shared_1.ContainerMethods.post,
                name: eventName,
                payload: value
            };
            _this.postEvent(id, event);
            if (_this.logLevel === shared_1.DebugLogLevel.Debug) {
                console.log("ContainerClient: invoking post() with event: ".concat(JSON.stringify(event)));
            }
        };
        /**
         * Subscribes the callback to receive event
         *
        */
        this.on = function (eventName, callback) {
            _this.subscribers.set(eventName, callback);
        };
        /**
         *  Removes event listeners, widget client class is no longer usable after calling this method
        */
        this.release = function () {
            window.removeEventListener("message", _this.onMessageHandler);
            // @ts-ignore
            _this.states = null;
            // @ts-ignore
            _this.postEvent = null;
            // @ts-ignore
            _this.onMessageHandler = null;
            // @ts-ignore
            _this.subscribers = null;
        };
        this.subscribers = new Map();
        this.widgets = new Map();
        this.states = new Map();
        this.logLevel = (_a = opts === null || opts === void 0 ? void 0 : opts.logs) !== null && _a !== void 0 ? _a : shared_1.DebugLogLevel.None;
        this.onMessageHandler = (0, misc_1.onContainerMessage)(this.handleEvent);
        console.log("container client initialized! ", this);
        window.addEventListener("message", this.onMessageHandler);
    }
    return ContainerClient;
}());
exports["default"] = ContainerClient;
