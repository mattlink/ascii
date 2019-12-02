"use strict";
/* This is sort of kind of a world "system"

Notes about what this World class could or should be:

- keep things related to generating the initial world state (?)
- leave propagation of the simulation to another system
- in theory, if users are to specify custom "factors" into the way their world is generated,
    then those factors would be tweaked here... (maybe?)
    - but, maybe this would be better left for a "Generator" class
        - it could generate types of rooms/dungeons?

*/
exports.__esModule = true;
var tile_1 = require("./tile");
var World = /** @class */ (function () {
    // private tree: Tile = new Tile('&#2510;', 'green', 'white');
    function World(width, height) {
        this.width = width;
        this.height = height;
        this.tiles = [];
        this.objects = [];
        // this.mobs = [];
        this.actors = [];
    }
    World.prototype.handleActorTurns = function () {
        var _this = this;
        this.actors.forEach(function (actor) {
            actor.takeTurn(_this);
        });
    };
    World.prototype.addActor = function (actor) {
        this.actors.push(actor);
    };
    World.prototype.getActors = function () {
        return this.actors;
    };
    World.prototype.getHeight = function () {
        return this.height;
    };
    World.prototype.getWidth = function () {
        return this.width;
    };
    // init generates the initial world state
    World.prototype.init = function () {
        var floorChars = ['&#8283;', '&#775;', '&#803;', '&#856;'];
        var treeChars = ['&#8483;'];
        //let chars: any[] = ['&#856;'];//'&#8283;'];//, '&#8483;', '&#775;', '&#803;', '&#856;'];
        // set up wall tiles
        var botLeft = new tile_1.Tile('&#9562;', 'black', 'white');
        var botRight = new tile_1.Tile('&#9565;', 'black', 'white');
        var topLeft = new tile_1.Tile('&#9556;', 'black', 'white');
        var topRight = new tile_1.Tile('&#9559;', 'black', 'white');
        // let horizontal = new Tile('&#9552;&#9552;', 'black', 'white');
        var horizontal = new tile_1.Tile('==', 'black', 'white');
        var vertical = new tile_1.Tile('&#9553;', 'black', 'white');
        for (var i = 0; i < this.height; i++) {
            this.tiles[i] = [];
            for (var j = 0; j < this.width; j++) {
                if (i == 0 && j == this.width - 1) {
                    this.tiles[i][j] = topRight;
                    continue;
                }
                if (i == 0 && j == 0) {
                    this.tiles[i][j] = topLeft;
                    continue;
                }
                if (i == 0) {
                    this.tiles[i][j] = horizontal;
                    continue;
                }
                if (i == this.height - 1 && j == this.width - 1) {
                    this.tiles[i][j] = botRight;
                    continue;
                }
                if (i == this.height - 1 && j == 0) {
                    this.tiles[i][j] = botLeft;
                    continue;
                }
                if (i == this.height - 1) {
                    this.tiles[i][j] = horizontal;
                    continue;
                }
                if (j == 0 || j == this.width - 1) {
                    this.tiles[i][j] = vertical;
                    continue;
                }
                var rand = Math.floor(Math.random() * 10);
                if (rand > 6) {
                    this.tiles[i][j] = new tile_1.Tile(treeChars[0], 'green', 'white');
                }
                else {
                    this.tiles[i][j] = new tile_1.Tile(floorChars[Math.floor(Math.random() * 4)], 'black', 'white');
                }
            }
        }
    };
    World.prototype.getTile = function (x, y) {
        return this.tiles[y][x];
    };
    World.prototype.getTileASCII = function (x, y) {
        return this.tiles[x][y].ascii;
    };
    World.prototype.getTileBg = function (x, y) {
        return this.tiles[x][y].bg;
    };
    World.prototype.getTileFg = function (x, y) {
        return this.tiles[x][y].fg;
    };
    return World;
}());
exports.World = World;
