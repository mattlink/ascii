"use strict";
exports.__esModule = true;
var GameObject = /** @class */ (function () {
    function GameObject(x, y, tile) {
        this.x = x;
        this.y = y;
        this.tile = tile;
    }
    GameObject.prototype.getTile = function () {
        return this.tile;
    };
    return GameObject;
}());
exports.GameObject = GameObject;
