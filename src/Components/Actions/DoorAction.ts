import { Action } from './Action';
import { Actor } from '../../Entity/Actors/Actor';
import { World } from '../../world';
import { Door } from '../../Entity/Door';

export class DoorAction extends Action {
    constructor(actor: Actor) {
        super(actor);
    }

    perform(world: World) {

        let fromRoom = world.getActiveRoom();

        // check if the actor is standing on a door
        let door = fromRoom.getObject(this.actor.x, this.actor.y);
        if (door instanceof Door) {

            if (door.toRoom == null) return; // door internal to a Room
            

            // Remove the actor from the room they're leaving
            fromRoom.getActors().splice(fromRoom.getActors().indexOf(this.actor), 1);

            // Add the actor to the room they're entering
            door.toRoom.addActor(this.actor);
            
            // Set the active room status on the world to the room that we're going to
            world.setActiveRoom(door.toRoom);
        }
    }

}