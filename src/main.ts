import { World } from './world';
import { Window } from './window';
import { Renderer } from './renderer';
import { Tile } from './tile';
import { IO } from './io';

import { Player } from './Entity/Player';
import { Mob } from './Entity/Mob';


// TODO - load in a world config (parse a json file?) then pass it into the World constructor
const WORLD_HEIGHT = 50;
const WORLD_WIDTH = 50;

let world = new World(WORLD_WIDTH, WORLD_HEIGHT);
world.init();

let renderer = new Renderer();
renderer.init(world);

// let gameWorldWindow = new Window(0, 0, world.getHeight(), world.getWidth(), world.getTiles());
// renderer.addWindow(gameWorldWindow);

let player = new Player(10, 10, new Tile('@', 'red', 'white'));
world.addActor(player);

// add two test mobs to the world
let mob1 = new Mob("Mob1 (F)", 20, 6, new Tile('F', 'blue', 'white'));
let mob2 = new Mob("Mob2 (O)", 6, 34, new Tile('O', 'blue', 'white'));
let mob3 = new Mob("Mob3 (A)", 20, 20, new Tile('A', 'purple', 'white'));

world.addActor(mob1);
world.addActor(mob2);
world.addActor(mob3);


/** 
 *  __TODO__: 
 * replace this with a more robust turn system, or a main game loop sort of thing  
                                             */

IO.genericKeyBinding(function(key: string) {
    
    if (!IO.validControl(key)) return;

    player.receiveKeyInput(key);

    world.handleActorTurns();

    let actors = world.getActors();
    renderer.renderLocalContexts(actors);
    actors.forEach(actor => {
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




