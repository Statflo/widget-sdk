"use strict";
exports.__esModule = true;
exports.createWidgetObj = exports.DebugLogLevel = exports.ContainerMethods = exports.WidgetMethods = void 0;
var WidgetMethods;
(function (WidgetMethods) {
    WidgetMethods["post"] = "widget_sdk/post";
    WidgetMethods["postForward"] = "widget_sdk/post_forward";
    WidgetMethods["setState"] = "widget_sdk/set_state";
})(WidgetMethods = exports.WidgetMethods || (exports.WidgetMethods = {}));
var ContainerMethods;
(function (ContainerMethods) {
    ContainerMethods["post"] = "container_sdk/post";
    ContainerMethods["setState"] = "container_sdk/set_state";
})(ContainerMethods = exports.ContainerMethods || (exports.ContainerMethods = {}));
var DebugLogLevel;
(function (DebugLogLevel) {
    DebugLogLevel["None"] = "none";
    DebugLogLevel["Debug"] = "debug";
})(DebugLogLevel = exports.DebugLogLevel || (exports.DebugLogLevel = {}));
function createWidgetObj(widgetState) {
    var state = {};
    var descriptors = {};
    Object.entries(widgetState).forEach(function (_a) {
        var key = _a[0], value = _a[1];
        // @ts-ignore
        descriptors[key] = {
            value: value,
            writable: true
        };
    });
    Object.defineProperties(state, descriptors);
    return state;
}
exports.createWidgetObj = createWidgetObj;
