"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.postEventFromWidget = exports.onMessageFromContainer = void 0;
var shared_1 = require("../shared");
var onMessageFromContainer = function (cb) { return function (e) {
    var validMethods = Object.values(shared_1.ContainerMethods);
    var event = e.data;
    if (event && validMethods.includes(event.method)) {
        cb(event);
    }
}; };
exports.onMessageFromContainer = onMessageFromContainer;
function postEventFromWidget(window, id) {
    var widgetContainerWindow = window.top;
    if (widgetContainerWindow) {
        var postEvent = function (event) {
            if (event && window.name !== "") {
                widgetContainerWindow.postMessage(__assign(__assign({}, event), { id: id }), "*");
            }
        };
        return postEvent;
    }
    return function () { return null; };
}
exports.postEventFromWidget = postEventFromWidget;
