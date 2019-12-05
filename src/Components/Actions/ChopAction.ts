// An Action for chopping down a tree
import { Action, Direction } from './Action';
import { Actor } from '../../Entity/Actor';
import { World } from '../../world';
import { Tree } from '../../Entity/Environment';

export class ChopAction extends Action {

    private dir: Direction;

    constructor(dir: Direction, actor: Actor) {
        super(actor);
        this.dir = dir;
    }

    perform(world: World) {

        // TODO: Check if the player can actually make a ChopAction
            // Do they have an axe, or another item capable of doing this?

        switch(this.dir) {
            case Direction.Up:
                // If there is a tree above, chop it..
                let object = world.getObject(this.actor.x, this.actor.y - 1);
                if (!(object instanceof Tree)) {
                    break;
                }

                // Attempt to chop down the tree

                break;

            case Direction.Down:

                break;

            case Direction.Left:

                break;

            case Direction.Right:

                break;

            default:
                break;
        }
    }
}