import { GameObject } from '../GameObject';
import { Tile } from '../../tile';
import { Actor } from '../Actors/Actor';

export abstract class Room {
    private width: number;
    private height: number;

    private actors: Actor[];
    public objects: GameObject[][];

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.objects = [];
        this.actors = [];
    }
    
    // NOTE: leave turn handling code out of the Room class (?)


    /* The init method is what defines how a type of room will get generated. */
    abstract init(): void;


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

    getObject(x: number, y: number) {
        return this.objects[x][y];
    }
    
    getHeight() {
        return this.height;
    }

    getWidth() {
        return this.width;
    }

    getTiles() {
        let tiles: Tile[][] = [];
        for (let i = 0; i < this.height; i++) {
            tiles[i] = [];
            for (let j = 0; j < this.width; j++) {
                tiles[i][j] = this.getObject(i, j).getTile();
            }
        }
        return tiles;
    }
}