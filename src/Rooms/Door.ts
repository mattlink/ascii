import { Room } from "./Room";
import { Tile } from "../tile";
import { GameObject } from "../GameObject";

export enum DoorType {
    NorthDoor,
    SouthDoor,
    EastDoor,
    WestDoor,

    TrapDoor,
    LadderDoor
}

export class Door extends GameObject {
    
    // If internal, toRoom will be null
    // An "internal" door is a door which opens to a sub-room structure within an actual Room instance
    toRoom: Room;
    
    public type: DoorType;

    constructor(type: DoorType, x: number, y: number, tile: Tile, toRoom: Room) {
        super(x, y, tile);
        this.toRoom = toRoom;
        this.type = type;
        this.name = 'Door';
    }

}