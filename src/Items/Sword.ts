import { Action, ActionDirection } from "../Actions/Action";
import { Actor } from "../Actors/Actor";
import { World } from "../world";
import { Wall, Floor } from "../Rooms/Environment";
import { GameObject } from "../GameObject";
import { Item } from "./Item";
import { Tile } from "../tile";

class SwordAction extends Action {
    private dir: ActionDirection;

    constructor(actor: Actor, dir: ActionDirection, sword: Sword) {
        super(actor);
        this.dir = dir;
    }

    perform(world: World) {
        let room = world.getActiveRoom();
        
        let toCoords = Action.DirectionToCoords(this.actor.x, this.actor.y, this.dir);

        let toPosX = toCoords[0];
        let toPosY = toCoords[1];

        let obj = room.objects[toPosX][toPosY];
        if (obj instanceof Floor && (<Floor>obj).getOccupation() != null) {
            let target = (<Floor>obj).getOccupation();
            
            // TODO: Check if we "really want to attack ..."
            
            // TODO: calculate a chance to hit, dice roll, etc.
            let hits = true; // for now, always hit
            if (hits) {
                
                world.appendMessage("You hit the " + target.name + ".");

                // TODO: target.health -= sword.damage + actor.damageMultiplier ...
                
                // for now, always kill
                target.death(world).forEach(obj => {
                    (<Floor>room.objects[toPosX][toPosY]).addObject(obj);
                });
                world.appendMessage("You kill the " + target.name + ".");

                (<Floor>obj).removeOccupation();
                console.log("room actors pre: ", room.actors);
                console.log("activeRoom actors pre: ", world.getActiveRoom().actors);
                room.actors = room.actors.filter(a => {
                    return a != target;
                });
                console.log("room actors post: ", room.actors);
                console.log("activeRoom actors post: ", world.getActiveRoom().actors);
            } 
            
            return true;
        }

        return false;
    }
}

export class Sword extends Item {

    damage: number = 2;

    constructor(x: number, y: number, tile: Tile) {
        super(x, y, tile);
        this.name = "sword";
    }

    use(actor: Actor, dir: ActionDirection, world: World) {
        let action = new SwordAction(actor, dir, this);
        let success = action.perform(world);  
        return success;
    }
}