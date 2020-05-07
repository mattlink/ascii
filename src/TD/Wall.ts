import { GameObject } from "../GameObject";
import { Tile } from "../tile";

export class Wall extends GameObject {

    static tile = new Tile('W', 'brown', 'black');

    constructor(x: number, y: number) {
        super(x, y, Wall.tile);
    }
}