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
var Environment_1 = require("../../Entity/Environment");
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
        var fromObject = world.getObject(this.actor.x, this.actor.y);
        if (this.dir == WalkDirection.Up) {
            var object = world.getObject(this.actor.x, this.actor.y - 1);
            if (!object.collides) {
                if (fromObject instanceof Environment_1.Floor) {
                    world.objects[this.actor.x][this.actor.y].removeOccupation();
                }
                this.actor.y = this.actor.y - 1;
                if (object instanceof Environment_1.Floor) {
                    world.objects[this.actor.x][this.actor.y].setOccupation(this.actor);
                }
            }
            else {
                if (this.actor.debug) {
                    console.log('COLLISION: ', this.actor);
                }
            }
        }
        else if (this.dir == WalkDirection.Down) {
            var object = world.getObject(this.actor.x, this.actor.y + 1);
            if (!object.collides) {
                if (fromObject instanceof Environment_1.Floor) {
                    world.objects[this.actor.x][this.actor.y].removeOccupation();
                }
                this.actor.y = this.actor.y + 1;
                if (object instanceof Environment_1.Floor) {
                    world.objects[this.actor.x][this.actor.y].setOccupation(this.actor);
                }
            }
            else {
                if (this.actor.debug) {
                    console.log('COLLISION: ', this.actor);
                }
            }
        }
        else if (this.dir == WalkDirection.Left) {
            var object = world.getObject(this.actor.x - 1, this.actor.y);
            if (!object.collides) {
                if (fromObject instanceof Environment_1.Floor) {
                    world.objects[this.actor.x][this.actor.y].removeOccupation();
                }
                this.actor.x = this.actor.x - 1;
                if (object instanceof Environment_1.Floor) {
                    world.objects[this.actor.x][this.actor.y].setOccupation(this.actor);
                }
            }
            else {
                if (this.actor.debug) {
                    console.log('COLLISION: ', this.actor);
                }
            }
        }
        else if (this.dir == WalkDirection.Right) {
            var object = world.getObject(this.actor.x + 1, this.actor.y);
            if (!object.collides) {
                if (fromObject instanceof Environment_1.Floor) {
                    world.objects[this.actor.x][this.actor.y].removeOccupation();
                }
                this.actor.x = this.actor.x + 1;
                if (object instanceof Environment_1.Floor) {
                    world.objects[this.actor.x][this.actor.y].setOccupation(this.actor);
                }
            }
            else {
                if (this.actor.debug) {
                    console.log('COLLISION: ', this.actor);
                }
            }
        }
        // In theory, if we DONT do the rendering update here, then the movement is completely independent of the renderer which is ideal
    };
    return WalkAction;
}(Action_1.Action));
exports.WalkAction = WalkAction;
