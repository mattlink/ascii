import { Tree, Wall, Floor } from './Environment';
import { Room, Area } from "./Room";
import { Door, DoorType } from './Door';
import { Tile } from '../tile';
import { GameObject } from '../GameObject';
import { BSPTree } from '../util';

export class Forest extends Room {
    constructor(width: number, height: number, name: string) {
        super(width, height, name);
    }

    init() {
        this.init_();
        // let baseArea = new Area(0, 0, this.getHeight(), this.getWidth());
        // this.initArea(baseArea);
    }

    init_() {
        for (let i = 0; i < this.getWidth(); i++) {
            for (let j = 0; j < this.getHeight(); j++) {

                if (i == 0 && j == this.getHeight() - 1) { 
                    this.objects[i][j] = new Wall(i, j, Wall.botLeft);
                    continue; 
                }
                if (i == 0 && j == 0) { 
                    this.objects[i][j] = new Wall(i, j, Wall.topLeft);
                    continue; 
                }
                

                if (i == this.getWidth() - 1 && j == this.getHeight() - 1) { 
                    this.objects[i][j] = new Wall(i, j, Wall.botRight); 
                    continue; 
                }
                if (i == this.getWidth() - 1 && j == 0) { 
                    this.objects[i][j] = new Wall(i, j, Wall.topRight);
                    continue; 
                }
                if (i == 0 || i == this.getWidth() - 1) { 
                    this.objects[i][j] = new Wall(i, j, Wall.vertical); 
                    continue; 
                }

                if (j == 0 || j == this.getHeight() - 1) { 
                    this.objects[i][j] = new Wall(i, j, Wall.horizontal);
                    continue; 
                }


                let rand = Math.floor(Math.random() * 10);
                if (rand > 7) {
                    this.objects[i][j] = new Tree(i, j, Tree.trees[0]);
                } else {
                    this.objects[i][j] = new Floor(i, j, Floor.forestTiles[Math.floor(Math.random() * 4)]);
                }
                
            }
        }

        //let baseArea = new Area(0, 0, this.getHeight(), this.getWidth());
        //this.generateCA(3, baseArea);
    }
}