"use strict";
exports.__esModule = true;
exports.onContainerMessage = void 0;
var shared_1 = require("../shared");
var onContainerMessage = function (cb) { return function (e) {
    var validMethods = Object.values(shared_1.WidgetMethods);
    if (e.data && validMethods.includes(e.data.method)) {
        cb({
            method: e.data.method,
            id: e.data.id,
            name: e.data.name,
            payload: e.data.payload,
            recipientId: e.data.recipientId
        });
    }
}; };
exports.onContainerMessage = onContainerMessage;
