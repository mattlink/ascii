import { Wall, Floor, Tree } from '../Environment';
import { Room, Area } from './Room';
import { Door, DoorType } from '../Door';
import { Tile } from '../../tile';
import { GameObject } from '../GameObject';
import { BSPTree } from '../../util';

export class Cave extends Room {

    private caveBrown = '#995e06';

    constructor(width: number, height: number, name: string) {
        super(width, height, name);

        // Set up Cave-specific tile info
        this.wallTile = new Tile('#', this.caveBrown, this.defaultBgColor);
        this.floorTile = new Tile('-', this.caveBrown, this.defaultBgColor);

        this.defaultFogBg = '#937d91'; // a dark, purple hazy 
        // this.defaultFogFg = this.caveBrown;
        this.defaultFogFg = 'black';
    }

    init() {
        // Initialize everything to empty GameObjects
        for (let i = 0; i < this.getWidth(); i++) {
            this.objects[i] = [];
            for (let j = 0; j < this.getHeight(); j++) {
                this.objects[i][j] = new GameObject(i, j, new Tile(' ', 'black', 'black'));
            }
        }

        // Draw some walls to create the internal room structure
        let baseArea = new Area(0, 0, this.getWidth(), this.getHeight());
        let tree = new BSPTree<Area>(null, null, baseArea);

        let BSPiterations = 2;
        let CAiterations = 3;

        // Generate a Symmetric BSP Tree
        this.generateSymmetricBSPTreeHorizontal(BSPiterations, tree);

        // Loop over leaves of binary tree, initializing each area at the leaf
        this.initAreas(tree, true);

        // Apply CA to each leaf of our BSP Tree
        this.applyCAtoBSPLeaves(tree, CAiterations);

        /**
         * Example of just CA (without BSP): 
         */
        // initialize the area with random walls as a starting point for CA
        //this.initArea(baseArea, true); // sets random flag to true
        //this.generateCA(5, baseArea);
    }

    

    init_ () {
        for (let i = 0; i < this.getHeight(); i++) {
            this.objects[i] = [];
            for  (let j = 0; j < this.getWidth(); j++) {

                /* Wall Placement */
                if (i == 0 && j == this.getWidth() - 1) { 
                    this.objects[i][j] = new Wall(i, j, new Tile(Wall.botLeft.ascii, this.caveBrown, this.defaultBgColor));
                    continue; 
                }
                if (i == 0 && j == 0) { 
                    this.objects[i][j] = new Wall(i, j, new Tile(Wall.topLeft.ascii, this.caveBrown, this.defaultBgColor));
                    continue; 
                }
                

                if (i == this.getHeight() - 1 && j == this.getWidth() - 1) { 
                    this.objects[i][j] = new Wall(i, j, new Tile(Wall.botRight.ascii, this.caveBrown, this.defaultBgColor));
                    continue;
                }
                if (i == this.getHeight() - 1 && j == 0) { 
                    this.objects[i][j] = new Wall(i, j, new Tile(Wall.topRight.ascii, this.caveBrown, this.defaultBgColor));
                    continue; 
                }
                if (i == 0 || i == this.getHeight() - 1) { 
                    this.objects[i][j] = new Wall(i, j, new Tile(Wall.vertical.ascii, this.caveBrown, this.defaultBgColor));
                    continue; 
                }

                if (j == 0 || j == this.getWidth() - 1) { 
                    this.objects[i][j] = new Wall(i, j, new Tile(Wall.horizontal.ascii, this.caveBrown, this.defaultBgColor));
                    continue; 
                }


                /* Floor Placement */
                // this.objects[i][j] = new Floor(i, j, new Tile('-', this.caveBrown, this.defaultBgColor));
                this.objects[i][j] = new Floor(i, j, this.floorTile);
                // this.objects[i][j] = new Floor(i, j, Floor.caveFloor[Math.floor(Math.random() * Floor.caveFloor.length)]);
            }
        }
    }

    

    // Draw a connective corrridor area type thing in between two areas using their midpoints
    // connectAreas(area1: Area, area2: Area) {
    //     // Let's draw from area1 to area2
    //     // Check if area1 is above, below, or horizontally next to area2
    //     if (area1.cx < area2.cx) {
    //         // area1 is to the left of area2
    //         // Either start from the bottom or right of area1
    //         // Lets choose the right for now
    //         let x = area1.x + area1.width - 1
    //         let y = area1.cy;//Math.floor((area1.y + area1.height) / 2);

    //         this.objects[x][y-1] = new Wall(x, y-1, new Tile(Wall.botLeft.ascii, Cave.caveBrown, Cave.roomBg));
    //         this.objects[x][y] = new Floor(x, y, new Tile('-', Cave.caveBrown, Cave.roomBg));
    //         this.objects[x][y+1] = new Wall(x, y+1, new Tile(Wall.topLeft.ascii, Cave.caveBrown, Cave.roomBg));

    //         for (let n = x+1; n < area2.cx; n++) {
    //             this.objects[n][y-1] = new Wall(n, y-1, new Tile(Wall.horizontal.ascii, Cave.caveBrown, Cave.roomBg));
    //             this.objects[n][y] = new Floor(n, y, new Tile('-', Cave.caveBrown, Cave.roomBg));
    //             if (n < area2.cx - 1) {
    //                 this.objects[n][y+1] = new Wall(n, y+1, new Tile(Wall.horizontal.ascii, Cave.caveBrown, Cave.roomBg));
    //             }
    //         }
            
    //     }


    // }
}