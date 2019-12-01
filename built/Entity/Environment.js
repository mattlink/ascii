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
var Tree = /** @class */ (function (_super) {
    __extends(Tree, _super);
    function Tree(x, y, tile) {
        return _super.call(this, x, y, tile) || this;
    }
    return Tree;
}(GameObject_1.GameObject));
exports.Tree = Tree;
var Floor = /** @class */ (function (_super) {
    __extends(Floor, _super);
    function Floor(x, y, tile) {
        return _super.call(this, x, y, tile) || this;
    }
    return Floor;
}(GameObject_1.GameObject));
exports.Floor = Floor;
var Wall = /** @class */ (function (_super) {
    __extends(Wall, _super);
    function Wall(x, y, tile) {
        return _super.call(this, x, y, tile) || this;
    }
    return Wall;
}(GameObject_1.GameObject));
exports.Wall = Wall;
