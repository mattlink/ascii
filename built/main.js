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
