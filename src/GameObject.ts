import { Tile } from "./tile";

export class GameObject {

    public name: string = "Default GameObject Name";

    public x: number;
    public y: number;
    public tile: Tile;

    public collides: boolean = false;
    public destructible: boolean = false;

    constructor(x: number, y: number, tile: Tile) {
        this.x = x;
        this.y = y;
        this.tile = tile;
    }

    public getTile() {
        return this.tile;
    }

    public key()  {
        return this.x + ' ' + this.y;
    }
}
