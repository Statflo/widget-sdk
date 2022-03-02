(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.WidgetSDK = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
                widgetIframeElement = _this.window.document.getElementById(id);
                if (!widgetIframeElement) {
                    throw new Error("Unable to post(). Could not find Iframe element for widget id '".concat(id, "'"));
                }
                _this.widgets.set(id, widgetIframeElement);
            }
            var widgetDomain = _this.states.get(id).widgetDomain;
            widgetIframeElement.contentWindow.postMessage(event, widgetDomain || "*");
        };
        this.createWidget = function (state) {
            var id = state.id;
            if (!id) {
                throw new Error("Unable to create widget. Expected an id to exist in initial widget state but '".concat(id, "' was given."));
            }
            if (_this.states.get(id)) {
                throw new Error("Unable to create widget. A widget with the id '".concat(id, "' already exists."));
            }
            var widgetElement = _this.window.document.getElementById(id);
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
                    value: value,
                },
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
                        value: value,
                    },
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
                payload: value,
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
            _this.window.removeEventListener("message", _this.onMessageHandler);
            // @ts-ignore
            _this.states = null;
            // @ts-ignore
            _this.postEvent = null;
            // @ts-ignore
            _this.onMessageHandler = null;
            // @ts-ignore
            _this.subscribers = null;
        };
        if (!opts.window) {
            throw Error("window must be provided to container client constructor");
        }
        this.subscribers = new Map();
        this.widgets = new Map();
        this.states = new Map();
        this.window = opts.window;
        this.logLevel = (_a = opts.logs) !== null && _a !== void 0 ? _a : shared_1.DebugLogLevel.None;
        this.onMessageHandler = (0, misc_1.onContainerMessage)(this.handleEvent);
        this.window.addEventListener("message", this.onMessageHandler);
    }
    return ContainerClient;
}());
exports.default = ContainerClient;

},{"../shared":4,"./misc":2}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
            recipientId: e.data.recipientId,
        });
    }
}; };
exports.onContainerMessage = onContainerMessage;

},{"../shared":4}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Helpers = exports.ContainerClient = exports.WidgetClient = void 0;
require("iframe-resizer/js/iframeResizer.contentWindow.min.js");
var container_1 = require("./container");
exports.ContainerClient = container_1.default;
var Helpers = require("./shared");
exports.Helpers = Helpers;
var widget_1 = require("./widget");
exports.WidgetClient = widget_1.default;

},{"./container":1,"./shared":4,"./widget":5,"iframe-resizer/js/iframeResizer.contentWindow.min.js":8}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    var descriptors = {};
    Object.entries(widgetState).forEach(function (_a) {
        var key = _a[0], value = _a[1];
        // @ts-ignore
        descriptors[key] = {
            value: value,
            writable: true,
            enumerable: true,
        };
    });
    return Object.defineProperties({}, descriptors);
}
exports.createWidgetObj = createWidgetObj;

},{}],5:[function(require,module,exports){
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
Object.defineProperty(exports, "__esModule", { value: true });
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
                    value: value,
                },
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
                payload: value,
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
                recipientId: recipientId,
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
            _this.window.removeEventListener("message", _this.onMessageHandler);
            // @ts-ignore
            _this.state = null;
            // @ts-ignore
            _this.postEvent = null;
            // @ts-ignore
            _this.onMessageHandler = null;
            // @ts-ignore
            _this.subscribers = null;
        };
        var id = opts.id, createWidgetState = opts.createWidgetState, window = opts.window;
        if (!id) {
            throw new Error("Widget id must be provided to WidgetClient constructor");
        }
        this.window = window;
        this.subscribers = new Map();
        this.state = createWidgetState(id);
        var topWindow = window.top;
        this.postEvent = function (event) {
            if (event) {
                topWindow.postMessage(__assign(__assign({}, event), { id: id }), "*");
            }
        };
        this.onMessageHandler = (0, misc_1.onMessageFromContainer)(this.handleEvent);
        this.window.addEventListener("message", this.onMessageHandler);
    }
    return WidgetClient;
}());
exports.default = WidgetClient;

},{"../shared":4,"./misc":6}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onMessageFromContainer = void 0;
var shared_1 = require("../shared");
var onMessageFromContainer = function (cb) { return function (e) {
    var validMethods = Object.values(shared_1.ContainerMethods);
    var event = e.data;
    if (event && validMethods.includes(event.method)) {
        cb(event);
    }
}; };
exports.onMessageFromContainer = onMessageFromContainer;

},{"../shared":4}],7:[function(require,module,exports){

var ContainerClient = require('./dist/index').ContainerClient;
var WidgetClient = require('./dist/index').WidgetClient;
var Helpers = require('./dist/index').Helpers;

window.Statflo = {
  ContainerClient,
  WidgetClient,
  Helpers,
}

},{"./dist/index":3}],8:[function(require,module,exports){
/*! iFrame Resizer (iframeSizer.contentWindow.min.js) - v4.3.2 - 2021-04-26
 *  Desc: Include this file in any page being loaded into an iframe
 *        to force the iframe to resize to the content size.
 *  Requires: iframeResizer.min.js on host page.
 *  Copyright: (c) 2021 David J. Bradshaw - dave@bradshaw.net
 *  License: MIT
 */

!function(c){if("undefined"!=typeof window){var i=!0,o=10,r="",a=0,u="",s=null,d="",l=!1,f={resize:1,click:1},m=128,h=!0,g=1,n="bodyOffset",p=n,v=!0,y="",w={},b=32,T=null,E=!1,O=!1,S="[iFrameSizer]",M=S.length,I="",N={max:1,min:1,bodyScroll:1,documentElementScroll:1},A="child",C=!0,z=window.parent,k="*",R=0,x=!1,e=null,L=16,F=1,t="scroll",P=t,D=window,j=function(){re("onMessage function not defined")},q=function(){},H=function(){},W={height:function(){return re("Custom height calculation function not defined"),document.documentElement.offsetHeight},width:function(){return re("Custom width calculation function not defined"),document.body.scrollWidth}},B={},J=!1;try{var U=Object.create({},{passive:{get:function(){J=!0}}});window.addEventListener("test",ee,U),window.removeEventListener("test",ee,U)}catch(e){}var V,X,Y,K,Q,G,Z={bodyOffset:function(){return document.body.offsetHeight+pe("marginTop")+pe("marginBottom")},offset:function(){return Z.bodyOffset()},bodyScroll:function(){return document.body.scrollHeight},custom:function(){return W.height()},documentElementOffset:function(){return document.documentElement.offsetHeight},documentElementScroll:function(){return document.documentElement.scrollHeight},max:function(){return Math.max.apply(null,ye(Z))},min:function(){return Math.min.apply(null,ye(Z))},grow:function(){return Z.max()},lowestElement:function(){return Math.max(Z.bodyOffset()||Z.documentElementOffset(),ve("bottom",be()))},taggedElement:function(){return we("bottom","data-iframe-height")}},$={bodyScroll:function(){return document.body.scrollWidth},bodyOffset:function(){return document.body.offsetWidth},custom:function(){return W.width()},documentElementScroll:function(){return document.documentElement.scrollWidth},documentElementOffset:function(){return document.documentElement.offsetWidth},scroll:function(){return Math.max($.bodyScroll(),$.documentElementScroll())},max:function(){return Math.max.apply(null,ye($))},min:function(){return Math.min.apply(null,ye($))},rightMostElement:function(){return ve("right",be())},taggedElement:function(){return we("right","data-iframe-width")}},_=(V=Te,Q=null,G=0,function(){var e=Date.now(),t=L-(e-(G=G||e));return X=this,Y=arguments,t<=0||L<t?(Q&&(clearTimeout(Q),Q=null),G=e,K=V.apply(X,Y),Q||(X=Y=null)):Q=Q||setTimeout(Ee,t),K});te(window,"message",function(t){var n={init:function(){y=t.data,z=t.source,ae(),h=!1,setTimeout(function(){v=!1},m)},reset:function(){v?ie("Page reset ignored by init"):(ie("Page size reset by host page"),Me("resetPage"))},resize:function(){Oe("resizeParent","Parent window requested size check")},moveToAnchor:function(){w.findTarget(i())},inPageLink:function(){this.moveToAnchor()},pageInfo:function(){var e=i();ie("PageInfoFromParent called from parent: "+e),H(JSON.parse(e)),ie(" --")},message:function(){var e=i();ie("onMessage called from parent: "+e),j(JSON.parse(e)),ie(" --")}};function o(){return t.data.split("]")[1].split(":")[0]}function i(){return t.data.substr(t.data.indexOf(":")+1)}function r(){return t.data.split(":")[2]in{true:1,false:1}}function e(){var e=o();e in n?n[e]():("undefined"==typeof module||!module.exports)&&"iFrameResize"in window||"jQuery"in window&&"iFrameResize"in window.jQuery.prototype||r()||re("Unexpected message ("+t.data+")")}S===(""+t.data).substr(0,M)&&(!1===h?e():r()?n.init():ie('Ignored message of type "'+o()+'". Received before initialization.'))}),te(window,"readystatechange",Ae),Ae()}function ee(){}function te(e,t,n,o){e.addEventListener(t,n,!!J&&(o||{}))}function ne(e){return e.charAt(0).toUpperCase()+e.slice(1)}function oe(e){return S+"["+I+"] "+e}function ie(e){E&&"object"==typeof window.console&&console.log(oe(e))}function re(e){"object"==typeof window.console&&console.warn(oe(e))}function ae(){function e(e){return"true"===e}var t;function n(e){Ne(0,0,e.type,e.screenY+":"+e.screenX)}function o(e,t){ie("Add event listener: "+t),te(window.document,e,n)}t=y.substr(M).split(":"),I=t[0],a=c!==t[1]?Number(t[1]):a,l=c!==t[2]?e(t[2]):l,E=c!==t[3]?e(t[3]):E,b=c!==t[4]?Number(t[4]):b,i=c!==t[6]?e(t[6]):i,u=t[7],p=c!==t[8]?t[8]:p,r=t[9],d=t[10],R=c!==t[11]?Number(t[11]):R,w.enable=c!==t[12]&&e(t[12]),A=c!==t[13]?t[13]:A,P=c!==t[14]?t[14]:P,O=c!==t[15]?Boolean(t[15]):O,ie("Initialising iFrame ("+window.location.href+")"),function(){function e(e,t){return"function"==typeof e&&(ie("Setup custom "+t+"CalcMethod"),W[t]=e,e="custom"),e}"iFrameResizer"in window&&Object===window.iFrameResizer.constructor&&(function(){var e=window.iFrameResizer;ie("Reading data from page: "+JSON.stringify(e)),Object.keys(e).forEach(ue,e),j="onMessage"in e?e.onMessage:j,q="onReady"in e?e.onReady:q,k="targetOrigin"in e?e.targetOrigin:k,p="heightCalculationMethod"in e?e.heightCalculationMethod:p,P="widthCalculationMethod"in e?e.widthCalculationMethod:P}(),p=e(p,"height"),P=e(P,"width"));ie("TargetOrigin for parent set to: "+k)}(),function(){c===u&&(u=a+"px");ce("margin",function(e,t){-1!==t.indexOf("-")&&(re("Negative CSS value ignored for "+e),t="");return t}("margin",u))}(),ce("background",r),ce("padding",d),(t=document.createElement("div")).style.clear="both",t.style.display="block",t.style.height="0",document.body.appendChild(t),fe(),me(),document.documentElement.style.height="",document.body.style.height="",ie('HTML & body height set to "auto"'),ie("Enable public methods"),D.parentIFrame={autoResize:function(e){return!0===e&&!1===i?(i=!0,he()):!1===e&&!0===i&&(i=!1,de("remove"),null!==s&&s.disconnect(),clearInterval(T)),Ne(0,0,"autoResize",JSON.stringify(i)),i},close:function(){Ne(0,0,"close")},getId:function(){return I},getPageInfo:function(e){"function"==typeof e?(H=e,Ne(0,0,"pageInfo")):(H=function(){},Ne(0,0,"pageInfoStop"))},moveToAnchor:function(e){w.findTarget(e)},reset:function(){Ie("parentIFrame.reset")},scrollTo:function(e,t){Ne(t,e,"scrollTo")},scrollToOffset:function(e,t){Ne(t,e,"scrollToOffset")},sendMessage:function(e,t){Ne(0,0,"message",JSON.stringify(e),t)},setHeightCalculationMethod:function(e){p=e,fe()},setWidthCalculationMethod:function(e){P=e,me()},setTargetOrigin:function(e){ie("Set targetOrigin: "+e),k=e},size:function(e,t){Oe("size","parentIFrame.size("+((e||"")+(t?","+t:""))+")",e,t)}},!0===O&&(o("mouseenter","Mouse Enter"),o("mouseleave","Mouse Leave")),he(),w=function(){function i(e){var t=e.getBoundingClientRect(),e={x:window.pageXOffset!==c?window.pageXOffset:document.documentElement.scrollLeft,y:window.pageYOffset!==c?window.pageYOffset:document.documentElement.scrollTop};return{x:parseInt(t.left,10)+parseInt(e.x,10),y:parseInt(t.top,10)+parseInt(e.y,10)}}function n(e){var t,n=e.split("#")[1]||e,e=decodeURIComponent(n),o=document.getElementById(e)||document.getElementsByName(e)[0];c!==o?(t=i(t=o),ie("Moving to in page link (#"+n+") at x: "+t.x+" y: "+t.y),Ne(t.y,t.x,"scrollToOffset")):(ie("In page link (#"+n+") not found in iFrame, so sending to parent"),Ne(0,0,"inPageLink","#"+n))}function e(){var e=window.location.hash,t=window.location.href;""!==e&&"#"!==e&&n(t)}function t(){Array.prototype.forEach.call(document.querySelectorAll('a[href^="#"]'),function(e){"#"!==e.getAttribute("href")&&te(e,"click",function(e){e.preventDefault(),n(this.getAttribute("href"))})})}function o(){Array.prototype.forEach&&document.querySelectorAll?(ie("Setting up location.hash handlers"),t(),te(window,"hashchange",e),setTimeout(e,m)):re("In page linking not fully supported in this browser! (See README.md for IE8 workaround)")}w.enable?o():ie("In page linking not enabled");return{findTarget:n}}(),Oe("init","Init message from host page"),q()}function ue(e){var t=e.split("Callback");2===t.length&&(this[t="on"+t[0].charAt(0).toUpperCase()+t[0].slice(1)]=this[e],delete this[e],re("Deprecated: '"+e+"' has been renamed '"+t+"'. The old method will be removed in the next major version."))}function ce(e,t){c!==t&&""!==t&&"null"!==t&&ie("Body "+e+' set to "'+(document.body.style[e]=t)+'"')}function se(n){var e={add:function(e){function t(){Oe(n.eventName,n.eventType)}B[e]=t,te(window,e,t,{passive:!0})},remove:function(e){var t,n=B[e];delete B[e],t=window,e=e,n=n,t.removeEventListener(e,n,!1)}};n.eventNames&&Array.prototype.map?(n.eventName=n.eventNames[0],n.eventNames.map(e[n.method])):e[n.method](n.eventName),ie(ne(n.method)+" event listener: "+n.eventType)}function de(e){se({method:e,eventType:"Animation Start",eventNames:["animationstart","webkitAnimationStart"]}),se({method:e,eventType:"Animation Iteration",eventNames:["animationiteration","webkitAnimationIteration"]}),se({method:e,eventType:"Animation End",eventNames:["animationend","webkitAnimationEnd"]}),se({method:e,eventType:"Input",eventName:"input"}),se({method:e,eventType:"Mouse Up",eventName:"mouseup"}),se({method:e,eventType:"Mouse Down",eventName:"mousedown"}),se({method:e,eventType:"Orientation Change",eventName:"orientationchange"}),se({method:e,eventType:"Print",eventName:["afterprint","beforeprint"]}),se({method:e,eventType:"Ready State Change",eventName:"readystatechange"}),se({method:e,eventType:"Touch Start",eventName:"touchstart"}),se({method:e,eventType:"Touch End",eventName:"touchend"}),se({method:e,eventType:"Touch Cancel",eventName:"touchcancel"}),se({method:e,eventType:"Transition Start",eventNames:["transitionstart","webkitTransitionStart","MSTransitionStart","oTransitionStart","otransitionstart"]}),se({method:e,eventType:"Transition Iteration",eventNames:["transitioniteration","webkitTransitionIteration","MSTransitionIteration","oTransitionIteration","otransitioniteration"]}),se({method:e,eventType:"Transition End",eventNames:["transitionend","webkitTransitionEnd","MSTransitionEnd","oTransitionEnd","otransitionend"]}),"child"===A&&se({method:e,eventType:"IFrame Resized",eventName:"resize"})}function le(e,t,n,o){return t!==e&&(e in n||(re(e+" is not a valid option for "+o+"CalculationMethod."),e=t),ie(o+' calculation method set to "'+e+'"')),e}function fe(){p=le(p,n,Z,"height")}function me(){P=le(P,t,$,"width")}function he(){var e;!0===i?(de("add"),e=b<0,window.MutationObserver||window.WebKitMutationObserver?e?ge():s=function(){function t(e){function t(e){!1===e.complete&&(ie("Attach listeners to "+e.src),e.addEventListener("load",i,!1),e.addEventListener("error",r,!1),u.push(e))}"attributes"===e.type&&"src"===e.attributeName?t(e.target):"childList"===e.type&&Array.prototype.forEach.call(e.target.querySelectorAll("img"),t)}function o(e){ie("Remove listeners from "+e.src),e.removeEventListener("load",i,!1),e.removeEventListener("error",r,!1),e=e,u.splice(u.indexOf(e),1)}function n(e,t,n){o(e.target),Oe(t,n+": "+e.target.src)}function i(e){n(e,"imageLoad","Image loaded")}function r(e){n(e,"imageLoadFailed","Image load failed")}function a(e){Oe("mutationObserver","mutationObserver: "+e[0].target+" "+e[0].type),e.forEach(t)}var u=[],c=window.MutationObserver||window.WebKitMutationObserver,s=function(){var e=document.querySelector("body");return s=new c(a),ie("Create body MutationObserver"),s.observe(e,{attributes:!0,attributeOldValue:!1,characterData:!0,characterDataOldValue:!1,childList:!0,subtree:!0}),s}();return{disconnect:function(){"disconnect"in s&&(ie("Disconnect body MutationObserver"),s.disconnect(),u.forEach(o))}}}():(ie("MutationObserver not supported in this browser!"),ge())):ie("Auto Resize disabled")}function ge(){0!==b&&(ie("setInterval: "+b+"ms"),T=setInterval(function(){Oe("interval","setInterval: "+b)},Math.abs(b)))}function pe(e,t){var n=0;return t=t||document.body,n=null!==(n=document.defaultView.getComputedStyle(t,null))?n[e]:0,parseInt(n,o)}function ve(e,t){for(var n,o=t.length,i=0,r=ne(e),a=Date.now(),u=0;u<o;u++)i<(n=t[u].getBoundingClientRect()[e]+pe("margin"+r,t[u]))&&(i=n);return a=Date.now()-a,ie("Parsed "+o+" HTML elements"),ie("Element position calculated in "+a+"ms"),L/2<(a=a)&&ie("Event throttle increased to "+(L=2*a)+"ms"),i}function ye(e){return[e.bodyOffset(),e.bodyScroll(),e.documentElementOffset(),e.documentElementScroll()]}function we(e,t){var n=document.querySelectorAll("["+t+"]");return 0===n.length&&(re("No tagged elements ("+t+") found on page"),document.querySelectorAll("body *")),ve(e,n)}function be(){return document.querySelectorAll("body *")}function Te(e,t,n,o){function i(){e in{init:1,interval:1,size:1}||!(p in N||l&&P in N)?e in{interval:1}||ie("No change in size detected"):Ie(t)}var r,a;function u(e,t){return!(Math.abs(e-t)<=R)}r=c!==n?n:Z[p](),a=c!==o?o:$[P](),u(g,r)||l&&u(F,a)||"init"===e?(Se(),Ne(g=r,F=a,e)):i()}function Ee(){G=Date.now(),Q=null,K=V.apply(X,Y),Q||(X=Y=null)}function Oe(e,t,n,o){x&&e in f?ie("Trigger event cancelled: "+e):(e in{reset:1,resetPage:1,init:1}||ie("Trigger event: "+t),("init"===e?Te:_)(e,t,n,o))}function Se(){x||(x=!0,ie("Trigger event lock on")),clearTimeout(e),e=setTimeout(function(){x=!1,ie("Trigger event lock off"),ie("--")},m)}function Me(e){g=Z[p](),F=$[P](),Ne(g,F,e)}function Ie(e){var t=p;p=n,ie("Reset trigger event: "+e),Se(),Me("reset"),p=t}function Ne(e,t,n,o,i){var r;!0===C&&(c===i?i=k:ie("Message targetOrigin: "+i),ie("Sending message to host page ("+(r=I+":"+(e+":"+t)+":"+n+(c!==o?":"+o:""))+")"),z.postMessage(S+r,i))}function Ae(){"loading"!==document.readyState&&window.parent.postMessage("[iFrameResizerChild]Ready","*")}}();

},{}]},{},[7])(7)
});
