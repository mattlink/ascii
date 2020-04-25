import { Actor } from './Actor';
import { ActionDirection, Action } from '../Actions/Action';
import { WaitAction } from '../Actions/WaitAction';
import { WalkAction } from '../Actions/WalkAction';
import { TrapDoorAction } from '../Actions/TrapDoorAction';
import { PickupItemAction } from '../Actions/PickupItemAction';
import { Tile } from '../tile';
import { World } from '../world';

export class Player extends Actor {

    constructor(x0: number, y0: number, tile: Tile) {
        super("You", x0, y0, tile);
        this.nextAction = new WaitAction(this);
    }

    receiveKeyInput(key: string) {
        
        // directional movement
        if (key == 'w') {
            this.nextAction = new WalkAction(ActionDirection.Up, this);
        }
        else if (key == 'a') {
            this.nextAction = new WalkAction(ActionDirection.Left, this);
        }
        else if (key == 's') {
            this.nextAction = new WalkAction(ActionDirection.Down, this);
        }
        else if (key == 'd') {
            this.nextAction = new WalkAction(ActionDirection.Right, this);
        }

        // diagonal movement:
        else if (key == 'q') {
            this.nextAction = new WalkAction(ActionDirection.UpLeft, this);
        }
        else if (key == 'e') {
            this.nextAction = new WalkAction(ActionDirection.UpRight, this);
        }
        else if (key == 'z') {
            this.nextAction = new WalkAction(ActionDirection.DownLeft, this);
        }
        else if (key == 'x') {
            this.nextAction = new WalkAction(ActionDirection.DownRight, this);
        }

        // other world interactions
        else if (key == ',' || key == 'P') {
            this.nextAction = new PickupItemAction(this);
        }

        else if (key == '>') {
            this.nextAction = new TrapDoorAction(this);
        }

        else if (key == 'j')  {
            this.nextAction = new WaitAction(this);
        }
    }

    takeTurn(world: World) {
        this.nextAction.perform(world);      
    }

    death(world: World) {
        
        // TODO: somehow trigger the end of the game

        return [];
    }
}