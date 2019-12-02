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
var Environment_1 = require("./Entity/Environment");
var tile_1 = require("./tile");
var World = /** @class */ (function () {
    function World(width, height) {
        this.width = width;
        this.height = height;
        this.objects = [];
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
        // this.objects[actor.x][actor.y] = actor;
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
        var floors = [
            new tile_1.Tile('&#8283;', 'black', 'white'),
            new tile_1.Tile('&#775;', 'black', 'white'),
            new tile_1.Tile('&#803;', 'black', 'white'),
            new tile_1.Tile('&#856;', 'black', 'white')
        ];
        var trees = [
            new tile_1.Tile('&#8483;', 'green', 'white')
        ];
        // SHIM:
        // let floorChars = ['&#8283;', '&#775;', '&#803;', '&#856;'];
        // let treeChars = ['&#8483;'];
        // set up wall tiles
        var botLeft = new tile_1.Tile('&#9562;', 'black', 'white');
        var botRight = new tile_1.Tile('&#9565;', 'black', 'white');
        var topLeft = new tile_1.Tile('&#9556;', 'black', 'white');
        var topRight = new tile_1.Tile('&#9559;', 'black', 'white');
        // let horizontal = new Tile('&#9552;&#9552;', 'black', 'white');
        var horizontal = new tile_1.Tile('==', 'black', 'white');
        var vertical = new tile_1.Tile('&#9553;', 'black', 'white');
        for (var i = 0; i < this.width; i++) {
            this.objects[i] = [];
            for (var j = 0; j < this.height; j++) {
                if (i == 0 && j == this.width - 1) {
                    this.objects[i][j] = new Environment_1.Wall(i, j, botLeft);
                    continue;
                }
                if (i == 0 && j == 0) {
                    this.objects[i][j] = new Environment_1.Wall(i, j, topLeft);
                    continue;
                }
                if (i == this.height - 1 && j == this.width - 1) {
                    this.objects[i][j] = new Environment_1.Wall(i, j, botRight);
                    continue;
                }
                if (i == this.height - 1 && j == 0) {
                    this.objects[i][j] = new Environment_1.Wall(i, j, topRight);
                    continue;
                }
                if (i == 0 || i == this.height - 1) {
                    this.objects[i][j] = new Environment_1.Wall(i, j, vertical);
                    continue;
                }
                if (j == 0 || j == this.width - 1) {
                    this.objects[i][j] = new Environment_1.Wall(i, j, horizontal);
                    continue;
                }
                var rand = Math.floor(Math.random() * 10);
                if (rand > 6) {
                    this.objects[i][j] = new Environment_1.Tree(i, j, trees[0]);
                }
                else {
                    this.objects[i][j] = new Environment_1.Floor(i, j, floors[Math.floor(Math.random() * 4)]);
                }
            }
        }
    };
    World.prototype.getObject = function (x, y) {
        return this.objects[x][y];
    };
    return World;
}());
exports.World = World;
