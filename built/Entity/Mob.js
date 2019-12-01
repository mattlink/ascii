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
var Actor_1 = require("./Actor");
var WalkAction_1 = require("../Components/Actions/WalkAction");
var WaitAction_1 = require("../Components/Actions/WaitAction");
var Mob = /** @class */ (function (_super) {
    __extends(Mob, _super);
    function Mob(x, y, tile) {
        var _this = _super.call(this, x, y, tile) || this;
        _this.nextAction = new WaitAction_1.WaitAction(_this);
        return _this;
    }
    Mob.prototype.takeTurn = function (world) {
        var actionList = [
            new WaitAction_1.WaitAction(this),
            new WalkAction_1.WalkAction(WalkAction_1.WalkDirection.Up, this),
            new WalkAction_1.WalkAction(WalkAction_1.WalkDirection.Down, this),
            new WalkAction_1.WalkAction(WalkAction_1.WalkDirection.Left, this),
            new WalkAction_1.WalkAction(WalkAction_1.WalkDirection.Right, this)
        ];
        var r = Math.floor(Math.random() * (actionList.length));
        actionList[r].perform(world);
        // actionList[0].perform();
    };
    return Mob;
}(Actor_1.Actor));
exports.Mob = Mob;
