// Entity
export { GameObject } from './Entity/GameObject';
export { Door, DoorType } from './Entity/Door';
export { Tree, Floor, Wall } from './Entity/Environment';

// Actors
export { Actor } from './Entity/Actors/Actor';
export { Mob } from './Entity/Actors/Mob';
export { Player } from './Entity/Actors/Player';

// Actions
export { Action, Direction } from './Components/Actions/Action';
export { WaitAction } from './Components/Actions/WaitAction';
export { ChopAction } from './Components/Actions/ChopAction';
export { DoorAction } from './Components/Actions/DoorAction';
export { WalkAction } from './Components/Actions/WalkAction';


// Rooms
export { Room, Area } from './Entity/Rooms/Room';
/*consider leaving out of module*/export { Cave } from './Entity/Rooms/Cave';
/*consider leaving out of module*/export { Forest } from './Entity/Rooms/Forest';

export { BSPTree } from './util';

export { World } from './world';
export { Renderer } from './renderer';
export { Window } from './window';
export { Tile } from './tile';
export { IO } from './io';
export { Camera } from './camera'; // not officially supporting the Camera


export class Engine {


    public run() {
        console.log('ascii engine running!');
    }
}


export abstract class Game {

    abstract load(): void;
    abstract update(): void;
    abstract draw(): void;


}