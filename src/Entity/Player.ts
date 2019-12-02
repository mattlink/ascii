import { Actor } from './Actor';
import { Action } from '../Components/Actions/Action';
import { WaitAction } from '../Components/Actions/WaitAction';
import { WalkAction, WalkDirection } from '../Components/Actions/WalkAction';
import { Tile } from '../tile';
import { IO } from '../io';
import { World } from '../world';

export class Player extends Actor {
    
    public debug: boolean = false;

    constructor(x0: number, y0: number, tile: Tile) {
        super("Player", x0, y0, tile);
        this.nextAction = new WaitAction(this);
    }

    receiveKeyInput(key: string) {
        if (key == 'w') {
            this.nextAction = new WalkAction(WalkDirection.Up, this);
        }
        else if (key == 'a') {
            this.nextAction = new WalkAction(WalkDirection.Left, this);
        }
        else if (key == 's') {
            this.nextAction = new WalkAction(WalkDirection.Down, this);
        }
        else if (key == 'd') {
            this.nextAction = new WalkAction(WalkDirection.Right, this);
        }

        else  {
            this.nextAction = new WaitAction(this);
        }
    }

    takeTurn(world: World) {
        this.nextAction.perform(world);        
    }
    
   /* move(x1: number, y1: number) {
        this.x = x1;
        this.y = y1;
    }

    moveUp() {
        this.move(this.x, this.y - 1);
    }
    moveDown() {
        this.move(this.x, this.y + 1);
    }
    moveLeft() {
        this.move(this.x - 1, this.y);
    }
    moveRight() {
        this.move(this.x + 1, this.y);
    }*/
    
}