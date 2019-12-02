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
var WaitAction_1 = require("../Components/Actions/WaitAction");
var WalkAction_1 = require("../Components/Actions/WalkAction");
var Player = /** @class */ (function (_super) {
    __extends(Player, _super);
    function Player(x0, y0, tile) {
        var _this = _super.call(this, "Player", x0, y0, tile) || this;
        _this.debug = false;
        _this.nextAction = new WaitAction_1.WaitAction(_this);
        return _this;
    }
    Player.prototype.receiveKeyInput = function (key) {
        if (key == 'w') {
            this.nextAction = new WalkAction_1.WalkAction(WalkAction_1.WalkDirection.Up, this);
        }
        else if (key == 'a') {
            this.nextAction = new WalkAction_1.WalkAction(WalkAction_1.WalkDirection.Left, this);
        }
        else if (key == 's') {
            this.nextAction = new WalkAction_1.WalkAction(WalkAction_1.WalkDirection.Down, this);
        }
        else if (key == 'd') {
            this.nextAction = new WalkAction_1.WalkAction(WalkAction_1.WalkDirection.Right, this);
        }
        else {
            this.nextAction = new WaitAction_1.WaitAction(this);
        }
    };
    Player.prototype.takeTurn = function (world) {
        this.nextAction.perform(world);
    };
    return Player;
}(Actor_1.Actor));
exports.Player = Player;
