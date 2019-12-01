"use strict";
exports.__esModule = true;
var Tile = /** @class */ (function () {
    function Tile(ascii, fg, bg) {
        this.ascii = '.';
        this.fg = 'black';
        this.bg = 'white';
        // Check for "empty constructor"
        if (typeof ascii === 'undefined' || ascii == null) {
            return;
        }
        this.ascii = ascii;
        if (fg != null && bg != null) {
            this.fg = fg;
            this.bg = bg;
            // console.log(this);
            return;
        }
        return;
    }
    return Tile;
}());
exports.Tile = Tile;
