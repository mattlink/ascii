import { Action } from './Action';
import { Actor } from '../Actors/Actor';
import { Player } from '../Actors/Player';
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

            // door internal to a Room, Trap and Ladder doors will have their own procedures.
            if (door.toRoom == null || (<Door>door).type == DoorType.TrapDoor || (<Door>door).type == DoorType.LadderDoor) return; 

            // Remove the actor from the room they're leaving
            fromRoom.getActors().splice(fromRoom.getActors().indexOf(this.actor), 1);

            // Add the actor to the room they're entering
            door.toRoom.addActor(this.actor);
            

            // When the actor walks onto a door, they are now on the edge of the room
            // this will break the renderer. In order to avoid this, we ensure that
            // every door plops the actor out infront of the door that it leads to.
            // Start by setting the actor position to anything else, then determine
            // where to place the actor.

            // Initially set the coordiantes to 20, 20 then adjust properly
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

            // TrapDoor
            if ((<Door>door).type == DoorType.TrapDoor) {
                // TrapDoor actions are handled in their own action (since they require a `>` to be pressed to use them)
            }
            
            // Set the active room status on the world to the room that we're going to (but only if its the player who went through the door)
            // if (this.actor instanceof Player) 
                // world.getActiveLevel().setActiveRoom(door.toRoom);
        }
    }

}