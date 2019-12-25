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

    public static forestTiles = [
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

    /* BIG TODO:
        Walls should be able to contain "doors" that let you travel from room to room....
    */ 

    static wallFg = 'black';
    static wallBg = 'white';

   // static basicTile = new Tile('#', Wall.wallFg, Wall.wallBg);
    
    // static botLeft = new Tile('&#9562;', Wall.wallFg, Wall.wallBg);
    static botLeft = new Tile('&#9492;', Wall.wallFg, Wall.wallBg);
    // static botLeft = Wall.basicTile; 

    // static botRight = new Tile('&#9565;', Wall.wallFg, Wall.wallBg);
    static botRight = new Tile('&#9496;', Wall.wallFg, Wall.wallBg);
    // static botRight = Wall.basicTile;

    // static topLeft = new Tile('&#9556;', Wall.wallFg, Wall.wallBg);
    static topLeft = new Tile('&#9484;', Wall.wallFg, Wall.wallBg);
    // static topLeft = Wall.basicTile;

    // static topRight = new Tile('&#9559;', Wall.wallFg, Wall.wallBg);
    static topRight = new Tile('&#9488;', Wall.wallFg, Wall.wallBg);
    // static topRight = Wall.basicTile;

    static vertical = new Tile('&#9474;', Wall.wallFg, Wall.wallBg);
    static horizontal = new Tile('&#9472;&#9472;', Wall.wallFg, Wall.wallBg);
    // static vertical = Wall.basicTile;
    // static horizontal = Wall.basicTile;

}