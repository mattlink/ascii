"use strict";
exports.__esModule = true;
var Actor_1 = require("./Entity/Actor");
var tile_1 = require("./tile");
var Renderer = /** @class */ (function () {
    function Renderer() {
    }
    Renderer.prototype.updateGameObject = function (obj, context) {
        // Render the game object in its position
        this.updateTile(obj.x, obj.y, obj.getTile(), context);
    };
    // "Re-render a specific tile"
    Renderer.prototype.updateTile = function (x, y, tile, context) {
        context.children[y].children[x].innerHTML = tile.ascii;
        context.children[y].children[x].style.backgroundColor = tile.bg;
        context.children[y].children[x].style.color = tile.fg;
    };
    Renderer.prototype.renderLocalWorldContexts = function (objs, world, context) {
        // Update all locations around the game object to their initial world state
        for (var n = 0; n < objs.length; n++) {
            // If the player is in debug render their movements and local contexts in yellow
            if (objs[n] instanceof Actor_1.Actor && objs[n].debug) {
                this.updateTile(objs[n].x - 1, objs[n].y, new tile_1.Tile(world.getObject(objs[n].x - 1, objs[n].y).getTile().ascii, world.getObject(objs[n].x - 1, objs[n].y).getTile().fg, 'yellow'), context);
                this.updateTile(objs[n].x + 1, objs[n].y, new tile_1.Tile(world.getObject(objs[n].x + 1, objs[n].y).getTile().ascii, world.getObject(objs[n].x + 1, objs[n].y).getTile().fg, 'yellow'), context);
                this.updateTile(objs[n].x, objs[n].y - 1, new tile_1.Tile(world.getObject(objs[n].x, objs[n].y - 1).getTile().ascii, world.getObject(objs[n].x, objs[n].y - 1).getTile().fg, 'yellow'), context);
                this.updateTile(objs[n].x, objs[n].y + 1, new tile_1.Tile(world.getObject(objs[n].x, objs[n].y + 1).getTile().ascii, world.getObject(objs[n].x, objs[n].y + 1).getTile().fg, 'yellow'), context);
            }
            else {
                this.updateTile(objs[n].x - 1, objs[n].y, world.getObject(objs[n].x - 1, objs[n].y).getTile(), context);
                this.updateTile(objs[n].x + 1, objs[n].y, world.getObject(objs[n].x + 1, objs[n].y).getTile(), context);
                this.updateTile(objs[n].x, objs[n].y - 1, world.getObject(objs[n].x, objs[n].y - 1).getTile(), context);
                this.updateTile(objs[n].x, objs[n].y + 1, world.getObject(objs[n].x, objs[n].y + 1).getTile(), context);
            }
        }
    };
    Renderer.prototype.addWindow = function (window) {
        var context = window.getContext();
        this.bind(context);
    };
    // public updateWindow(window: Window, tiles: Tile[][]) {
    //     for (let i = 0; i < window.localHeight; i++) {
    //         for (let j = 0; j < window.localWidth; j++) {
    //             this.updateTile(i, j, tiles[i][j], window.getContext());
    //         }
    //     }
    // }
    Renderer.prototype.bind = function (windowContext) {
        var body = document.body;
        body.style.margin = '0';
        body.appendChild(windowContext);
    };
    Renderer.pxs = function (x) {
        return x.toString() + 'px';
    };
    Renderer.elementSize = 15;
    return Renderer;
}());
exports.Renderer = Renderer;
