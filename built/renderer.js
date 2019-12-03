"use strict";
exports.__esModule = true;
var Player_1 = require("./Entity/Player");
var tile_1 = require("./tile");
var Renderer = /** @class */ (function () {
    function Renderer() {
        this.elementSize = 15;
        this.context = document.createElement('div');
    }
    Renderer.prototype.init = function (world) {
        this.world = world;
        // initialize the rendering context
        this.initializeContext(world);
        // bind context to body
        this.bind(this.context);
    };
    Renderer.prototype.updateGameObject = function (obj) {
        // Render the game object in its position
        this.updateTile(obj.x, obj.y, obj.getTile(), this.context);
    };
    // "Re-render a specific tile"
    Renderer.prototype.updateTile = function (x, y, tile, context) {
        context.children[y].children[x].innerHTML = tile.ascii;
        // (<HTMLElement>document.querySelector('#'+x+'-'+y)).style.backgroundColor = tile.bg;
        context.children[y].children[x].style.backgroundColor = tile.bg;
        context.children[y].children[x].style.color = tile.fg;
    };
    Renderer.prototype.renderLocalContexts = function (objs, context) {
        if (context === void 0) { context = this.context; }
        // Update all locations around the game object to their initial world state
        for (var n = 0; n < objs.length; n++) {
            // If the player is in debug render their movements and local contexts in yellow
            if (objs[n] instanceof Player_1.Player && objs[n].debug) {
                this.updateTile(objs[n].x - 1, objs[n].y, new tile_1.Tile(this.world.getObject(objs[n].x - 1, objs[n].y).getTile().ascii, this.world.getObject(objs[n].x - 1, objs[n].y).getTile().fg, 'yellow'), context);
                this.updateTile(objs[n].x + 1, objs[n].y, new tile_1.Tile(this.world.getObject(objs[n].x + 1, objs[n].y).getTile().ascii, this.world.getObject(objs[n].x + 1, objs[n].y).getTile().fg, 'yellow'), context);
                this.updateTile(objs[n].x, objs[n].y - 1, new tile_1.Tile(this.world.getObject(objs[n].x, objs[n].y - 1).getTile().ascii, this.world.getObject(objs[n].x, objs[n].y - 1).getTile().fg, 'yellow'), context);
                this.updateTile(objs[n].x, objs[n].y + 1, new tile_1.Tile(this.world.getObject(objs[n].x, objs[n].y + 1).getTile().ascii, this.world.getObject(objs[n].x, objs[n].y + 1).getTile().fg, 'yellow'), context);
            }
            else {
                this.updateTile(objs[n].x - 1, objs[n].y, this.world.getObject(objs[n].x - 1, objs[n].y).getTile(), context);
                this.updateTile(objs[n].x + 1, objs[n].y, this.world.getObject(objs[n].x + 1, objs[n].y).getTile(), context);
                this.updateTile(objs[n].x, objs[n].y - 1, this.world.getObject(objs[n].x, objs[n].y - 1).getTile(), context);
                this.updateTile(objs[n].x, objs[n].y + 1, this.world.getObject(objs[n].x, objs[n].y + 1).getTile(), context);
            }
        }
    };
    Renderer.prototype.initializeContext = function (world) {
        this.context.style.height = Renderer.pxs(world.getHeight() * this.elementSize);
        this.context.style.width = Renderer.pxs(world.getWidth() * this.elementSize);
        this.context.style.margin = 'auto';
        for (var i = 0; i < world.getHeight(); i++) {
            var rowDiv = document.createElement('div');
            rowDiv.style.height = Renderer.pxs(this.elementSize);
            rowDiv.style.display = 'flex';
            for (var j = 0; j < world.getWidth(); j++) {
                var element = document.createElement('div');
                element.style.height = Renderer.pxs(this.elementSize);
                element.style.width = Renderer.pxs(this.elementSize);
                element.style.textAlign = 'center';
                element.style.userSelect = 'none';
                element.innerHTML = world.getObject(j, i).getTile().ascii;
                element.style.backgroundColor = world.getObject(j, i).getTile().bg;
                element.style.color = world.getObject(j, i).getTile().fg;
                rowDiv.appendChild(element);
            }
            this.context.appendChild(rowDiv);
        }
    };
    Renderer.prototype.addWindow = function (window) {
        var context = this.initWindow(window);
        this.bind(context);
    };
    Renderer.prototype.initWindow = function (window) {
        var windowContext = document.createElement('div');
        windowContext.style.height = Renderer.pxs(window.localHeight);
        windowContext.style.width = Renderer.pxs(window.localWidth);
        windowContext.style.margin = 'auto';
        for (var i = 0; i < window.localHeight; i++) {
            var rowDiv = document.createElement('div');
            rowDiv.style.height = Renderer.pxs(this.elementSize);
            rowDiv.style.display = 'flex';
            for (var j = 0; j < window.localWidth; j++) {
                var element = document.createElement('div');
                element.style.height = Renderer.pxs(this.elementSize);
                element.style.width = Renderer.pxs(this.elementSize);
                element.style.textAlign = 'center';
                element.style.userSelect = 'none';
                element.innerHTML = window.getTile(i, j).ascii;
                element.style.backgroundColor = window.getTile(i, j).bg;
                element.style.color = window.getTile(i, j).fg;
                rowDiv.appendChild(element);
            }
            windowContext.appendChild(rowDiv);
        }
        return windowContext;
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
    return Renderer;
}());
exports.Renderer = Renderer;
