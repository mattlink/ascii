(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var Action = /** @class */ (function () {
    function Action(actor) {
        this.actor = actor;
    }
    return Action;
}());
exports.Action = Action;

},{}],2:[function(require,module,exports){
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
var WaitAction = /** @class */ (function (_super) {
    __extends(WaitAction, _super);
    function WaitAction(actor) {
        return _super.call(this, actor) || this;
    }
    WaitAction.prototype.perform = function (world) { };
    return WaitAction;
}(Action_1.Action));
exports.WaitAction = WaitAction;

},{"./Action":1}],3:[function(require,module,exports){
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

},{"./Action":1}],4:[function(require,module,exports){
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
// essentially, "Actors" are GameObjects that are allowed to takeTurns.
var Actor = /** @class */ (function (_super) {
    __extends(Actor, _super);
    function Actor(x, y, tile) {
        return _super.call(this, x, y, tile) || this;
    }
    return Actor;
}(GameObject_1.GameObject));
exports.Actor = Actor;

},{"./GameObject":5}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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
var Actor_1 = require("./Actor");
var WalkAction_1 = require("../Components/Actions/WalkAction");
var WaitAction_1 = require("../Components/Actions/WaitAction");
var Mob = /** @class */ (function (_super) {
    __extends(Mob, _super);
    function Mob(x, y, tile) {
        var _this = _super.call(this, x, y, tile) || this;
        _this.nextAction = new WaitAction_1.WaitAction(_this);
        return _this;
    }
    Mob.prototype.takeTurn = function (world) {
        var actionList = [
            new WaitAction_1.WaitAction(this),
            new WalkAction_1.WalkAction(WalkAction_1.WalkDirection.Up, this),
            new WalkAction_1.WalkAction(WalkAction_1.WalkDirection.Down, this),
            new WalkAction_1.WalkAction(WalkAction_1.WalkDirection.Left, this),
            new WalkAction_1.WalkAction(WalkAction_1.WalkDirection.Right, this)
        ];
        var r = Math.floor(Math.random() * (actionList.length));
        actionList[r].perform(world);
        // actionList[0].perform();
    };
    return Mob;
}(Actor_1.Actor));
exports.Mob = Mob;

},{"../Components/Actions/WaitAction":2,"../Components/Actions/WalkAction":3,"./Actor":4}],7:[function(require,module,exports){
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
var Actor_1 = require("./Actor");
var WaitAction_1 = require("../Components/Actions/WaitAction");
var WalkAction_1 = require("../Components/Actions/WalkAction");
var Player = /** @class */ (function (_super) {
    __extends(Player, _super);
    function Player(x0, y0, tile) {
        var _this = _super.call(this, x0, y0, tile) || this;
        _this.nextAction = new WaitAction_1.WaitAction(_this);
        return _this;
    }
    Player.prototype.receiveKeyInput = function (key) {
        if (key == 'w') {
            this.nextAction = new WalkAction_1.WalkAction(WalkAction_1.WalkDirection.Up, this);
        }
        else if (key == 'a') {
            this.nextAction = new WalkAction_1.WalkAction(WalkAction_1.WalkDirection.Left, this);
        }
        else if (key == 's') {
            this.nextAction = new WalkAction_1.WalkAction(WalkAction_1.WalkDirection.Down, this);
        }
        else if (key == 'd') {
            this.nextAction = new WalkAction_1.WalkAction(WalkAction_1.WalkDirection.Right, this);
        }
        else {
            this.nextAction = new WaitAction_1.WaitAction(this);
        }
    };
    Player.prototype.takeTurn = function (world) {
        this.nextAction.perform(world);
    };
    return Player;
}(Actor_1.Actor));
exports.Player = Player;

},{"../Components/Actions/WaitAction":2,"../Components/Actions/WalkAction":3,"./Actor":4}],8:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var IO = /** @class */ (function () {
    function IO() {
    }
    IO.initKeyBindings = function () {
        document.addEventListener('keypress', function (event) {
            if (event.key == 'w') {
                console.log('w - up');
            }
            else if (event.key == 'a') {
                console.log('a - left');
            }
            else if (event.key == 's') {
                console.log('s - down');
            }
            else if (event.key == 'd') {
                console.log('d - right');
            }
            else {
                console.log('unknown keypress:', event.key);
            }
        });
    };
    IO.genericKeyBinding = function (func) {
        document.addEventListener('keypress', function (event) {
            func(event.key);
        });
    };
    return IO;
}());
exports.IO = IO;

},{}],9:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var world_1 = require("./world");
var renderer_1 = require("./renderer");
var tile_1 = require("./tile");
var io_1 = require("./io");
var Player_1 = require("./Entity/Player");
var Mob_1 = require("./Entity/Mob");
// TODO - load in a world config (parse a json file?) then pass it into the World constructor
var WORLD_HEIGHT = 50;
var WORLD_WIDTH = 50;
var world = new world_1.World(WORLD_WIDTH, WORLD_HEIGHT);
world.init();
var renderer = new renderer_1.Renderer();
renderer.init(world);
// add two test mobs to the world
var mob1 = new Mob_1.Mob(20, 6, new tile_1.Tile('F', 'blue', 'white'));
var mob2 = new Mob_1.Mob(6, 34, new tile_1.Tile('Q', 'blue', 'white'));
var mob3 = new Mob_1.Mob(20, 20, new tile_1.Tile('A', 'purple', 'white'));
world.addActor(mob1);
world.addActor(mob2);
world.addActor(mob3);
var player = new Player_1.Player(10, 10, new tile_1.Tile('@', 'red', 'white'));
world.addActor(player);
io_1.IO.genericKeyBinding(function (key) {
    //console.log(key);
    player.receiveKeyInput(key);
    renderer.renderLocalContexts(world.getActors());
    world.handleActorTurns();
    var actors = world.getActors();
    renderer.renderLocalContexts(actors);
    actors.forEach(function (actor) {
        renderer.updateGameObject(actor);
    });
});

},{"./Entity/Mob":6,"./Entity/Player":7,"./io":8,"./renderer":10,"./tile":11,"./world":12}],10:[function(require,module,exports){
"use strict";
exports.__esModule = true;
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
            this.updateTile(objs[n].x - 1, objs[n].y, this.world.getTile(objs[n].x - 1, objs[n].y));
            this.updateTile(objs[n].x + 1, objs[n].y, this.world.getTile(objs[n].x + 1, objs[n].y));
            this.updateTile(objs[n].x, objs[n].y - 1, this.world.getTile(objs[n].x, objs[n].y - 1));
            this.updateTile(objs[n].x, objs[n].y + 1, this.world.getTile(objs[n].x, objs[n].y + 1));
            // new Tile(this.world.getTile(i, j).ascii, this.world.getTile(i, j).fg, 'green')
            // Uncomment below to leave a green actor movement path: 
            // this.updateTile(objs[n].x - 1, objs[n].y, new Tile(this.world.getTile(objs[n].x - 1, objs[n].y).ascii, this.world.getTile(objs[n].x - 1, objs[n].y).fg, 'green'));
            // this.updateTile(objs[n].x + 1, objs[n].y, new Tile(this.world.getTile(objs[n].x + 1, objs[n].y).ascii, this.world.getTile(objs[n].x + 1, objs[n].y).fg, 'green'));
            // this.updateTile(objs[n].x, objs[n].y - 1, new Tile(this.world.getTile(objs[n].x, objs[n].y - 1).ascii, this.world.getTile(objs[n].x, objs[n].y - 1).fg, 'green'));
            // this.updateTile(objs[n].x, objs[n].y + 1, new Tile(this.world.getTile(objs[n].x, objs[n].y + 1).ascii, this.world.getTile(objs[n].x, objs[n].y + 1).fg, 'green'));
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
                element.innerHTML = world.getTileASCII(i, j);
                element.style.backgroundColor = world.getTileBg(i, j);
                element.style.color = world.getTileFg(i, j);
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

},{}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
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
        var horizontal = new tile_1.Tile('&#9552;', 'black', 'white');
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

},{"./tile":11}]},{},[9]);
