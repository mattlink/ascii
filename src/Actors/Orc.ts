import { Actor, Corpse } from './Actor';
import { ActionDirection } from '../Actions/Action';
import { WalkAction } from '../Actions/WalkAction';
import { WaitAction } from '../Actions/WaitAction';
import { Tile } from '../tile';
import { Action } from '../Actions/Action';
import { World } from '../world';
import { Sword } from '../Items/Sword';
import { Mob } from './Mob';

export class Orc extends Mob {

    constructor(name: string, x: number, y: number, tile: Tile) {
        super(name, x, y, tile, true);
        this.nextAction = new WaitAction(this);
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

        // check if the player is nearby, if so update our state to hostile
        let dx = this.x - world.getPlayer().x;
        let dy = this.y - world.getPlayer().y;

        // figure out which direction to move to be closer to the player
        // TODO: implement better pathfinding
        let action = new WaitAction(this);
        if (dy > 0) {
            // Move down towards the player
            action = new WalkAction(ActionDirection.Up, this); // backwards?
        }
        else if (dy < 0) {
            // Move up towards the player
            action = new WalkAction(ActionDirection.Down, this); // backwards?
        }
        else if (dx > 0) {
            // Move left towards the player
            action = new WalkAction(ActionDirection.Left, this);
        }
        else if (dx < 0) {
            // Move right towards the player
            action = new WalkAction(ActionDirection.Right, this);
        }

        action.perform(world);
        return;
    }

    death(world: World) {

        this.dead = true;
        let objects = [];
        objects.push(new Corpse(this));

        // TODO: randomly select things from this mob's inventory to be dropped

        return objects;
    }
}
