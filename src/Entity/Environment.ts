import { GameObject } from './GameObject';
import { Tile } from '../tile';

export class Tree extends GameObject {
    constructor(x: number, y: number, tile: Tile) {
        super(x, y, tile);
    }
}

export class Floor extends GameObject {
    constructor(x: number, y:number, tile: Tile) {
        super(x, y, tile);
    }
}

export class Wall extends GameObject {
    constructor(x: number, y: number, tile: Tile) {
        super(x, y, tile);
    }
}