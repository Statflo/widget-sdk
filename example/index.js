"use strict";
exports.__esModule = true;
var domino = require("domino");
var index_js_1 = require("../dist/index.js");
var myWindow = domino.createWindow('<h1>My page </h1>', 'http://example.com');
var myWidgetClient = new index_js_1.WidgetClient({
    id: "10",
    createWidgetState: function (id) { return ({ id: id }); },
    window: myWindow
});
var myContainerClient = new index_js_1.ContainerClient({
    window: myWindow
});
console.log("helpers: ", index_js_1.Helpers.WidgetMethods);
