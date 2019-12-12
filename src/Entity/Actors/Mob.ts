import { Actor } from './Actor';
import { Direction } from '../../Components/Actions/Action';
import { WalkAction } from '../../Components/Actions/WalkAction';
import { WaitAction } from '../../Components/Actions/WaitAction';
import { Tile } from '../../tile';
import { Action } from '../../Components/Actions/Action';
import { Room } from '../Rooms/Room';

export class Mob extends Actor {

    constructor(name: string, x: number, y: number, tile: Tile) {
        super(name, x, y, tile);
        this.nextAction = new WaitAction(this);
        
        this.collides = true;
    }

    takeTurn(room: Room) {

        let actionList: Action[] = [
            new WaitAction(this),
            new WalkAction(Direction.Up, this),
            new WalkAction(Direction.Down, this),
            new WalkAction(Direction.Left, this),
            new WalkAction(Direction.Right, this)
        ];

        let r = Math.floor(Math.random() * (actionList.length));

        
        actionList[r].perform(room);
        // actionList[0].perform();
    }
}