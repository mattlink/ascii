import { GameObject } from '../GameObject';
import { Tile } from '../../tile';
import { Actor } from '../Actors/Actor';
import { World } from '../../world';
import { Door, DoorType } from '../Door';
import { Wall, Floor, Tree } from '../Environment';
import { BSPTree } from '../../util';

// An instance of Area represents some area of a Room, usually walled off
// Generally we apply our proc gen algorithms to Areas rather than direction to Rooms
export class Area {
    public x: number;
    public y: number;
    public height: number;
    public width: number;

    constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height; 
    }
}

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

    public defaultFogBg = '#e9ecef'; // a sort of gray color
    public defaultFogFg = 'black'; 

    public defaultBgColor = 'black';
    public defaultFgColor = 'white'; 
    public floorTile = new Tile('.', this.defaultFgColor, this.defaultBgColor);
    public wallTile = new Tile('#', this.defaultFgColor, this.defaultBgColor);

    constructor(width: number, height: number, name: string) {
        this.width = width;
        this.height = height;
        this.objects = [];
        this.actors = [];
        this.name = name;

        // initialize all objects in room to empty game objects
        for (let i = 0; i < this.getWidth(); i++) {
            this.objects[i] = [];
            for (let j = 0; j < this.getHeight(); j++) {
                this.objects[i][j] = new GameObject(i, j, new Tile(' ', 'black', 'black'));
            }
        }
    }

    /* The init method is what defines how a type of room will get generated. */
    abstract init(): void;

    // abstract placeDoor(toRoom: Room, type: DoorType, x?: number, y?: number): void;
    placeDoor(toRoom: Room, type: DoorType, x1?: number, y1?: number) {
        switch (type) {

            case DoorType.TrapDoor: {
                let x = Math.floor(Math.random() * this.getWidth());
                let y = Math.floor(Math.random() * this.getHeight());

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
        for (let i = 0; i < this.width; i++) {
            tiles[i] = [];
            for (let j = 0; j < this.height; j++) {
                tiles[i][j] = this.getObject(i, j).getTile();
            }
        }
        return tiles;
    }

    /********
     *  Various algorithms and room generation helpers 
     */

    generateCA(iterations: number, area: Area) {
        // Assume that we get an initially randomized area, instead of a totally plain one

        if (iterations == 0) return;

        let newObjects = [];
        for (let i = area.x+1; i < area.width+area.x-1; i++) {
            newObjects[i] = [];
        }

        for (let i = area.x+1; i < area.width+area.x-1; i++) {
           for (let j = area.y+1; j < area.height+area.y-1; j++) {
            if (this.getNeighboringWalls(i, j) > 4 && (this.objects[i][j] instanceof Wall || this.objects[i][j] instanceof Tree)
                || this.getNeighboringWalls(i, j) > 5 && !(this.objects[i][j] instanceof Wall || this.objects[i][j] instanceof Tree)) {
                 
                newObjects[i][j] = new Wall(i, j, this.wallTile);//new Tile('#', CaveEnv.caveBrown, CaveEnv.roomBg));
            }
            else {
                newObjects[i][j] = new Floor(i, j, this.floorTile);//new Tile('-', CaveEnv.caveBrown, CaveEnv.roomBg));
            }
           }
        } 

        // redraw the new objects
        for (let i = area.x+1; i < area.width+area.x-1; i++) {
            for (let j = area.y+1; j < area.height+area.y-1; j++) {
                this.objects[i][j] = newObjects[i][j];
            }
        }


       iterations--;

       this.generateCA(iterations, area);

    }

    getNeighboringWalls(x: number, y: number) {
        let wallCount = 0;
        for (let i = x - 1; i <= x + 1; i++) {
            for (let j = y - 1; j <= y + 1; j++) {
                if (this.objects[i][j] instanceof Wall) {
                    wallCount++;
                }
            }
        }
        return wallCount;
    }

    generateSymmetricBSPTreeVertical(iterationsLeft: number, tree: BSPTree<Area>) {
        if (iterationsLeft == 0) return;

        let baseArea = tree.value;

        let x_offset = 0;
        let y_offset = 0;

        let leftWidth = baseArea.width;
        let leftHeight = baseArea.height;

        let rightWidth = baseArea.width;
        let rightHeight = baseArea.height;

        // do the vertical split
        x_offset = Math.floor(baseArea.width / 2);
        leftWidth = x_offset;
        rightWidth = baseArea.width - x_offset;

        tree.left = new BSPTree<Area>(null, null, new Area(baseArea.x, baseArea.y, leftWidth, leftHeight));
        tree.right = new BSPTree<Area>(null, null, new Area(baseArea.x + x_offset, baseArea.y + y_offset, rightWidth, rightHeight));

        iterationsLeft--;

        this.generateSymmetricBSPTreeHorizontal(iterationsLeft, tree.left);
        this.generateSymmetricBSPTreeHorizontal(iterationsLeft, tree.right);

    }

    generateSymmetricBSPTreeHorizontal(iterationsLeft: number, tree: BSPTree<Area>) {
        if (iterationsLeft == 0) return;

        let baseArea = tree.value;

        let x_offset = 0;
        let y_offset = 0;

        let leftWidth = baseArea.width;
        let leftHeight = baseArea.height;

        let rightWidth = baseArea.width;
        let rightHeight = baseArea.height;

        // do the horizontal split
        y_offset = Math.floor(baseArea.height / 2);
        leftHeight = y_offset;
        rightHeight = baseArea.height - y_offset;

        tree.left = new BSPTree<Area>(null, null, new Area(baseArea.x, baseArea.y, leftWidth, leftHeight));
        tree.right = new BSPTree<Area>(null, null, new Area(baseArea.x + x_offset, baseArea.y + y_offset, rightWidth, rightHeight)); 

        iterationsLeft--;

        this.generateSymmetricBSPTreeVertical(iterationsLeft, tree.left);
        this.generateSymmetricBSPTreeVertical(iterationsLeft, tree.right);
    }

    generateBSPTree(iterationsLeft: number, tree: BSPTree<Area>) {
        if (iterationsLeft == 0) return;

        let baseArea = tree.value;

        let dir = Math.floor(Math.random() * 2);

        let x_offset = 0;
        let y_offset = 0;

        let leftWidth = baseArea.width;
        let leftHeight = baseArea.height;

        let rightWidth = baseArea.width;
        let rightHeight = baseArea.height;

        if (dir == 0) { // vertical split
            //x_offset = Math.max(Math.floor(Math.random() * (baseArea.width / 2)), Math.floor(Math.random() * (baseArea.width)));
            x_offset = Math.floor(baseArea.width / 2);
            console.log("Vertical split w x_offset:", x_offset);
            leftWidth = x_offset;
            rightWidth = baseArea.width - x_offset;
        }
        if (dir == 1){ // horizontal split
            // y_offset = Math.max(Math.floor(Math.random() * (baseArea.height / 2)), Math.floor(Math.random() * (baseArea.height)));
            y_offset = Math.floor(baseArea.height / 2);
            console.log("Horizontal split w y_offset", y_offset);
            leftHeight = y_offset;
            rightHeight = baseArea.height - y_offset;
        } 


        tree.left = new BSPTree<Area>(null, null, new Area(baseArea.x, baseArea.y, leftWidth, leftHeight));
        tree.right = new BSPTree<Area>(null, null, new Area(baseArea.x + x_offset, baseArea.y + y_offset, rightWidth, rightHeight));

        iterationsLeft--;

        this.generateBSPTree(iterationsLeft, tree.left);
        this.generateBSPTree(iterationsLeft, tree.right);

    }

    applyCAtoBSPLeaves(tree: BSPTree<Area>, iterations: number) {
        if (tree.left == null && tree.right == null) {
            this.generateCA(iterations, tree.value);
        }

        if (tree.left != null) {
            this.applyCAtoBSPLeaves(tree.left, iterations);
        }

        if (tree.right != null) {
            this.applyCAtoBSPLeaves(tree.right, iterations);
        }
    }

    /**
     * Method for recursively drawing all Area leaves in a BSPTree
     */
    initAreas(tree: BSPTree<Area>, random?: boolean) {
        if (tree.left == null && tree.right == null) {
        // draw this area
        this.initArea(tree.value, random);
        }

        if (tree.left != null) {
            this.initAreas(tree.left, random);
        }
        if (tree.right != null) {
            this.initAreas(tree.right, random);
        }
    }

    // Draws an area with wall around it, TODO: more sophisticated area drawing (subarea drawing, etc)
    initArea(area: Area, random?: boolean) {

        let x = area.x;
        let y = area.y;
        let l = area.width;//area.width - 1;
        let h = area.height;//area.height - 1;


        for (let i = x; i < x+l; i++) {
            for (let j = y; j < y+h; j++) {
                if (i == x && j == (y+h) - 1) {
                    // this.objects[i][j] = new Wall(i, j, new Tile(Wall.botLeft.ascii, CaveEnv.caveBrown, CaveEnv.roomBg));
                    this.objects[i][j] = new Wall(i, j, this.wallTile); 
                    continue;
                }

                if (i == x && j == y) {
                    // this.objects[i][j] = new Wall(i, j, new Tile(Wall.topLeft.ascii, CaveEnv.caveBrown, CaveEnv.roomBg));
                    this.objects[i][j] = new Wall(i, j, this.wallTile);
                    continue;
                }

                if (i == (x+l) - 1 && j == (y+h) - 1) {
                    // this.objects[i][j] = new Wall(i, j, new Tile(Wall.botRight.ascii, CaveEnv.caveBrown, CaveEnv.roomBg));
                    this.objects[i][j] = new Wall(i, j, this.wallTile)
                    continue;
                }

                if (i == (x+l) - 1 && j == y) {
                    // this.objects[i][j] = new Wall(i, j, new Tile(Wall.topRight.ascii, CaveEnv.caveBrown, CaveEnv.roomBg));
                    this.objects[i][j] = new Wall(i, j, this.wallTile)
                    continue;
                }

                if (i == x || i == (x+l) - 1) {
                    // this.objects[i][j] = new Wall(i, j, new Tile(Wall.vertical.ascii, CaveEnv.caveBrown, CaveEnv.roomBg));
                    this.objects[i][j] = new Wall(i, j, this.wallTile)
                    continue;
                }

                if (j == y || j == (y+h) - 1) {
                    // this.objects[i][j] = new Wall(i, j, new Tile(Wall.horizontal.ascii, CaveEnv.caveBrown, CaveEnv.roomBg));
                    this.objects[i][j] = new Wall(i, j, this.wallTile)
                    continue;
                }


                if (random) {
                    let r = Math.floor(Math.random() * 2);
                    if (r == 0) this.objects[i][j] = new Floor(i, j, this.floorTile);//new Floor(i, j, new Tile('-', CaveEnv.caveBrown, CaveEnv.roomBg));
                    else if (r == 1) this.objects[i][j] = new Wall(i, j, this.wallTile);//new Tile('#', CaveEnv.caveBrown, CaveEnv.roomBg));
                }
                else {
                    // Otherwise, place a Floor object tile
                    this.objects[i][j] = new Floor(i, j, this.floorTile);//new Tile('-', CaveEnv.caveBrown, CaveEnv.roomBg));
                }

            }
        }

    }
}
