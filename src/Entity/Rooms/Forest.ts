import { Tree, Wall, Floor } from '../Environment';
import { Room } from "./room";

export class Forest extends Room {
    constructor(width: number, height: number) {
        super(width, height);
    }

    init() {
        for (let i = 0; i < this.getHeight(); i++) {
            this.objects[i] = [];
            for (let j = 0; j < this.getWidth(); j++) {

                if (i == 0 && j == this.getWidth() - 1) { 
                    this.objects[i][j] = new Wall(i, j, Wall.botLeft);
                    continue; 
                }
                if (i == 0 && j == 0) { 
                    this.objects[i][j] = new Wall(i, j, Wall.topLeft);
                    continue; 
                }
                

                if (i == this.getHeight() - 1 && j == this.getWidth() - 1) { 
                    this.objects[i][j] = new Wall(i, j, Wall.botRight); 
                    continue; 
                }
                if (i == this.getHeight() - 1 && j == 0) { 
                    this.objects[i][j] = new Wall(i, j, Wall.topRight);
                    continue; 
                }
                if (i == 0 || i == this.getHeight() - 1) { 
                    this.objects[i][j] = new Wall(i, j, Wall.vertical); 
                    continue; 
                }

                if (j == 0 || j == this.getWidth() - 1) { 
                    this.objects[i][j] = new Wall(i, j, Wall.horizontal);
                    continue; 
                }

                let rand = Math.floor(Math.random() * 10);
                if (rand > 7) {
                    this.objects[i][j] = new Tree(i, j, Tree.trees[0]);
                } else {
                    this.objects[i][j] = new Floor(i, j, Floor.floors[Math.floor(Math.random() * 4)]);
                }
                
            }
        }
    }
}