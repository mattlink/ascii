import { Wall, Floor } from '../Environment';
import { Room } from './Room';
import { Tile } from '../../tile';

export class Cave extends Room {

    private static caveBrown = '#995e06';
    public static roomBg = 'black';

    constructor(width: number, height: number) {
        super(width, height);
    }

    init () {
        for (let i = 0; i < this.getHeight(); i++) {
            this.objects[i] = [];
            for  (let j = 0; j < this.getWidth(); j++) {

                /* Wall Placement */
                if (i == 0 && j == this.getWidth() - 1) { 
                    this.objects[i][j] = new Wall(i, j, new Tile(Wall.botLeft.ascii, Cave.caveBrown, Cave.roomBg));
                    continue; 
                }
                if (i == 0 && j == 0) { 
                    this.objects[i][j] = new Wall(i, j, new Tile(Wall.topLeft.ascii, Cave.caveBrown, Cave.roomBg));
                    continue; 
                }
                

                if (i == this.getHeight() - 1 && j == this.getWidth() - 1) { 
                    this.objects[i][j] = new Wall(i, j, new Tile(Wall.botRight.ascii, Cave.caveBrown, Cave.roomBg)); 
                    continue; 
                }
                if (i == this.getHeight() - 1 && j == 0) { 
                    this.objects[i][j] = new Wall(i, j, new Tile(Wall.topRight.ascii, Cave.caveBrown, Cave.roomBg));
                    continue; 
                }
                if (i == 0 || i == this.getHeight() - 1) { 
                    this.objects[i][j] = new Wall(i, j, new Tile(Wall.vertical.ascii, Cave.caveBrown, Cave.roomBg)); 
                    continue; 
                }

                if (j == 0 || j == this.getWidth() - 1) { 
                    this.objects[i][j] = new Wall(i, j, new Tile(Wall.horizontal.ascii, Cave.caveBrown, Cave.roomBg));
                    continue; 
                }


                /* Floor Placement */
                this.objects[i][j] = new Floor(i, j, new Tile('-', Cave.caveBrown, Cave.roomBg));
            }
        }
    }
}