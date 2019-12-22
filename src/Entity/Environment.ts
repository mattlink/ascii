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

    public static caveFloor = [
            new Tile('&#8283;', '#995e06', 'black'), // 4 dots
            new Tile('&#775;', '#995e06', 'black'), // single dot
            new Tile('&#803;', '#995e06', 'black'), // space (we want more spaces)
            // new Tile('&#803;', '#995e06', 'black'), 
            // new Tile('&#803;', '#995e06', 'black'), 
            new Tile('&#856;', '#995e06', 'black') // other single dot
    ]
}

export class Wall extends GameObject {

    constructor(x: number, y: number, tile: Tile) {
        super(x, y, tile);
        this.collides = true;
    }

    /* BIG TODO:
        Walls should be able to contain "doors" that let you travel from room to room....
    */ 

    static wallFg = 'black';
    static wallBg = 'white';
    
    // static botLeft = new Tile('&#9562;', Wall.wallFg, Wall.wallBg);
    static botLeft = new Tile('&#9492;', Wall.wallFg, Wall.wallBg);
    // static botRight = new Tile('&#9565;', Wall.wallFg, Wall.wallBg);
    static botRight = new Tile('&#9496;', Wall.wallFg, Wall.wallBg);

    // static topLeft = new Tile('&#9556;', Wall.wallFg, Wall.wallBg);
    static topLeft = new Tile('&#9484;', Wall.wallFg, Wall.wallBg);

    // static topRight = new Tile('&#9559;', Wall.wallFg, Wall.wallBg);
    static topRight = new Tile('&#9488;', Wall.wallFg, Wall.wallBg);

    // let horizontal = new Tile('&#9552;&#9552;', 'black', 'white');
    // static horizontal = new Tile('==', Wall.wallFg, Wall.wallBg);
    // static vertical = new Tile('&#9553;', Wall.wallFg, Wall.wallBg);
    static vertical = new Tile('&#9474;', Wall.wallFg, Wall.wallBg);
    static horizontal = new Tile('&#9472;&#9472;', Wall.wallFg, Wall.wallBg);

}