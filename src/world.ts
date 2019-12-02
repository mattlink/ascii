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
    public objects: GameObject[][];
    private actors: Actor[];

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.objects = [];
        this.actors = [];

    }

    handleActorTurns() {
        this.actors.forEach(actor => {
            actor.takeTurn(this);
        });
    }

    addActor(actor: Actor) {
        this.actors.push(actor);
        // this.objects[actor.x][actor.y] = actor;
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
        let floors = [
            new Tile('&#8283;', 'black', 'white'), 
            new Tile('&#775;', 'black', 'white'), 
            new Tile('&#803;', 'black', 'white'), 
            new Tile('&#856;', 'black', 'white')
        ];

        let trees = [
            new Tile('&#8483;', 'green', 'white')
        ];

        // SHIM:
        // let floorChars = ['&#8283;', '&#775;', '&#803;', '&#856;'];
        // let treeChars = ['&#8483;'];

        // set up wall tiles
        let botLeft = new Tile('&#9562;', 'black', 'white');
        let botRight = new Tile('&#9565;', 'black', 'white');
        let topLeft = new Tile('&#9556;', 'black', 'white');
        let topRight = new Tile('&#9559;', 'black', 'white');
        // let horizontal = new Tile('&#9552;&#9552;', 'black', 'white');
        let horizontal = new Tile('==', 'black', 'white');
        let vertical = new Tile('&#9553;', 'black', 'white');

        for (let i = 0; i < this.width; i++) {
            this.objects[i] = [];
            for (let j = 0; j < this.height; j++) {

                if (i == 0 && j == this.width - 1) { 
                    this.objects[i][j] = new Wall(i, j, botLeft);
                    continue; 
                }
                if (i == 0 && j == 0) { 
                    this.objects[i][j] = new Wall(i, j, topLeft);
                    continue; 
                }
                

                if (i == this.height - 1 && j == this.width - 1) { 
                    this.objects[i][j] = new Wall(i, j, botRight); 
                    continue; 
                }
                if (i == this.height - 1 && j == 0) { 
                    this.objects[i][j] = new Wall(i, j, topRight);
                    continue; 
                }
                if (i == 0 || i == this.height - 1) { 
                    this.objects[i][j] = new Wall(i, j, vertical); 
                    continue; 
                }

                if (j == 0 || j == this.width - 1) { 
                    this.objects[i][j] = new Wall(i, j, horizontal);
                    continue; 
                }

                let rand = Math.floor(Math.random() * 10);
                if (rand > 6) {
                    this.objects[i][j] = new Tree(i, j, trees[0]);
                } else {
                    this.objects[i][j] = new Floor(i, j, floors[Math.floor(Math.random() * 4)]);
                }
                
            }
        }
    }

    getObject(x: number, y:number) {
        return this.objects[x][y];
    }
}