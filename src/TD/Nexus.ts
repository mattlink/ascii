import { GameObject } from "../GameObject";
import { Tile } from "../tile";

// The Nexus GameObject is the thing that we are defending in this TD. When the nexus dies the game is over.

export class Nexus extends GameObject {

    private health: number = 100;

    constructor(x: number, y: number, tile: Tile) {
        super(x, y, tile);
    }

}