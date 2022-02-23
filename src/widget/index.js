"use strict";
exports.__esModule = true;
var shared_1 = require("../shared");
var misc_1 = require("./misc");
var WidgetClient = /** @class */ (function () {
    function WidgetClient(opts) {
        var _this = this;
        /**
         *  Updates local widget state and forwards the event to an event handler
        */
        this.handleEvent = function (e) {
            var _a;
            var method = e.method, name = e.name, payload = e.payload;
            if (method === shared_1.ContainerMethods.setState) {
                var property = payload.property, value = payload.value;
                _this.state[property] = value;
            }
            // invokes subscriber to this event
            (_a = _this.subscribers.get(name)) === null || _a === void 0 ? void 0 : _a(e);
        };
        /**
         * Assigns value to property for this widget's state. This will be syncronized with the container's widget state.
         *
         * Valid widgets: (all widgets)
         *
        */
        this.setState = function (property, value) {
            _this.postEvent({
                method: shared_1.WidgetMethods.setState,
                name: shared_1.WidgetMethods.setState,
                payload: {
                    property: property,
                    value: value
                }
            });
            _this.state[property] = value;
        };
        /**
         * Pushes event to container
         *
        */
        this.post = function (eventName, value) {
            _this.postEvent({
                method: shared_1.WidgetMethods.post,
                name: eventName,
                payload: value
            });
        };
        /**
         * Pushes event to container to be forwarded (posted) to another widget whose id is equal to recipient id here.
         *
        */
        this.postForward = function (eventName, value, recipientId) {
            _this.postEvent({
                method: shared_1.WidgetMethods.postForward,
                name: eventName,
                payload: value,
                recipientId: recipientId
            });
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
            _this.state = null;
            // @ts-ignore
            _this.postEvent = null;
            // @ts-ignore
            _this.onMessageHandler = null;
            // @ts-ignore
            _this.subscribers = null;
        };
        var id = opts.id, createWidgetState = opts.createWidgetState;
        if (!id) {
            throw new Error("Widget id must be provided to WidgetClient constructor");
        }
        console.log("widget client initialized! ", this);
        this.subscribers = new Map();
        this.state = createWidgetState(id);
        this.postEvent = (0, misc_1.postEventFromWidget)(window, id);
        this.onMessageHandler = (0, misc_1.onMessageFromContainer)(this.handleEvent);
        window.addEventListener("message", this.onMessageHandler);
    }
    return WidgetClient;
}());
exports["default"] = WidgetClient;
