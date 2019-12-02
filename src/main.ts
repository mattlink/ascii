import { World } from './world';
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


// add two test mobs to the world
let mob1 = new Mob(20, 6, new Tile('F', 'blue', 'white'));
let mob2 = new Mob(6, 34, new Tile('Q', 'blue', 'white'));
let mob3 = new Mob(20, 20, new Tile('A', 'purple', 'white'));

world.addActor(mob1);
world.addActor(mob2);
world.addActor(mob3);


let player = new Player(10, 10, new Tile('@', 'red', 'white'));
world.addActor(player);



IO.genericKeyBinding(function(key: string) {
    //console.log(key);
    player.receiveKeyInput(key);

    renderer.renderLocalContexts(world.getActors());

    world.handleActorTurns();

    let actors = world.getActors();
    renderer.renderLocalContexts(actors);
    actors.forEach(actor => {
        renderer.updateGameObject(actor);
    });
    


});







