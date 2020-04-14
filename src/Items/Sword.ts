import { Action, ActionDirection } from "../Actions/Action";
import { Actor } from "../Actors/Actor";
import { World } from "../world";
import { Wall, Floor } from "../Rooms/Environment";
import { Item } from "./Item";
import { Tile } from "../tile";
import { Player } from "../Actors/Player";
import { Mob } from "../Actors/Mob";

class SwordAction extends Action {
    private dir: ActionDirection;

    private sword: Sword;

    constructor(actor: Actor, dir: ActionDirection, sword: Sword) {
        super(actor);
        this.dir = dir;
        this.sword = sword;
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
                
                if (this.actor instanceof Player) world.appendMessage("You hit the " + target.name + ".");
                else if (this.actor instanceof Mob && target instanceof Player) world.appendMessage("The " + this.actor.name + " hits you.");

                // TODO: target.health -= sword.damage + actor.damageMultiplier ...
                target.health -= this.sword.damage;

                // check if the target was killed
                if (target.health <= 0) {

                    // invoke the target's death (dropping some/all of its inventory)
                    target.death(world).forEach(obj => {
                        (<Floor>room.objects[toPosX][toPosY]).addObject(obj);
                    });

                    if (this.actor instanceof Player) world.appendMessage("You kill the " + target.name + ".");
                    else if (this.actor instanceof Mob) world.appendMessage("The " + this.actor.name + " kills you.");

                    (<Floor>obj).removeOccupation();
                    room.actors = room.actors.filter(a => {
                        return a != target;
                    });
                }
            } 
            
            return true;
        }

        return false;
    }
}

export class Sword extends Item {

    public damage = 25;

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