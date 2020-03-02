import { Actor, Corpse } from './Actor';
import { ActionDirection } from '../Actions/Action';
import { WalkAction } from '../Actions/WalkAction';
import { WaitAction } from '../Actions/WaitAction';
import { Tile } from '../tile';
import { Action } from '../Actions/Action';
import { World } from '../world';

export class Mob extends Actor {

    dead: boolean = false;

    constructor(name: string, x: number, y: number, tile: Tile) {
        super(name, x, y, tile);
        this.nextAction = new WaitAction(this);
        
        this.collides = true;
    }

    takeTurn(world: World) {

        if (this.dead) return;
        if (this.debug) console.log('DEBUG:', this.name, "taking turn.", this.x, this.y);

        let actionList: Action[] = [
            new WaitAction(this),
            new WalkAction(ActionDirection.Up, this),
            new WalkAction(ActionDirection.Down, this),
            new WalkAction(ActionDirection.Left, this),
            new WalkAction(ActionDirection.Right, this),
            new WalkAction(ActionDirection.UpRight, this),
            new WalkAction(ActionDirection.UpLeft, this),
            new WalkAction(ActionDirection.DownRight, this),
            new WalkAction(ActionDirection.DownLeft, this)

        ];

        let r = Math.floor(Math.random() * (actionList.length));

        actionList[r].perform(world);
    }

    death(world: World) {
        
        this.dead = true;
        let objects = [];
        objects.push(new Corpse(this));
        
        // TODO: randomly select things from this mob's inventory to be dropped

        return objects;
    }
}