import { Action } from './Action';
import { Actor } from '../Actors/Actor';
import { World } from '../world';
import { Door, DoorType } from '../Rooms/Door';

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
            

            // When the actor walks onto a door, they are now on the edge of the room
            // this will break the renderer. In order to avoid this, we ensure that
            // every door plops the actor out infront of the door that it leads to.
            // Start by setting the actor position to anything else, then determine
            // where to place the actor.
            this.actor.x = 20;
            this.actor.y = 20;

            if ((<Door>door).type == 0) {
                this.actor.x = door.x;
                this.actor.y = fromRoom.getHeight() - 2;
            }

            if ((<Door>door).type == 1) {
                this.actor.x = door.x;
                this.actor.y = 1;
            }

            if ((<Door>door).type == 2) {
                this.actor.x = 1;
                this.actor.y = door.y;
            }

            if ((<Door>door).type == 3) {
                this.actor.x = fromRoom.getWidth() - 2;
                this.actor.y = door.y;
            }
            
            // Set the active room status on the world to the room that we're going to
            world.getActiveLevel().setActiveRoom(door.toRoom);
        }
    }

}