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
        this.bind();
    };
    Renderer.prototype.updateGameObject = function (obj) {
        /*for (let i = obj.x - 1; i <= obj.x + 1; i++) {
            for (let j = obj.y - 1; j <= obj.y + 1; j++) {
                
                if (this.world.tileContainsMob(i, j)) continue;
                // Doing it this: way leaves a green trail around where the player walks
                this.updateTile(i, j, new Tile(this.world.getTile(i, j).ascii, this.world.getTile(i, j).fg, 'green'));
                
                // this.updateTile(i, j, this.world.getTile(i, j));
            }
        }*/
        // Render the game object in its position
        this.updateTile(obj.x, obj.y, obj.getTile());
    };
    // "Re-render a specific tile"
    Renderer.prototype.updateTile = function (x, y, tile) {
        this.context.children[y].children[x].innerHTML = tile.ascii;
        // (<HTMLElement>document.querySelector('#'+x+'-'+y)).style.backgroundColor = tile.bg;
        this.context.children[y].children[x].style.backgroundColor = tile.bg;
        this.context.children[y].children[x].style.color = tile.fg;
    };
    Renderer.prototype.renderLocalContexts = function (objs) {
        // Update all locations around the game object to their initial world state
        for (var n = 0; n < objs.length; n++) {
            // If the player is in debug render their movements and local contexts in yellow
            if (objs[n] instanceof Player_1.Player && objs[n].debug) {
                this.updateTile(objs[n].x - 1, objs[n].y, new tile_1.Tile(this.world.getObject(objs[n].x - 1, objs[n].y).getTile().ascii, this.world.getObject(objs[n].x - 1, objs[n].y).getTile().fg, 'yellow'));
                this.updateTile(objs[n].x + 1, objs[n].y, new tile_1.Tile(this.world.getObject(objs[n].x + 1, objs[n].y).getTile().ascii, this.world.getObject(objs[n].x + 1, objs[n].y).getTile().fg, 'yellow'));
                this.updateTile(objs[n].x, objs[n].y - 1, new tile_1.Tile(this.world.getObject(objs[n].x, objs[n].y - 1).getTile().ascii, this.world.getObject(objs[n].x, objs[n].y - 1).getTile().fg, 'yellow'));
                this.updateTile(objs[n].x, objs[n].y + 1, new tile_1.Tile(this.world.getObject(objs[n].x, objs[n].y + 1).getTile().ascii, this.world.getObject(objs[n].x, objs[n].y + 1).getTile().fg, 'yellow'));
            }
            else {
                this.updateTile(objs[n].x - 1, objs[n].y, this.world.getObject(objs[n].x - 1, objs[n].y).getTile());
                this.updateTile(objs[n].x + 1, objs[n].y, this.world.getObject(objs[n].x + 1, objs[n].y).getTile());
                this.updateTile(objs[n].x, objs[n].y - 1, this.world.getObject(objs[n].x, objs[n].y - 1).getTile());
                this.updateTile(objs[n].x, objs[n].y + 1, this.world.getObject(objs[n].x, objs[n].y + 1).getTile());
            }
        }
    };
    Renderer.prototype.initializeContext = function (world) {
        this.context.style.height = this.pxs(world.getHeight() * this.elementSize);
        this.context.style.width = this.pxs(world.getWidth() * this.elementSize);
        this.context.style.margin = 'auto';
        for (var i = 0; i < world.getHeight(); i++) {
            var rowDiv = document.createElement('div');
            rowDiv.style.height = this.pxs(this.elementSize);
            rowDiv.style.display = 'flex';
            for (var j = 0; j < world.getWidth(); j++) {
                var element = document.createElement('div');
                element.style.height = this.pxs(this.elementSize);
                element.style.width = this.pxs(this.elementSize);
                element.style.textAlign = 'center';
                element.style.userSelect = 'none';
                element.innerHTML = world.getObject(j, i).getTile().ascii;
                element.style.backgroundColor = world.getObject(j, i).getTile().bg;
                element.style.color = world.getObject(j, i).getTile().fg;
                // element.innerHTML = world.getTileASCII(i,j);
                // element.style.backgroundColor = world.getTileBg(i, j);
                // element.style.color = world.getTileFg(i, j);                
                // element.id = i+'-'+j;
                rowDiv.appendChild(element);
            }
            this.context.appendChild(rowDiv);
        }
    };
    Renderer.prototype.bind = function () {
        var body = document.body;
        body.style.margin = '0';
        body.appendChild(this.context);
    };
    Renderer.prototype.pxs = function (x) {
        return x.toString() + 'px';
    };
    return Renderer;
}());
exports.Renderer = Renderer;
