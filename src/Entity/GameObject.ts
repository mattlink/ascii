import { Tile } from "../tile";


export class GameObject {
    public x: number;
    public y: number;
    private tile: Tile;

    constructor(x: number, y: number, tile: Tile) {
        this.x = x;
        this.y = y;
        this.tile = tile;
    }

    public getTile() {
        return this.tile;
    }
    
}