import { Room } from "./Rooms/Room";
import { Player } from "./Actors/Player";
import { Tile } from "../tile";
import { GameObject } from "./GameObject";

export enum DoorType {
    NorthDoor,
    SouthDoor,
    WestDoor,
    EastDoor,

    TrapDoor,
    LadderDoor
}

export class Door extends GameObject {
    
    // If internal, toRoom will be null
    // An "internal" door is a door which opens to a sub-room structure within an actual Room instance
    toRoom: Room;

    constructor(x: number, y: number, tile: Tile, toRoom: Room) {
        super(x, y, tile);
        this.toRoom = toRoom;
    }

}