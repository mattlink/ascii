import { GameObject } from "../GameObject";
import { Mob } from '../Actors/Mob';
import { Tile } from "../tile";

// The Nexus GameObject is the thing that we are defending in this TD. When the nexus dies the game is over.

export class Nexus extends GameObject {

    public health: number = 100;

    constructor(x: number, y: number, tile: Tile) {
        super(x, y, tile);
        this.name = 'Nexus';
    }
}
