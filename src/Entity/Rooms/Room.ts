import { GameObject } from '../GameObject';
import { Tile } from '../../tile';
import { Actor } from '../Actors/Actor';
import { World } from '../../world';
import { Door, DoorType } from '../Door';
import { Wall, Floor } from '../Environment';

export abstract class Room {

    public name: string;

    private width: number;
    private height: number;

    private actors: Actor[];
    public objects: GameObject[][];

    public northDoor: Door = null;
    public southDoor: Door = null;
    public westDoor: Door = null;
    public eastDoor: Door = null;

    private wallDoorTile: Tile = new Tile('*', 'orange', 'black');
    private trapDoorTile: Tile = new Tile('#', 'orange', 'black');
    private ladderDoorTile: Tile = new Tile('\\', 'orange', 'black');

    constructor(width: number, height: number, name: string) {
        this.width = width;
        this.height = height;
        this.objects = [];
        this.actors = [];
        this.name = name;
    }

    /* The init method is what defines how a type of room will get generated. */
    abstract init(): void;

    // abstract placeDoor(toRoom: Room, type: DoorType, x?: number, y?: number): void;
    placeDoor(toRoom: Room, type: DoorType, x1?: number, y1?: number) {
        switch (type) {

            case DoorType.TrapDoor: {
                let y = Math.floor(Math.random() * this.getWidth());
                let x = Math.floor(Math.random() * this.getHeight());

                this.objects[x][y] = new Door(x, y, this.trapDoorTile, toRoom);

                return { x, y };
                // toRoom.placeDoor(this, DoorType.LadderDoor, x, y);
                break;
            }

            case DoorType.LadderDoor: {
                // let y = Math.floor(Math.random() * this.getHeight() - 1) + 1;
                // let x = Math.floor(Math.random() * this.getWidth() - 1) + 1;
                this.objects[x1 + 1][y1 + 1] = new Door(x1+1, y1+1, this.ladderDoorTile, toRoom);
                return { x1, y1 };
                break;
                // console.error('LadderDoor requires you to manually set the x and y of the door');
                // break;
            }

            case DoorType.NorthDoor: {
                let y = 0;
                let x = Math.floor(this.getWidth() / 2);
                console.log('Placing NorthDoor: ', x, y);
                this.objects[x][y] = new Door(x, y, this.wallDoorTile, toRoom);
                return { x, y };
                // toRoom.placeDoor(this, DoorType.SouthDoor);
                break;
            }

            case DoorType.SouthDoor: {
                let y = this.getHeight() - 1;
                let x = Math.floor(this.getWidth() / 2);
                this.objects[x][y] = new Door(x, y, this.wallDoorTile, toRoom);
                return { x, y };
                // toRoom.placeDoor(this, DoorType.NorthDoor);
                break;
            }

            case DoorType.EastDoor: {
                let y = this.getHeight() / 2;
                let x = 0;
                this.objects[x][y] = new Door(x, y, this.wallDoorTile, toRoom);
                return { x, y };
                // toRoom.placeDoor(this, DoorType.WestDoor);
                break;
            }

            case DoorType.WestDoor: {
                let y = this.getHeight() / 2;
                let x = this.getWidth() - 1;
                this.objects[x][y] = new Door(x, y, this.wallDoorTile, toRoom);
                return { x, y };
                // toRoom.placeDoor(this, DoorType.EastDoor);
                break;
            }

            default: {
                console.log("DoorType:", type, " not supported by ", this.name);
                break;
            }
        }
    }



    // placeDoor(toRoom: Room) {
    //     console.log("call to placeDoor()");
    //     // this.doors.push(door);
    //     // get the walls and choose a random wall (or floor?) to place it
    //     // choose a random location to place it
    //     // let rx = Math.floor(Math.random() * this.getHeight());
    //     // let ry = Math.floor(Math.random() * this.getWidth());

    //     // this.objects[rx][ry] = new Door(rx, ry, new Tile('%', 'red', 'green'), toRoom);
    //     // toRoom.objects[rx][ry] = new Door(rx, ry, new Tile('%', 'red', 'green'), this);
        

    // }

    handleActorTurns(world: World) {
        this.actors.forEach(actor => {
            actor.takeTurn(world);
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