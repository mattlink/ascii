import { Actor } from './Actor';
import { Direction } from '../../Components/Actions/Action';
import { WaitAction } from '../../Components/Actions/WaitAction';
import { WalkAction } from '../../Components/Actions/WalkAction';
import { DoorAction } from '../../Components/Actions/DoorAction';
import { Tile } from '../../tile';
import { World } from '../../world';

export class Player extends Actor {

    constructor(x0: number, y0: number, tile: Tile) {
        super("Player", x0, y0, tile);
        this.nextAction = new WaitAction(this);
    }

    receiveKeyInput(key: string) {
        if (key == 'w') {
            this.nextAction = new WalkAction(Direction.Up, this);
        }
        else if (key == 'a') {
            this.nextAction = new WalkAction(Direction.Left, this);
        }
        else if (key == 's') {
            this.nextAction = new WalkAction(Direction.Down, this);
        }
        else if (key == 'd') {
            this.nextAction = new WalkAction(Direction.Right, this);
        }

        else if (key == '>') {
            this.nextAction = new DoorAction(this);
        }

        else  {
            this.nextAction = new WaitAction(this);
        }
    }

    takeTurn(world: World) {
        this.nextAction.perform(world);        
    }
}