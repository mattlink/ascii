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
var Action_1 = require("./Action");
var WalkDirection;
(function (WalkDirection) {
    WalkDirection[WalkDirection["Up"] = 0] = "Up";
    WalkDirection[WalkDirection["Down"] = 1] = "Down";
    WalkDirection[WalkDirection["Left"] = 2] = "Left";
    WalkDirection[WalkDirection["Right"] = 3] = "Right";
})(WalkDirection = exports.WalkDirection || (exports.WalkDirection = {}));
var WalkAction = /** @class */ (function (_super) {
    __extends(WalkAction, _super);
    function WalkAction(dir, actor) {
        var _this = _super.call(this, actor) || this;
        _this.dir = dir;
        return _this;
    }
    WalkAction.prototype.perform = function (world) {
        // TODO: We want to handle collisions here
        if (this.dir == WalkDirection.Up) {
            if (!(this.actor.y - 1 <= 0)) {
                this.actor.y = this.actor.y - 1;
            }
        }
        else if (this.dir == WalkDirection.Down) {
            if (this.actor.y + 1 < world.getHeight() - 1) {
                this.actor.y = this.actor.y + 1;
            }
        }
        else if (this.dir == WalkDirection.Left) {
            if (!(this.actor.x - 1 <= 0)) {
                this.actor.x = this.actor.x - 1;
            }
        }
        else if (this.dir == WalkDirection.Right) {
            if (this.actor.x + 1 < world.getWidth() - 1) {
                this.actor.x = this.actor.x + 1;
            }
        }
        // In theory, if we DONT do the rendering update here, then the movement is completely independent of the renderer which is ideal
    };
    return WalkAction;
}(Action_1.Action));
exports.WalkAction = WalkAction;
