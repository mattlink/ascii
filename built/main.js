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
// let gameWorldWindow = new Window(0, 0, world.getHeight(), world.getWidth(), world.getTiles());
// renderer.addWindow(gameWorldWindow);
var player = new Player_1.Player(10, 10, new tile_1.Tile('@', 'red', 'white'));
world.addActor(player);
// add two test mobs to the world
var mob1 = new Mob_1.Mob("Mob1 (F)", 20, 6, new tile_1.Tile('F', 'blue', 'white'));
var mob2 = new Mob_1.Mob("Mob2 (O)", 6, 34, new tile_1.Tile('O', 'blue', 'white'));
var mob3 = new Mob_1.Mob("Mob3 (A)", 20, 20, new tile_1.Tile('A', 'purple', 'white'));
world.addActor(mob1);
world.addActor(mob2);
world.addActor(mob3);
/**
 *  __TODO__:
 * replace this with a more robust turn system, or a main game loop sort of thing
                                             */
io_1.IO.genericKeyBinding(function (key) {
    if (!io_1.IO.validControl(key))
        return;
    player.receiveKeyInput(key);
    world.handleActorTurns();
    var actors = world.getActors();
    renderer.renderLocalContexts(actors);
    actors.forEach(function (actor) {
        renderer.updateGameObject(actor);
    });
});
/* Testing the window system:
let winTiles: Tile[][] = [
    [new Tile('*', 'black', 'white'), new Tile('*', 'black', 'white'), new Tile('*', 'black', 'white'), new Tile('*', 'black', 'white'), new Tile('*', 'black', 'white')],
    [new Tile('*', 'black', 'white'), new Tile('*', 'black', 'white'), new Tile('*', 'black', 'white'), new Tile('*', 'black', 'white'), new Tile('*', 'black', 'white')],
    [new Tile('*', 'black', 'white'), new Tile('*', 'black', 'white'), new Tile('*', 'black', 'white'), new Tile('*', 'black', 'white'), new Tile('*', 'black', 'white')],
    [new Tile('*', 'black', 'white'), new Tile('*', 'black', 'white'), new Tile('*', 'black', 'white'), new Tile('*', 'black', 'white'), new Tile('*', 'black', 'white')],
    [new Tile('*', 'black', 'white'), new Tile('*', 'black', 'white'), new Tile('*', 'black', 'white'), new Tile('*', 'black', 'white'), new Tile('*', 'black', 'white')],
];

let testWin = new Window(0, 0, 5, 5, winTiles);
renderer.addWindow(testWin);
console.log(testWin);*/
