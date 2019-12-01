"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var GameObject_1 = require("./GameObject");
// essentially, "Actors" are GameObjects that are allowed to takeTurns.
var Actor = /** @class */ (function (_super) {
    __extends(Actor, _super);
    function Actor(x, y, tile) {
        return _super.call(this, x, y, tile) || this;
    }
    return Actor;
}(GameObject_1.GameObject));
exports.Actor = Actor;
