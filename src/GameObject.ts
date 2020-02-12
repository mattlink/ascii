import { Tile } from "./tile";

export class GameObject {
    public x: number;
    public y: number;
    private tile: Tile;

    public collides: boolean;

    constructor(x: number, y: number, tile: Tile) {
        this.x = x;
        this.y = y;
        this.tile = tile;

        this.collides = false;
    }

    public getTile() {
        return this.tile;
    }
    
}