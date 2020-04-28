import { Action } from './Action';
import { Actor } from '../Actors/Actor';
import { Player } from '../Actors/Player';
import { World } from '../world';
import { Door, DoorType } from '../Rooms/Door';

export class TrapDoorAction extends Action {
    constructor(actor: Actor) {
        super(actor);
    }

    perform(world: World) {

        let fromRoom = world.getActiveRoom();

        // check if the actor is standing on a door
        let door = fromRoom.getObject(this.actor.x, this.actor.y);
        if (door instanceof Door) {

            // door internal to a Room, Trap and Ladder doors will have their own procedures.

            // Remove the actor from the room they're leaving
            fromRoom.getActors().splice(fromRoom.getActors().indexOf(this.actor), 1);

            // Add the actor to the room they're entering
            door.toRoom.addActor(this.actor);
            
            // Set the active room status on the world to the room that we're going to (but only if its the player who went through the door)
            if (this.actor instanceof Player) {
                // world.updateActiveLevel(door.toLevel);
                // world.getActiveLevel().setActiveRoom(door.toRoom);
            }
        }
    }

}