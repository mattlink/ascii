import { GameObject } from './GameObject';
import { Tile } from '../tile';
import { Actor } from './Actor';


export class Tree extends GameObject {
    constructor(x: number, y: number, tile: Tile) {
        super(x, y, tile);
        this.collides = true;
    }
}

export class Floor extends GameObject {
    private occupiedBy: Actor = null;

    constructor(x: number, y:number, tile: Tile) {
        super(x, y, tile);
        this.collides = false;
    }

    setOccupation(actor: Actor) {
        this.occupiedBy = actor;
        this.collides = true;
    }

    removeOccupation() {
        this.occupiedBy = null;
        this.collides = false;
    }
}

export class Wall extends GameObject {
    constructor(x: number, y: number, tile: Tile) {
        super(x, y, tile);
        this.collides = true;
    }
}