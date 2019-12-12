import { GameObject } from './GameObject';
import { Tile } from '../tile';
import { Actor } from './Actors/Actor';


export class Tree extends GameObject {
    constructor(x: number, y: number, tile: Tile) {
        super(x, y, tile);
        this.collides = true;
    }

    public static trees = [
        new Tile('Y', 'green', 'white')
    ];
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

    public static floors = [
            new Tile('&#8283;', 'black', 'white'), 
            new Tile('&#775;', 'black', 'white'), 
            new Tile('&#803;', 'black', 'white'), 
            new Tile('&#856;', 'black', 'white')
    ]
}

export class Wall extends GameObject {
    constructor(x: number, y: number, tile: Tile) {
        super(x, y, tile);
        this.collides = true;
    }

    public static botLeft = new Tile('&#9562;', 'black', 'white');
    public static botRight = new Tile('&#9565;', 'black', 'white');
    public static topLeft = new Tile('&#9556;', 'black', 'white');
    public static topRight = new Tile('&#9559;', 'black', 'white');
    // let horizontal = new Tile('&#9552;&#9552;', 'black', 'white');
    public static horizontal = new Tile('==', 'black', 'white');
    public static vertical = new Tile('&#9553;', 'black', 'white');

}