import { GameObject } from '../GameObject';
import { Tile } from '../tile';
import { Actor } from '../Actors/Actor';
import { World } from '../world';
import { Door, DoorType } from './Door';
import { Wall, Floor, Tree } from './Environment';
import { BSPTree } from '../util';
import { Item } from '../Items/Item';

// An instance of Area represents some area of a Room, usually walled off
// Generally we apply our proc gen algorithms to Areas rather than ActionDirection to Rooms
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

export class Room { 
    public name: string;
    
    private width: number;
    private height: number;

    public actors: Actor[];
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
    init(BSPIterations?: number, CAIterations?: number, prevRoom?: Room, doorDirToPrevRoom?: DoorType) {

        // Create area tree to represent internal room structure
        let baseArea = new Area(0, 0, this.getWidth(), this.getHeight());
        let tree = new BSPTree<Area>(null, null, baseArea);

        if (BSPIterations > 0) {
            this.generateSymmetricBSPTreeHorizontal(BSPIterations, tree);
        }

        // Initialilze every leaf of the BSP Tree
        this.initAreas(tree, (CAIterations > 0));

        this.applyCAtoBSPLeaves(tree, CAIterations);

        if (prevRoom == undefined || doorDirToPrevRoom == undefined) return;
        this.placeDoor(prevRoom, doorDirToPrevRoom);
    }

    placeDoor(toRoom: Room, dir: DoorType, x?: number, y?: number) {

        if (dir == DoorType.NorthDoor) {
            let doorx = x || Math.floor(Math.random() * this.getWidth());
            let doory = this.getHeight() - 1;
            this.objects[doorx][doory] = new Door(DoorType.NorthDoor, doorx, doory, this.wallDoorTile, toRoom);
            return this.objects[doorx][doory];
        }
        if (dir == DoorType.SouthDoor) {
            let doorx = x || Math.floor(Math.random() * this.getWidth());
            let doory = 0;
            this.objects[doorx][doory] = new Door(DoorType.SouthDoor, doorx, doory, this.wallDoorTile, toRoom);
            return this.objects[doorx][doory];
        }
        if (dir == DoorType.WestDoor) {
            let doorx = 0;
            let doory = y || Math.floor(Math.random() * this.getHeight());
            this.objects[doorx][doory] = new Door(DoorType.WestDoor, doorx, doory, this.wallDoorTile, toRoom);
            return this.objects[doorx][doory];

        }
        if (dir == DoorType.EastDoor) {
            let doorx = this.getWidth() - 1;
            let doory = y || Math.floor(Math.random() * this.getHeight());
            this.objects[doorx][doory] = new Door(DoorType.EastDoor, doorx, doory, this.wallDoorTile, toRoom);
            return this.objects[doorx][doory];
        }

        return null;
    }

    //
    // LEAVING COMMENT TO PRESERVE HOW TRAP DOORS / LADDER DOORS WERE IMPLEMENTED
    //
    /*placeDoorOld(toRoom: Room, type: DoorType, x1?: number, y1?: number) {
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

        }
    }*/

    placeItem(item: Item) {
        this.objects[item.x][item.y] = new Floor(item.x, item.y, this.floorTile); // reset this tile to a floor so that we can actually put an item on it
        (<Floor>this.objects[item.x][item.y]).addObject(item);
    }

    handleActorTurns(world: World) {
        this.actors.forEach(actor => {
            actor.takeTurn(world);
        });
    }

    addActor(actor: Actor) {
        console.log("actor added to room");
        this.actors.push(actor);
        this.objects[actor.x][actor.y] = new Floor(actor.x, actor.y, this.floorTile);
        (<Floor>this.objects[actor.x][actor.y]).setOccupation(actor);
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

    correctSpawn(object: GameObject) {
        
        // Correct the spawn if necessary
        if (this.getObject(object.x,object.y) instanceof Wall) {
            // Find the nearest tiles that is not a wall
            
            let d = 1;
            let x = object.x;
            let y = object.y;

            let positionFound = false;

            let blockedNorth = false;
            let blockedEast = false;
            let blockedSouth = false;
            let blockedWest = false;

            while (!(positionFound || (blockedNorth && blockedEast && blockedSouth && blockedWest))) {
                
                // Look up by d
                if (y-d < 0) {
                    blockedNorth = true;
                    break;
                }
                if (!blockedNorth && this.getObject(x, y-d) instanceof Floor) {
                    object.x = x;
                    object.y = y-d;
                    positionFound = true;
                    console.log("Moved player to:", object.x, object.y);
                    break;
                }

                // Look down by d
                if (y+d > this.height - 1) {
                    blockedSouth = true;
                    break;
                }
                if (!blockedSouth && this.getObject(x, y+d) instanceof Floor) {
                    object.x = x;
                    object.y = y+d;
                    positionFound = true;
                    console.log("Moved player to:", object.x, object.y);
                    break;
                }

                // Look right by d
                if (x+d > this.width - 1) {
                    blockedEast = true;
                    break;
                }
                if (!blockedEast && this.getObject(x+d,y) instanceof Floor) {
                    object.x = x+d;
                    object.y = y;
                    positionFound = true;
                    console.log("Moved player to:", object.x, object.y);
                    break;
                }

                // Look left by d
                if (x-d < 0) {
                    blockedWest = true;
                    break;
                }
                if (!blockedWest && this.getObject(x-d, y) instanceof Floor) {
                    object.x = x -d;
                    object.y = y;
                    positionFound = true;
                    console.log("Moved player to:", object.x, object.y);
                    break;
                }

                d++;
            }
        }
    }

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
