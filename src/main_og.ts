import { World } from './world';
import { Window } from './Systems/window';
import { Renderer } from './Systems/renderer';
import { Tile } from './tile';
import { IO } from './Systems/io';

import { Player } from './Actors/Player';
import { Mob } from './Actors/Mob';
import { Cave } from './Rooms/Cave';
import { Forest } from './Rooms/Forest';
import { DoorType, Door } from './Rooms/Door';
import { Camera } from './Systems/camera';

// TODO - load in a world config (parse a json file?) then pass it into the World constructor

let world = new World();

const FOREST_HEIGHT = 60;
const FOREST_WIDTH = 100;

let forest = new Forest(FOREST_WIDTH / 2, FOREST_HEIGHT / 2, 'Forest');
forest.init();

let cave = new Cave(FOREST_WIDTH / 2, FOREST_HEIGHT / 2, 'Cave');
cave.init();
cave.addActor(new Mob("Cave Mob 1", 10, 10, new Tile('O', 'white', 'purple')));
cave.addActor(new Mob("Cave Mob 2", 10, 10, new Tile('A', 'white', 'red')));

// let cave2 = new Cave(FOREST_WIDTH / 2, FOREST_HEIGHT / 2, 'Cave 2');
// cave2.init();
// cave2.addActor(new Mob('Cave2 Mob 1', 12, 12, new Tile('A', 'white', 'red')));
// cave2.addActor(new Mob('Cave2 Mob 2', 12, 20, new Tile('A', 'white', 'red')));


// Add our forest to the world
world.addRoom(forest); 
world.addRoom(cave);
// world.addRoom(cave2);


// Add doors to rooms
let { x, y } = forest.placeDoor(cave, DoorType.TrapDoor); // Place a TrapDoor from the forest to the cave
//console.log(x, y);
cave.placeDoor(forest, DoorType.LadderDoor, x, y);



// Add our player to the active room
let player = new Player(10, 10, new Tile('@', 'red', 'white'));
world.getActiveRoom().addActor(player);

// Add some test mobs to the forest
let mob1 = new Mob("Mob1 (F)", 20, 6, new Tile('F', 'blue', 'white'));
let mob2 = new Mob("Mob2 (O)", 6, 14, new Tile('O', 'blue', 'white'));
let mob3 = new Mob("Mob3 (A)", 20, 20, new Tile('A', 'purple', 'white'));
let mob4 = new Mob("Mob4 (P)", 6, 20, new Tile('P', 'yellow', 'white'));

forest.addActor(mob1);
forest.addActor(mob2);
forest.addActor(mob3);
forest.addActor(mob4);

let viewWidth = FOREST_WIDTH / 4;
let viewHeight = FOREST_HEIGHT / 4;
let camera = new Camera(world.getActiveRoom(), viewWidth, viewHeight, player.x, player.y);

let renderer = new Renderer();

let gameWindow = new Window(-1, -1, world.getActiveRoom().getWidth(), world.getActiveRoom().getHeight(), world.getActiveRoom().getTiles());
// let gameWindow = new Window(-1, -1, viewWidth, viewHeight, camera.getTilesInView());
renderer.addWindow(gameWindow);

// renderer.renderRoom(world.getActiveRoom(), gameWindow.getContext());


/** 
 *  __TODO__: 
 * replace this with a more robust turn system, or a main game loop sort of thing  
                                             */
IO.genericKeyBinding(function(key: string) {
    
    if (!IO.validControl(key)) return;

    player.receiveKeyInput(key);

    world.takeTurn();

    // Check if we should be rendering a new room
    if (world.getActiveRoomChanged()) {
        // renderer.renderRoom(world.getActiveRoom(), gameWindow.getContext());

        camera.switchTargetRoom(world.getActiveRoom());
        renderer.renderView(camera, gameWindow);
        // renderer.renderViewOblong(camera, gameWindow);
    }

    // Make sure the camera is centered on our player
    camera.reCenter(player.x, player.y);
    renderer.renderView(camera, gameWindow);
    // renderer.renderViewOblong(camera, gameWindow);
    // renderer.updateCameraView(camera, gameWindow); // Theoretically more efficient view update function

    // Grab all the actors in the active room
    let actors = world.getActiveRoom().getActors();

    // Render each actor
    actors.forEach(actor => {
        if(camera.actorInView(actor.x, actor.y)) {
            // Render the actual actor
            renderer.updateGameObject(actor, gameWindow.getContext());
            // Render everything /around/ this actor
            renderer.renderObjectContext(actor, world.getActiveRoom(), gameWindow.getContext());
        }
        // renderer.updateCameraView(camera, gameWindow.getContext());
    });


});

// // Testing the window system by creating a new window:
// let winTiles: Tile[][] = [
//     [new Tile('*', 'black', 'white'), new Tile('*', 'black', 'white'), new Tile('*', 'black', 'white'), new Tile('*', 'black', 'white'), new Tile('*', 'black', 'white')],
//     [new Tile('*', 'black', 'white'), new Tile('*', 'black', 'white'), new Tile('*', 'black', 'white'), new Tile('*', 'black', 'white'), new Tile('*', 'black', 'white')],
//     [new Tile('*', 'black', 'white'), new Tile('*', 'black', 'white'), new Tile('*', 'black', 'white'), new Tile('*', 'black', 'white'), new Tile('*', 'black', 'white')],
//     [new Tile('*', 'black', 'white'), new Tile('*', 'black', 'white'), new Tile('*', 'black', 'white'), new Tile('*', 'black', 'white'), new Tile('*', 'black', 'white')],
//     [new Tile('*', 'black', 'white'), new Tile('*', 'black', 'white'), new Tile('*', 'black', 'white'), new Tile('*', 'black', 'white'), new Tile('*', 'black', 'white')],
//     [new Tile('*', 'black', 'white'), new Tile('*', 'black', 'white'), new Tile('*', 'black', 'white'), new Tile('*', 'black', 'white'), new Tile('*', 'black', 'white')],
//     [new Tile('*', 'black', 'white'), new Tile('*', 'black', 'white'), new Tile('*', 'black', 'white'), new Tile('*', 'black', 'white'), new Tile('*', 'black', 'white')],
//     [new Tile('*', 'black', 'white'), new Tile('*', 'black', 'white'), new Tile('*', 'black', 'white'), new Tile('*', 'black', 'white'), new Tile('*', 'black', 'white')],
// ];

// let testWin = new Window(50, 800, 5, 5, winTiles);
// renderer.addWindow(testWin);



