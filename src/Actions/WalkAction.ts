import { Action, ActionDirection } from "./Action";
import { Actor }  from "../Actors/Actor";
import { Floor, Wall } from "../Rooms/Environment";
import { Nexus } from '../TD/Nexus';
import { Door, DoorType } from "../Rooms/Door";
import { Menu, MenuInfo, MenuOption } from '../Systems/Menu/Menu';

import { World } from "../world";
import { DoorAction } from "./DoorAction";

export class WalkAction extends Action {

    private dir: ActionDirection;

    constructor(dir: ActionDirection, actor: Actor) {
        super(actor);
        this.dir = dir;
    }

    perform(world: World) {

        // Try to use our item if we have one equipt
        if (this.actor.equipt) {
            let item = this.actor.equipt;
            var success = item.use(this.actor, this.dir, world);
            if (success) return;
        }

        let room = world.getActiveRoom();
        let fromObject = room.getObject(this.actor.x, this.actor.y);
        let toObject = null;
        if (this.dir == ActionDirection.Up) toObject = room.getObject(this.actor.x, this.actor.y - 1);
        if (this.dir == ActionDirection.Down) toObject = room.getObject(this.actor.x, this.actor.y + 1);
        if (this.dir == ActionDirection.Left) toObject = room.getObject(this.actor.x - 1, this.actor.y);
        if (this.dir == ActionDirection.Right) toObject = room.getObject(this.actor.x + 1, this.actor.y);

        if (this.dir == ActionDirection.UpLeft) toObject = room.getObject(this.actor.x - 1, this.actor. y - 1);
        if (this.dir == ActionDirection.UpRight) toObject = room.getObject(this.actor.x + 1, this.actor. y - 1);
        if (this.dir == ActionDirection.DownLeft) toObject = room.getObject(this.actor.x - 1, this.actor. y + 1);
        if (this.dir == ActionDirection.DownRight) toObject = room.getObject(this.actor.x + 1, this.actor. y + 1);


        if (!toObject.collides && !toObject.destructible) {
            if (fromObject instanceof Floor) {
                (<Floor>room.objects[this.actor.x][this.actor.y]).removeOccupation();
            }

            if (toObject instanceof Nexus) {
                (<Floor>room.objects[this.actor.x][this.actor.y]).removeOccupation();
                room.getActors().splice(room.getActors().indexOf(this.actor), 1);
                const nexus = world.getPlayer();
                nexus.health -= 10;
                return;
            }

            // Check if the actor just walked through a door:
            if (toObject instanceof Door) {
                this.actor.x = toObject.x;
                this.actor.y = toObject.y;

                let newAction = new DoorAction(this.actor);
                newAction.perform(world);
                return;
            }

            // actually move in desired direction
            if (this.dir == ActionDirection.Up) this.actor.y = this.actor.y - 1;
            if (this.dir == ActionDirection.Down) this.actor.y = this.actor.y + 1;
            if (this.dir == ActionDirection.Left) this.actor.x = this.actor.x - 1;
            if (this.dir == ActionDirection.Right) this.actor.x = this.actor.x + 1;

            // diagonals:
            if (this.dir == ActionDirection.UpLeft) {
                this.actor.x -= 1
                this.actor.y -= 1
            }
            if (this.dir == ActionDirection.UpRight) { 
                this.actor.x += 1;
                this.actor.y -= 1; 
            }

            if (this.dir == ActionDirection.DownLeft){
                this.actor.x -= 1;
                this.actor.y +=1;
            }
            if (this.dir == ActionDirection.DownRight) {
                this.actor.x += 1;
                this.actor.y += 1;
            }

            if (toObject instanceof Floor) {
                (<Floor>room.objects[this.actor.x][this.actor.y]).setOccupation(this.actor);
            }
        } else if (toObject.destructible) {
            // TODO Add attacking interaction
        } else {
            if (this.actor.debug) {
                console.log('COLLISION: ', this.actor);
            }
        }
    }
}

