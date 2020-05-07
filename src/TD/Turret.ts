import { GameObject } from "../GameObject";
import { Tile } from "../tile";

export class Turret extends GameObject {

    static tile = new Tile('T', 'yellow', 'black');

    constructor(x: number, y: number) {
        super(x, y, Turret.tile);
    }
}