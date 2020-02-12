// An Action for chopping down a tree
import { Action, ActionDirection } from './Action';
import { Actor } from '../Actors/Actor';
import { Tree } from '../Rooms/Environment';
import { World } from '../world';

export class ChopAction extends Action {

    private dir: ActionDirection;

    constructor(dir: ActionDirection, actor: Actor) {
        super(actor);
        this.dir = dir;
    }

    perform(world: World) {

        let room = world.getActiveRoom();

        // TODO: Check if the player can actually make a ChopAction
            // Do they have an axe, or another item capable of doing this?

        switch(this.dir) {
            case ActionDirection.Up:
                // If there is a tree above, chop it..
                let object = room.getObject(this.actor.x, this.actor.y - 1);
                if (!(object instanceof Tree)) {
                    break;
                }

                // Attempt to chop down the tree

                break;

            case ActionDirection.Down:

                break;

            case ActionDirection.Left:

                break;

            case ActionDirection.Right:

                break;

            default:
                break;
        }
    }
}