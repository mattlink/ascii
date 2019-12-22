// An Action for chopping down a tree
import { Action, Direction } from './Action';
import { Actor } from '../../Entity/Actors/Actor';
import { Tree } from '../../Entity/Environment';
import { World } from '../../world';

export class ChopAction extends Action {

    private dir: Direction;

    constructor(dir: Direction, actor: Actor) {
        super(actor);
        this.dir = dir;
    }

    perform(world: World) {

        let room = world.getActiveRoom();

        // TODO: Check if the player can actually make a ChopAction
            // Do they have an axe, or another item capable of doing this?

        switch(this.dir) {
            case Direction.Up:
                // If there is a tree above, chop it..
                let object = room.getObject(this.actor.x, this.actor.y - 1);
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