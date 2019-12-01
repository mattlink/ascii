/* This is sort of kind of a world "system" 

Notes about what this World class could or should be:

- keep things related to generating the initial world state (?)
- leave propagation of the simulation to another system
- in theory, if users are to specify custom "factors" into the way their world is generated, 
    then those factors would be tweaked here... (maybe?)
    - but, maybe this would be better left for a "Generator" class
        - it could generate types of rooms/dungeons?

*/

//import { ASCII } from './ascii';
import { GameObject } from './Entity/GameObject';
import { Tree, Wall, Floor } from './Entity/Environment';
import { Tile } from './tile';
import { Mob } from './Entity/Mob';
import { Actor } from './Entity/Actor';

export class World {
    private width: number;
    private height: number;
    private tiles: Tile[][];
    // private mobs: Mob[];
    private actors: Actor[];

    // private tree: Tile = new Tile('&#2510;', 'green', 'white');

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.tiles = [];
        // this.mobs = [];
        this.actors = [];

    }

    handleActorTurns() {
        this.actors.forEach(actor => {
            actor.takeTurn(this);
        });
    }

    addActor(actor: Actor) {
        this.actors.push(actor);
    }

    getActors() {
        return this.actors;
    }


    getHeight() {
        return this.height;
    }
    getWidth() {
        return this.width;
    }

    // init generates the initial world state
    init() {              // 4 part,  2 part, blank,     single raised
        let floorChars = ['&#8283;', '&#775;', '&#803;', '&#856;'];
        let treeChars = ['&#8483;'];
        //let chars: any[] = ['&#856;'];//'&#8283;'];//, '&#8483;', '&#775;', '&#803;', '&#856;'];

        // set up wall tiles
        let botLeft = new Tile('&#9562;', 'black', 'white');
        let botRight = new Tile('&#9565;', 'black', 'white');
        let topLeft = new Tile('&#9556;', 'black', 'white');
        let topRight = new Tile('&#9559;', 'black', 'white');
        let horizontal = new Tile('&#9552;', 'black', 'white');
        let vertical = new Tile('&#9553;', 'black', 'white');

        for (let i = 0; i < this.height; i++) {
            this.tiles[i] = [];
            for (let j = 0; j < this.width; j++) {

                if (i == 0 && j == this.width - 1) { this.tiles[i][j] = topRight; continue; }
                if (i == 0 && j == 0) { this.tiles[i][j] = topLeft; continue; }
                if (i == 0) { this.tiles[i][j] = horizontal; continue; }

                if (i == this.height - 1 && j == this.width - 1) { this.tiles[i][j] = botRight; continue; }
                if (i == this.height - 1 && j == 0) { this.tiles[i][j] = botLeft; continue; }
                if (i == this.height - 1) { this.tiles[i][j] = horizontal; continue; }

                if (j == 0 || j == this.width - 1) { this.tiles[i][j] = vertical; continue; }

                let rand = Math.floor(Math.random() * 10);
                if (rand > 6) {
                    this.tiles[i][j] = new Tile(treeChars[0], 'green', 'white');
                } else {
                    this.tiles[i][j] = new Tile(floorChars[Math.floor(Math.random() * 4)], 'black', 'white');
                }
                
            }
        }

        



    }

    getTile(x: number, y: number) {
        return this.tiles[y][x];
    }
    getTileASCII(x: number, y: number): string {
        return this.tiles[x][y].ascii;
    }
    getTileBg(x: number, y: number): string {
        return this.tiles[x][y].bg;
    }
    getTileFg(x: number, y: number): string {
        return this.tiles[x][y].fg;
    }
}