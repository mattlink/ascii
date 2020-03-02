import { Action, ActionDirection } from "./Action";
import { Actor }  from "../Actors/Actor";
import { Floor, Wall } from "../Rooms/Environment";
import { World } from "../world";

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


        if (!toObject.collides) {
            if (fromObject instanceof Floor) {
                (<Floor>room.objects[this.actor.x][this.actor.y]).removeOccupation();
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
        } else {
            if (this.actor.debug) {
                console.log('COLLISION: ', this.actor);
            }
        }
    }
}

